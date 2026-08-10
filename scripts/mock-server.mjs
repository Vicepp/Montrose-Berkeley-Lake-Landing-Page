// Local stand-in for the Netlify runtime: serves the site and implements
// /api/track and /api/stats using the REAL lib modules against an in-memory
// store. Lets the admin panel be tested end to end without deploying.
//
//   ADMIN_PASSWORD=test node scripts/mock-server.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normaliseBatch, dayKey, buildReport } from '../netlify/lib/aggregate.mjs';
import { collect } from '../netlify/lib/collect.mjs';
import { safeEqual, issueToken, verifyToken, visitorId, newId } from '../netlify/lib/auth.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || 8788);
const SECRET = process.env.ADMIN_PASSWORD || 'test';

const mem = new Map();
const store = {
  async get(key) { return mem.has(key) ? JSON.parse(mem.get(key)) : null; },
  async setJSON(key, val) { mem.set(key, JSON.stringify(val)); },
  async list({ prefix }) {
    return { blobs: [...mem.keys()].filter(k => k.startsWith(prefix)).map(key => ({ key })) };
  },
  async delete(key) { mem.delete(key); },
};

// Optional: seed synthetic history so the dashboard has something to draw.
if (process.env.SEED) {
  const names = ['Webinar: sticky bar', 'Webinar: poster', 'Playbook download',
                 'Press preview: usanews', 'Webinar pop-in', 'Video play'];
  const sections = ['opportunity', 'sponsor', 'value-add', 'gallery', 'ceo', 'testimonials', 'press', 'path', 'final-cta'];
  const now = Date.now();
  for (let d = 20; d >= 0; d--) {
    const ts = now - d * 86400000;
    const day = dayKey(ts);
    const events = [];
    const visitors = 8 + Math.floor(Math.random() * 22);
    for (let v = 0; v < visitors; v++) {
      const id = 'seed' + day + '-' + v;
      const mobile = Math.random() < 0.55;
      events.push({ t: 'view', n: '/', v: id, d: mobile ? 'm' : 'd',
                    ref: Math.random() < 0.4 ? ['google.com', 'linkedin.com', 't.co'][Math.floor(Math.random() * 3)] : '', ts });
      const depth = Math.floor(Math.random() * sections.length) + 1;
      for (let i = 0; i < depth; i++) events.push({ t: 'section', n: sections[i], v: id, d: mobile ? 'm' : 'd', ref: '', ts });
      if (Math.random() < 0.28) events.push({ t: 'cta', n: names[Math.floor(Math.random() * names.length)], v: id, d: mobile ? 'm' : 'd', ref: '', ts });
      if (Math.random() < 0.09) events.push({ t: 'outbound', n: 'Calendly: schedule a call', v: id, d: mobile ? 'm' : 'd', ref: '', ts });
    }
    mem.set(`raw/${day}/${newId()}`, JSON.stringify(events));
  }
  console.log('seeded 21 days of synthetic traffic');
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
};

const send = (res, status, body, type = 'application/json') => {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
};

const readBody = req => new Promise(resolve => {
  let b = ''; req.on('data', c => { b += c; if (b.length > 1e6) req.destroy(); });
  req.on('end', () => { try { resolve(JSON.parse(b || '{}')); } catch { resolve({}); } });
});

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/track') {
    if (req.method !== 'POST') return send(res, 405, { error: 'method' });
    const body = await readBody(req);
    const ua = req.headers['user-agent'] || '';
    const now = Date.now();
    const day = dayKey(now);
    const vid = visitorId(req.socket.remoteAddress || '', ua, day, SECRET);
    const events = normaliseBatch(body, { userAgent: ua, visitorId: vid, now });
    if (events.length) await store.setJSON(`raw/${day}/${newId()}`, events);
    return send(res, 200, { ok: true, stored: events.length });
  }

  if (url.pathname === '/api/stats') {
    if (req.method === 'POST') {
      const body = await readBody(req);
      if (!body.password || !safeEqual(body.password, SECRET)) {
        await new Promise(r => setTimeout(r, 100));
        return send(res, 401, { error: 'invalid password' });
      }
      return send(res, 200, { token: issueToken(SECRET) });
    }
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!verifyToken(token, SECRET)) return send(res, 401, { error: 'unauthorised' });
    const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '30', 10) || 30, 1), 90);
    return send(res, 200, buildReport(await collect(store, days), { days }));
  }

  // static files
  let p = url.pathname === '/' ? '/index.html' : url.pathname;
  if (p === '/admin') p = '/admin.html';
  const file = path.join(ROOT, decodeURIComponent(p));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    return send(res, 404, 'Not found', 'text/plain');
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`mock netlify running: http://127.0.0.1:${PORT}  (admin password: ${SECRET})`);
});

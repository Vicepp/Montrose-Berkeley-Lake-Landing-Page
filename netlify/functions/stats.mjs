// Admin API.
//   POST /api/stats  { password }        -> { token }
//   GET  /api/stats?days=30  (Bearer)    -> report JSON
//
// The read + compaction logic lives in ../lib/collect.mjs so it can be tested
// against a fake store; this file is just the HTTP shell.
import { getStore } from '@netlify/blobs';
import { buildReport } from '../lib/aggregate.mjs';
import { collect } from '../lib/collect.mjs';
import { safeEqual, issueToken, verifyToken } from '../lib/auth.mjs';

export default async (request) => {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    return json({ error: 'ADMIN_PASSWORD is not set on this site' }, 503);
  }

  if (request.method === 'POST') return login(request, secret);
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });

  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!verifyToken(token, secret)) return json({ error: 'unauthorised' }, 401);

  const url = new URL(request.url);
  const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '30', 10) || 30, 1), 90);

  try {
    const byDay = await collect(getStore('analytics'), days);
    return json(buildReport(byDay, { days }));
  } catch (err) {
    console.error('stats: failed', err?.message);
    return json({ error: 'could not read analytics' }, 500);
  }
};

async function login(request, secret) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  // Uniform failure regardless of cause, plus a delay to blunt brute forcing.
  if (!body?.password || !safeEqual(body.password, secret)) {
    await new Promise(r => setTimeout(r, 400));
    return json({ error: 'invalid password' }, 401);
  }
  return json({ token: issueToken(secret) });
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export const config = { path: '/api/stats' };

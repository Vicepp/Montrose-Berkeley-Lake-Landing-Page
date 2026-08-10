// Event collector. Accepts a small batch from the page and appends it to
// today's raw bucket. One blob per batch, so concurrent visitors can never
// clobber each other's writes (there is no read-modify-write here).
import { getStore } from '@netlify/blobs';
import { normaliseBatch, dayKey } from '../lib/aggregate.mjs';
import { visitorId, newId } from '../lib/auth.mjs';

export default async (request, context) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }

  const ua = request.headers.get('user-agent') || '';
  const ip =
    context?.ip ||
    request.headers.get('x-nf-client-connection-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '';

  const now = Date.now();
  const day = dayKey(now);
  const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_PASSWORD || 'mbl-default-salt';
  const vid = visitorId(ip, ua, day, salt);

  const events = normaliseBatch(body, { userAgent: ua, visitorId: vid, now });
  // Bots and malformed payloads normalise to nothing — accept quietly so the
  // beacon never retries and no error surfaces to a real visitor.
  if (!events.length) return json({ ok: true, stored: 0 });

  try {
    const store = getStore('analytics');
    await store.setJSON(`raw/${day}/${newId()}`, events);
  } catch (err) {
    console.error('track: store write failed', err?.message);
    return json({ ok: false }, 500);
  }

  return json({ ok: true, stored: events.length });
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export const config = { path: '/api/track' };

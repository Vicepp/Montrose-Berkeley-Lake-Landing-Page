// Admin auth. The password itself is never stored in the browser: exchanging it
// once yields a short-lived HMAC token, and that is what sessionStorage holds.
import { createHmac, timingSafeEqual, randomUUID, createHash } from 'node:crypto';

const TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

/** Constant-time string compare that does not leak length through early return. */
export function safeEqual(a = '', b = '') {
  const ha = createHash('sha256').update(String(a)).digest();
  const hb = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

export function issueToken(secret, now = Date.now()) {
  const exp = String(now + TTL_MS);
  const sig = createHmac('sha256', secret).update(exp).digest('hex');
  return `${exp}.${sig}`;
}

export function verifyToken(token, secret, now = Date.now()) {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [exp, sig] = token.split('.');
  if (!/^\d+$/.test(exp)) return false;
  if (Number(exp) < now) return false;
  const expect = createHmac('sha256', secret).update(exp).digest('hex');
  if (sig.length !== expect.length) return false;
  return timingSafeEqual(Buffer.from(sig), Buffer.from(expect));
}

/**
 * Pseudonymous visitor id: hash of IP + user agent + a salt that rotates daily.
 * Raw IPs are never written to storage, and yesterday's ids cannot be linked to
 * today's, so this stays a counting mechanism rather than a tracking one.
 */
export function visitorId(ip = '', userAgent = '', day = '', siteSecret = '') {
  return createHash('sha256')
    .update(`${ip}|${userAgent}|${day}|${siteSecret}`)
    .digest('hex')
    .slice(0, 16);
}

export const newId = () => randomUUID();

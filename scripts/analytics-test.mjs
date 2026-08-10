// Unit tests for the analytics maths and auth. Runs locally with plain node —
// no Netlify runtime needed, which is the point of keeping these modules pure.
import {
  isBot, cleanName, cleanPath, cleanRef, normaliseBatch, dayKey,
  summarise, mergeSummaries, buildReport, recentDays,
} from '../netlify/lib/aggregate.mjs';
import { safeEqual, issueToken, verifyToken, visitorId } from '../netlify/lib/auth.mjs';

let pass = 0;
const fails = [];
const t = (name, cond, detail = '') => {
  if (cond) { pass++; } else { fails.push(name + (detail ? ' — ' + detail : '')); }
};
const eq = (name, a, b) => t(name, JSON.stringify(a) === JSON.stringify(b), `got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);

/* ---------- bot filtering ---------- */
t('bot: googlebot', isBot('Mozilla/5.0 (compatible; Googlebot/2.1)'));
t('bot: headless', isBot('HeadlessChrome/120'));
t('bot: curl', isBot('curl/8.0'));
t('bot: facebook scraper', isBot('facebookexternalhit/1.1'));
t('bot: real iphone is not a bot', !isBot('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1'));
t('bot: real chrome is not a bot', !isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0 Safari/537.36'));

/* ---------- input cleaning ---------- */
eq('name: ok', cleanName('cta:webinar'), 'cta:webinar');
eq('name: strips junk', cleanName('<script>alert(1)</script>'), null);
eq('name: trims', cleanName('  hello world  '), 'hello world');
eq('name: caps length', cleanName('x'.repeat(200)).length, 60);
eq('path: forces leading slash', cleanPath('evil'), '/');
eq('path: keeps real path', cleanPath('/index.html'), '/index.html');
eq('ref: hostname only', cleanRef('https://www.google.com/search?q=secret'), 'google.com');
eq('ref: junk -> empty', cleanRef('not a url'), '');

/* ---------- batch normalisation ---------- */
const good = normaliseBatch(
  { events: [
      { type: 'view', name: '/', device: 'mobile', ref: 'https://t.co/x' },
      { type: 'cta', name: 'Reserve Your Spot' },
      { type: 'bogus', name: 'nope' },
      { type: 'cta', name: '</script>' },
  ] },
  { userAgent: 'Mozilla/5.0 (iPhone) Safari', visitorId: 'abc', now: 1000 }
);
eq('batch: keeps only valid events', good.length, 2);
eq('batch: view normalised', good[0], { t: 'view', n: '/', v: 'abc', d: 'm', ref: 't.co', ts: 1000 });
eq('batch: bot batch dropped', normaliseBatch({ events: [{ type: 'view', name: '/' }] }, { userAgent: 'Googlebot' }).length, 0);
eq('batch: garbage body is safe', normaliseBatch(null), []);
eq('batch: non-array events is safe', normaliseBatch({ events: 'x' }), []);
t('batch: caps flood at 60', normaliseBatch(
  { events: Array.from({ length: 500 }, () => ({ type: 'cta', name: 'spam' })) },
  { userAgent: 'Safari' }).length === 60);

/* ---------- day bucketing ---------- */
eq('dayKey', dayKey(Date.UTC(2026, 7, 7, 13, 0, 0)), '2026-08-07');
eq('recentDays length', recentDays(7, Date.UTC(2026, 7, 7)).length, 7);
eq('recentDays ends today', recentDays(3, Date.UTC(2026, 7, 7)).at(-1), '2026-08-07');

/* ---------- summarise ---------- */
const events = [
  { t: 'view', n: '/', v: 'v1', d: 'd', ref: 'google.com' },
  { t: 'view', n: '/', v: 'v2', d: 'm', ref: '' },
  { t: 'view', n: '/', v: 'v1', d: 'd', ref: 'google.com' },
  { t: 'cta', n: 'Reserve Your Spot', v: 'v1', d: 'd' },
  { t: 'cta', n: 'Reserve Your Spot', v: 'v2', d: 'm' },
  { t: 'outbound', n: 'calendly', v: 'v1', d: 'd' },
  { t: 'section', n: 'testimonials', v: 'v1', d: 'd' },
  { t: 'section', n: 'testimonials', v: 'v1', d: 'd' },
  { t: 'section', n: 'testimonials', v: 'v2', d: 'm' },
];
const s = summarise(events);
eq('summary: views', s.views, 3);
eq('summary: unique visitors', s.visitors.length, 2);
eq('summary: devices', s.devices, { m: 1, d: 2 });
eq('summary: cta count', s.cta['Reserve Your Spot'], 2);
eq('summary: outbound', s.outbound.calendly, 1);
eq('summary: section dedupes per visitor', s.sections.testimonials.length, 2);
eq('summary: referrers', s.referrers['google.com'], 2);

/* ---------- merging ---------- */
const m = mergeSummaries(summarise(events), summarise(events));
eq('merge: views add', m.views, 6);
eq('merge: same visitors do not double count', m.visitors.length, 2);
eq('merge: cta adds', m.cta['Reserve Your Spot'], 4);
eq('merge: sections stay deduped', m.sections.testimonials.length, 2);
eq('merge: null left', mergeSummaries(null, s).views, 3);
eq('merge: null right', mergeSummaries(s, null).views, 3);

/* ---------- report ---------- */
const report = buildReport({ '2026-08-06': summarise(events), '2026-08-07': summarise(events) });
eq('report: total views', report.totals.views, 6);
eq('report: unique visitors', report.totals.visitors, 2);
eq('report: cta clicks', report.totals.ctaClicks, 4);
eq('report: series length', report.series.length, 2);
eq('report: top cta name', report.cta[0].name, 'Reserve Your Spot');
eq('report: cta rate is a percentage of views', report.cta[0].rate, 66.7);
eq('report: section pct of unique visitors', report.sections[0].pct, 100);
t('report: no visitor ids leak to the client', !JSON.stringify(report).includes('v1'));
eq('report: empty input is safe', buildReport({}).totals.views, 0);

/* ---------- auth ---------- */
t('auth: correct password matches', safeEqual('hunter2', 'hunter2'));
t('auth: wrong password rejected', !safeEqual('hunter2', 'hunter3'));
t('auth: different lengths rejected', !safeEqual('a', 'aaaaaaaaaa'));

const secret = 'super-secret';
const tok = issueToken(secret, 1000);
t('auth: fresh token verifies', verifyToken(tok, secret, 2000));
t('auth: token rejected with wrong secret', !verifyToken(tok, 'other', 2000));
t('auth: expired token rejected', !verifyToken(tok, secret, 1000 + 9 * 60 * 60 * 1000));
t('auth: garbage token rejected', !verifyToken('nope', secret));
t('auth: forged signature rejected', !verifyToken(`${1000 + 8 * 3600000}.deadbeef`, secret, 2000));
t('auth: empty token rejected', !verifyToken('', secret));

const id1 = visitorId('1.2.3.4', 'UA', '2026-08-07', 'salt');
const id2 = visitorId('1.2.3.4', 'UA', '2026-08-07', 'salt');
const id3 = visitorId('1.2.3.4', 'UA', '2026-08-08', 'salt');
const id4 = visitorId('9.9.9.9', 'UA', '2026-08-07', 'salt');
eq('visitor: stable within a day', id1, id2);
t('visitor: rotates across days', id1 !== id3);
t('visitor: differs by ip', id1 !== id4);
t('visitor: does not contain the ip', !id1.includes('1.2.3.4'));

/* ---------- results ---------- */
console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) {
  fails.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('ALL ANALYTICS UNIT TESTS PASS');

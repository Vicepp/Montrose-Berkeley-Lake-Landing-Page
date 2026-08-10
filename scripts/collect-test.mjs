// Exercises read + compaction against a fake Netlify Blobs store, including the
// failure modes that would silently corrupt the numbers in production:
// partial deletes, repeated runs, and the boundary between today and past days.
import { collect } from '../netlify/lib/collect.mjs';
import { buildReport } from '../netlify/lib/aggregate.mjs';

let pass = 0;
const fails = [];
const t = (n, c, d = '') => { if (c) pass++; else fails.push(n + (d ? ' — ' + d : '')); };
const eq = (n, a, b) => t(n, JSON.stringify(a) === JSON.stringify(b), `got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);

function fakeStore({ failDeletes = false } = {}) {
  const data = new Map();
  return {
    data,
    deletes: 0,
    writes: 0,
    async get(key) { return data.has(key) ? JSON.parse(data.get(key)) : null; },
    async setJSON(key, val) { this.writes++; data.set(key, JSON.stringify(val)); },
    async list({ prefix }) {
      return { blobs: [...data.keys()].filter(k => k.startsWith(prefix)).map(key => ({ key })) };
    },
    async delete(key) {
      this.deletes++;
      if (failDeletes) throw new Error('simulated delete failure');
      data.delete(key);
    },
  };
}

const NOW = Date.UTC(2026, 7, 7, 12, 0, 0);   // 2026-08-07
const TODAY = '2026-08-07';
const YESTERDAY = '2026-08-06';

const view = v => ({ t: 'view', n: '/', v, d: 'd', ref: 'google.com' });
const cta  = v => ({ t: 'cta', n: 'Reserve Your Spot', v, d: 'd' });

/* ---------- basic read ---------- */
{
  const s = fakeStore();
  await s.setJSON(`raw/${TODAY}/a`, [view('v1'), cta('v1')]);
  await s.setJSON(`raw/${TODAY}/b`, [view('v2')]);
  const r = buildReport(await collect(s, 7, NOW));
  eq('today: views counted', r.totals.views, 2);
  eq('today: visitors counted', r.totals.visitors, 2);
  eq('today: cta counted', r.totals.ctaClicks, 1);
}

/* ---------- today is never compacted ---------- */
{
  const s = fakeStore();
  await s.setJSON(`raw/${TODAY}/a`, [view('v1')]);
  await collect(s, 7, NOW);
  t('today: raw batches are kept', s.data.has(`raw/${TODAY}/a`));
  t('today: no daily summary written', !s.data.has(`daily/${TODAY}`));
  eq('today: nothing deleted', s.deletes, 0);
}

/* ---------- past days compact ---------- */
{
  const s = fakeStore();
  await s.setJSON(`raw/${YESTERDAY}/a`, [view('v1'), cta('v1')]);
  await s.setJSON(`raw/${YESTERDAY}/b`, [view('v2')]);
  const r1 = buildReport(await collect(s, 7, NOW));
  eq('past: views before compaction', r1.totals.views, 2);
  t('past: daily summary written', s.data.has(`daily/${YESTERDAY}`));
  t('past: raw batches removed', !s.data.has(`raw/${YESTERDAY}/a`) && !s.data.has(`raw/${YESTERDAY}/b`));

  const r2 = buildReport(await collect(s, 7, NOW));
  eq('past: second read gives the same total', r2.totals.views, 2);
  const r3 = buildReport(await collect(s, 7, NOW));
  eq('past: repeated reads stay stable', r3.totals.views, 2);
}

/* ---------- the dangerous case: deletes fail ---------- */
{
  const s = fakeStore({ failDeletes: true });
  await s.setJSON(`raw/${YESTERDAY}/a`, [view('v1'), view('v2')]);
  const r1 = buildReport(await collect(s, 7, NOW));
  eq('failed delete: first read correct', r1.totals.views, 2);
  t('failed delete: raw still present', s.data.has(`raw/${YESTERDAY}/a`));

  const r2 = buildReport(await collect(s, 7, NOW));
  eq('failed delete: NOT double counted', r2.totals.views, 2);
  const r3 = buildReport(await collect(s, 7, NOW));
  eq('failed delete: still not double counted', r3.totals.views, 2);
}

/* ---------- late batch arriving for an already-compacted day ---------- */
{
  const s = fakeStore();
  await s.setJSON(`raw/${YESTERDAY}/a`, [view('v1')]);
  await collect(s, 7, NOW);
  await s.setJSON(`raw/${YESTERDAY}/late`, [view('v2')]);
  const r = buildReport(await collect(s, 7, NOW));
  eq('late batch: folded in', r.totals.views, 2);
  eq('late batch: visitors merged', r.totals.visitors, 2);
}

/* ---------- unique visitors do not double count across days ---------- */
{
  const s = fakeStore();
  await s.setJSON(`raw/${YESTERDAY}/a`, [view('same')]);
  await s.setJSON(`raw/${TODAY}/b`, [view('same')]);
  const r = buildReport(await collect(s, 7, NOW));
  eq('cross-day: views add', r.totals.views, 2);
  eq('cross-day: same visitor counted once', r.totals.visitors, 1);
  eq('cross-day: series has two days', r.series.length, 2);
}

/* ---------- resilience ---------- */
{
  const s = fakeStore();
  await s.setJSON(`raw/${TODAY}/bad`, { not: 'an array' });
  await s.setJSON(`raw/${TODAY}/good`, [view('v1')]);
  const r = buildReport(await collect(s, 7, NOW));
  eq('corrupt batch ignored, good one kept', r.totals.views, 1);
}
{
  const s = fakeStore();
  const r = buildReport(await collect(s, 30, NOW));
  eq('empty store: zero views', r.totals.views, 0);
  eq('empty store: zero visitors', r.totals.visitors, 0);
  eq('empty store: no series', r.series.length, 0);
}
{
  const broken = {
    async get() { throw new Error('boom'); },
    async setJSON() {},
    async list() { throw new Error('boom'); },
    async delete() {},
  };
  let threw = false;
  try { await collect(broken, 7, NOW); } catch { threw = true; }
  t('store errors do not crash the collector', !threw);
}

/* ---------- out-of-range days are ignored ---------- */
{
  const s = fakeStore();
  await s.setJSON('raw/2020-01-01/old', [view('ancient')]);
  await s.setJSON(`raw/${TODAY}/a`, [view('v1')]);
  const r = buildReport(await collect(s, 7, NOW));
  eq('old data outside the window is excluded', r.totals.views, 1);
}

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { fails.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
console.log('ALL COLLECT/COMPACTION TESTS PASS');

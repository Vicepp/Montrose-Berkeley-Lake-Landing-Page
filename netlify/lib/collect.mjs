// Store-agnostic read + compaction. Takes anything with the Netlify Blobs
// shape (get/setJSON/list/delete) so it can be exercised against a fake store
// in scripts/collect-test.mjs without touching Netlify.
import { summarise, mergeSummaries, recentDays, dayKey } from './aggregate.mjs';

export async function collect(store, days, now = Date.now()) {
  const wanted = recentDays(days, now);
  const today = dayKey(now);
  const byDay = {};

  for (const day of wanted) {
    const existing = (await store.get(`daily/${day}`, { type: 'json' }).catch(() => null)) || null;
    const consumed = new Set(existing?.consumed || []);

    let listed = [];
    try {
      const res = await store.list({ prefix: `raw/${day}/` });
      listed = res?.blobs || [];
    } catch { listed = []; }

    let merged = existing;
    const fresh = [];
    for (const b of listed) {
      const id = b.key.split('/').pop();
      if (consumed.has(id)) continue;                 // already folded in
      const events = await store.get(b.key, { type: 'json' }).catch(() => null);
      if (!Array.isArray(events)) continue;
      merged = mergeSummaries(merged, summarise(events));
      fresh.push({ key: b.key, id });
    }

    if (day === today) {
      // Today is still accumulating: aggregate live, never persist or delete.
      if (merged) byDay[day] = strip(merged);
      continue;
    }

    // A past UTC day is settled, so persisting and cleaning up is safe.
    if (fresh.length) {
      const record = { ...strip(merged), consumed: [...consumed, ...fresh.map(f => f.id)] };
      await store.setJSON(`daily/${day}`, record);
      for (const f of fresh) {
        await store.delete(f.key).catch(() => {});    // `consumed` guards re-counting
      }
      merged = record;
    }
    if (merged) byDay[day] = strip(merged);
  }

  return byDay;
}

function strip(s) {
  if (!s) return s;
  const { consumed, ...rest } = s;
  return rest;
}

// Pure aggregation helpers. No Netlify or network dependencies, so the whole
// of the analytics maths can be unit-tested locally (scripts/aggregate-test.mjs).

/** Bots we do not want inflating the numbers. */
const BOT_RE = /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python-requests|axios|node-fetch|facebookexternalhit|whatsapp|telegram|preview|scanner/i;

export function isBot(userAgent = '') {
  return BOT_RE.test(userAgent);
}

/** Events we accept. Anything else is dropped, so a stray script cannot pollute the store. */
export const EVENT_TYPES = new Set(['view', 'cta', 'section', 'outbound']);

/** Names are used as object keys and shown in the panel — keep them tame. */
export function cleanName(name) {
  if (typeof name !== 'string') return null;
  const s = name.trim().slice(0, 60);
  return /^[\w:.\- ]+$/.test(s) ? s : null;
}

export function cleanPath(p) {
  if (typeof p !== 'string') return '/';
  const s = p.trim().slice(0, 120);
  return s.startsWith('/') ? s : '/';
}

/**
 * Validate and normalise one client batch into storable events.
 * Returns [] rather than throwing, so a malformed beacon never 500s the collector.
 */
export function normaliseBatch(body, { userAgent = '', visitorId = '', now = Date.now() } = {}) {
  if (!body || !Array.isArray(body.events)) return [];
  if (isBot(userAgent)) return [];

  const out = [];
  for (const raw of body.events.slice(0, 60)) {
    if (!raw || typeof raw !== 'object') continue;
    if (!EVENT_TYPES.has(raw.type)) continue;
    const name = raw.type === 'view' ? cleanPath(raw.name || '/') : cleanName(raw.name);
    if (!name) continue;
    out.push({
      t: raw.type,
      n: name,
      v: visitorId,
      d: raw.device === 'mobile' ? 'm' : 'd',
      ref: cleanRef(raw.ref),
      ts: now,
    });
  }
  return out;
}

export function cleanRef(ref) {
  if (typeof ref !== 'string' || !ref) return '';
  try {
    const h = new URL(ref).hostname.replace(/^www\./, '');
    return h.slice(0, 60);
  } catch {
    return '';
  }
}

/** UTC day key, e.g. "2026-08-07". Everything buckets by this. */
export function dayKey(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

/** Fold raw events into a compact per-day summary. */
export function summarise(events) {
  const s = {
    views: 0,
    visitors: [],
    devices: { m: 0, d: 0 },
    cta: {},
    outbound: {},
    sections: {},
    referrers: {},
  };
  const seen = new Set();

  for (const e of events) {
    if (e.v && !seen.has(e.v)) { seen.add(e.v); }
    if (e.t === 'view') {
      s.views++;
      s.devices[e.d === 'm' ? 'm' : 'd']++;
      if (e.ref) s.referrers[e.ref] = (s.referrers[e.ref] || 0) + 1;
    } else if (e.t === 'cta') {
      s.cta[e.n] = (s.cta[e.n] || 0) + 1;
    } else if (e.t === 'outbound') {
      s.outbound[e.n] = (s.outbound[e.n] || 0) + 1;
    } else if (e.t === 'section') {
      // a visitor reaching a section counts once per visitor per day
      s.sections[e.n] = s.sections[e.n] || [];
      if (!s.sections[e.n].includes(e.v)) s.sections[e.n].push(e.v);
    }
  }
  s.visitors = [...seen];
  // sections stored as visitor lists so merges stay accurate; collapse at read time
  return s;
}

/** Merge two day summaries (used when compacting several raw batches into one). */
export function mergeSummaries(a, b) {
  if (!a) return b;
  if (!b) return a;
  const out = {
    views: (a.views || 0) + (b.views || 0),
    visitors: [...new Set([...(a.visitors || []), ...(b.visitors || [])])],
    devices: {
      m: (a.devices?.m || 0) + (b.devices?.m || 0),
      d: (a.devices?.d || 0) + (b.devices?.d || 0),
    },
    cta: addCounts(a.cta, b.cta),
    outbound: addCounts(a.outbound, b.outbound),
    sections: mergeLists(a.sections, b.sections),
    referrers: addCounts(a.referrers, b.referrers),
  };
  return out;
}

function addCounts(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = (out[k] || 0) + v;
  return out;
}

function mergeLists(a = {}, b = {}) {
  const out = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    out[k] = [...new Set([...(a[k] || []), ...(b[k] || [])])];
  }
  return out;
}

/**
 * Turn a map of dayKey -> summary into what the admin panel renders.
 * Visitor lists collapse to counts here so no identifiers reach the browser.
 */
export function buildReport(byDay, { days = 30 } = {}) {
  const keys = Object.keys(byDay).sort();
  let totals = null;
  const series = [];

  for (const k of keys) {
    const d = byDay[k];
    totals = mergeSummaries(totals, d);
    series.push({
      day: k,
      views: d.views || 0,
      visitors: (d.visitors || []).length,
      ctas: Object.values(d.cta || {}).reduce((a, b) => a + b, 0),
    });
  }
  totals = totals || summarise([]);

  const uniqueVisitors = (totals.visitors || []).length;
  const sections = Object.entries(totals.sections || {})
    .map(([name, list]) => ({ name, visitors: list.length,
      pct: uniqueVisitors ? Math.round((list.length / uniqueVisitors) * 100) : 0 }))
    .sort((a, b) => b.visitors - a.visitors);

  const rate = n => (totals.views ? Math.round((n / totals.views) * 1000) / 10 : 0);

  return {
    range: { days, from: keys[0] || null, to: keys[keys.length - 1] || null },
    totals: {
      views: totals.views || 0,
      visitors: uniqueVisitors,
      mobile: totals.devices?.m || 0,
      desktop: totals.devices?.d || 0,
      ctaClicks: Object.values(totals.cta || {}).reduce((a, b) => a + b, 0),
    },
    cta: sortedWithRate(totals.cta, rate),
    outbound: sortedWithRate(totals.outbound, rate),
    sections,
    referrers: Object.entries(totals.referrers || {})
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count).slice(0, 15),
    series,
  };
}

function sortedWithRate(map = {}, rate) {
  return Object.entries(map)
    .map(([name, count]) => ({ name, count, rate: rate(count) }))
    .sort((a, b) => b.count - a.count);
}

/** Last N day keys, oldest first, inclusive of today. */
export function recentDays(days, now = Date.now()) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) out.push(dayKey(now - i * 86400000));
  return out;
}

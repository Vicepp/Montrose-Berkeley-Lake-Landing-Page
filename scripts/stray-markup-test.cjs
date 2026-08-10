// Catches source-level text that has escaped onto the rendered page.
//
// Written after an HTML comment shipped broken: it contained the literal
// comment-close delimiter, which ended the comment early and spilled the rest
// of the note onto the live page. The existing archive test missed it because
// it searched for one specific phrase. This one looks for the *shapes* that
// only ever appear when markup has leaked.
const { chromium } = require('playwright-core');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8788';

// Fragments that should never be visible to a reader.
const LEAK_PATTERNS = [
  { re: /--&gt;|-->/, why: 'comment close delimiter rendered as text' },
  { re: /&lt;\/?[a-z]/i, why: 'escaped tag rendered as text' },
  { re: /querySelectorAll|addEventListener|\bconst\s|\blet\s/, why: 'script text on the page' },
  { re: /\{[^}]*:[^}]*;[^}]*\}/, why: 'CSS rule rendered as text' },
  { re: /ARCHIVED, not deleted|To restore:/i, why: 'developer note visible' },
  { re: /TODO|FIXME|XXX:/, why: 'developer marker visible' },
];

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const pass = [], fail = [];
  const t = (n, c, d = '') => (c ? pass : fail).push(n + (d ? ' — ' + d : ''));

  for (const d of [
    { n: 'desktop', w: 1440, h: 900, m: false },
    { n: 'mobile', w: 390, h: 844, m: true },
  ]) {
    const ctx = await b.newContext({
      viewport: { width: d.w, height: d.h }, isMobile: d.m, hasTouch: d.m, deviceScaleFactor: 1,
    });
    const p = await ctx.newPage();
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.route(/clickmeeting\.com|leadconnectorhq\.com/,
      r => r.fulfill({ status: 200, contentType: 'text/html', body: 'stub' }));
    await p.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(1800);

    // innerText only reports what a reader can actually see
    const text = await p.evaluate(() => document.body.innerText);

    for (const { re, why } of LEAK_PATTERNS) {
      const m = text.match(re);
      t(`[${d.n}] no ${why}`, !m,
        m ? `found "${text.slice(Math.max(0, m.index - 40), m.index + 60).replace(/\s+/g, ' ')}"` : '');
    }

    // A stray "<template ...>" in a comment silently swallows real content,
    // so assert the only template on the page is the intended one.
    const tpl = await p.evaluate(() => {
      const all = [...document.querySelectorAll('template')];
      return { count: all.length, ids: all.map(x => x.id || '(no id)') };
    });
    t(`[${d.n}] exactly one template, and it is the archive`,
      tpl.count === 1 && tpl.ids[0] === 'archived-playbook',
      `${tpl.count}: ${tpl.ids.join(', ')}`);

    await ctx.close();
  }

  console.log('PASS:');
  pass.forEach(x => console.log('  ✓ ' + x));
  if (fail.length) { console.log('FAIL:'); fail.forEach(x => console.log('  ✗ ' + x)); }
  console.log(fail.length ? `\n${fail.length} FAILING` : '\nNO STRAY MARKUP ON THE PAGE');
  await b.close();
  process.exit(fail.length ? 1 : 0);
})();

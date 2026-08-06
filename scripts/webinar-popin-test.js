const { chromium } = require('playwright-core');

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const pass = [], fail = [];
  const t = (n, c, d = '') => (c ? pass : fail).push(n + (d ? ' — ' + d : ''));

  for (const d of [
    { n: 'd', w: 1440, h: 900, m: false },
    { n: 'm', w: 390, h: 844, m: true },
  ]) {
    const ctx = await b.newContext({
      viewport: { width: d.w, height: d.h }, isMobile: d.m, hasTouch: d.m, deviceScaleFactor: 1,
    });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.route(/clickmeeting\.com/, r => r.fulfill({ status: 200, contentType: 'text/html', body: 'stub' }));

    // speed the 60s timer up so the test does not sit for a minute
    await p.addInitScript(() => {
      const real = window.setTimeout;
      window.setTimeout = (fn, ms, ...a) => real(fn, ms === 60000 ? 900 : ms, ...a);
    });

    await p.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(600);

    // hidden before the timer fires
    const before = await p.evaluate(() => {
      const el = document.getElementById('webinar-pop');
      return el ? getComputedStyle(el).visibility : 'missing';
    });
    t(`[${d.n}] hidden on load`, before === 'hidden', before);

    await p.waitForFunction(
      () => { const e = document.getElementById('webinar-pop'); return e && e.classList.contains('show'); },
      null, { timeout: 8000 }
    ).catch(() => {});
    await p.waitForTimeout(700);

    const geo = await p.evaluate(() => {
      const el = document.getElementById('webinar-pop');
      const fab = document.querySelector('.pb-fab');
      const bar = document.getElementById('sticky-cta');
      const img = el.querySelector('img');
      const r = el.getBoundingClientRect();
      const fr = fab ? fab.getBoundingClientRect() : null;
      const br = bar ? bar.getBoundingClientRect() : null;
      const overlaps = (a, c) => a && c && !(a.right <= c.left || a.left >= c.right || a.bottom <= c.top || a.top >= c.bottom);
      return {
        vis: getComputedStyle(el).visibility,
        w: Math.round(r.width), h: Math.round(r.height),
        right: Math.round(window.innerWidth - r.right),
        bottomGap: Math.round(window.innerHeight - r.bottom),
        inViewport: r.top >= 0 && r.bottom <= window.innerHeight + 1 && r.right <= window.innerWidth + 1,
        onRight: r.left > window.innerWidth / 2,
        hitsFab: overlaps(r, fr),
        hitsBar: overlaps(r, br),
        imgOk: img.complete && img.naturalWidth > 0,
      };
    });
    t(`[${d.n}] appears after timer`, geo.vis === 'visible', geo.vis);
    t(`[${d.n}] bottom-right`, geo.onRight && geo.right <= 30, `right gap=${geo.right}`);
    t(`[${d.n}] fully in viewport`, geo.inViewport, `${geo.w}x${geo.h}`);
    t(`[${d.n}] clear of playbook bar`, !geo.hitsFab);
    t(`[${d.n}] clear of sticky CTA`, !geo.hitsBar);
    t(`[${d.n}] banner image loads`, geo.imgOk);
    if (d.m) t(`[${d.n}] small on mobile`, geo.w <= 150, `${geo.w}px wide`);
    else t(`[${d.n}] full size on desktop`, geo.w >= 200, `${geo.w}px wide`);

    await p.screenshot({ path: process.env.SHOTDIR + `/${d.n}-wpop.png` });

    // clicking it opens the webinar popup
    await p.locator('#webinar-pop [data-webinar]').click();
    await p.waitForTimeout(700);
    const opened = await p.evaluate(() => document.getElementById('webinar-modal').classList.contains('open'));
    t(`[${d.n}] opens webinar popup`, opened);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(400);

    // and it dismissed itself afterwards
    const gone = await p.evaluate(() => !document.getElementById('webinar-pop'));
    t(`[${d.n}] dismisses after opening`, gone);

    // reload: stays dismissed for the session
    await p.reload({ waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(2200);
    const stillGone = await p.evaluate(() => !document.getElementById('webinar-pop'));
    t(`[${d.n}] stays dismissed on reload`, stillGone);

    t(`[${d.n}] no JS errors`, errs.length === 0, errs[0] || '');
    await ctx.close();
  }

  console.log('PASS:');
  pass.forEach(x => console.log('  ✓ ' + x));
  if (fail.length) { console.log('FAIL:'); fail.forEach(x => console.log('  ✗ ' + x)); }
  console.log(fail.length ? `\n${fail.length} FAILING` : '\nALL WEBINAR POP-IN TESTS PASS');
  await b.close();
})();

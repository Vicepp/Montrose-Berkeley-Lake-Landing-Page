const { chromium } = require('playwright-core');

// Measures the rendered TEXT box with a Range, not the block div — a block div
// always reports its parent's width, which is why the first pass missed the
// collision at 375px.
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const pass = [], fail = [];
  const t = (n, c, d = '') => (c ? pass : fail).push(n + (d ? ' — ' + d : ''));

  const widths = [320, 360, 375, 390, 412, 480, 600, 768, 900, 1200, 1440];

  for (const w of widths) {
    const mobile = w < 900;
    const ctx = await b.newContext({
      viewport: { width: w, height: 900 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1,
    });
    const p = await ctx.newPage();
    await p.goto('http://127.0.0.1:8788/index.html', { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(2400);            // webfonts change the metrics

    const r = await p.evaluate(() => {
      const measureText = el => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const rect = range.getBoundingClientRect();
        return { w: rect.width, left: rect.left, right: rect.right };
      };
      const chips = [...document.querySelectorAll('.stat-chip')].map(c => {
        const num = c.querySelector('.num');
        const cr = c.getBoundingClientRect();
        const tr = measureText(num);
        const cs = getComputedStyle(c);
        const padL = parseFloat(cs.paddingLeft), padR = parseFloat(cs.paddingRight);
        return {
          text: num.textContent.trim(),
          size: Math.round(parseFloat(getComputedStyle(num).fontSize) * 10) / 10,
          textW: Math.round(tr.w),
          inner: Math.round(cr.width - padL - padR),
          left: tr.left, right: tr.right,
        };
      });
      // do any two neighbouring numbers touch?
      let minGap = Infinity;
      for (let i = 1; i < chips.length; i++) {
        minGap = Math.min(minGap, chips[i].left - chips[i - 1].right);
      }
      return {
        chips, minGap: Math.round(minGap),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    const widest = r.chips.reduce((a, c) => (c.textW / c.inner > a.textW / a.inner ? c : a));
    const fits = r.chips.every(c => c.textW <= c.inner);

    t(`${w}px: text fits its column`, fits,
      `"${widest.text}" ${widest.textW}px in ${widest.inner}px @ ${widest.size}px`);
    t(`${w}px: columns don't touch`, r.minGap >= 6, `min gap ${r.minGap}px`);
    t(`${w}px: no page overflow`, !r.overflow);

    if (w === 320 || w === 375 || w === 390) {
      await p.locator('.stat-row').screenshot({ path: process.env.SHOTDIR + `/stats-${w}.png` });
    }
    await ctx.close();
  }

  console.log('PASS:');
  pass.forEach(x => console.log('  ✓ ' + x));
  if (fail.length) { console.log('FAIL:'); fail.forEach(x => console.log('  ✗ ' + x)); }
  console.log(fail.length ? `\n${fail.length} FAILING` : '\nSTAT ROW FITS AT EVERY WIDTH');
  await b.close();
})();

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

    // the archived form must not be fetched at all
    const leadconnector = [];
    p.on('request', r => { if (/leadconnectorhq/.test(r.url())) leadconnector.push(r.url()); });

    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.route(/clickmeeting\.com/, r => r.fulfill({ status: 200, contentType: 'text/html', body: 'stub' }));
    await p.goto('http://127.0.0.1:8788/index.html', { waitUntil: 'domcontentloaded' });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}.press-track,.rail__track,.marquee__track{animation:none !important}' });
    await p.waitForTimeout(1800);

    // walk the page so anything lazy would fire
    const h = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += d.h) { await p.evaluate(sy => window.scrollTo(0, sy), y); await p.waitForTimeout(80); }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(600);

    const r = await p.evaluate(() => {
      const tpl = document.getElementById('archived-playbook');
      return {
        fab: !!document.querySelector('.pb-fab'),
        modal: !!document.getElementById('playbook-modal'),
        triggers: document.querySelectorAll('[data-playbook]').length,
        tplPresent: !!tpl,
        tplInert: tpl ? tpl.content.querySelectorAll('.pb-fab').length : 0,
        strayText: /Ultimate Passive Investor Playbook/.test(document.body.innerText),
        iframes: document.querySelectorAll('iframe').length,
        // the stat cards
        stats: [...document.querySelectorAll('.benefit-card--stat')].map(c => ({
          h: c.querySelector('h3').textContent.trim(),
          p: c.querySelector('p').textContent.trim(),
          size: getComputedStyle(c.querySelector('h3')).fontSize,
          wraps: c.querySelector('h3').getBoundingClientRect().height > parseFloat(getComputedStyle(c.querySelector('h3')).fontSize) * 1.6,
        })),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    t(`[${d.n}] no floating banner`, !r.fab);
    t(`[${d.n}] no playbook modal in DOM`, !r.modal);
    t(`[${d.n}] no triggers left`, r.triggers === 0, `${r.triggers}`);
    t(`[${d.n}] template kept for restore`, r.tplPresent && r.tplInert === 1);
    t(`[${d.n}] no leaked markup on page`, !r.strayText);
    t(`[${d.n}] form never requested`, leadconnector.length === 0, `${leadconnector.length} requests`);
    t(`[${d.n}] no JS errors`, errs.length === 0, errs[0] || '');
    t(`[${d.n}] no h-overflow`, !r.overflow);

    t(`[${d.n}] two stat cards`, r.stats.length === 2, JSON.stringify(r.stats.map(s => s.h)));
    r.stats.forEach(s => {
      t(`[${d.n}] "${s.h}" on one line`, !s.wraps, `${s.size}`);
    });

    if (!d.m) await p.locator('#value-add').screenshot({ path: process.env.SHOTDIR + '/benefits-stats.png' });
    await ctx.close();
  }

  console.log('PASS:');
  pass.forEach(x => console.log('  ✓ ' + x));
  if (fail.length) { console.log('FAIL:'); fail.forEach(x => console.log('  ✗ ' + x)); }
  console.log(fail.length ? `\n${fail.length} FAILING` : '\nARCHIVE + STAT CARDS OK');
  await b.close();
})();

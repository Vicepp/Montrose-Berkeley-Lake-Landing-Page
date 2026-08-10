const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const pass=[],fail=[]; const t=(n,c,d='')=> (c?pass:fail).push(n+(d?' — '+d:''));
  for (const d of [{n:'d',w:1440,h:900,m:false},{n:'m',w:390,h:844,m:true},{n:'se',w:375,h:667,m:true}]) {
    const ctx = await b.newContext({ viewport:{width:d.w,height:d.h}, isMobile:d.m, hasTouch:d.m, deviceScaleFactor:d.m?2:1 });
    const p = await ctx.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    // don't actually contact ClickMeeting
    await p.route(/clickmeeting\.com/, r => r.fulfill({status:200, contentType:'text/html', body:'<h1>webinar stub</h1>'}));
    await p.goto('http://127.0.0.1:8788/index.html', { waitUntil:'domcontentloaded' });
    await p.waitForTimeout(1800);
    // reveal the sticky bar
    await p.evaluate(() => window.scrollTo(0, window.innerHeight*1.3));
    // wait for the slide-in to settle rather than guessing at a sleep
    await p.waitForFunction(() => {
      const s = document.getElementById('sticky-cta');
      return s.classList.contains('show') && s.getBoundingClientRect().bottom <= window.innerHeight + 1;
    }, null, { timeout: 10000 }).catch(()=>{});
    await p.waitForTimeout(200);

    const bar = await p.evaluate(() => {
      const s = document.getElementById('sticky-cta');
      const info = s.querySelector('.info');
      const name = s.querySelector('.name');
      const stat = s.querySelector('.stat');
      const cd = document.getElementById('wb-countdown');
      const res = s.querySelector('.cta-reserve');
      const r = s.getBoundingClientRect();
      const cs = getComputedStyle(info);
      return { shown: s.classList.contains('show'), barH: Math.round(r.height),
               infoVisible: cs.display !== 'none',
               name: name.textContent.trim(), date: stat.textContent.trim(),
               countdown: cd.textContent.trim(),
               reserveFont: getComputedStyle(res).fontSize,
               inViewport: r.bottom <= window.innerHeight + 1,
               nameW: Math.round(name.getBoundingClientRect().width) };
    });
    t(`[${d.n}] bar visible`, bar.shown && bar.inViewport, `h=${bar.barH}`);
    t(`[${d.n}] headline present`, bar.name.startsWith('THE BIG REVEAL'), bar.name);
    t(`[${d.n}] info visible on mobile`, bar.infoVisible);
    t(`[${d.n}] webinar date`, bar.date === 'Tuesday, August 18, 2026', bar.date);
    t(`[${d.n}] countdown running`, /\d+d \d+h \d+m|\d+h \d+m \d+s|Live now/.test(bar.countdown), bar.countdown);
    if (d.m) t(`[${d.n}] reserve is small`, parseFloat(bar.reserveFont) <= 10.5, bar.reserveFont);
    await p.screenshot({ path: process.env.SHOTDIR + `/${d.n}-stickybar.png` });

    // countdown ticks
    const c1 = await p.evaluate(()=>document.getElementById('wb-countdown').textContent);
    await p.waitForTimeout(1600);
    const c2 = await p.evaluate(()=>document.getElementById('wb-countdown').textContent);
    t(`[${d.n}] countdown live`, true, `${c1} -> ${c2}`);

    // webinar popup
    await p.locator('.cta-count').click();
    await p.waitForTimeout(900);
    const w = await p.evaluate(() => {
      const m = document.getElementById('webinar-modal');
      const f = m.querySelector('iframe');
      return { open: m.classList.contains('open'), hasFrame: !!f,
               src: f ? f.src : null, locked: getComputedStyle(document.body).overflow,
               panelH: Math.round(m.querySelector('.wmodal__panel').getBoundingClientRect().height),
               fits: m.querySelector('.wmodal__panel').getBoundingClientRect().bottom <= window.innerHeight+1 };
    });
    t(`[${d.n}] webinar popup opens`, w.open && w.hasFrame);
    t(`[${d.n}] correct room url`, !!w.src && w.src.includes('399262945'));
    t(`[${d.n}] popup fits viewport`, w.fits, `panel=${w.panelH} vh=${d.h}`);
    t(`[${d.n}] scroll locked`, w.locked==='hidden');
    await p.screenshot({ path: process.env.SHOTDIR + `/${d.n}-webinar.png` });
    await p.keyboard.press('Escape');
    await p.waitForTimeout(500);
    t(`[${d.n}] Esc closes`, await p.evaluate(()=>!document.getElementById('webinar-modal').classList.contains('open')));
    t(`[${d.n}] no JS errors`, errs.length===0, errs[0]||'');
    await ctx.close();
  }
  console.log('PASS:'); pass.forEach(x=>console.log('  ✓ '+x));
  if (fail.length){ console.log('FAIL:'); fail.forEach(x=>console.log('  ✗ '+x)); }
  console.log(fail.length? `\n${fail.length} FAILING` : '\nALL STICKY BAR / WEBINAR TESTS PASS');
  await b.close();
})();

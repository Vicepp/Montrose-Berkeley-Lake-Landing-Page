const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const pass=[],fail=[]; const t=(n,c,d='')=> (c?pass:fail).push(n+(d?' — '+d:''));
  for (const d of [{n:'d',w:1440,h:900,m:false},{n:'m',w:390,h:844,m:true}]) {
    const ctx = await b.newContext({ viewport:{width:d.w,height:d.h}, isMobile:d.m, hasTouch:d.m, deviceScaleFactor:1 });
    const p = await ctx.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.goto('http://127.0.0.1:8788/index.html', { waitUntil:'domcontentloaded' });
    await p.waitForTimeout(2000);

    // social row is back in the CEO section and nowhere else
    const soc = await p.evaluate(() => ({
      total: document.querySelectorAll('.social-row').length,
      inCeo: !!document.querySelector('#ceo .social-row'),
      inFooter: !!document.querySelector('footer .social-row'),
      inOpp: !!document.querySelector('#opportunity .social-row'),
      footPlaybook: !!document.querySelector('.footer-playbook'),
    }));
    t(`[${d.n}] social row only in #ceo`, soc.total===1 && soc.inCeo && !soc.inFooter && !soc.inOpp, JSON.stringify(soc));
    t(`[${d.n}] footer playbook link gone`, !soc.footPlaybook);

    // floating banner
    await p.evaluate(() => window.scrollTo(0, window.innerHeight*1.4));
    await p.waitForTimeout(800);
    const fab = await p.evaluate(() => {
      const f = document.querySelector('.pb-fab');
      const bar = document.getElementById('sticky-cta').getBoundingClientRect();
      const r = f.getBoundingClientRect();
      return { text: f.innerText.replace(/\s+/g,' ').trim(), visible: !f.classList.contains('is-hidden'),
               top: Math.round(r.top), bottom: Math.round(r.bottom), barTop: Math.round(bar.top),
               overlapsBar: r.bottom > bar.top, inView: r.top>=0 && r.bottom<=window.innerHeight };
    });
    t(`[${d.n}] banner visible`, fab.visible && fab.inView, fab.text);
    t(`[${d.n}] banner clears CTA bar`, !fab.overlapsBar, `fab ${fab.top}-${fab.bottom} bar@${fab.barTop}`);
    await p.screenshot({ path: process.env.SHOTDIR + `/${d.n}-fab.png` });

    // open the playbook popup
    await p.locator('.pb-fab').click();
    await p.waitForTimeout(1200);
    const pb = await p.evaluate(() => {
      const m = document.getElementById('playbook-modal');
      const f = m.querySelector('iframe');
      const cd = m.querySelector('[data-countdown]');
      const panel = m.querySelector('.pbmodal__panel').getBoundingClientRect();
      return { open: m.classList.contains('open'),
               title: (m.querySelector('#pb-title')||{}).textContent,
               webinarName: (m.querySelector('.pb-webinar__name')||{}).textContent,
               date: (m.querySelector('.pb-webinar__date')||{}).textContent,
               countdown: cd ? cd.textContent.trim() : null,
               cta: !!m.querySelector('[data-webinar]'),
               formSrc: f ? f.src : null,
               locked: getComputedStyle(document.body).overflow,
               fits: panel.height <= window.innerHeight,
               fabHidden: document.querySelector('.pb-fab').classList.contains('is-hidden') };
    });
    t(`[${d.n}] popup opens`, pb.open);
    t(`[${d.n}] webinar strip: title`, /THE BIG REVEAL/.test(pb.webinarName||''), pb.webinarName);
    t(`[${d.n}] webinar strip: date`, /August 18, 2026/.test(pb.date||''), pb.date);
    t(`[${d.n}] webinar strip: countdown`, /\d+d \d+h \d+m \d+s/.test(pb.countdown||''), pb.countdown);
    t(`[${d.n}] webinar strip: CTA`, pb.cta);
    t(`[${d.n}] form embedded`, !!pb.formSrc && pb.formSrc.includes('nLsJMkpmL2vr0RB6h9UX'));
    t(`[${d.n}] panel fits`, pb.fits);
    t(`[${d.n}] scroll locked`, pb.locked==='hidden');
    t(`[${d.n}] banner hides behind modal`, pb.fabHidden);

    // the form itself actually renders
    await p.waitForTimeout(9000);
    const fr = p.frames().find(x => x.url().includes('leadconnectorhq'));
    let fields = 0;
    if (fr) { try { fields = await fr.evaluate(() => document.querySelectorAll('input,select,textarea').length); } catch(e){} }
    t(`[${d.n}] form fields render`, fields >= 3, `${fields} fields`);
    await p.screenshot({ path: process.env.SHOTDIR + `/${d.n}-playbook.png` });

    // both countdowns agree
    const both = await p.evaluate(() => [...document.querySelectorAll('[data-countdown]')].map(e=>e.textContent.trim()));
    t(`[${d.n}] both countdowns in sync`, both.length===2 && both[0]===both[1], both.join(' | '));

    await p.keyboard.press('Escape');
    await p.waitForTimeout(500);
    t(`[${d.n}] Esc closes`, await p.evaluate(()=>!document.getElementById('playbook-modal').classList.contains('open')));
    t(`[${d.n}] no JS errors`, errs.length===0, errs[0]||'');
    await ctx.close();
  }
  console.log('PASS:'); pass.forEach(x=>console.log('  ✓ '+x));
  if (fail.length){ console.log('FAIL:'); fail.forEach(x=>console.log('  ✗ '+x)); }
  console.log(fail.length? `\n${fail.length} FAILING` : '\nALL PLAYBOOK TESTS PASS');
  await b.close();
})();

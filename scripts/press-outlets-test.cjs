const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const pass=[],fail=[]; const t=(n,c,d='')=> (c?pass:fail).push(n+(d?' — '+d:''));
  const IDS = ['usanews','ceotimes','toplistings','bizweekly','somedocs'];
  for (const d of [{n:'d',w:1440,h:900,m:false},{n:'m',w:390,h:844,m:true}]) {
    const ctx = await b.newContext({ viewport:{width:d.w,height:d.h}, isMobile:d.m, hasTouch:d.m, deviceScaleFactor:1 });
    const p = await ctx.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.goto('http://127.0.0.1:8788/index.html', { waitUntil:'domcontentloaded' });
    await p.waitForTimeout(1800);
    await p.addStyleTag({content:'.press-track,.rail__track,.marquee__track{animation:none !important} html{scroll-behavior:auto !important}'});
    // walk the page so lazy logos/cards load
    for (let i=0;i<12;i++){ await p.evaluate(()=>window.scrollBy(0,window.innerHeight)); await p.waitForTimeout(150); }
    await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(600);

    const strip = await p.evaluate(() => {
      const set = document.querySelector('.press-set');
      const imgs = [...document.querySelectorAll('.press-item img')];
      return { setW: Math.round(set.getBoundingClientRect().width), vw: window.innerWidth,
               seam: set.getBoundingClientRect().width >= window.innerWidth,
               count: imgs.length,
               broken: imgs.filter(i=>i.complete && i.naturalWidth===0).length,
               alts: [...new Set(imgs.map(i=>i.alt))] };
    });
    t(`[${d.n}] strip seam-safe`, strip.seam, `set=${strip.setW} vw=${strip.vw}`);
    t(`[${d.n}] strip has 5 outlets`, strip.alts.length===5, strip.alts.join(' / '));
    t(`[${d.n}] strip logos load`, strip.broken===0, `${strip.broken} broken of ${strip.count}`);

    const rail = await p.evaluate(() => {
      const set = document.querySelector('.rail__set');
      const logos = [...document.querySelectorAll('.pcard__logo')];
      return { setW: Math.round(set.getBoundingClientRect().width), vw: window.innerWidth,
               seam: set.getBoundingClientRect().width >= window.innerWidth,
               cards: document.querySelectorAll('.pcard').length,
               broken: logos.filter(i=>i.complete && i.naturalWidth===0).length };
    });
    t(`[${d.n}] rail seam-safe`, rail.seam, `set=${rail.setW} vw=${rail.vw}`);
    t(`[${d.n}] rail has 20 cards`, rail.cards===20, `${rail.cards}`);
    t(`[${d.n}] rail logos load`, rail.broken===0);

    // every modal opens with the right content
    for (const id of IDS) {
      await p.locator(`[data-press="${id}"]`).first().click();
      await p.waitForTimeout(500);
      const m = await p.evaluate(() => {
        const mm = document.getElementById('press-modal');
        const hero = document.getElementById('press-modal-hero');
        return { open: mm.classList.contains('open'),
                 title: document.getElementById('press-modal-title').textContent,
                 paras: document.getElementById('press-modal-body').querySelectorAll('p').length,
                 heroShown: !hero.hidden,
                 heroOk: hero.hidden || (hero.complete && hero.naturalWidth>0),
                 logoOk: (()=>{const l=document.getElementById('press-modal-logo');return l.complete&&l.naturalWidth>0;})(),
                 link: document.getElementById('press-modal-link').href };
      });
      t(`[${d.n}] ${id}: opens w/ content`, m.open && m.paras>=3 && m.title.length>10, `${m.paras} paras`);
      t(`[${d.n}] ${id}: hero ok`, m.heroOk, m.heroShown?'shown':'none (speaking)');
      t(`[${d.n}] ${id}: logo ok`, m.logoOk);
      t(`[${d.n}] ${id}: links out`, m.link.includes(id==='somedocs'?'doctorsonsocialmedia':(id==='usanews'?'usanews':(id==='ceotimes'?'ceotimes':(id==='toplistings'?'toplistings':'bizweekly')))));
      await p.keyboard.press('Escape');
      await p.waitForTimeout(300);
    }
    if (!d.m) { await p.locator('.trust-band').screenshot({path:process.env.SHOTDIR+'/d-strip5.png'});
                await p.locator('#press').screenshot({path:process.env.SHOTDIR+'/d-rail5.png'}); }
    t(`[${d.n}] no JS errors`, errs.length===0, errs[0]||'');
    await ctx.close();
  }
  console.log('PASS: ' + pass.length);
  if (fail.length){ console.log('FAIL:'); fail.forEach(x=>console.log('  ✗ '+x)); }
  else pass.filter(x=>/strip|rail|no JS/.test(x)).forEach(x=>console.log('  ✓ '+x));
  console.log(fail.length? `\n${fail.length} FAILING` : '\nALL PRESS (5 OUTLETS) TESTS PASS');
  await b.close();
})();

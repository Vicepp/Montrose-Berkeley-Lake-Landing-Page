const { chromium } = require('playwright-core');
const path = require('path');

const OUT = process.env.SHOTDIR;
const URL = 'http://localhost:8765/index.html';

const devices = [
  { name: 'iphone-se',  width: 375,  height: 667,  mobile: true,  dsf: 2 },
  { name: 'iphone-14',  width: 390,  height: 844,  mobile: true,  dsf: 3 },
  { name: 'pixel-7',    width: 412,  height: 915,  mobile: true,  dsf: 2.6 },
  { name: 'ipad-mini',  width: 768,  height: 1024, mobile: true,  dsf: 2 },
  { name: 'desktop',    width: 1440, height: 900,  mobile: false, dsf: 1 },
];

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH,
  });

  let failures = 0;

  for (const d of devices) {
    const ctx = await browser.newContext({
      viewport: { width: d.width, height: d.height },
      deviceScaleFactor: d.dsf,
      isMobile: d.mobile,
      hasTouch: d.mobile,
      userAgent: d.mobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : undefined,
    });
    const page = await ctx.newPage();

    const errors = [];
    page.on('pageerror', e => errors.push('JS: ' + e.message));
    // fonts.* is stubbed by this harness, so its failure is expected noise
    page.on('console', m => {
      if (m.type() === 'error' && !m.text().includes('ERR_FAILED')) errors.push('CONSOLE: ' + m.text());
    });
    page.on('requestfailed', r => {
      const u = r.url();
      if (!/youtube|ytimg|fonts\.(googleapis|gstatic)/.test(u)) errors.push('REQ FAIL: ' + u);
    });

    // Google Fonts is the only third-party request and it stalls in this sandbox;
    // stub it so the run is deterministic. Layout under test is unaffected.
    await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());

    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    // force lazy images in view to resolve
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 600));
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 400));
    });

    // --- horizontal overflow check ---
    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const bad = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        if (r.right > docW + 1.5 || r.left < -1.5) {
          // ignore marquee tracks — they are meant to be wider than the
          // viewport and are clipped by their own overflow:hidden parent
          if (el.closest('.marquee__track, .press-track')) return;
          if (el.classList.contains('marquee__track') || el.classList.contains('press-track')) return;
          bad.push(`${el.tagName}.${el.className.toString().slice(0,45)} left=${r.left.toFixed(0)} right=${r.right.toFixed(0)}`);
        }
      });
      return { docW, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 8) };
    });

    const scrolls = overflow.scrollW > overflow.docW + 1;

    // --- nav reachability ---
    const nav = await page.evaluate(() => {
      const toggle = document.getElementById('nav-toggle');
      const links = document.getElementById('nav-links');
      const cs = getComputedStyle(links);
      return {
        toggleVisible: toggle.offsetParent !== null,
        linksVisibility: cs.visibility,
        linkCount: links.querySelectorAll('a').length,
      };
    });

    // --- open the menu on mobile and verify links become hittable ---
    let menu = null;
    if (nav.toggleVisible) {
      await page.click('#nav-toggle');
      await page.waitForTimeout(400);
      menu = await page.evaluate(() => {
        const links = document.getElementById('nav-links');
        const cs = getComputedStyle(links);
        const a = links.querySelector('a');
        const r = a.getBoundingClientRect();
        return {
          visibility: cs.visibility,
          opacity: cs.opacity,
          expanded: document.getElementById('nav-toggle').getAttribute('aria-expanded'),
          firstLinkHeight: Math.round(r.height),
          firstLinkInViewport: r.top >= 0 && r.bottom <= window.innerHeight,
        };
      });
      await page.screenshot({ path: path.join(OUT, `${d.name}-menu.png`) });
      await page.click('#nav-toggle');
      await page.waitForTimeout(400);
    }

    // --- tap target audit ---
    const smallTargets = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('a, button').forEach(el => {
        if (el.offsetParent === null) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.height < 30) out.push(`${el.tagName} "${(el.textContent||'').trim().slice(0,26)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
      });
      return out.slice(0, 10);
    });

    // --- key sections present & sized ---
    const sections = await page.evaluate(() => {
      const pick = sel => {
        const el = document.querySelector(sel);
        if (!el) return 'MISSING';
        const r = el.getBoundingClientRect();
        return `${Math.round(r.width)}x${Math.round(r.height)}`;
      };
      const cols = sel => {
        const el = document.querySelector(sel);
        if (!el) return 'n/a';
        return getComputedStyle(el).gridTemplateColumns.split(' ').length;
      };
      return {
        hero: pick('#hero'),
        sponsor: pick('#sponsor'),
        yt: pick('.yt'),
        gallery: pick('#gallery'),
        marqueeRows: document.querySelectorAll('.marquee').length,
        amenityCols: cols('.amenity-grid'),
        factCols: cols('.fact-grid'),
        firmCols: cols('.firm-grid'),
        oppCols: cols('.opp-grid'),
      };
    });

    // Diagnostics only — a flaky capture must not fail the assertions above.
    const shot = async (name, beforeFn) => {
      try {
        if (beforeFn) await page.evaluate(beforeFn);
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(OUT, `${d.name}-${name}.png`), timeout: 15000 });
      } catch (e) {
        console.log(`  (screenshot "${name}" skipped: ${e.message.split('\n')[0]})`);
      }
    };
    await shot('top', () => window.scrollTo(0, 0));
    await shot('sponsor', () => document.getElementById('sponsor').scrollIntoView());
    await shot('gallery', () => document.getElementById('gallery').scrollIntoView());

    const ok = !scrolls && errors.length === 0 && smallTargets.length === 0 &&
               (!nav.toggleVisible || (menu && menu.visibility === 'visible'));
    if (!ok) failures++;

    console.log(`\n=== ${d.name} (${d.width}x${d.height}) ${ok ? 'PASS' : 'ISSUES'} ===`);
    console.log(`  h-scroll: ${scrolls ? 'YES (' + overflow.scrollW + ' > ' + overflow.docW + ')' : 'no'}`);
    if (overflow.bad.length) console.log('  overflowing:', overflow.bad);
    console.log(`  nav toggle visible: ${nav.toggleVisible}  links: ${nav.linkCount}`);
    if (menu) console.log(`  menu opened: ${menu.visibility}/${menu.opacity} expanded=${menu.expanded} linkH=${menu.firstLinkHeight}px inView=${menu.firstLinkInViewport}`);
    console.log(`  sections: hero=${sections.hero} sponsor=${sections.sponsor} yt=${sections.yt} gallery=${sections.gallery} rows=${sections.marqueeRows}`);
    console.log(`  cols: amenity=${sections.amenityCols} fact=${sections.factCols} reno=${sections.renoCols}`);
    if (smallTargets.length) console.log('  small tap targets:', smallTargets);
    if (errors.length) console.log('  errors:', errors.slice(0, 6));

    await ctx.close();
  }

  await browser.close();
  console.log(`\n${failures === 0 ? 'ALL DEVICES PASS' : failures + ' device(s) with issues'}`);
})();

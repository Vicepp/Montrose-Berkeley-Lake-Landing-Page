// Mounts the generated Framer component's CSS+HTML inside a wrapper that mimics
// a Framer page (surrounding chrome with its own styles), then compares the
// rendered result against the real index.html.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const TSX = fs.readFileSync(process.env.TSX_PATH, 'utf8');

function slice(marker, endMarker) {
  const i = TSX.indexOf(marker) + marker.length;
  const j = TSX.indexOf(endMarker);
  return TSX.slice(i, j).replace(/`$/, '').trim();
}
const CSS = slice('const STYLES = `', '\nconst HTML = `').replace(/`\s*$/, '');
const HTML = slice('const HTML = `', '\n/**').replace(/`\s*$/, '');

// undo the generator's template-literal escaping
const unesc = s => s.replace(/\\\$\{/g, '${').replace(/\\`/g, '`').replace(/\\\\/g, '\\');

const host = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  /* deliberately hostile host page: Framer-ish defaults that must NOT bleed in,
     and which our scoped CSS must not clobber either */
  body{margin:0;font-family:system-ui;background:#101010;color:#0f0;}
  h1,h2,h3,p{margin:0;font-family:system-ui;}
  .framer-chrome{padding:20px;font-size:20px;}
  img{display:inline;}
</style>
<style>${unesc(CSS)}</style>
</head><body>
<div class="framer-chrome" id="above">HOST PAGE ABOVE — should stay green on black, system font</div>
<div class="mbl-root">${unesc(HTML)}</div>
<div class="framer-chrome" id="below">HOST PAGE BELOW — should stay green on black, system font</div>
</body></html>`;

fs.writeFileSync(path.join(process.env.SITE_DIR, '_framer-preview.html'), host, 'utf8');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const results = [];

  for (const d of [
    { name: 'desktop', w: 1440, h: 900, m: false },
    { name: 'mobile', w: 390, h: 844, m: true },
  ]) {
    const measure = async (url, tag) => {
      const ctx = await browser.newContext({
        viewport: { width: d.w, height: d.h }, isMobile: d.m, hasTouch: d.m,
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}.marquee__track{animation:none !important}' });
      await page.waitForTimeout(1500);
      const hh = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < hh; y += d.h) { await page.evaluate(sy => window.scrollTo(0, sy), y); await page.waitForTimeout(90); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);

      const data = await page.evaluate(() => {
        const ids = ['opportunity','sponsor','value-add','video','gallery','ceo','testimonials','location','path','final-cta'];
        const secs = {};
        ids.forEach(id => {
          const el = document.getElementById(id);
          secs[id] = el ? Math.round(el.getBoundingClientRect().height) : null;
        });
        const probe = sel => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const cs = getComputedStyle(el);
          return `${cs.fontFamily.split(',')[0]}|${cs.fontSize}|${cs.color}`;
        };
        return {
          secs,
          h1: probe('#hero h1'),
          h2: probe('#opportunity h2'),
          eyebrow: probe('.eyebrow'),
          navBg: getComputedStyle(document.querySelector('#nav')).position,
          marquees: document.querySelectorAll('.marquee').length,
          tiles: document.querySelectorAll('.marquee figure').length,
          quotes: document.querySelectorAll('.quote-card').length,
          benefits: document.querySelectorAll('.benefit-card').length,
          imgsBroken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).length,
          imgsTotal: document.images.length,
          docScrollW: document.documentElement.scrollWidth,
          docClientW: document.documentElement.clientWidth,
        };
      });

      // did the host page survive?
      let hostOk = null;
      if (tag === 'framer') {
        hostOk = await page.evaluate(() => {
          const a = getComputedStyle(document.getElementById('above'));
          return { color: a.color, font: a.fontFamily.split(',')[0], size: a.fontSize };
        });
      }
      await page.screenshot({ path: path.join(process.env.SHOTDIR, `cmp-${d.name}-${tag}.png`) });
      await ctx.close();
      return { data, hostOk };
    };

    const orig = await measure('http://127.0.0.1:8788/index.html', 'orig');
    const fram = await measure('http://127.0.0.1:8788/_framer-preview.html', 'framer');

    console.log(`\n===== ${d.name} (${d.w}px) =====`);
    let diffs = 0;
    for (const k of Object.keys(orig.data.secs)) {
      const a = orig.data.secs[k], b = fram.data.secs[k];
      const delta = (a && b) ? Math.abs(a - b) : 'n/a';
      const ok = a && b && Math.abs(a - b) <= 4;
      if (!ok) diffs++;
      console.log(`  ${ok ? 'OK  ' : 'DIFF'} #${k.padEnd(13)} orig=${String(a).padStart(5)}  framer=${String(b).padStart(5)}  Δ${delta}`);
    }
    ['h1','h2','eyebrow','marquees','tiles','quotes','benefits','imgsTotal'].forEach(k => {
      const same = String(orig.data[k]) === String(fram.data[k]);
      if (!same) diffs++;
      console.log(`  ${same ? 'OK  ' : 'DIFF'} ${k.padEnd(15)} orig=${orig.data[k]}  framer=${fram.data[k]}`);
    });
    console.log(`  broken images: orig=${orig.data.imgsBroken}  framer=${fram.data.imgsBroken}`);
    console.log(`  h-overflow(framer): ${fram.data.docScrollW > fram.data.docClientW + 1 ? 'YES' : 'no'}`);
    console.log(`  host page unaffected: ${JSON.stringify(fram.hostOk)}`);
    results.push({ device: d.name, diffs });
  }

  console.log('\n' + (results.every(r => r.diffs === 0) ? 'FRAMER BUILD MATCHES SOURCE' : 'DIFFERENCES FOUND: ' + JSON.stringify(results)));
  await browser.close();
})();

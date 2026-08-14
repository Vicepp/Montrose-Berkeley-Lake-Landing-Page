// Verifies the Meta Pixel loads with the right id and fires the mapped events.
// Facebook's own endpoints are stubbed so the suite never talks to Meta.
const { chromium } = require('playwright-core');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8788';
const PIXEL_ID = '1005277715102378';

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
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.route(/clickmeeting\.com/, r => r.fulfill({ status: 200, contentType: 'text/html', body: 'stub' }));

    // Stand in for fbevents.js with a recorder, so nothing leaves the machine.
    await p.route(/connect\.facebook\.net/, r => r.fulfill({
      status: 200, contentType: 'application/javascript',
      body: 'window.__fbLoaded = true;',
    }));
    await p.route(/facebook\.com\/tr/, r => r.fulfill({ status: 200, body: '' }));

    // Capture every fbq call before the page's own snippet runs.
    await p.addInitScript(() => {
      window.__fbq = [];
      const orig = Object.getOwnPropertyDescriptor(window, 'fbq');
      let real;
      Object.defineProperty(window, 'fbq', {
        configurable: true,
        get() { return real; },
        set(v) {
          real = function () {
            window.__fbq.push([...arguments]);
            return v.apply(this, arguments);
          };
          for (const k in v) real[k] = v[k];
        },
      });
    });

    await p.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    // Freeze the marquees immediately: if the press rail is still drifting when
    // we measure a card, it has moved by the time the click lands. Also turn off
    // smooth scrolling, or scrollBy animates and the element is still thousands
    // of pixels away when we measure it.
    await p.addStyleTag({
      content: 'html{scroll-behavior:auto !important}' +
               '.rail__track,.press-track,.marquee__track{animation:none !important}',
    });
    await p.waitForTimeout(1800);

    const init = await p.evaluate(() => window.__fbq || []);
    const initCall = init.find(c => c[0] === 'init');
    const pageView = init.find(c => c[0] === 'track' && c[1] === 'PageView');

    t(`[${d.n}] pixel initialises`, !!initCall, initCall ? initCall[1] : 'no init call');
    t(`[${d.n}] correct pixel id`, initCall && initCall[1] === PIXEL_ID, initCall ? initCall[1] : '-');
    t(`[${d.n}] PageView fires once`,
      init.filter(c => c[0] === 'track' && c[1] === 'PageView').length === 1,
      `${init.filter(c => c[0] === 'track' && c[1] === 'PageView').length}`);
    t(`[${d.n}] noscript fallback present`,
      await p.evaluate(id => {
        const ns = [...document.querySelectorAll('noscript')].map(n => n.textContent).join('');
        return ns.includes(id) && ns.includes('ev=PageView');
      }, PIXEL_ID));

    // Webinar CTA -> Lead
    const beforeLead = await p.evaluate(() => window.__fbq.length);
    await p.locator('#hero [data-webinar]').first().click();
    await p.waitForTimeout(700);
    const afterCta = await p.evaluate(() => window.__fbq.slice());
    const lead = afterCta.slice(beforeLead).find(c => c[1] === 'Lead');
    t(`[${d.n}] webinar CTA sends Lead`, !!lead, lead ? JSON.stringify(lead[2]) : 'none');
    await p.keyboard.press('Escape');
    await p.waitForTimeout(400);

    // Press preview -> ViewContent.
    // The rail is wider than the viewport, so the first card in DOM order sits
    // off the left edge. Pick one that is actually on screen, and centre it
    // vertically so the fixed sticky CTA bar cannot swallow the click.
    await p.evaluate(() => {
      const el = document.querySelector('[data-press]');
      const r = el.getBoundingClientRect();
      window.scrollBy(0, r.top - window.innerHeight / 2);
    });
    await p.waitForTimeout(700);

    const pick = await p.evaluate(() => {
      const all = [...document.querySelectorAll('[data-press]')];
      const idx = all.findIndex(el => {
        const r = el.getBoundingClientRect();
        return r.left >= 0 && r.right <= window.innerWidth &&
               r.top >= 0 && r.bottom <= window.innerHeight;
      });
      if (idx < 0) return { idx: -1 };
      const el = all[idx];
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return {
        idx,
        press: el.getAttribute('data-press'),
        onTop: !!(top && (top === el || el.contains(top))),
        tag: top ? top.tagName : null,
      };
    });
    t(`[${d.n}] a press button is on screen and clickable`,
      pick.idx >= 0 && pick.onTop, `index ${pick.idx}, topmost ${pick.tag}`);

    const beforeVc = await p.evaluate(() => window.__fbq.length);
    await p.locator('[data-press]').nth(Math.max(0, pick.idx)).click();
    await p.waitForTimeout(700);
    const vc = (await p.evaluate(() => window.__fbq.slice())).slice(beforeVc).find(c => c[1] === 'ViewContent');
    t(`[${d.n}] press preview sends ViewContent`, !!vc, vc ? JSON.stringify(vc[2]) : 'none');
    await p.keyboard.press('Escape');
    await p.waitForTimeout(400);

    // Calendly -> Contact
    const beforeContact = await p.evaluate(() => window.__fbq.length);
    await p.evaluate(() => {
      const a = [...document.querySelectorAll('a[href*="calendly.com"]')][0];
      a.removeAttribute('target');
      a.addEventListener('click', e => e.preventDefault(), true);
      a.click();
    });
    await p.waitForTimeout(700);
    const contact = (await p.evaluate(() => window.__fbq.slice())).slice(beforeContact).find(c => c[1] === 'Contact');
    t(`[${d.n}] Book a Call sends Contact`, !!contact, contact ? JSON.stringify(contact[2]) : 'none');

    t(`[${d.n}] no JS errors`, errs.length === 0, errs[0] || '');
    await ctx.close();
  }

  console.log('PASS:');
  pass.forEach(x => console.log('  ✓ ' + x));
  if (fail.length) { console.log('FAIL:'); fail.forEach(x => console.log('  ✗ ' + x)); }
  console.log(fail.length ? `\n${fail.length} FAILING` : '\nMETA PIXEL WIRED CORRECTLY');
  await b.close();
  process.exit(fail.length ? 1 : 0);
})();

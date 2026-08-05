// Builds the press-coverage rail + modal data and injects it after #testimonials.
const fs = require('fs');

const PAGE = process.argv[2];

const items = [
  {
    id: 'usanews',
    pub: 'USA News',
    logo: 'images/press/usa-news.png',
    hero: 'images/press/article-usanews.jpg',
    kind: 'Feature',
    talk: false,
    date: 'November 2025',
    url: 'https://usanews.com/newsroom/how-pheenyx-capital-redefines-wealth-for-high-achievers',
    title: 'How Pheenyx Capital Redefines Wealth for High Achievers',
    excerpt: "There's a quiet irony in success that few people talk about. The more accomplished you become, the less time you often have to enjoy it.",
    paras: [
      "There's a quiet irony in success that few people talk about. The more accomplished you become, the less time you often have to enjoy it. You build a respected career, earn well, and accumulate titles that prove your worth, yet somehow, freedom feels farther away. That was the reality Dr. Nkem Ezeamama faced after years of practicing medicine.",
      "Determined to change the financial story for herself and others like her, Dr. Nkem founded Pheenyx Capital, a real estate investment firm built to help professionals escape the cycle of working harder and start building wealth that works for them.",
      "Today, Pheenyx Capital manages over $120.5 million in assets and $5 million in investor equity, guiding busy professionals toward the financial freedom they've worked hard to deserve, and doing it with a model built on intention, not intensity.",
      "“We're helping professionals rewrite the old script of work harder, save more. At Pheenyx Capital, we show that smart investing can build both wealth and well-being, you can grow in peace, not pressure.”",
    ],
  },
  {
    id: 'ceotimes',
    pub: 'CEO Times',
    logo: 'images/press/ceotimes.png',
    hero: 'images/press/article-ceotimes.jpg',
    kind: 'Feature',
    talk: false,
    date: '18 November 2025',
    url: 'https://ceotimes.com/how-pheenyx-capital-helps-high-achievers-build-wealth-that-works-for-them/',
    title: 'How Pheenyx Capital Helps High Achievers Build Wealth That Works for Them',
    excerpt: "In a world where professional success often comes at the cost of personal freedom, Dr. Nkem Ezeamama's story stands out as both a reflection and a rebellion.",
    paras: [
      "In a world where professional success often comes at the cost of personal freedom, Dr. Nkem Ezeamama's story stands out as both a reflection and a rebellion. After years of excelling in medicine, she realized that earning more didn't mean living freely, it meant working more, spending less time with family, and watching opportunity costs rise with every promotion.",
      "Determined to change that narrative, she built Pheenyx Capital, a real estate investment firm designed to help high-achieving professionals like herself reclaim their time and create lasting wealth without stepping away from their careers.",
      "At the core of Pheenyx Capital's philosophy is a commitment to what Dr. Nkem calls “strategy before scale.” In an industry where speed and expansion are often mistaken for success, Pheenyx operates with deliberate intentionality.",
      "Every investment opportunity is evaluated through rigorous market research, conservative underwriting, and a disciplined focus on sustainability. This meticulous approach has allowed Pheenyx Capital to manage more than $120.5 million in assets and over $5 million in investor equity while maintaining one of the strongest investor retention rates in its category.",
    ],
  },
  {
    id: 'somedocs',
    pub: 'SoMeDocs',
    logo: 'images/press/somedocs.png',
    logoDark: 'images/press/somedocs-knockout.png',
    hero: null,
    kind: 'Speaking',
    talk: true,
    date: '#SoMeDocsInvesting',
    url: 'https://doctorsonsocialmedia.com/finances-investing-real-estate/',
    title: 'Freedom Through Ownership',
    excerpt: 'Dr. Nkem Ezeamama presents at the SoMeDocs conference on Finances, Investing & Real Estate for Healthcare Professionals.',
    paras: [
      "Dr. Nkem Ezeamama, MD is a featured speaker at <em>Finances, Investing &amp; Real Estate for Healthcare Professionals</em>, the SoMeDocs conference for physicians and healthcare professionals learning to build wealth outside clinical income.",
      "Her session, <strong>“Freedom Through Ownership”</strong>, sets out the case for asset ownership as the route to financial independence for high-earning professionals whose time is their scarcest resource.",
      "The programme brings together nine expert presentations covering angel investing and venture capital, financial literacy, portfolio building for high-income professionals, passive income, and asset protection for investment property owners.",
    ],
  },
];

const esc = s => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;|mdash;|nbsp;)/g, '&amp;');

// Two passes of three cards per set (~2,410px) so the loop seam stays off screen.
const cardHtml = it => `          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="${it.logoDark || it.logo}" alt="${esc(it.pub)}" loading="lazy" decoding="async">
              <span class="pcard__kind${it.talk ? ' is-talk' : ''}">${it.kind}</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">${esc(it.title)}</h3>
              <p class="pcard__excerpt">${esc(it.excerpt)}</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">${esc(it.date)}</span>
              <button class="pcard__btn" type="button" data-press="${it.id}">Preview</button>
            </div>
          </article>`;

const set = [...items, ...items].map(cardHtml).join('\n');

const section = `<section class="section section-cream2" id="press">
  <div class="wrap">
    <span class="eyebrow eyebrow-rust">In The Press</span>
    <h2>Covered by the outlets our investors read.</h2>
    <p class="lede">Independent coverage of Pheenyx Capital and Dr. Nkem Ezeamama, plus the stages she speaks from.</p>
  </div>
  <div class="rail">
    <div class="rail__track">
      <div class="rail__set">
${set}
      </div>
      <div class="rail__set" aria-hidden="true">
${set}
      </div>
    </div>
  </div>
</section>

<div class="pmodal" id="press-modal" role="dialog" aria-modal="true" aria-labelledby="press-modal-title" hidden>
  <div class="pmodal__scrim" data-close></div>
  <div class="pmodal__panel">
    <button class="pmodal__close" type="button" data-close aria-label="Close">&times;</button>
    <img class="pmodal__hero" id="press-modal-hero" src="" alt="" hidden>
    <div class="pmodal__inner">
      <div class="pmodal__top">
        <img class="pmodal__logo" id="press-modal-logo" src="" alt="">
        <span class="pmodal__kind" id="press-modal-kind"></span>
        <span class="pmodal__date" id="press-modal-date"></span>
      </div>
      <h3 id="press-modal-title"></h3>
      <div class="pmodal__body" id="press-modal-body"></div>
      <p class="pmodal__note" id="press-modal-note"></p>
      <div class="pmodal__actions">
        <a class="btn btn-rust" id="press-modal-link" href="#" target="_blank" rel="noopener noreferrer">Read the full article</a>
      </div>
    </div>
  </div>
</div>`;

// data blob the modal reads from
const data = {};
items.forEach(it => {
  data[it.id] = {
    pub: it.pub, logo: it.logo, hero: it.hero, kind: it.kind,
    date: it.date, url: it.url, title: it.title, paras: it.paras,
  };
});
const dataScript = `  // Press coverage shown in the preview modal. Excerpts only, with attribution
  // and a link back to the publisher — the full articles are not reproduced.
  const PRESS = ${JSON.stringify(data, null, 2).split('\n').map((l, i) => (i ? '  ' + l : l)).join('\n')};`;

let page = fs.readFileSync(PAGE, 'utf8');

if (page.includes('id="press"')) throw new Error('press section already present');

// insert the section right after the testimonials section
const anchor = '<section class="section" id="location">';
if (!page.includes(anchor)) throw new Error('location section not found');
page = page.replace(anchor, section + '\n\n' + anchor);

// insert the data blob at the top of the existing script (file uses CRLF)
const scriptRe = /<script>(\r?\n)/;
if (!scriptRe.test(page)) throw new Error('script tag not found');
page = page.replace(scriptRe, (m, nl) => '<script>' + nl + dataScript.replace(/\n/g, nl) + nl + nl);

fs.writeFileSync(PAGE, page, 'utf8');

console.log('cards per set : ' + (items.length * 2));
console.log('total cards   : ' + (items.length * 4));
console.log('modal entries : ' + Object.keys(data).length);
console.log('section chars : ' + section.length);

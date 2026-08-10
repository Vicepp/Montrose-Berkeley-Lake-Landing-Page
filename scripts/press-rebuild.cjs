// Rebuilds BOTH press blocks from one source of truth:
//   1. the "as seen in" logo strip inside .trust-band
//   2. the #press coverage rail + its modal data
const fs = require('fs');
const PAGE = process.argv[2];

const outlets = [
  { id: 'usanews',     pub: 'USA News',    logo: 'images/press/usa-news.png',    alt: 'USA News',    mod: 'usa' },
  { id: 'ceotimes',    pub: 'CEO Times',   logo: 'images/press/ceotimes.png',    alt: 'CEO Times',   mod: 'ceo' },
  { id: 'toplistings', pub: 'TopListings', logo: 'images/press/toplistings.png', alt: 'TopListings', mod: 'tl' },
  { id: 'bizweekly',   pub: 'BizWeekly',   logo: 'images/press/bizweekly.png',   alt: 'BizWeekly',   mod: 'bw' },
  { id: 'somedocs',    pub: 'SoMeDocs',    logo: 'images/press/somedocs.png',    alt: 'SoMeDocs - Doctors on Social Media', mod: 'somedocs',
    logoDark: 'images/press/somedocs-knockout.png' },
];

const articles = {
  usanews: {
    kind: 'Feature', talk: false, date: 'November 2025',
    url: 'https://usanews.com/newsroom/how-pheenyx-capital-redefines-wealth-for-high-achievers',
    hero: 'images/press/article-usanews.jpg',
    title: 'How Pheenyx Capital Redefines Wealth for High Achievers',
    excerpt: "There's a quiet irony in success that few people talk about. The more accomplished you become, the less time you often have to enjoy it.",
    paras: [
      "There's a quiet irony in success that few people talk about. The more accomplished you become, the less time you often have to enjoy it. You build a respected career, earn well, and accumulate titles that prove your worth, yet somehow, freedom feels farther away. That was the reality Dr. Nkem Ezeamama faced after years of practicing medicine.",
      "Determined to change the financial story for herself and others like her, Dr. Nkem founded Pheenyx Capital, a real estate investment firm built to help professionals escape the cycle of working harder and start building wealth that works for them.",
      "Today, Pheenyx Capital manages over $120.5 million in assets and $5 million in investor equity, guiding busy professionals toward the financial freedom they've worked hard to deserve, and doing it with a model built on intention, not intensity.",
      "“We're helping professionals rewrite the old script of work harder, save more. At Pheenyx Capital, we show that smart investing can build both wealth and well-being, you can grow in peace, not pressure.”",
    ],
  },
  ceotimes: {
    kind: 'Feature', talk: false, date: '18 November 2025',
    url: 'https://ceotimes.com/how-pheenyx-capital-helps-high-achievers-build-wealth-that-works-for-them/',
    hero: 'images/press/article-ceotimes.jpg',
    title: 'How Pheenyx Capital Helps High Achievers Build Wealth That Works for Them',
    excerpt: "In a world where professional success often comes at the cost of personal freedom, Dr. Nkem Ezeamama's story stands out as both a reflection and a rebellion.",
    paras: [
      "In a world where professional success often comes at the cost of personal freedom, Dr. Nkem Ezeamama's story stands out as both a reflection and a rebellion. After years of excelling in medicine, she realized that earning more didn't mean living freely, it meant working more, spending less time with family, and watching opportunity costs rise with every promotion.",
      "Determined to change that narrative, she built Pheenyx Capital, a real estate investment firm designed to help high-achieving professionals like herself reclaim their time and create lasting wealth without stepping away from their careers.",
      "At the core of Pheenyx Capital's philosophy is a commitment to what Dr. Nkem calls “strategy before scale.” In an industry where speed and expansion are often mistaken for success, Pheenyx operates with deliberate intentionality.",
      "Every investment opportunity is evaluated through rigorous market research, conservative underwriting, and a disciplined focus on sustainability. This meticulous approach has allowed Pheenyx Capital to manage more than $120.5 million in assets and over $5 million in investor equity while maintaining one of the strongest investor retention rates in its category.",
    ],
  },
  toplistings: {
    kind: 'Feature', talk: false, date: '29 May 2026',
    url: 'https://toplistings.com/pheenyx-capital-taps-into-the-multifamily-real-estate-goldmine-reaching-153m-in-aum/',
    hero: 'images/press/article-toplistings.jpg',
    title: 'Pheenyx Capital Taps Into the Multifamily Real Estate Goldmine, Reaching $153M in AUM',
    excerpt: 'In multifamily real estate, growth is not measured by ambition alone. It is measured by the quality of the deals a firm pursues and the discipline behind its underwriting.',
    paras: [
      "In multifamily real estate, growth is not measured by ambition alone. It is measured by the quality of the deals a firm pursues, the discipline behind its underwriting, the strength of its investor base, and the trust it builds across the market.",
      "For Pheenyx Capital Investment, that discipline has translated into a major milestone: more than $153 million in assets under management, 150+ active investors, and 885 portfolio units. The achievement positions the physician-led investment firm as a growing player in the multifamily space and signals a clear message to brokers, operators, lenders, capital partners, and investors: Pheenyx Capital is building with intention.",
      "The company's approach to acquisitions begins long before a property reaches the closing table. Every opportunity must make sense from multiple angles: market strength, asset condition, occupancy, rent positioning, operating expenses, debt assumptions, insurance costs, tax considerations, renovation potential, and long-term exit strategy.",
      "Multifamily remains a goldmine, but it is not a forgiving one. The firms that will continue to win are not simply the ones chasing the largest number of units. They are the ones that understand how to evaluate risk, protect capital, create operational value, and communicate clearly with investors and partners.",
    ],
  },
  bizweekly: {
    kind: 'Feature', talk: false, date: '29 May 2026',
    url: 'https://bizweekly.com/the-physician-ceo-behind-a-153m-firm-helping-professionals-build-wealth-beyond-work/',
    hero: 'images/press/article-bizweekly.jpg',
    title: 'The Physician CEO Behind a $153M Firm Helping Professionals Build Wealth Beyond Work',
    excerpt: 'Pheenyx Capital Investment has crossed a major milestone: more than $153 million in portfolio size, 150+ active investors, and 885 portfolio units.',
    paras: [
      "Pheenyx Capital Investment has crossed a major milestone: more than $153 million in portfolio size, 150+ active investors, and 885 portfolio units. For a physician-led investment firm built to help high-earning professionals turn active income into long-term wealth, the growth is more than a business achievement.",
      "At the center of that vision is Dr. Nkem Ezeamama, an emergency physician, investor, and Founder and CEO of Pheenyx Capital. Her work sits at the intersection of medicine, business, wealth education, and real estate investing, but the heart of it is simple: helping accomplished professionals build beyond the limits of their careers.",
      "“At Pheenyx Capital, the focus is not simply on acquiring properties. It is on serving the people those investments are designed to support. Strong returns are built through disciplined strategy, but lasting legacy is built through trust.” — Dr. Nkem Ezeamama, MD",
      "Dr. Nkem's background as a physician gives the company a clear leadership advantage. Medicine requires judgment, precision, risk awareness, communication, and trust. Those same principles show up in how Pheenyx Capital approaches investing. The firm is not built around hype or fast promises.",
    ],
  },
  somedocs: {
    kind: 'Speaking', talk: true, date: '#SoMeDocsInvesting',
    url: 'https://doctorsonsocialmedia.com/finances-investing-real-estate/',
    hero: null,
    title: 'Freedom Through Ownership',
    excerpt: 'Dr. Nkem Ezeamama presents at the SoMeDocs conference on Finances, Investing & Real Estate for Healthcare Professionals.',
    paras: [
      "Dr. Nkem Ezeamama, MD is a featured speaker at <em>Finances, Investing &amp; Real Estate for Healthcare Professionals</em>, the SoMeDocs conference for physicians and healthcare professionals learning to build wealth outside clinical income.",
      "Her session, <strong>“Freedom Through Ownership”</strong>, sets out the case for asset ownership as the route to financial independence for high-earning professionals whose time is their scarcest resource.",
      "The programme brings together nine expert presentations covering angel investing and venture capital, financial literacy, portfolio building for high-income professionals, passive income, and asset protection for investment property owners.",
    ],
  },
};

const esc = s => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;|mdash;|nbsp;)/g, '&amp;');

// ---------- 1. logo strip ----------
// 5 outlets x 3 passes = 15 per set (~2,520px desktop), so the loop seam
// stays off screen on wide monitors.
const stripItems = [];
for (let i = 0; i < 3; i++) {
  for (const o of outlets) {
    stripItems.push(`          <div class="press-item press-item--${o.mod}"><img src="${o.logo}" alt="${esc(o.alt)}" loading="lazy" decoding="async"></div>`);
  }
}
const stripSet = stripItems.join('\n');
const stripHtml = `<section class="trust-band" aria-label="Pheenyx Capital in the press">
  <div class="press-strip">
    <div class="press-track">
      <div class="press-set">
${stripSet}
      </div>
      <div class="press-set" aria-hidden="true">
${stripSet}
      </div>
    </div>
  </div>
</section>`;

// ---------- 2. coverage rail ----------
const card = o => {
  const a = articles[o.id];
  return `          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="${o.logoDark || o.logo}" alt="${esc(o.pub)}" loading="lazy" decoding="async">
              <span class="pcard__kind${a.talk ? ' is-talk' : ''}">${a.kind}</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">${esc(a.title)}</h3>
              <p class="pcard__excerpt">${esc(a.excerpt)}</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">${esc(a.date)}</span>
              <button class="pcard__btn" type="button" data-press="${o.id}">Preview</button>
            </div>
          </article>`;
};
const railSet = [...outlets, ...outlets].map(card).join('\n');
const railHtml = `  <div class="rail">
    <div class="rail__track">
      <div class="rail__set">
${railSet}
      </div>
      <div class="rail__set" aria-hidden="true">
${railSet}
      </div>
    </div>
  </div>`;

// ---------- 3. modal data ----------
const data = {};
outlets.forEach(o => {
  const a = articles[o.id];
  data[o.id] = { pub: o.pub, logo: o.logo, hero: a.hero, kind: a.kind,
                 date: a.date, url: a.url, title: a.title, paras: a.paras };
});

let page = fs.readFileSync(PAGE, 'utf8');
const NL = page.includes('\r\n') ? '\r\n' : '\n';
const fix = s => s.replace(/\n/g, NL);

function replaceBlock(html, startMark, endMark, replacement, label) {
  const i = html.indexOf(startMark);
  if (i < 0) throw new Error(`${label}: start not found`);
  const j = html.indexOf(endMark, i);
  if (j < 0) throw new Error(`${label}: end not found`);
  console.log(`${label}: replaced ${j + endMark.length - i} chars`);
  return html.slice(0, i) + replacement + html.slice(j + endMark.length);
}

page = replaceBlock(page, '<section class="trust-band"', '</section>', fix(stripHtml), 'logo strip');
page = replaceBlock(page, '  <div class="rail">', '  </div>' + NL + '</section>', fix(railHtml) + NL + '</section>', 'coverage rail');

const blob = `  const PRESS = ${JSON.stringify(data, null, 2).split('\n').map((l, i) => (i ? '  ' + l : l)).join('\n')};`;
page = replaceBlock(page, '  const PRESS = {', '\n  };', fix(blob), 'modal data');

fs.writeFileSync(PAGE, page, 'utf8');

console.log(`\noutlets      : ${outlets.length}`);
console.log(`strip items  : ${stripItems.length} per set (${stripItems.length * 2} total)`);
console.log(`rail cards   : ${outlets.length * 2} per set (${outlets.length * 4} total)`);
console.log(`modal entries: ${Object.keys(data).length}`);

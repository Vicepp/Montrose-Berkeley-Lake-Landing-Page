# Montrose Berkeley Lake — Investor Landing Page

Static single-page site for the Montrose Berkeley Lake opportunity (Pheenyx Capital Investment).

## Structure

```
index.html              The page: markup, inline CSS, inline JS
admin.html              Private analytics dashboard (/admin)
images/                 Page imagery
images/gallery/         Photo-marquee images
images/press/           Publication logos and article thumbnails
netlify/functions/      /api/track collector, /api/stats admin API
netlify/lib/            Pure logic, unit-tested without the Netlify runtime
scripts/                Generators and test harnesses
netlify.toml            Publish config, headers, redirects
```

The page itself has no build step. The only external requests are Google Fonts
and the embedded ClickMeeting / LeadConnector / YouTube widgets.

## Local preview

```bash
python -m http.server 8765
# then visit http://localhost:8765
```

That serves the page but not the analytics endpoints. To exercise those too:

```bash
ADMIN_PASSWORD=test SEED=1 node scripts/mock-server.mjs 8788
# http://127.0.0.1:8788        the page, with tracking live
# http://127.0.0.1:8788/admin  the dashboard (password: test)
```

`scripts/mock-server.mjs` implements `/api/track` and `/api/stats` against an
in-memory store using the *same* modules the Functions use, so the dashboard can
be developed and tested without deploying. `SEED=1` fills it with synthetic
traffic so the charts have something to draw.

## Deploy to Netlify

Connect the GitHub repo and accept the defaults — `netlify.toml` sets the
publish directory, the functions directory, headers and redirects.

**One environment variable is required** for the dashboard:

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | yes | Password for `/admin`. Without it `/api/stats` returns 503 and the dashboard cannot be opened. |
| `ANALYTICS_SALT` | no | Salt for the visitor hash. Defaults to `ADMIN_PASSWORD`. Changing it resets visitor counting from that day on. |

Set it in **Site settings → Environment variables**, then redeploy.

## Analytics

Two systems run side by side: a first-party collector that feeds `/admin`, and
the Meta Pixel.

### Meta Pixel

Pixel ID `1005277715102378`, base code in `<head>`, and the same named CTA
events mirrored into it from the existing event layer, so the two can never
drift apart:

| On the page | Meta event |
|---|---|
| Any "Register for Webinar" | `Lead` |
| Any "Book a Call" (Calendly) | `Contact` |
| Press preview opened | `ViewContent` |
| Dr Nkem video played | `VideoPlay` (custom) |
| Page load | `PageView` (from the base code) |

`content_name` carries the specific entry point, e.g. `Webinar: sticky bar`, so
Events Manager shows which CTA actually earns registrations.

**This sets third-party cookies and sends visitor data to Meta.** The page has
no consent banner. If you advertise to or receive visitors from the UK or EU,
take advice on whether you need one before running traffic.

### First-party collector

No third parties, no cookies, no consent needed for this part.

**How it works.** A small script at the bottom of `index.html` batches events and
POSTs them to `/api/track`, a Netlify Function that appends each batch to a blob
in Netlify Blobs. `/api/stats` reads them back, and the dashboard at `/admin`
renders the result.

**What it records:** page views, unique visitors, mobile/desktop split, every
named CTA click (each webinar entry point separately, playbook, press previews,
video), outbound clicks (Calendly, social, email, phone), how far down the page
visitors get, and referring sites.

**Privacy.** Visitors are counted with a SHA-256 hash of IP + user agent + a
salt that rotates daily. Raw IPs are never written to storage, yesterday's ids
cannot be linked to today's, and no identifier is ever sent to the browser.
Known bots and preview crawlers are filtered out before anything is stored.

**Storage.** One blob per batch, so concurrent visitors can never overwrite each
other. Past days are compacted into a single summary and the raw batches
deleted. Compaction records which batch ids it has already folded in, so a
failed delete cannot double-count them on a later run — that case is covered in
`scripts/collect-test.mjs`.

**Auth.** The password is exchanged once for an 8-hour HMAC token; the password
itself is never stored in the browser. Comparison is constant-time, and failed
logins are delayed and return an identical response whatever the cause.

**Limits worth knowing.** Ad-blockers will miss a small share of traffic. There
is no data from before the feature went live. Days bucket by UTC.

## Tests

Start the mock server first — the browser suites expect it on port 8788:

```bash
ADMIN_PASSWORD=test SEED=1 node scripts/mock-server.mjs 8788
```

```bash
npm test                               # analytics maths + compaction (84 assertions)
node scripts/responsive-test.cjs       # layout across 5 viewports
node scripts/press-outlets-test.cjs    # press strip + rail + modals
node scripts/sticky-bar-test.cjs       # sticky bar, countdown, webinar popup
node scripts/webinar-popin-test.cjs    # timed pop-in placement and dismissal
node scripts/meta-pixel-test.cjs       # Meta Pixel id + event mapping
node scripts/stray-markup-test.cjs     # nothing from source leaked onto the page
node scripts/hero-stats-test.cjs       # hero stat row fits at every width
```

The browser suites need Playwright's Chromium (`CHROME_PATH`) and write
screenshots to `SHOTDIR`. Run them against the mock server rather than a plain
static file server: `python -m http.server` has no POST handler, so the
analytics beacon logs a harmless 501 on every page load and the suites report it
as a console error.

**Why `.cjs`.** `package.json` declares `"type": "module"` for the analytics
code, which makes every bare `.js` file an ES module. The generators and browser
suites are CommonJS, so they carry the `.cjs` extension to opt back out. A new
CommonJS script must use `.cjs` or it will fail on `require`.

## Photo gallery

The "Life at Montrose Berkeley Lake" section is a three-row marquee:

| Row | Direction | Duration |
|-----|-----------|----------|
| 1   | left      | 64s      |
| 2   | right     | 76s      |
| 3   | left      | 88s      |

Each row holds one set of photos rendered twice; the track translates `-50%`,
so the second set lands exactly where the first began and the loop is seamless.
Hovering a row pauses it and the hovered tile pulses.

To add or remove a photo, edit both `marquee__set` blocks in that row — they
must stay identical or the loop will visibly jump. The duplicate is marked
`aria-hidden="true"` and is hidden entirely under `prefers-reduced-motion`,
where the rows become manually scrollable strips instead.

## Editing notes

- Section copy lives inline in `index.html`; there is no CMS.
- The video section (`#video`) is still a placeholder frame. Replace
  `.video-frame` with a `<video>` or an `<iframe>` embed, keeping the
  aspect-ratio wrapper.
- Gallery images are resized to 1200px wide, JPEG q82. Match that when adding
  new ones so rows stay light.

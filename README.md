# Montrose Berkeley Lake — Investor Landing Page

Static single-page site for the Montrose Berkeley Lake opportunity (Pheenyx Capital Investment).

## Structure

```
index.html              The entire page: markup, inline CSS, inline JS
images/                 Page imagery (hero, amenities, logo)
images/gallery/         Photo-marquee images
netlify.toml            Netlify publish + cache/security headers
```

No build step and no dependencies. The only external request is Google Fonts
(Fraunces, Inter, IBM Plex Mono).

## Local preview

Open `index.html` directly, or serve it:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to Netlify

Connect the GitHub repo in Netlify and accept the defaults — `netlify.toml`
already sets publish directory to the repo root with no build command.
Every push to the default branch redeploys.

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

# Framer build

`MontroseBerkeleyLake.tsx` is the whole landing page packaged as a single
Framer **code component**. Drop it on a new page and you get the same site
that's in `index.html` — same markup, same CSS, same interactions.

`preview.html` is that component rendered inside a deliberately hostile host
page. Open it in a browser to see exactly what Framer will show, without
opening Framer.

## Add it to Framer

1. In your Framer project, open the **Assets** panel → **Code** tab.
2. Click **+** → **New Code File**. Name it `MontroseBerkeleyLake`.
3. Select everything in the placeholder file and paste in the full contents of
   `MontroseBerkeleyLake.tsx`.
4. Create the new page: **Pages** panel → **+** → name it (e.g. `Montrose`).
5. On that page, open **Insert** (or press `I`) → **Code** → drag
   **MontroseBerkeleyLake** onto the canvas.
6. Select it and set width to **Fill**, height to **Fit**.
7. Set the page's own background to `#f6f1e7` so the area behind the component
   matches, and remove any default page padding.

The right-hand panel exposes one control, **Sticky CTA**, which hides the fixed
bottom bar — useful while designing on canvas.

## Where the images come from

Nothing needs uploading to Framer. All 28 images are served from jsDelivr,
pointed at the public GitHub repo:

```
https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/...
```

That means **pushing new images to `main` updates the Framer page too**.
jsDelivr caches aggressively; append `@<commit-sha>` instead of `@main` if you
ever need a version pinned in place.

## Regenerating after editing the site

The component is generated, not hand-written, so `index.html` stays the single
source of truth. After changing the site:

```bash
node scripts/build-framer.js index.html framer/MontroseBerkeleyLake.tsx
```

Then paste the new file into Framer again. Don't hand-edit the `.tsx` — the next
regeneration would overwrite it.

## How it works, and the trade-off

The component injects the page's HTML with `dangerouslySetInnerHTML` and its CSS
through a `<style>` tag, then re-attaches the interactions (mobile menu, gallery
tap-to-pause, click-to-load video, smooth anchors) in a `useEffect` scoped to the
component's own DOM.

Every CSS selector is rewritten to sit under `.mbl-root`, so the page's styles
cannot leak into the rest of your Framer project — `:root`, `html`, `body` and
`*` all get remapped. This is verified: the preview mounts the component between
two host elements styled green-on-black in system font, and they stay that way.

**The trade-off:** this renders the real page, but the sections are not native
Framer layers. You can't select a heading on the canvas and retype it. Text
edits happen in `index.html` and flow through on regeneration.

If you'd rather edit on canvas, the page has to be rebuilt as native Framer
frames and text layers — that's a manual rebuild in the Framer UI, not something
that can be generated from the HTML.

## Verified

`scripts/framer-verify.js` renders the component and `index.html` side by side
and compares them. Last run, at 1440px and 390px:

- all 10 section heights identical to the pixel
- heading fonts, sizes and colours identical
- 3 marquee rows / 44 tiles / 6 testimonials / 5 benefit cards present
- 50 images, 0 broken
- no horizontal overflow
- host page styles unaffected

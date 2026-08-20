# Framer components

Copy-paste source for Framer. **Nothing here ships with the landing page** —
these files are not linked from any page and are not part of the build. They
live in the repo so the Framer components and the site stay in step.

## WebinarFloatingBar.tsx

The landing page sticky CTA bar, rebuilt as a Framer code component. Matches
`#sticky-cta` in `index.html`: full-bleed navy bar pinned to the bottom that
slides up on scroll, session title in Fraunces beside the date, a countdown
chip, and a rust pill button.

### To use it

1. In Framer: **Assets → Code → New Code Component**
2. Paste the whole file over the placeholder
3. Drop it on the page and set the props in the right-hand panel

Fonts load themselves — the component appends the Google Fonts link for
Fraunces, IBM Plex Mono and Inter on mount, so it looks right in a Framer
project that does not already carry them.

### Three phases

It does **not** disappear when the clock runs out. It moves through:

| Phase | When | Chip | Button | Links to |
|---|---|---|---|---|
| `upcoming` | before the start | countdown ticking | Register for Webinar | Register Link |
| `live` | during `Runs For` | turns rust, "Live now" | Watch Now | Register Link |
| `ended` | after | hidden | Watch Webinar Replay | Replay Link |

All of it is clock-driven, so the bar keeps its pre-webinar face for as long
as ads are running and hands itself over to the replay with no edit.

`Starts` is read as **wall-clock time in America/Chicago**, not the viewer's
zone, and is resolved against that zone so it stays correct across daylight
saving.

### Three size tiers

Driven by the bar's **own measured width**, not the window, so the same code
picks the right tier at runtime and on a Framer breakpoint frame.

| Tier | Width | Layout |
|---|---|---|
| mobile | ≤ 760px | two stacked rows; chip and button share the lower row |
| tablet | ≤ 1024px | one row, tightened type and padding |
| desktop | > 1024px | one row, full size |

Every value that differs between tiers is in the `TIER` object near the top of
the file — adjust sizing there rather than hunting through the JSX.

### Designing on canvas

Two controls exist only for design work. **Set both back to Auto before
publishing.**

- **Preview Phase** — force Before / During / After
- **Preview Size** — force Mobile / Tablet / Desktop

On the Framer canvas the bar renders in normal flow rather than `fixed`, so it
can be selected and positioned. At runtime it pins to the bottom of the
viewport and slides up past the **Reveal After** scroll distance (set it to `0`
to show it immediately).

### Keeping it in step with the site

The colours and type default to the landing page tokens:

| Token | Value | Used for |
|---|---|---|
| bar | `rgba(13,24,48,0.97)` | bar background |
| rust | `#b5562c` | button, live chip |
| countdown | `#f0a87f` | countdown digits |
| date text | `#9aa1b8` | date line |

If the site's `--rust` or the sticky bar background changes in `index.html`,
change it here too.

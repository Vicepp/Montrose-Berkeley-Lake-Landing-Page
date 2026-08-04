// Generates a Framer code component from the shipped index.html.
// Generating rather than hand-porting guarantees the Framer version stays
// pixel-identical to the page that was actually tested.
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3];
const CDN = 'https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/';
const ROOT = '.mbl-root';

let html = fs.readFileSync(SRC, 'utf8');

// ---- 1. pull the pieces apart -------------------------------------------
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const fontHref = html.match(/<link href="(https:\/\/fonts\.googleapis[^"]+)"/)[1];
let body = html.match(/<body>([\s\S]*)<\/body>/)[1];
body = body.replace(/<script>[\s\S]*?<\/script>/g, '').trim();

// ---- 2. point every local asset at the CDN ------------------------------
body = body.replace(/(src|href)="images\//g, `$1="${CDN}images/`);

// ---- 3. scope the CSS so it cannot leak into the rest of the Framer page -
function prefixSelectorList(list) {
  return list.split(',').map(sel => {
    const s = sel.trim();
    if (!s) return s;
    if (/^(from|to|\d+%)$/.test(s)) return s;          // keyframe stops
    if (s === ':root' || s === 'html' || s === 'body') return ROOT;
    if (s === '*') return `${ROOT}, ${ROOT} *`;
    if (s.startsWith('@')) return s;
    return `${ROOT} ${s}`;
  }).join(', ');
}

// Walk the stylesheet, rewriting selectors at every level except inside @keyframes.
function scope(cssText, insideKeyframes = false) {
  let out = '';
  let i = 0;
  while (i < cssText.length) {
    // copy comments verbatim
    if (cssText.startsWith('/*', i)) {
      const end = cssText.indexOf('*/', i + 2);
      const stop = end === -1 ? cssText.length : end + 2;
      out += cssText.slice(i, stop);
      i = stop;
      continue;
    }
    const brace = cssText.indexOf('{', i);
    if (brace === -1) { out += cssText.slice(i); break; }

    const prelude = cssText.slice(i, brace);
    // find the matching close brace
    let depth = 1, j = brace + 1;
    while (j < cssText.length && depth > 0) {
      if (cssText.startsWith('/*', j)) { const e = cssText.indexOf('*/', j + 2); j = e === -1 ? cssText.length : e + 2; continue; }
      if (cssText[j] === '{') depth++;
      else if (cssText[j] === '}') depth--;
      j++;
    }
    const inner = cssText.slice(brace + 1, j - 1);
    const trimmed = prelude.trim();

    if (/^@(media|supports)/i.test(trimmed)) {
      out += prelude + '{' + scope(inner, false) + '}';
    } else if (/^@keyframes/i.test(trimmed)) {
      out += prelude + '{' + inner + '}';                // leave stops alone
    } else if (trimmed.startsWith('@')) {
      out += prelude + '{' + inner + '}';
    } else {
      const lead = prelude.match(/^\s*/)[0];
      out += lead + prefixSelectorList(trimmed) + '{' + (insideKeyframes ? inner : inner) + '}';
    }
    i = j;
  }
  return out;
}

let scoped = scope(css);

// `*{margin:0;padding:0;box-sizing:border-box}` must also hit the root itself.
scoped = `@import url('${fontHref}');\n` +
         `${ROOT}{box-sizing:border-box; margin:0; padding:0; width:100%;}\n` +
         `${ROOT} *{box-sizing:border-box;}\n` +
         scoped;

// smooth scrolling is the one rule that genuinely belongs to the document
scoped = scoped.replace(/scroll-behavior:\s*smooth;?/g, '');

// ---- 4. emit the component ---------------------------------------------
const esc = s => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const tsx = `import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

// ---------------------------------------------------------------------------
// Montrose Berkeley Lake — investor landing page.
//
// Generated from the deployed index.html so this stays identical to the tested
// page. Images are served from jsDelivr off the GitHub repo, so nothing needs
// to be uploaded into Framer.
//
// Regenerate rather than hand-editing: the source of truth is index.html in
// github.com/Vicepp/Montrose-Berkeley-Lake-Landing-Page
// ---------------------------------------------------------------------------

const STYLES = \`${esc(scoped)}\`

const HTML = \`${esc(body)}\`

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 5200
 * @framerDisableUnlink
 */
export default function MontroseBerkeleyLake(props: any) {
    const { showStickyBar = true, style } = props
    const root = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = root.current
        if (!el) return

        const $ = (s: string) => el.querySelector(s) as HTMLElement | null
        const $$ = (s: string) => Array.from(el.querySelectorAll(s)) as HTMLElement[]

        const nav = $("#nav")
        const stickyCta = $("#sticky-cta")
        const navToggle = $("#nav-toggle")
        const navLinks = $("#nav-links")
        const cleanups: Array<() => void> = []

        const on = (t: any, ev: string, fn: any, opts?: any) => {
            if (!t) return
            t.addEventListener(ev, fn, opts)
            cleanups.push(() => t.removeEventListener(ev, fn, opts))
        }

        // --- sticky nav + bottom CTA bar ---
        const onScroll = () => {
            nav?.classList.toggle("scrolled", window.scrollY > 40)
            if (showStickyBar) {
                stickyCta?.classList.toggle("show", window.scrollY > window.innerHeight * 0.9)
            }
        }
        on(window, "scroll", onScroll, { passive: true })
        onScroll()

        // --- mobile menu ---
        const setMenu = (open: boolean) => {
            nav?.classList.toggle("menu-open", open)
            navToggle?.setAttribute("aria-expanded", String(open))
            navToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu")
        }
        on(navToggle, "click", (e: MouseEvent) => {
            e.stopPropagation()
            setMenu(!nav?.classList.contains("menu-open"))
        })
        navLinks?.querySelectorAll("a").forEach(a =>
            on(a, "click", () => setMenu(false))
        )
        on(document, "keydown", (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenu(false)
        })
        on(document, "click", (e: MouseEvent) => {
            if (nav && !nav.contains(e.target as Node)) setMenu(false)
        })

        // --- in-page anchors (Framer intercepts plain hash links) ---
        $$('a[href^="#"]').forEach(a => {
            on(a, "click", (e: MouseEvent) => {
                const id = (a.getAttribute("href") || "").slice(1)
                if (!id) return
                const target = el.querySelector('[id="' + id + '"]')
                if (!target) return
                e.preventDefault()
                target.scrollIntoView({ behavior: "smooth", block: "start" })
            })
        })

        // --- click-to-load YouTube ---
        $$(".yt").forEach(box => {
            const btn = box.querySelector(".yt__btn")
            on(btn, "click", () => {
                const frame = document.createElement("iframe")
                frame.src =
                    "https://www.youtube-nocookie.com/embed/" +
                    box.getAttribute("data-yt") +
                    "?autoplay=1&rel=0&modestbranding=1"
                frame.title = "Pheenyx Capital Investment"
                frame.allow =
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                frame.allowFullscreen = true
                box.replaceChildren(frame)
            })
        })

        // --- gallery: tap stands in for hover on touch devices ---
        if (window.matchMedia("(hover:none)").matches) {
            const clearActive = (except: Element | null) => {
                $$(".marquee figure.is-active").forEach(f => {
                    if (f !== except) f.classList.remove("is-active")
                })
                $$(".marquee.is-paused").forEach(r => {
                    if (!except || !r.contains(except)) r.classList.remove("is-paused")
                })
            }
            $$(".marquee figure").forEach(tile => {
                on(tile, "click", (e: MouseEvent) => {
                    e.stopPropagation()
                    const turningOn = !tile.classList.contains("is-active")
                    clearActive(turningOn ? tile : null)
                    tile.classList.toggle("is-active", turningOn)
                    tile.closest(".marquee")?.classList.toggle("is-paused", turningOn)
                })
            })
            on(document, "click", () => clearActive(null))
        }

        return () => cleanups.forEach(fn => fn())
    }, [showStickyBar])

    return (
        <div
            ref={root}
            className="mbl-root"
            style={{ width: "100%", ...style }}
            data-hide-sticky={showStickyBar ? undefined : "true"}
        >
            <style>{STYLES}</style>
            <style>{\`.mbl-root[data-hide-sticky="true"] #sticky-cta{display:none;}\`}</style>
            <div dangerouslySetInnerHTML={{ __html: HTML }} />
        </div>
    )
}

addPropertyControls(MontroseBerkeleyLake, {
    showStickyBar: {
        type: ControlType.Boolean,
        title: "Sticky CTA",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
})
`;

fs.writeFileSync(OUT, tsx, 'utf8');

console.log('wrote', OUT);
console.log('  css:  ' + scoped.length.toLocaleString() + ' chars');
console.log('  html: ' + body.length.toLocaleString() + ' chars');
console.log('  tsx:  ' + tsx.length.toLocaleString() + ' chars');
const leftover = (body.match(/(src|href)="images\//g) || []).length;
console.log('  unrewritten local image refs: ' + leftover);
console.log('  cdn refs: ' + (body.match(/cdn\.jsdelivr\.net/g) || []).length);

// Framer code component — the Montrose landing page sticky CTA bar.
//
// NOT part of the landing page build. This folder is a copy-paste source:
// paste this file into a Framer Code Component and wire the props there.
//
// Mirrors #sticky-cta in index.html — full-bleed navy bar pinned to the
// bottom that slides up on scroll, session title in Fraunces beside the date,
// a countdown chip, and a rust pill button.
//
// It does NOT vanish when the clock runs out. It moves through three phases:
//
//   upcoming   countdown ticking   "Register for Webinar"  -> register link
//   live       chip turns rust     "Watch Now"             -> register link
//   ended      chip hidden         "Watch Webinar Replay"  -> replay link
//
// Three size tiers, driven by the bar's own measured width so they work both
// at runtime and on a Framer breakpoint frame:
//
//   mobile   <= 760px    two stacked rows, chip and button share the lower row
//   tablet   <= 1024px   one row, tightened type and padding
//   desktop   > 1024px   one row, full size
//
// On the Framer canvas it always renders in flow (not fixed) so it can be
// designed, and the Preview control forces any phase.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

type Phase = "upcoming" | "live" | "ended"
type Size = "mobile" | "tablet" | "desktop"

interface Props {
    headline: string
    dateLabel: string
    targetDate: string
    liveMinutes: number
    countdownPrefix: string
    livePrefix: string
    liveValue: string
    labelUpcoming: string
    labelLive: string
    labelEnded: string
    statLive: string
    statEnded: string
    registerLink: string
    replayLink: string
    revealAfter: number
    barColor: string
    textColor: string
    mutedColor: string
    accentColor: string
    countdownColor: string
    buttonTextColor: string
    previewPhase: "auto" | Phase
    previewSize: "auto" | Size
}

/* ------------------------------------------------------------------ */
/* Time                                                                */
/* ------------------------------------------------------------------ */

function pad(value: number): string {
    return String(value).padStart(2, "0")
}

function parseLocalDateTimeParts(value: string) {
    const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2})(?::(\d{2}))?(?::(\d{2}))?)?/
    )
    if (!match) return null
    return {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
        hour: Number(match[4] ?? "0"),
        minute: Number(match[5] ?? "0"),
        second: Number(match[6] ?? "0"),
    }
}

// The date is entered as wall-clock time in Chicago, so it has to be resolved
// against that zone rather than the viewer's. Solving by iteration keeps this
// correct across the daylight-saving boundary without a tz library.
function getChicagoEpoch(value: string): number {
    const fallback = { year: 2026, month: 8, day: 26, hour: 18, minute: 0, second: 0 }
    const parts = parseLocalDateTimeParts(value) ?? fallback
    const desiredAsUTC = Date.UTC(
        parts.year, parts.month - 1, parts.day,
        parts.hour, parts.minute, parts.second
    )

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        hour12: false,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    })

    const renderedAsUTC = (epochMs: number): number => {
        const map: Record<string, string> = {}
        for (const part of formatter.formatToParts(new Date(epochMs))) {
            if (part.type !== "literal") map[part.type] = part.value
        }
        return Date.UTC(
            Number(map.year), Number(map.month) - 1, Number(map.day),
            Number(map.hour), Number(map.minute), Number(map.second)
        )
    }

    let epoch = desiredAsUTC
    for (let i = 0; i < 4; i++) {
        const diff = desiredAsUTC - renderedAsUTC(epoch)
        if (diff === 0) break
        epoch += diff
    }
    return epoch
}

/* ------------------------------------------------------------------ */
/* Fonts                                                               */
/* ------------------------------------------------------------------ */

const FONT_HREF =
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=IBM+Plex+Mono:wght@500;600;700&family=Inter:wght@400;600&display=swap"

const SERIF = "'Fraunces', Georgia, serif"
const MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
const SANS = "'Inter', system-ui, sans-serif"

function useBrandFonts() {
    React.useEffect(() => {
        if (typeof document === "undefined") return
        if (document.querySelector(`link[href="${FONT_HREF}"]`)) return
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = FONT_HREF
        document.head.appendChild(link)
    }, [])
}

/* ------------------------------------------------------------------ */
/* Size tiers                                                          */
/* ------------------------------------------------------------------ */

// Every number that differs between mobile, tablet and desktop lives here, so
// the JSX below stays free of nested ternaries.
const TIER = {
    mobile: {
        barPad: "10px 0 calc(10px + env(safe-area-inset-bottom))",
        wrapPad: "0 20px",
        stack: true,
        wrapGap: 8,
        infoGap: 1,
        nameSize: 12.5,
        statSize: 10,
        statTrack: "0.03em",
        actionsGap: 8,
        chipPad: "6px 6px",
        kickerSize: 7.5,
        kickerTrack: "0.06em",
        valueSize: 11.5,
        valueTrack: "0em",
        valueMin: 0,
        btnPad: "9px 8px",
        btnSize: 9,
        btnTrack: "0.03em",
        grow: true,
    },
    tablet: {
        barPad: "13px 0",
        wrapPad: "0 24px",
        stack: false,
        wrapGap: 14,
        infoGap: 16,
        nameSize: 13.5,
        statSize: 10.5,
        statTrack: "0.02em",
        actionsGap: 10,
        chipPad: "7px 14px",
        kickerSize: 8.5,
        kickerTrack: "0.1em",
        valueSize: 14,
        valueTrack: "0.04em",
        valueMin: "14ch",
        btnPad: "11px 18px",
        btnSize: 11,
        btnTrack: "0.05em",
        grow: false,
    },
    desktop: {
        barPad: "16px 0",
        wrapPad: "0 32px",
        stack: false,
        wrapGap: 20,
        infoGap: 22,
        nameSize: 15,
        statSize: 11.5,
        statTrack: "0em",
        actionsGap: 12,
        chipPad: "8px 20px",
        kickerSize: 9,
        kickerTrack: "0.12em",
        valueSize: 16,
        valueTrack: "0.06em",
        valueMin: "14ch",
        btnPad: "13px 26px",
        btnSize: 12.5,
        btnTrack: "0.06em",
        grow: false,
    },
} as const

function tierFor(width: number): Size {
    if (width <= 760) return "mobile"
    if (width <= 1024) return "tablet"
    return "desktop"
}

/* ------------------------------------------------------------------ */

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 72
 */
export default function WebinarFloatingBar(props: Partial<Props>) {
    const {
        headline = "THE BIG DEAL HAS A NAME: Meet Montrose Berkeley Lake",
        dateLabel = "Wednesday, August 26, 2026",
        targetDate = "2026-08-26T18:00:00",
        liveMinutes = 60,
        countdownPrefix = "Webinar in",
        livePrefix = "Join the",
        liveValue = "Live now",
        labelUpcoming = "Register for Webinar",
        labelLive = "Watch Now",
        labelEnded = "Watch Webinar Replay",
        statLive = "Happening now",
        statEnded = "Replay available now",
        registerLink = "#webinar",
        replayLink = "/replay",
        revealAfter = 600,
        barColor = "rgba(13,24,48,0.97)",
        textColor = "#ffffff",
        mutedColor = "#9aa1b8",
        accentColor = "#b5562c",
        countdownColor = "#f0a87f",
        buttonTextColor = "#ffffff",
        previewPhase = "auto",
        previewSize = "auto",
    } = props

    useBrandFonts()
    const isCanvas = useIsStaticRenderer()

    const startMs = React.useMemo(() => getChicagoEpoch(targetDate), [targetDate])
    const endMs = React.useMemo(
        () => startMs + Math.max(0, liveMinutes) * 60000,
        [startMs, liveMinutes]
    )

    const [now, setNow] = React.useState<number>(() => Date.now())
    const [width, setWidth] = React.useState<number>(() =>
        typeof window === "undefined" ? 1200 : window.innerWidth
    )
    const [shown, setShown] = React.useState<boolean>(false)
    const hostRef = React.useRef<HTMLDivElement | null>(null)

    // One timer for the whole bar. It keeps running past the start time so the
    // phase advances on its own while someone sits on the page.
    React.useEffect(() => {
        if (isCanvas || typeof window === "undefined") return
        const id = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(id)
    }, [isCanvas])

    // Measure the bar's own box, not the window: fixed at runtime it spans the
    // viewport, and on a Framer breakpoint frame it spans that frame, so one
    // measurement picks the right tier in both places.
    React.useEffect(() => {
        if (typeof window === "undefined") return
        const el = hostRef.current

        const measure = () => {
            const own = el ? el.getBoundingClientRect().width : 0
            setWidth(own > 0 ? own : window.innerWidth)
        }
        measure()

        if (el && typeof ResizeObserver !== "undefined") {
            const ro = new ResizeObserver(measure)
            ro.observe(el)
            return () => ro.disconnect()
        }
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [])

    // Slide up once the reader is past the fold, as on the landing page.
    React.useEffect(() => {
        if (isCanvas || typeof window === "undefined") return
        if (revealAfter <= 0) {
            setShown(true)
            return
        }
        const onScroll = () => setShown(window.scrollY > revealAfter)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [isCanvas, revealAfter])

    const phase: Phase = React.useMemo(() => {
        if (previewPhase !== "auto") return previewPhase
        if (isCanvas) return "upcoming"
        if (now < startMs) return "upcoming"
        if (now < endMs) return "live"
        return "ended"
    }, [previewPhase, isCanvas, now, startMs, endMs])

    const size: Size = previewSize !== "auto" ? previewSize : tierFor(width)
    const t = TIER[size]

    const countdown = React.useMemo(() => {
        const total = Math.max(0, Math.floor((startMs - now) / 1000))
        const d = Math.floor(total / 86400)
        const h = Math.floor((total % 86400) / 3600)
        const m = Math.floor((total % 3600) / 60)
        const s = total % 60
        return `${pad(d)}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`
    }, [startMs, now])

    const live = phase === "live"
    const ended = phase === "ended"

    const buttonLabel = ended ? labelEnded : live ? labelLive : labelUpcoming
    const buttonHref = ended ? replayLink : registerLink
    const stat = ended ? statEnded : live ? statLive : dateLabel

    /* ---------------------------- styles ---------------------------- */

    const bar: React.CSSProperties = {
        position: isCanvas ? "relative" : "fixed",
        left: 0,
        right: 0,
        bottom: isCanvas ? undefined : shown ? 0 : -140,
        zIndex: 200,
        width: "100%",
        background: barColor,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        padding: t.barPad,
        transition: "bottom .4s ease",
        color: textColor,
        fontFamily: SANS,
        boxSizing: "border-box",
    }

    const wrap: React.CSSProperties = {
        maxWidth: 1160,
        margin: "0 auto",
        padding: t.wrapPad,
        display: "flex",
        flexDirection: t.stack ? "column" : "row",
        alignItems: t.stack ? "stretch" : "center",
        justifyContent: "space-between",
        gap: t.wrapGap,
        boxSizing: "border-box",
    }

    const info: React.CSSProperties = {
        display: "flex",
        flexDirection: t.stack ? "column" : "row",
        alignItems: t.stack ? "flex-start" : "center",
        gap: t.infoGap,
        minWidth: 0,
    }

    // Truncates rather than wrapping — a two-line title doubles the bar height.
    const name: React.CSSProperties = {
        fontFamily: SERIF,
        fontWeight: 600,
        color: textColor,
        fontSize: t.nameSize,
        lineHeight: 1.25,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100%",
    }

    const statStyle: React.CSSProperties = {
        fontFamily: MONO,
        fontSize: t.statSize,
        letterSpacing: t.statTrack,
        color: mutedColor,
        whiteSpace: "nowrap",
    }

    const actions: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: t.actionsGap,
        flex: "0 0 auto",
    }

    const chip: React.CSSProperties = {
        display: ended ? "none" : "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        lineHeight: 1.15,
        padding: t.chipPad,
        borderRadius: 999,
        flex: t.grow ? "1.2 1 0" : "0 0 auto",
        background: live ? accentColor : "rgba(255,255,255,0.09)",
        border: `1px solid ${live ? accentColor : "rgba(255,255,255,0.3)"}`,
        boxSizing: "border-box",
    }

    const kicker: React.CSSProperties = {
        fontFamily: MONO,
        fontSize: t.kickerSize,
        letterSpacing: t.kickerTrack,
        textTransform: "uppercase",
        color: live ? "rgba(255,255,255,0.9)" : "#b7bdd0",
        whiteSpace: "nowrap",
    }

    const value: React.CSSProperties = {
        fontFamily: MONO,
        fontSize: t.valueSize,
        fontWeight: 700,
        letterSpacing: t.valueTrack,
        color: live ? "#ffffff" : countdownColor,
        fontVariantNumeric: "tabular-nums",
        // A fixed measure stops the bar twitching as the digits change.
        minWidth: t.valueMin,
        textAlign: "center",
        whiteSpace: "nowrap",
    }

    const button: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flex: t.grow ? "1 1 0" : "0 0 auto",
        padding: t.btnPad,
        borderRadius: 999,
        background: accentColor,
        color: buttonTextColor,
        fontFamily: MONO,
        fontSize: t.btnSize,
        fontWeight: 600,
        letterSpacing: t.btnTrack,
        textTransform: "uppercase",
        textDecoration: "none",
        whiteSpace: "nowrap",
        border: "1px solid transparent",
        cursor: "pointer",
        boxSizing: "border-box",
    }

    return (
        <div ref={hostRef} style={bar} role="region" aria-label="Webinar">
            <div style={wrap}>
                <div style={info}>
                    <span style={name}>{headline}</span>
                    <span style={statStyle}>{stat}</span>
                </div>

                <div style={actions}>
                    <div style={chip} aria-live={isCanvas ? "off" : "polite"}>
                        <span style={kicker}>{live ? livePrefix : countdownPrefix}</span>
                        <strong style={value}>{live ? liveValue : countdown}</strong>
                    </div>

                    <a href={buttonHref} style={button}>
                        {buttonLabel}
                    </a>
                </div>
            </div>
        </div>
    )
}

addPropertyControls(WebinarFloatingBar, {
    headline: {
        type: ControlType.String,
        title: "Headline",
        defaultValue: "THE BIG DEAL HAS A NAME: Meet Montrose Berkeley Lake",
    },
    dateLabel: {
        type: ControlType.String,
        title: "Date",
        defaultValue: "Wednesday, August 26, 2026",
    },
    targetDate: {
        type: ControlType.Date,
        title: "Starts",
        defaultValue: "2026-08-26T18:00:00",
        displayTime: true,
        description: "Wall-clock time in America/Chicago.",
    },
    liveMinutes: {
        type: ControlType.Number,
        title: "Runs For",
        defaultValue: 60,
        min: 0,
        max: 480,
        step: 5,
        unit: "min",
        description: "After this the bar switches to the replay.",
    },

    labelUpcoming: {
        type: ControlType.String,
        title: "Before",
        defaultValue: "Register for Webinar",
    },
    labelLive: { type: ControlType.String, title: "During", defaultValue: "Watch Now" },
    labelEnded: {
        type: ControlType.String,
        title: "After",
        defaultValue: "Watch Webinar Replay",
    },
    registerLink: {
        type: ControlType.Link,
        title: "Register Link",
        defaultValue: "#webinar",
    },
    replayLink: { type: ControlType.Link, title: "Replay Link", defaultValue: "/replay" },

    countdownPrefix: {
        type: ControlType.String,
        title: "Chip Label",
        defaultValue: "Webinar in",
    },
    livePrefix: { type: ControlType.String, title: "Live Label", defaultValue: "Join the" },
    liveValue: { type: ControlType.String, title: "Live Value", defaultValue: "Live now" },
    statLive: {
        type: ControlType.String,
        title: "Date (During)",
        defaultValue: "Happening now",
    },
    statEnded: {
        type: ControlType.String,
        title: "Date (After)",
        defaultValue: "Replay available now",
    },

    revealAfter: {
        type: ControlType.Number,
        title: "Reveal After",
        defaultValue: 600,
        min: 0,
        max: 4000,
        step: 50,
        unit: "px",
        description: "Scroll distance before the bar slides up. 0 shows always.",
    },

    barColor: {
        type: ControlType.Color,
        title: "Bar",
        defaultValue: "rgba(13,24,48,0.97)",
    },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#ffffff" },
    mutedColor: { type: ControlType.Color, title: "Date Text", defaultValue: "#9aa1b8" },
    accentColor: { type: ControlType.Color, title: "Rust", defaultValue: "#b5562c" },
    countdownColor: {
        type: ControlType.Color,
        title: "Countdown",
        defaultValue: "#f0a87f",
    },
    buttonTextColor: {
        type: ControlType.Color,
        title: "Button Text",
        defaultValue: "#ffffff",
    },

    previewPhase: {
        type: ControlType.Enum,
        title: "Preview Phase",
        defaultValue: "auto",
        options: ["auto", "upcoming", "live", "ended"],
        optionTitles: ["Auto (clock)", "Before", "During", "After"],
        description: "Force a state to design it. Leave on Auto to publish.",
    },
    previewSize: {
        type: ControlType.Enum,
        title: "Preview Size",
        defaultValue: "auto",
        options: ["auto", "mobile", "tablet", "desktop"],
        optionTitles: ["Auto (width)", "Mobile", "Tablet", "Desktop"],
        description: "Force a tier to design it. Leave on Auto to publish.",
    },
})

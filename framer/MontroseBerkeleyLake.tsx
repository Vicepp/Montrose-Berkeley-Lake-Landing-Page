import { useEffect, useRef } from "react"
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

const STYLES = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.mbl-root{box-sizing:border-box; margin:0; padding:0; width:100%;}
.mbl-root *{box-sizing:border-box;}

  .mbl-root{
    --ink:#122040;
    --ink-2:#1c2f57;
    --paper:#f6f1e7;
    --paper-2:#eee4d0;
    --rust:#b5562c;
    --rust-deep:#8c4220;
    --green:#32513e;
    --stone:#6e6659;
    --cream-ink:#cdc0a4;
    --white:#ffffff;
    --radius:14px;
  }
  .mbl-root, .mbl-root *{box-sizing:border-box; margin:0; padding:0;}
  .mbl-root{
    
    -webkit-text-size-adjust:100%; /* stop iOS inflating text in landscape */
  }
  .mbl-root{
    font-family:'Inter', sans-serif;
    background:var(--paper);
    color:var(--ink);
    line-height:1.55;
    -webkit-font-smoothing:antialiased;
    overflow-x:clip; /* \`clip\` not \`hidden\` — hidden would break position:sticky */
  }
  .mbl-root /* Anchor targets clear the sticky nav instead of hiding under it. */
  header[id], .mbl-root section[id], .mbl-root div[id]{scroll-margin-top:76px;}
  .mbl-root img{display:block; max-width:100%;}
  .mbl-root a{color:inherit; text-decoration:none;}
  .mbl-root .mono{font-family:'IBM Plex Mono', monospace;}
  .mbl-root .eyebrow{
    font-family:'IBM Plex Mono', monospace;
    font-size:12.5px;
    letter-spacing:0.16em;
    text-transform:uppercase;
    font-weight:500;
  }
  .mbl-root h1, .mbl-root h2, .mbl-root h3{font-family:'Fraunces', serif; font-weight:600; letter-spacing:-0.01em;}
  .mbl-root .italic{font-style:italic; font-weight:500;}
  .mbl-root .wrap{max-width:1160px; margin:0 auto; padding:0 32px;}
  .mbl-root section{position:relative;}

  .mbl-root /* NAV */
  #nav{
    position:sticky; top:0; z-index:100;
    background:rgba(18,32,64,0.0);
    transition:background .35s ease, box-shadow .35s ease, padding .35s ease;
    padding:22px 0;
  }
  .mbl-root #nav.scrolled{background:rgba(18,32,64,0.96); backdrop-filter:blur(6px); box-shadow:0 8px 24px rgba(0,0,0,.18); padding:14px 0;}
  .mbl-root #nav .wrap{display:flex; align-items:center; justify-content:space-between;}
  .mbl-root .nav-brand{display:flex; align-items:center; gap:10px;}
  .mbl-root .nav-brand img{height:34px; width:auto;}
  .mbl-root .nav-brand span{color:var(--white); font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:.12em; text-transform:uppercase; opacity:.85;}
  .mbl-root .nav-links{display:flex; gap:30px; align-items:center;}
  .mbl-root .nav-links a{color:var(--white); font-family:'IBM Plex Mono',monospace; font-size:12.5px; letter-spacing:.05em; opacity:.82; transition:opacity .2s; padding:7px 0;}
  .mbl-root .nav-links a:hover{opacity:1;}
  .mbl-root .nav-stats{display:flex; gap:22px; align-items:center; padding-right:22px; border-right:1px solid rgba(255,255,255,.18); margin-right:4px;}
  .mbl-root .nav-stats div{text-align:left;}
  .mbl-root .nav-stats .v{font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:600; color:#fff;}
  .mbl-root .nav-stats .k{font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:.05em; text-transform:uppercase; color:#8891a8; margin-top:2px;}
  @media (max-width:1180px){ .mbl-root .nav-stats{display:none;} }

  .mbl-root /* MOBILE NAV TOGGLE — hidden on desktop, .mbl-root revealed at the 860px breakpoint */
  .nav-toggle{
    display:none; align-items:center; justify-content:center;
    width:44px; height:44px; margin-right:-8px;
    background:none; border:0; cursor:pointer;
    -webkit-tap-highlight-color:transparent;
  }
  .mbl-root .nav-toggle .bars{position:relative; width:22px; height:14px;}
  .mbl-root .nav-toggle .bars span{
    position:absolute; left:0; width:100%; height:2px; border-radius:2px;
    background:var(--white);
    transition:transform .3s ease, opacity .2s ease, top .3s ease;
  }
  .mbl-root .nav-toggle .bars span:nth-child(1){top:0;}
  .mbl-root .nav-toggle .bars span:nth-child(2){top:6px;}
  .mbl-root .nav-toggle .bars span:nth-child(3){top:12px;}
  .mbl-root #nav.menu-open .nav-toggle .bars span:nth-child(1){top:6px; transform:rotate(45deg);}
  .mbl-root #nav.menu-open .nav-toggle .bars span:nth-child(2){opacity:0;}
  .mbl-root #nav.menu-open .nav-toggle .bars span:nth-child(3){top:6px; transform:rotate(-45deg);}
  .mbl-root .btn{
    display:inline-flex; align-items:center; gap:8px;
    padding:13px 26px; border-radius:999px;
    font-family:'IBM Plex Mono',monospace; font-size:12.5px; letter-spacing:.06em; text-transform:uppercase;
    font-weight:600; cursor:pointer; border:1px solid transparent; transition:transform .18s ease, box-shadow .18s ease, background .2s;
  }
  .mbl-root .btn-rust{background:var(--rust); color:var(--white);}
  .mbl-root .btn-rust:hover{background:var(--rust-deep); transform:translateY(-1px); box-shadow:0 10px 24px rgba(181,86,44,.35);}
  .mbl-root .btn-ghost{border-color:rgba(255,255,255,.4); color:var(--white);}
  .mbl-root .btn-ghost:hover{border-color:#fff; background:rgba(255,255,255,.08);}
  .mbl-root /* shorter label, .mbl-root tighter box, .mbl-root so it fits alongside the nav links */
  .nav-cta{padding:9px 15px; font-size:10.5px; letter-spacing:.04em; white-space:nowrap;}

  .mbl-root /* HERO */
  #hero{
    min-height:100vh;
    display:flex; align-items:flex-end;
    background-attachment:scroll; /* fixed attachment janks / breaks on iOS */
    background:linear-gradient(180deg, rgba(10,17,36,.55) 0%, rgba(10,17,36,.55) 40%, rgba(10,14,28,.94) 100%), url('images/hero-bg.jpg') center 30%/cover no-repeat;
    margin-top:-84px; padding-top:84px;
  }
  .mbl-root /* svh = viewport minus mobile browser chrome, .mbl-root so the hero never overflows the screen */
  @supports (min-height:100svh){ #hero{min-height:100svh;} }
  .mbl-root .hero-inner{padding:120px 0 76px;}
  .mbl-root .hero-tag{color:var(--rust); background:rgba(181,86,44,.16); border:1px solid rgba(181,86,44,.5); display:inline-block; padding:7px 14px; border-radius:999px; margin-bottom:26px; color:#e79b74;}
  .mbl-root #hero h1{color:var(--white); font-size:clamp(44px,7.2vw,92px); line-height:0.98; max-width:900px;}
  .mbl-root .hero-sub{color:#dfe2ec; font-size:19px; max-width:540px; margin:22px 0 40px; font-weight:400;}
  .mbl-root .hero-actions{display:flex; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:56px;}
  .mbl-root .hero-scroll{color:#cbd0dd; font-family:'IBM Plex Mono',monospace; font-size:12.5px; letter-spacing:.05em; display:inline-flex; align-items:center; min-height:44px;}
  .mbl-root .stat-row{display:flex; flex-wrap:wrap; gap:0; border-top:1px solid rgba(255,255,255,.16);}
  .mbl-root .stat-chip{flex:1; min-width:150px; padding:22px 0 4px; border-right:1px solid rgba(255,255,255,.16); text-align:center;}
  .mbl-root .stat-chip:last-child{border-right:none;}
  .mbl-root .stat-chip .num{font-family:'Fraunces',serif; font-weight:600; font-size:30px; color:var(--white);}
  .mbl-root .stat-chip .lbl{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:#a7adbd; margin-top:4px;}

  .mbl-root /* SECTION GENERIC */
  .section{padding:104px 0;}
  .mbl-root .section-cream2{background:var(--paper-2);}
  .mbl-root .section-navy{background:var(--ink); color:var(--white);}
  .mbl-root .section-navy .eyebrow{color:#e79b74;}
  .mbl-root .section-navy .stone-text{color:#b7bdd0;}
  .mbl-root .eyebrow-rust{color:var(--rust);}
  .mbl-root .eyebrow-green{color:var(--green);}
  .mbl-root .stone-text{color:var(--stone);}
  .mbl-root .section h2{font-size:clamp(30px,4vw,46px); line-height:1.08; margin:14px 0 20px;}
  .mbl-root .lede{font-size:18px; max-width:640px; color:var(--stone); margin-bottom:8px;}

  .mbl-root /* OPPORTUNITY */
  .opp-grid{display:grid; grid-template-columns:1.15fr .85fr; gap:64px; align-items:center; margin-top:48px;}
  .mbl-root .opp-grid p{margin-bottom:16px; font-size:16.5px; color:#3b382f;}
  .mbl-root .opp-figure{border-radius:var(--radius); overflow:hidden; box-shadow:0 24px 60px rgba(18,32,64,.18);}
  .mbl-root .opp-figure img{width:100%; height:420px; object-fit:cover;}
  .mbl-root .opp-caption{font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:var(--stone); margin-top:10px; letter-spacing:.03em;}
  .mbl-root .factbar{display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-top:56px; border-top:1px solid #ddd0b3; padding-top:28px;}
  .mbl-root .factbar div .k{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:var(--stone);}
  .mbl-root .factbar div .v{font-family:'Fraunces',serif; font-size:22px; font-weight:600; margin-top:4px;}

  .mbl-root /* ICON FACT GRID */
  .fact-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:52px;}
  .mbl-root .fact-card{background:var(--paper-2); border:1px solid #e2d5b8; border-radius:12px; padding:22px;}
  .mbl-root .fact-card svg{width:22px; height:22px; stroke:var(--rust); margin-bottom:14px;}
  .mbl-root .fact-card .k{font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--stone);}
  .mbl-root .fact-card .v{font-family:'Fraunces',serif; font-size:19px; font-weight:600; margin-top:5px; color:var(--ink);}
  .mbl-root .section-navy .fact-card{background:var(--ink-2); border-color:rgba(255,255,255,.12);}
  .mbl-root .section-navy .fact-card .k{color:#9aa1b8;}
  .mbl-root .section-navy .fact-card .v{color:#fff;}
  .mbl-root .section-navy .fact-card svg{stroke:#e79b74;}

  .mbl-root /* AMENITY GRID */
  .amenity-grid{display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-top:44px;}
  .mbl-root .amenity-card{display:flex; align-items:center; gap:10px; background:var(--white); border:1px solid #e2d5b8; border-radius:10px; padding:16px 14px;}
  .mbl-root .amenity-card svg{width:18px; height:18px; stroke:var(--green); flex-shrink:0;}
  .mbl-root .amenity-card span{font-size:13.5px; font-weight:500; color:var(--ink);}

  .mbl-root /* RENOVATION SCOPE */
  .reno-panels{display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:56px;}
  .mbl-root .reno-panel{background:var(--ink-2); border:1px solid rgba(255,255,255,.12); border-radius:var(--radius); padding:32px;}
  .mbl-root .reno-panel h4{font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:.06em; text-transform:uppercase; margin-bottom:20px; display:flex; align-items:center; gap:10px;}
  .mbl-root .reno-panel.interior h4{color:#e79b74;}
  .mbl-root .reno-panel.exterior h4{color:#8fd4a8;}
  .mbl-root .reno-panel ul{list-style:none;}
  .mbl-root .reno-panel li{font-size:14.5px; color:#c7cbdb; padding:9px 0; border-bottom:1px solid rgba(255,255,255,.08); padding-left:18px; position:relative;}
  .mbl-root .reno-panel li:last-child{border-bottom:none;}
  .mbl-root .reno-panel li::before{content:'•'; position:absolute; left:0; color:#5c6480;}
  .mbl-root .reno-panel .status{display:inline-block; margin-top:18px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.05em; text-transform:uppercase; padding:6px 12px; border-radius:999px;}
  .mbl-root .reno-panel.interior .status{background:rgba(181,86,44,.18); color:#e79b74;}
  .mbl-root .reno-panel.exterior .status{background:rgba(50,81,62,.35); color:#8fd4a8;}

  .mbl-root /* STICKY BOTTOM BAR */
  #sticky-cta{
    position:fixed; left:0; right:0; bottom:-100px; z-index:200;
    background:rgba(13,24,48,.97); backdrop-filter:blur(8px);
    border-top:1px solid rgba(255,255,255,.12);
    padding:16px 0; transition:bottom .4s ease;
  }
  .mbl-root #sticky-cta.show{bottom:0;}
  .mbl-root #sticky-cta .wrap{display:flex; align-items:center; justify-content:space-between; gap:20px;}
  .mbl-root #sticky-cta .info{display:flex; gap:26px; align-items:center;}
  .mbl-root #sticky-cta .info .name{font-family:'Fraunces',serif; font-weight:600; color:#fff; font-size:16px;}
  .mbl-root #sticky-cta .info .stat{font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:#9aa1b8;}
  .mbl-root #sticky-cta .info .stat b{color:#fff; font-weight:600;}
  .mbl-root #sticky-cta .actions{display:flex; gap:12px; align-items:center;}

  .mbl-root /* Live countdown chip — sits where "Schedule a Call" used to. */
  .cta-count{
    flex-direction:column; align-items:center; gap:2px; padding:8px 20px; line-height:1.15;
    background:rgba(255,255,255,.09); border-color:rgba(255,255,255,.3);
  }
  .mbl-root .cta-count:hover{background:rgba(255,255,255,.16); border-color:rgba(255,255,255,.5);}
  .mbl-root .cta-count__k{font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:#b7bdd0;}
  .mbl-root .cta-count__v{
    font-size:16px; font-weight:700; letter-spacing:.06em; color:#f0a87f;
    font-variant-numeric:tabular-nums; font-feature-settings:"tnum";
    min-width:14ch; text-align:center;   /* stop the bar twitching each second */
  }
  .mbl-root .cta-count.is-live{background:var(--rust); border-color:var(--rust);}
  .mbl-root .cta-count.is-live .cta-count__k{color:rgba(255,255,255,.9);}
  .mbl-root .cta-count.is-live .cta-count__v{color:#fff;}

  .mbl-root /* WEBINAR POPUP */
  .wmodal{position:fixed; inset:0; z-index:400; display:none; align-items:center; justify-content:center; padding:20px;}
  .mbl-root .wmodal.open{display:flex;}
  .mbl-root .wmodal__scrim{position:absolute; inset:0; background:rgba(8,13,28,.85); backdrop-filter:blur(4px);}
  .mbl-root .wmodal__panel{
    position:relative; z-index:1;
    width:min(1024px, 100%); max-height:90vh; aspect-ratio:1024/768;
    background:#0d1830; border-radius:var(--radius); overflow:hidden;
    box-shadow:0 40px 100px rgba(0,0,0,.6);
  }
  .mbl-root .wmodal__frame{width:100%; height:100%;}
  .mbl-root .wmodal__frame iframe{width:100%; height:100%; border:0; display:block;}
  .mbl-root .wmodal__close{
    position:absolute; top:12px; right:12px; z-index:2;
    width:38px; height:38px; border-radius:50%; border:0; cursor:pointer;
    background:rgba(10,17,36,.75); color:#fff; font-size:19px; line-height:1;
    display:flex; align-items:center; justify-content:center; transition:background .2s ease;
  }
  .mbl-root .wmodal__close:hover{background:var(--rust);}

  @media (max-width:760px){
    .mbl-root /* Everything stays visible on mobile: headline + date on one row, .mbl-root countdown and CTA on the next. */
    #sticky-cta{padding:10px 0 calc(10px + env(safe-area-inset-bottom));}
    .mbl-root #sticky-cta .wrap{flex-direction:column; align-items:stretch; gap:8px;}
    .mbl-root #sticky-cta .info{
      display:flex; flex-direction:column; gap:1px; min-width:0;
    }
    .mbl-root #sticky-cta .info .name{
      font-size:12.5px; line-height:1.25;
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .mbl-root #sticky-cta .info .stat{font-size:10px; letter-spacing:.03em;}
    .mbl-root #sticky-cta .actions{gap:8px;}
    .mbl-root #sticky-cta .actions .btn{flex:1; justify-content:center;}
    .mbl-root .cta-count{padding:7px 8px; flex:1.35;}
    .mbl-root .cta-count__k{font-size:8px; letter-spacing:.07em;}
    .mbl-root .cta-count__v{font-size:13.5px; letter-spacing:.02em; min-width:0;}
    .mbl-root /* "Reserve Your Spot" kept small so the countdown has room */
    .cta-reserve{padding:9px 12px; font-size:10px; letter-spacing:.04em;}
    .mbl-root .wmodal{padding:10px;}
    .mbl-root .wmodal__panel{aspect-ratio:auto; height:82vh;}
  }

  .mbl-root /* SLIDER SECTION */
  .compare-wrap{margin-top:52px;}
  .mbl-root .compare{position:relative; border-radius:var(--radius); overflow:hidden; box-shadow:0 30px 70px rgba(0,0,0,.45); aspect-ratio:16/10; max-width:840px; margin:0 auto;}
  .mbl-root .compare img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover; -webkit-user-select:none; user-select:none;}
  .mbl-root .compare-after{clip-path:inset(0 calc(100% - var(--pos,50%)) 0 0);}
  .mbl-root .compare-divider{position:absolute; top:0; bottom:0; left:var(--pos,50%); width:2px; background:rgba(255,255,255,.85); pointer-events:none; box-shadow:0 0 12px rgba(0,0,0,.4);}
  .mbl-root .compare-handle{position:absolute; top:50%; left:var(--pos,50%); transform:translate(-50%,-50%); width:52px; height:52px; border-radius:50%; background:var(--white); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(0,0,0,.35); pointer-events:none;}
  .mbl-root .compare-handle svg{width:20px; height:20px;}
  .mbl-root .compare-tag{position:absolute; top:16px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.08em; text-transform:uppercase; padding:7px 12px; border-radius:999px; background:rgba(18,32,64,.72); color:#fff; backdrop-filter:blur(3px);}
  .mbl-root .compare-tag.left{left:16px;}
  .mbl-root .compare-tag.right{right:16px;}
  .mbl-root .compare-range{width:100%; max-width:840px; display:block; margin:22px auto 0; -webkit-appearance:none; appearance:none; height:2px; background:rgba(255,255,255,.3); outline:none;}
  .mbl-root .compare-range::-webkit-slider-thumb{-webkit-appearance:none; appearance:none; width:0; height:0;}
  .mbl-root .compare-caption{text-align:center; margin-top:18px; font-size:14px; color:#b7bdd0; max-width:520px; margin-left:auto; margin-right:auto;}
  .mbl-root .upside-row{display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,.14); margin-top:56px; border-radius:var(--radius); overflow:hidden;}
  .mbl-root .upside-cell{background:var(--ink-2); padding:32px 28px; text-align:center;}
  .mbl-root .upside-cell .num{font-family:'Fraunces',serif; font-size:38px; font-weight:600; color:var(--rust-glow,#e08a5c);}
  .mbl-root .upside-cell .lbl{font-family:'IBM Plex Mono',monospace; font-size:11.5px; letter-spacing:.05em; text-transform:uppercase; color:#b7bdd0; margin-top:8px;}

  .mbl-root /* USP CARDS */
  .usp-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:2px; background:#ddd0b3; margin-top:52px; border-radius:var(--radius); overflow:hidden;}
  .mbl-root .usp-card{background:var(--paper); padding:30px 30px; min-height:140px;}
  .mbl-root .usp-card .tag{font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.08em; text-transform:uppercase; color:var(--green);}
  .mbl-root .usp-card h3{font-size:20px; margin:12px 0 10px; font-weight:600;}
  .mbl-root .usp-card p{font-size:14.5px; color:var(--stone);}

  .mbl-root /* GALLERY — SCROLLING MARQUEE */
  .gallery-marquee{margin-top:52px; --tile-w:320px; --tile-h:210px; --tile-gap:14px; --fade:90px;}
  .mbl-root .marquee{
    position:relative; overflow:hidden; padding:8px 0;
    -webkit-mask-image:linear-gradient(90deg, transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%);
            mask-image:linear-gradient(90deg, transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%);
  }
  .mbl-root .marquee + .marquee{margin-top:var(--tile-gap);}
  .mbl-root .marquee__track{display:flex; width:max-content; will-change:transform;}
  .mbl-root .marquee__set{display:flex;}
  .mbl-root /* Row 1 scrolls left, .mbl-root row 2 scrolls right, .mbl-root row 3 scrolls left. */
  .marquee--left  .marquee__track{animation:marquee-left  64s linear infinite;}
  .mbl-root .marquee--right .marquee__track{animation:marquee-right 76s linear infinite;}
  .mbl-root .marquee--slow  .marquee__track{animation-duration:88s;}
  .mbl-root /* Pause the row on hover so the pulse reads clearly. Touch devices get
     the same effect by tapping a tile (JS adds .is-paused / .is-active). */
  @media (hover:hover){
    .marquee:hover .marquee__track{animation-play-state:paused;}
  }
  .mbl-root .marquee:focus-within .marquee__track, .mbl-root .marquee.is-paused .marquee__track{animation-play-state:paused;}

  @keyframes marquee-left { from{transform:translate3d(0,0,0);}      to{transform:translate3d(-50%,0,0);} }
  @keyframes marquee-right{ from{transform:translate3d(-50%,0,0);}   to{transform:translate3d(0,0,0);} }

  .mbl-root .marquee figure{
    position:relative; flex:0 0 auto;
    width:var(--tile-w); height:var(--tile-h); margin-right:var(--tile-gap);
    border-radius:10px; overflow:hidden; background:var(--paper-2);
    box-shadow:0 6px 18px rgba(18,32,64,.10);
    transition:box-shadow .35s ease;
  }
  .mbl-root .marquee figure img{width:100%; height:100%; object-fit:cover;}
  .mbl-root .marquee figure::after{content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0) 52%, rgba(0,0,0,.62) 100%);}
  .mbl-root .marquee figcaption{
    position:absolute; left:12px; right:12px; bottom:10px; z-index:1;
    color:#fff; font-family:'IBM Plex Mono',monospace; font-size:11px;
    letter-spacing:.04em; text-shadow:0 2px 8px rgba(0,0,0,.6);
    /* keep long captions on one tidy line rather than stacking over the photo */
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .mbl-root /* Hover: the tile pulses. */
  @keyframes tile-pulse{
    0%,100%{transform:scale(1);}
    50%    {transform:scale(1.045);}
  }
  @media (hover:hover){
    .mbl-root .marquee figure:hover{
      z-index:2; box-shadow:0 16px 38px rgba(18,32,64,.30);
      animation:tile-pulse 1.15s ease-in-out infinite;
    }
  }
  .mbl-root .marquee figure.is-active{
    z-index:2; box-shadow:0 16px 38px rgba(18,32,64,.30);
    animation:tile-pulse 1.15s ease-in-out infinite;
  }

  .mbl-root /* NUMBERS */
  .numbers-grid{display:grid; grid-template-columns:repeat(2,1fr); gap:0; margin-top:52px; border-top:1px solid rgba(255,255,255,.14);}
  .mbl-root .numbers-row{display:flex; justify-content:space-between; align-items:baseline; padding:20px 4px; border-bottom:1px solid rgba(255,255,255,.14);}
  .mbl-root .numbers-row:nth-child(odd){padding-right:36px;}
  .mbl-root .numbers-row:nth-child(even){padding-left:36px;}
  .mbl-root .numbers-row .k{font-family:'IBM Plex Mono',monospace; font-size:13.5px; color:#b7bdd0; letter-spacing:.02em;}
  .mbl-root .numbers-row .v{font-family:'Fraunces',serif; font-size:21px; font-weight:600; color:#fff; white-space:nowrap; margin-left:16px;}
  .mbl-root .numbers-note{margin-top:26px; font-size:13px; color:#8b93a8; max-width:640px;}

  .mbl-root /* LOCATION */

  /* WHO YOU'RE INVESTING WITH */
  .firm-grid{display:grid; grid-template-columns:.95fr 1.05fr; gap:56px; align-items:center; margin-top:44px;}
  .mbl-root .firm-copy p{font-size:16.5px; color:#3b382f; margin-bottom:16px;}
  .mbl-root .firm-copy p:last-child{margin-bottom:0;}

  .mbl-root /* Click-to-load YouTube facade: a poster image stands in for the player until
     you press it, .mbl-root so the page costs nothing to load on mobile data. */
  .yt{position:relative; border-radius:var(--radius); overflow:hidden; aspect-ratio:16/9;
      background:var(--ink); box-shadow:0 24px 60px rgba(18,32,64,.24);}
  .mbl-root .yt__btn{position:absolute; inset:0; width:100%; height:100%; padding:0; border:0;
           background:none; cursor:pointer; display:block; -webkit-tap-highlight-color:transparent;}
  .mbl-root .yt__btn img{width:100%; height:100%; object-fit:cover;}
  .mbl-root .yt__btn::after{content:''; position:absolute; inset:0;
                  background:linear-gradient(180deg, rgba(10,17,36,.10) 40%, rgba(10,17,36,.62) 100%);}
  .mbl-root .yt__btn:focus-visible{outline:3px solid var(--rust); outline-offset:-3px;}
  .mbl-root .yt__play{
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:1;
    width:76px; height:76px; border-radius:50%;
    background:rgba(255,255,255,.16); border:2px solid rgba(255,255,255,.6);
    display:flex; align-items:center; justify-content:center; backdrop-filter:blur(2px);
    transition:background .25s ease, border-color .25s ease, transform .25s ease;
  }
  .mbl-root .yt__btn:hover .yt__play{background:var(--rust); border-color:var(--rust); transform:translate(-50%,-50%) scale(1.07);}
  .mbl-root .yt__play svg{width:26px; height:26px; margin-left:4px; fill:#fff;}
  .mbl-root .yt iframe{position:absolute; inset:0; width:100%; height:100%; border:0;}

  .mbl-root /* PRESS STRIP — logos sit straight on the paper, .mbl-root no plates or containers.
     Muted grey at rest so they read as texture; true colour on hover. */
  .trust-band{background:var(--paper-2); border-bottom:1px solid #ddd0b3; padding:14px 0;}
  .mbl-root .press-strip{
    overflow:hidden;
    -webkit-mask-image:linear-gradient(90deg, transparent 0, #000 110px, #000 calc(100% - 110px), transparent 100%);
            mask-image:linear-gradient(90deg, transparent 0, #000 110px, #000 calc(100% - 110px), transparent 100%);
  }
  .mbl-root .press-track{display:flex; width:max-content; animation:marquee-left 46s linear infinite; will-change:transform;}
  .mbl-root .press-set{display:flex;}
  @media (hover:hover){
    .mbl-root .press-strip:hover .press-track{animation-play-state:paused;}
  }
  .mbl-root .press-strip:focus-within .press-track, .mbl-root .press-strip.is-paused .press-track{animation-play-state:paused;}

  .mbl-root .press-item{
    flex:0 0 auto; width:168px; height:38px;
    display:flex; align-items:center; justify-content:center;
  }
  .mbl-root .press-item img{
    max-width:118px; object-fit:contain;
    filter:grayscale(1) opacity(.42);
    transition:filter .4s ease, transform .4s ease;
  }
  .mbl-root /* Per-logo caps — the three marks have very different aspect ratios, .mbl-root so a
     single max-height would leave CEOTimes looking half the size of the rest. */
  .press-item--usa img{max-height:24px;}
  .mbl-root .press-item--somedocs img{max-height:29px;}
  .mbl-root .press-item--ceo img{max-height:32px;}

  @media (hover:hover){
    .mbl-root .press-item:hover img{filter:none; transform:scale(1.04);}
  }
  .mbl-root /* touch devices have no hover — JS toggles this on tap */
  .press-item.is-active img{filter:none; transform:scale(1.04);}

  .mbl-root /* TESTIMONIALS */
  .quote-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:46px;}
  .mbl-root .quote-card{
    background:var(--ink-2); border:1px solid rgba(255,255,255,.12); border-radius:var(--radius);
    padding:30px 28px; display:flex; flex-direction:column;
  }
  .mbl-root .quote-card .mark{font-family:'Fraunces',serif; font-size:44px; line-height:.8; color:var(--rust); margin-bottom:14px;}
  .mbl-root .quote-card blockquote{font-size:15px; line-height:1.62; color:#d3d7e4; flex:1;}
  .mbl-root .quote-who{display:flex; align-items:center; gap:13px; margin-top:24px; padding-top:20px; border-top:1px solid rgba(255,255,255,.12);}
  .mbl-root .quote-avatar{
    flex:0 0 auto; width:44px; height:44px; border-radius:50%;
    background:linear-gradient(140deg, var(--rust), var(--rust-deep));
    display:flex; align-items:center; justify-content:center;
    font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:600; color:#fff; letter-spacing:.03em;
  }
  .mbl-root .quote-who .n{display:block; font-size:14.5px; font-weight:600; color:#fff; line-height:1.3;}
  .mbl-root .quote-who .r{display:block; font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.05em;
                text-transform:uppercase; color:#9aa1b8; margin-top:3px; line-height:1.35;}

  .mbl-root /* PRESS RAIL — sliding cards of coverage and speaking engagements */
  .rail{
    overflow:hidden; margin-top:44px; padding:6px 0;
    -webkit-mask-image:linear-gradient(90deg, transparent 0, #000 90px, #000 calc(100% - 90px), transparent 100%);
            mask-image:linear-gradient(90deg, transparent 0, #000 90px, #000 calc(100% - 90px), transparent 100%);
  }
  .mbl-root .rail__track{display:flex; width:max-content; animation:marquee-left 58s linear infinite; will-change:transform;}
  .mbl-root .rail__set{display:flex;}
  @media (hover:hover){ .mbl-root .rail:hover .rail__track{animation-play-state:paused;} }
  .mbl-root .rail:focus-within .rail__track, .mbl-root .rail.is-paused .rail__track{animation-play-state:paused;}

  .mbl-root .pcard{
    flex:0 0 auto; width:384px; margin-right:18px;
    display:flex; flex-direction:column;
    background:var(--ink-2); border:1px solid rgba(255,255,255,.13);
    border-radius:var(--radius); overflow:hidden;
    transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;
  }
  @media (hover:hover){
    .mbl-root .pcard:hover{transform:translateY(-3px); box-shadow:0 18px 40px rgba(0,0,0,.34); border-color:rgba(231,155,116,.5);}
  }
  .mbl-root .pcard__top{
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    padding:18px 22px 0;
  }
  .mbl-root .pcard__logo{height:22px; width:auto; max-width:112px; object-fit:contain;
               filter:brightness(0) invert(1) opacity(.86);}
  .mbl-root .pcard__kind{
    font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:.12em;
    text-transform:uppercase; padding:5px 10px; border-radius:999px; white-space:nowrap;
    background:rgba(231,155,116,.16); color:#e79b74; border:1px solid rgba(231,155,116,.34);
  }
  .mbl-root .pcard__kind.is-talk{background:rgba(143,212,168,.14); color:#8fd4a8; border-color:rgba(143,212,168,.32);}
  .mbl-root .pcard__body{padding:16px 22px 0; flex:1;}
  .mbl-root .pcard__title{
    font-family:'Fraunces',serif; font-size:20px; font-weight:600; line-height:1.24;
    color:#fff; letter-spacing:-0.01em; margin-bottom:10px;
    display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
  }
  .mbl-root .pcard__excerpt{
    font-size:14px; line-height:1.58; color:#b7bdd0;
    display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
  }
  .mbl-root .pcard__foot{
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    padding:16px 22px 18px; margin-top:14px;
  }
  .mbl-root .pcard__date{font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.05em;
               text-transform:uppercase; color:#8b93a8;}
  .mbl-root .pcard__btn{
    font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.07em; text-transform:uppercase;
    font-weight:600; color:#fff; background:rgba(255,255,255,.09);
    border:1px solid rgba(255,255,255,.22); border-radius:999px;
    padding:9px 16px; cursor:pointer; white-space:nowrap;
    transition:background .22s ease, border-color .22s ease;
  }
  .mbl-root .pcard__btn:hover{background:var(--rust); border-color:var(--rust);}
  .mbl-root .pcard__btn:focus-visible{outline:2px solid var(--rust); outline-offset:2px;}

  .mbl-root /* PRESS MODAL */
  .pmodal{
    position:fixed; inset:0; z-index:300; display:none;
    align-items:center; justify-content:center; padding:24px;
  }
  .mbl-root .pmodal.open{display:flex;}
  .mbl-root .pmodal__scrim{position:absolute; inset:0; background:rgba(8,13,28,.78); backdrop-filter:blur(4px);}
  .mbl-root .pmodal__panel{
    position:relative; z-index:1; width:min(760px, 100%); max-height:88vh; overflow-y:auto;
    background:var(--paper); border-radius:var(--radius);
    box-shadow:0 40px 90px rgba(0,0,0,.5);
  }
  .mbl-root .pmodal__hero{width:100%; height:210px; object-fit:cover; display:block;}
  .mbl-root .pmodal__inner{padding:30px 36px 34px;}
  .mbl-root .pmodal__top{display:flex; align-items:center; gap:14px; margin-bottom:16px; flex-wrap:wrap;}
  .mbl-root .pmodal__logo{height:26px; width:auto; max-width:132px; object-fit:contain;}
  .mbl-root .pmodal__kind{
    font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:.12em; text-transform:uppercase;
    padding:5px 10px; border-radius:999px;
    background:rgba(181,86,44,.13); color:var(--rust-deep); border:1px solid rgba(181,86,44,.3);
  }
  .mbl-root .pmodal__date{font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.05em;
                text-transform:uppercase; color:var(--stone); margin-left:auto;}
  .mbl-root .pmodal h3{font-family:'Fraunces',serif; font-size:clamp(24px,3vw,32px); font-weight:600;
             line-height:1.16; letter-spacing:-0.01em; margin-bottom:18px;}
  .mbl-root .pmodal__body p{font-size:16px; line-height:1.68; color:#3b382f; margin-bottom:15px;}
  .mbl-root .pmodal__body p:last-child{margin-bottom:0;}
  .mbl-root .pmodal__note{
    margin-top:22px; padding-top:18px; border-top:1px solid #ddd0b3;
    font-size:12.5px; line-height:1.6; color:var(--stone);
  }
  .mbl-root .pmodal__actions{display:flex; gap:12px; flex-wrap:wrap; margin-top:20px;}
  .mbl-root .pmodal__close{
    position:absolute; top:14px; right:14px; z-index:2;
    width:38px; height:38px; border-radius:50%; border:0; cursor:pointer;
    background:rgba(10,17,36,.55); color:#fff; font-size:19px; line-height:1;
    display:flex; align-items:center; justify-content:center;
    transition:background .2s ease;
  }
  .mbl-root .pmodal__close:hover{background:var(--rust);}

  .mbl-root /* MEET THE CEO */
  .ceo-grid{display:grid; grid-template-columns:.8fr 1.2fr; gap:56px; align-items:start; margin-top:44px;}
  .mbl-root .ceo-photo{border-radius:var(--radius); overflow:hidden; box-shadow:0 24px 60px rgba(18,32,64,.22); background:var(--paper-2);}
  .mbl-root .ceo-photo img{width:100%; height:auto; aspect-ratio:1/1; object-fit:cover; object-position:center 18%;}
  .mbl-root .ceo-role{font-family:'IBM Plex Mono',monospace; font-size:11.5px; letter-spacing:.14em;
            text-transform:uppercase; color:var(--rust); margin-bottom:8px;}
  .mbl-root .ceo-name{font-family:'Fraunces',serif; font-size:clamp(28px,3.4vw,40px); font-weight:600;
            line-height:1.1; letter-spacing:-0.01em; margin-bottom:22px;}
  .mbl-root .ceo-bio p{font-size:16.5px; color:#3b382f; margin-bottom:16px;}
  .mbl-root .social-row{display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top:26px;}
  .mbl-root .social-row a{
    display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px;
    border-radius:50%; border:1px solid #ddd0b3; background:var(--white); color:var(--ink);
    transition:background .22s ease, color .22s ease, border-color .22s ease, transform .22s ease;
  }
  .mbl-root .social-row a:hover{background:var(--rust); border-color:var(--rust); color:#fff; transform:translateY(-2px);}
  .mbl-root .social-row svg{width:19px; height:19px; fill:currentColor;}
  .mbl-root /* Booking CTA sits inline with the social icons, .mbl-root matching their height */
  .social-row .social-call{
    width:auto; height:44px; border-radius:999px; margin-left:6px;
    padding:0 22px; color:#fff; border-color:var(--rust); background:var(--rust);
  }
  .mbl-root .social-row .social-call:hover{background:var(--rust-deep); border-color:var(--rust-deep); transform:translateY(-2px);}

  .mbl-root /* Footer copy sits on near-black — invert the chips. These must come after
     the base .social-row rules above: same specificity, .mbl-root so source order wins. */
  .social-row--footer{margin-top:30px; padding-top:26px; border-top:1px solid rgba(255,255,255,.1);}
  .mbl-root .social-row--footer a{background:rgba(255,255,255,.07); border-color:rgba(255,255,255,.18); color:#dfe2ec;}
  .mbl-root .social-row--footer a:hover{background:var(--rust); border-color:var(--rust); color:#fff;}
  .mbl-root .social-row--footer .social-call{background:var(--rust); border-color:var(--rust); color:#fff;}

  .mbl-root /* FINANCIAL BENEFITS */
  .benefit-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(196px,1fr)); gap:14px; margin-top:44px;}
  .mbl-root .benefit-card{
    background:var(--ink-2); border:1px solid rgba(255,255,255,.12);
    border-radius:12px; padding:26px 22px;
  }
  .mbl-root .benefit-card svg{width:24px; height:24px; stroke:#e79b74; fill:none; stroke-width:1.6;
                    stroke-linecap:round; stroke-linejoin:round; margin-bottom:16px;}
  .mbl-root .benefit-card h3{font-size:17.5px; font-weight:600; color:#fff; margin-bottom:8px; line-height:1.25;}
  .mbl-root .benefit-card p{font-size:14px; color:#b7bdd0; line-height:1.5;}
  .mbl-root .benefit-actions{display:flex; gap:16px; flex-wrap:wrap; margin-top:40px;}

  .mbl-root /* WEBINAR / PATH */
  .path-band{background:var(--green); color:#fff; padding:88px 0;}
  .mbl-root .path-inner{display:grid; grid-template-columns:1.3fr .9fr; gap:56px; align-items:center;}
  .mbl-root .path-band .eyebrow{color:#b9d6c4;}
  .mbl-root .path-band h2{color:#fff;}
  .mbl-root .path-band p{color:#dfe8e1; font-size:16.5px; margin-bottom:26px; max-width:520px;}
  .mbl-root .webinar-card{background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.18); border-radius:var(--radius); padding:30px;}
  .mbl-root .webinar-card .eyebrow{color:#b9d6c4; margin-bottom:10px;}
  .mbl-root .webinar-card h3{font-size:22px; color:#fff; margin-bottom:8px;}
  .mbl-root .webinar-card p{color:#d7e4dc; font-size:14.5px; margin-bottom:18px;}
  .mbl-root .webinar-date{font-family:'IBM Plex Mono',monospace; font-size:13px; color:#fff; background:rgba(255,255,255,.12); display:inline-block; padding:8px 14px; border-radius:8px; margin-bottom:20px;}

  .mbl-root /* FINAL CTA */
  #final-cta{background:var(--ink); color:#fff; padding:130px 0; text-align:center; position:relative; overflow:hidden;}
  .mbl-root #final-cta::before{content:''; position:absolute; inset:0; background:radial-gradient(circle at 50% 0%, rgba(181,86,44,.22), transparent 60%);}
  .mbl-root #final-cta .inner{position:relative;}
  .mbl-root #final-cta .eyebrow{color:#e79b74; justify-content:center; display:flex;}
  .mbl-root #final-cta h2{font-size:clamp(34px,5.6vw,64px); margin:18px auto 22px; max-width:760px; color:#fff;}
  .mbl-root #final-cta p{color:#c3c8d6; font-size:17px; max-width:520px; margin:0 auto 38px;}
  .mbl-root .final-actions{display:flex; gap:16px; justify-content:center; flex-wrap:wrap;}

  .mbl-root /* FOOTER */
  /* bottom padding clears the fixed CTA bar, .mbl-root which would otherwise sit on top
     of the last row of footer content once it slides in */
  footer{background:#0d1830; color:#8b93a8; padding:56px 0 118px;}
  .mbl-root .footer-top{display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:32px; padding-bottom:36px; border-bottom:1px solid rgba(255,255,255,.1);}
  .mbl-root .footer-brand img{height:32px; margin-bottom:10px;}
  .mbl-root .footer-links{display:flex; gap:40px; flex-wrap:wrap;}
  .mbl-root .footer-links div .h{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:#5c6480; margin-bottom:12px;}
  .mbl-root .footer-links a{display:flex; align-items:center; min-height:36px; font-size:13.5px; color:#b7bdd0;}

  @media (max-width:860px){
    .mbl-root /* --- Mobile navigation: hamburger + slide-down panel --- */
    .nav-toggle{display:inline-flex;}
    .mbl-root #nav{padding:14px 0;}
    .mbl-root #nav.menu-open{background:rgba(18,32,64,.97); backdrop-filter:blur(8px);}
    .mbl-root .nav-links{
      position:absolute; left:0; right:0; top:100%;
      display:flex; flex-direction:column; align-items:stretch; gap:0;
      background:rgba(13,24,48,.98); backdrop-filter:blur(10px);
      border-top:1px solid rgba(255,255,255,.10);
      box-shadow:0 22px 44px rgba(0,0,0,.38);
      padding:6px 0 20px;
      max-height:calc(100vh - 100%); overflow-y:auto;
      opacity:0; visibility:hidden; transform:translateY(-10px);
      transition:opacity .26s ease, transform .26s ease, visibility .26s;
    }
    .mbl-root #nav.menu-open .nav-links{opacity:1; visibility:visible; transform:none;}
    .mbl-root .nav-links a{
      padding:15px 32px; opacity:1; font-size:15px;
      border-bottom:1px solid rgba(255,255,255,.08);
    }
    .mbl-root /* The stat strip is dead weight in the top bar on mobile — surface it here instead. */
    .nav-stats{
      display:grid; grid-template-columns:repeat(3,1fr); gap:0;
      padding:14px 32px 16px; margin:0;
      border-right:none; border-bottom:1px solid rgba(255,255,255,.12);
    }
    .mbl-root .nav-stats div{text-align:center;}
    .mbl-root .nav-links a.nav-cta{
      margin:18px 32px 0; justify-content:center;
      padding:15px 26px; font-size:12.5px; border-bottom:none;
    }

    .mbl-root /* --- Grids that previously never collapsed --- */
    .fact-grid{grid-template-columns:repeat(2,1fr);}
    .mbl-root .amenity-grid{grid-template-columns:repeat(2,1fr);}
    .mbl-root .reno-panels{grid-template-columns:1fr; gap:16px;}
    .mbl-root .reno-panel{padding:24px;}

    .mbl-root .opp-grid{grid-template-columns:1fr; gap:36px;}
    .mbl-root .opp-figure img{height:280px;}
    .mbl-root .factbar{grid-template-columns:repeat(2,1fr); row-gap:24px;}
    .mbl-root .usp-grid{grid-template-columns:1fr;}
    .mbl-root .upside-row{grid-template-columns:1fr;}
    .mbl-root .gallery-marquee{--tile-w:232px; --tile-h:152px; --tile-gap:10px; --fade:40px;}
    .mbl-root .numbers-grid{grid-template-columns:1fr;}
    .mbl-root .numbers-row:nth-child(odd), .mbl-root .numbers-row:nth-child(even){padding-left:4px; padding-right:4px;}
    .mbl-root .path-inner{grid-template-columns:1fr; gap:36px;}
    .mbl-root .firm-grid{grid-template-columns:1fr; gap:32px;}
    .mbl-root .yt__play{width:62px; height:62px;}
    .mbl-root .yt__play svg{width:22px; height:22px;}
    .mbl-root .ceo-grid{grid-template-columns:1fr; gap:30px;}
    .mbl-root .ceo-photo{max-width:320px;}
    .mbl-root .benefit-grid{grid-template-columns:repeat(2,1fr);}
    .mbl-root .quote-grid{grid-template-columns:repeat(2,1fr);}
    .mbl-root .pcard{width:300px; margin-right:14px;}
    .mbl-root .pcard__title{font-size:18px;}
    .mbl-root .rail{margin-top:34px;
      -webkit-mask-image:linear-gradient(90deg, transparent 0, #000 34px, #000 calc(100% - 34px), transparent 100%);
              mask-image:linear-gradient(90deg, transparent 0, #000 34px, #000 calc(100% - 34px), transparent 100%);}
    .mbl-root .pmodal{padding:14px;}
    .mbl-root .pmodal__inner{padding:24px 22px 26px;}
    .mbl-root .pmodal__hero{height:150px;}
    .mbl-root .pmodal__date{margin-left:0; width:100%;}
    .mbl-root .trust-band{padding:11px 0;}
    .mbl-root .press-strip{
      -webkit-mask-image:linear-gradient(90deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);
              mask-image:linear-gradient(90deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);}
    .mbl-root .press-item{width:124px; height:32px;}
    .mbl-root .press-item img{max-width:92px;}
    .mbl-root .press-item--usa img{max-height:19px;}
    .mbl-root .press-item--somedocs img{max-height:23px;}
    .mbl-root .press-item--ceo img{max-height:26px;}

    .mbl-root /* Three short stats read better as a row than a tall stack. */
    .stat-row{display:grid; grid-template-columns:repeat(3,1fr); gap:0;}
    .mbl-root .stat-chip{min-width:0; padding:18px 8px 4px;}
    .mbl-root .stat-chip .num{font-size:24px;}
    .mbl-root .stat-chip .lbl{font-size:10px;}

    .mbl-root /* --- Vertical rhythm: desktop spacing is far too tall on a phone --- */
    .section{padding:72px 0;}
    .mbl-root .path-band{padding:64px 0;}
    .mbl-root #final-cta{padding:88px 0;}
    .mbl-root .hero-inner{padding:100px 0 56px;}
    .mbl-root .hero-sub{font-size:17px; margin:18px 0 32px;}

    .mbl-root /* Fixed CTA bar must not sit on top of the disclaimer. */
    footer{padding-bottom:140px;}
    .mbl-root .footer-links{gap:28px;}
    .mbl-root .footer-links a{min-height:44px;} /* thumb-sized targets */
  }

  @media (max-width:520px){
    .mbl-root .wrap{padding:0 20px;}
    .mbl-root .nav-links a{padding-left:20px; padding-right:20px;}
    .mbl-root .nav-stats{padding-left:20px; padding-right:20px;}
    .mbl-root .nav-links a.nav-cta{margin-left:20px; margin-right:20px;}
    .mbl-root .amenity-grid{grid-template-columns:1fr;}
    .mbl-root .fact-grid{grid-template-columns:1fr;}
    .mbl-root .gallery-marquee{--tile-w:196px; --tile-h:130px; --fade:28px;}
    .mbl-root .section{padding:60px 0;}
    .mbl-root .numbers-row .v{font-size:18px;}
    .mbl-root .upside-cell{padding:26px 20px;}
    .mbl-root .upside-cell .num{font-size:32px;}
    .mbl-root .webinar-card{padding:24px;}
    .mbl-root /* Full-width buttons are far easier to hit than side-by-side pills. */
    .hero-actions, .mbl-root .final-actions, .mbl-root .benefit-actions{flex-direction:column; align-items:stretch;}
    .mbl-root .hero-actions .btn, .mbl-root .final-actions .btn, .mbl-root .benefit-actions .btn{justify-content:center;}
    .mbl-root .benefit-grid{grid-template-columns:1fr;}
    .mbl-root .quote-grid{grid-template-columns:1fr;}
    .mbl-root .quote-card{padding:26px 22px;}
    .mbl-root .ceo-photo{max-width:none;}
    .mbl-root .hero-scroll{text-align:center;}
  }
  @media (prefers-reduced-motion:reduce){
    .mbl-root{scroll-behavior:auto;}
    .mbl-root, .mbl-root *{transition:none !important;}
    .mbl-root /* Gallery falls back to a manually scrollable strip — no auto-motion, .mbl-root no pulse. */
    .marquee{overflow-x:auto; -webkit-mask-image:none; mask-image:none;}
    .mbl-root .marquee__track{animation:none !important; width:auto;}
    .mbl-root .marquee__set[aria-hidden="true"]{display:none;}
    .mbl-root .marquee figure:hover{animation:none !important;}
  }
`

const HTML = `<nav id="nav">
  <div class="wrap">
    <div class="nav-brand">
      <img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/pheenyx-logo.png" alt="Pheenyx Capital">
      <span>Pheenyx Capital</span>
    </div>
    <button class="nav-toggle" id="nav-toggle" type="button"
            aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">
      <span class="bars" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>
    <div class="nav-links" id="nav-links">
      <div class="nav-stats mono">
        <div><div class="v">492</div><div class="k">Units</div></div>
        <div><div class="v">94%</div><div class="k">Occupied</div></div>
        <div><div class="v">Duluth, GA</div><div class="k">Location</div></div>
      </div>
      <a href="#opportunity">Opportunity</a>
      <a href="#sponsor">About Us</a>
      <a href="#value-add">Benefits</a>
      <a href="https://calendly.com/pheenyxcapital/30min" class="btn btn-rust nav-cta"
         target="_blank" rel="noopener noreferrer">Schedule a Call</a>
    </div>
  </div>
</nav>

<header id="hero">
  <div class="wrap hero-inner">
    <span class="eyebrow hero-tag">The Big Reveal</span>
    <h1>Montrose <span class="italic">Berkeley Lake</span></h1>
    <p class="hero-sub">An Elevated Investment Opportunity by Pheenyx Capital</p>
    <div class="hero-actions">
      <a href="#path" class="btn btn-rust" data-webinar>Reserve Your Spot</a>
      <a href="#value-add" class="hero-scroll">See the details ↓</a>
    </div>
    <div class="stat-row">
      <div class="stat-chip"><div class="num">492</div><div class="lbl">Units</div></div>
      <div class="stat-chip"><div class="num">94%</div><div class="lbl">Occupied</div></div>
      <div class="stat-chip"><div class="num">41</div><div class="lbl">Acres</div></div>
    </div>
  </div>
</header>

<section class="trust-band" aria-label="Pheenyx Capital in the press">
  <div class="press-strip">
    <div class="press-track">
      <div class="press-set">
          <div class="press-item press-item--usa"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--somedocs"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs.png" alt="SoMeDocs - Doctors on Social Media" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--ceo"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--usa"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--somedocs"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs.png" alt="SoMeDocs - Doctors on Social Media" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--ceo"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--usa"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--somedocs"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs.png" alt="SoMeDocs - Doctors on Social Media" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--ceo"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--usa"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--somedocs"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs.png" alt="SoMeDocs - Doctors on Social Media" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--ceo"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async"></div>
      </div>
      <div class="press-set" aria-hidden="true">
          <div class="press-item press-item--usa"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--somedocs"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs.png" alt="SoMeDocs - Doctors on Social Media" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--ceo"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--usa"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--somedocs"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs.png" alt="SoMeDocs - Doctors on Social Media" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--ceo"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--usa"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--somedocs"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs.png" alt="SoMeDocs - Doctors on Social Media" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--ceo"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--usa"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--somedocs"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs.png" alt="SoMeDocs - Doctors on Social Media" loading="lazy" decoding="async"></div>
          <div class="press-item press-item--ceo"><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async"></div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="opportunity">
  <div class="wrap">
    <span class="eyebrow eyebrow-rust">The Opportunity</span>
    <div class="opp-grid">
      <div>
        <h2>A well-located property with room to grow.</h2>
        <p>Montrose Berkeley Lake is a 492-unit garden-style community on 41 acres in Duluth, Georgia, at the center of one of metro Atlanta's fastest-growing counties.</p>
        <p>The property is 94% occupied at an average rent of $1,387. Eighty units have already been renovated, with 412 left to capture the same upside.</p>
        <p>This isn't a turnaround story. It's a working plan, partway done.</p>
        <div class="social-row">
          <a href="https://www.linkedin.com/company/phcinvest/" target="_blank" rel="noopener noreferrer" aria-label="Pheenyx Capital on LinkedIn"> <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21H9z"/></svg> </a>
          <a href="https://www.facebook.com/phcinvest" target="_blank" rel="noopener noreferrer" aria-label="Pheenyx Capital on Facebook"> <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg> </a>
          <a href="https://www.youtube.com/@Phcinvest" target="_blank" rel="noopener noreferrer" aria-label="Pheenyx Capital on YouTube"> <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.9a3 3 0 0 0-2.12-2.12C19.5 4.27 12 4.27 12 4.27s-7.5 0-9.38.51A3 3 0 0 0 .5 6.9C0 8.78 0 12 0 12s0 3.22.5 5.1a3 3 0 0 0 2.12 2.12c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 0 0 2.12-2.12C24 15.22 24 12 24 12s0-3.22-.5-5.1zM9.6 15.6V8.4l6.24 3.6z"/></svg> </a>
          <a href="https://www.instagram.com/phcinvest/" target="_blank" rel="noopener noreferrer" aria-label="Pheenyx Capital on Instagram"> <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91a5.9 5.9 0 0 0 1.38 2.13 5.9 5.9 0 0 0 2.13 1.38c.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm7.85-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z"/></svg> </a>
          <a class="btn btn-rust social-call" href="https://calendly.com/pheenyxcapital/30min" target="_blank" rel="noopener noreferrer">Schedule a Call</a>
        </div>
      </div>
      <div>
        <figure class="opp-figure">
          <img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/entrance.jpg" alt="Montrose Berkeley Lake entrance">
        </figure>
        <p class="opp-caption">Duluth, GA 30096</p>
      </div>
    </div>
    <div class="fact-grid">
      <div class="fact-card">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/></svg>
        <div class="k">Total Units</div><div class="v">492</div>
      </div>
      <div class="fact-card">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><rect x="3" y="4" width="18" height="17" rx="1"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
        <div class="k">Year Built</div><div class="v">1988</div>
      </div>
      <div class="fact-card">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M3 3v18h18M7 15l4-5 3 3 5-7"/></svg>
        <div class="k">Occupancy</div><div class="v">94%</div>
      </div>
      <div class="fact-card">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <div class="k">Submarket</div><div class="v">Duluth, GA</div>
      </div>
    </div>
  </div>
</section>

<section class="section section-cream2">
  <div class="wrap">
    <span class="eyebrow eyebrow-green">The Community</span>
    <h2>Amenities, at a glance</h2>
    <div class="amenity-grid">
      <div class="amenity-card"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M2 12h20M4 12v6a1 1 0 001 1h14a1 1 0 001-1v-6M6 12V8a2 2 0 012-2h8a2 2 0 012 2v4"/></svg><span>Resort-Style Pool</span></div>
      <div class="amenity-card"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11M4 4l2.5 2.5M20 4l-2.5 2.5M4 20l2.5-2.5M20 20l-2.5-2.5"/></svg><span>Rogue Fitness Gym</span></div>
      <div class="amenity-card"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M3 21c0-4 4-4 4-8a4 4 0 00-4-4M21 21c0-4-4-4-4-8a4 4 0 014-4M12 21v-7M12 14a4 4 0 100-8 4 4 0 000 8z"/></svg><span>Two Dog Parks</span></div>
      <div class="amenity-card"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M12 2L2 8l10 6 10-6-10-6zM2 16l10 6 10-6M2 12l10 6 10-6"/></svg><span>1-Acre Lake &amp; Dock</span></div>
      <div class="amenity-card"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg><span>Turf Soccer Field</span></div>
      <div class="amenity-card"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6"/></svg><span>Clubhouse &amp; Business Ctr.</span></div>
      <div class="amenity-card"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><rect x="3" y="11" width="18" height="10" rx="1"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg><span>Package Service</span></div>
      <div class="amenity-card"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M2 8.5a15 15 0 0120 0M5 12a10 10 0 0114 0M8.5 15.5a5 5 0 017 0M12 19h.01"/></svg><span>Google Fiber Internet</span></div>
      <div class="amenity-card"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M12 2L4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z"/></svg><span>Outdoor Grilling Stations</span></div>
      <div class="amenity-card"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><path d="M12 21s-7-4.5-7-10a7 7 0 0114 0c0 5.5-7 10-7 10z"/><circle cx="12" cy="11" r="2.5"/></svg><span>Walking Trails</span></div>
    </div>
  </div>
</section>

<section class="section" id="sponsor">
  <div class="wrap">
    <span class="eyebrow eyebrow-rust">Who You're Investing With</span>
    <h2>Disciplined analysis, hands-on oversight.</h2>
    <div class="firm-grid">
      <div class="firm-copy">
        <p>Pheenyx Capital is a real estate firm focused on stable, well-positioned multifamily assets in growing U.S. markets.</p>
        <p>We apply disciplined analysis and hands-on oversight to protect capital and support long-term value.</p>
        <p>We serve busy professionals &mdash; especially physicians &mdash; who want access to institutional-quality real estate without the work of managing it.</p>
      </div>
      <div class="yt" data-yt="R0tQQBO8pgo">
        <button class="yt__btn" type="button"
                aria-label="Play video: Pheenyx Capital Investment — Rediscover the Joy of Limitless Wealth and Growth">
          <img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/pheenyx-video-cover.jpg" alt="" width="1280" height="720" loading="lazy" decoding="async">
          <span class="yt__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
        </button>
      </div>
    </div>
  </div>
</section>


<section class="section section-navy" id="value-add">
  <div class="wrap">
    <span class="eyebrow eyebrow-rust">Financial Benefits</span>
    <h2>When you invest in Montrose Berkeley Lake, you benefit from</h2>
    <div class="benefit-grid">
      <div class="benefit-card">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <h3>Consistent Cash Flow</h3>
        <p>Quarterly distributions projected</p>
      </div>
      <div class="benefit-card">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
        <h3>Appreciation Potential</h3>
        <p>Value-add strategies in motion</p>
      </div>
      <div class="benefit-card">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
        <h3>Tax Advantages</h3>
        <p>Depreciation, cost segregation</p>
      </div>
      <div class="benefit-card">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-5h6v5"/></svg>
        <h3>Economies of Scale</h3>
        <p>Lower operational costs and higher returns</p>
      </div>
      <div class="benefit-card">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        <h3>Passive Ownership</h3>
        <p>We handle the details, you earn the returns</p>
      </div>
    </div>
    <div class="benefit-actions">
      <a href="#path" class="btn btn-rust">Invest Now</a>
      <a href="#path" class="btn btn-ghost" data-webinar>Register for Webinar</a>
    </div>
  </div>
</section>

<section class="section section-cream2">
  <div class="wrap">
    <span class="eyebrow eyebrow-green">Why This Deal</span>
    <h2>What we looked at before saying yes.</h2>
    <div class="usp-grid">
      <div class="usp-card">
        <div class="tag mono">Rent Growth</div>
        <h3>Backed by comps, not hope</h3>
        <p>Nearby comps show room to push rents even further.</p>
      </div>
      <div class="usp-card">
        <div class="tag mono">Submarket</div>
        <h3>Gwinnett keeps growing</h3>
        <p>Rising population, and every zoned school rated 'A'.</p>
      </div>
      <div class="usp-card">
        <div class="tag mono">Employment</div>
        <h3>Jobs are minutes away</h3>
        <p>Close to major employers across tech, industrial, and healthcare.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="gallery">
  <div class="wrap">
    <span class="eyebrow eyebrow-rust">See It In Photos</span>
    <h2>Life at Montrose Berkeley Lake</h2>
    <p class="lede">The amenities, the grounds, and the units &mdash; as they stand today.</p>
  </div>
  <div class="gallery-marquee">
      <div class="marquee marquee--left">
        <div class="marquee__track">
          <div class="marquee__set">
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/pool.jpg" alt="Resort-Style Pool" loading="lazy" decoding="async"><figcaption>Resort-Style Pool</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-extWeb-118.jpg" alt="Pool Deck and Grill Stations" loading="lazy" decoding="async"><figcaption>Pool Deck &amp; Grill Stations</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/lake-dock.jpg" alt="1-Acre Lake and Dock" loading="lazy" decoding="async"><figcaption>1-Acre Lake &amp; Dock</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-extWeb-103.jpg" alt="Turf Soccer Field" loading="lazy" decoding="async"><figcaption>Turf Soccer Field</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/clubhouse.jpg" alt="Clubhouse and Business Center" loading="lazy" decoding="async"><figcaption>Clubhouse &amp; Business Center</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-extWeb-88.jpg" alt="Grill Patio and Playground" loading="lazy" decoding="async"><figcaption>Grill Patio &amp; Playground</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-extWeb-83.jpg" alt="Pool and Sundeck" loading="lazy" decoding="async"><figcaption>Pool &amp; Sundeck</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gym.jpg" alt="Rogue Fitness Gym" loading="lazy" decoding="async"><figcaption>Rogue Fitness Gym</figcaption></figure>
          </div>
          <div class="marquee__set" aria-hidden="true">
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/pool.jpg" alt="Resort-Style Pool" loading="lazy" decoding="async"><figcaption>Resort-Style Pool</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-extWeb-118.jpg" alt="Pool Deck and Grill Stations" loading="lazy" decoding="async"><figcaption>Pool Deck &amp; Grill Stations</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/lake-dock.jpg" alt="1-Acre Lake and Dock" loading="lazy" decoding="async"><figcaption>1-Acre Lake &amp; Dock</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-extWeb-103.jpg" alt="Turf Soccer Field" loading="lazy" decoding="async"><figcaption>Turf Soccer Field</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/clubhouse.jpg" alt="Clubhouse and Business Center" loading="lazy" decoding="async"><figcaption>Clubhouse &amp; Business Center</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-extWeb-88.jpg" alt="Grill Patio and Playground" loading="lazy" decoding="async"><figcaption>Grill Patio &amp; Playground</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-extWeb-83.jpg" alt="Pool and Sundeck" loading="lazy" decoding="async"><figcaption>Pool &amp; Sundeck</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gym.jpg" alt="Rogue Fitness Gym" loading="lazy" decoding="async"><figcaption>Rogue Fitness Gym</figcaption></figure>
          </div>
        </div>
      </div>
      <div class="marquee marquee--right">
        <div class="marquee__track">
          <div class="marquee__set">
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-2brWeb-1.jpg" alt="Living Room with Fireplace" loading="lazy" decoding="async"><figcaption>Living Room with Fireplace</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-2brWeb-5.jpg" alt="Two-Bedroom Living Area" loading="lazy" decoding="async"><figcaption>Two-Bedroom Living Area</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-2brWeb-9.jpg" alt="Dining and Kitchen" loading="lazy" decoding="async"><figcaption>Dining &amp; Kitchen</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-2brWeb-17.jpg" alt="Primary Bedroom" loading="lazy" decoding="async"><figcaption>Primary Bedroom</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-2brWeb-19.jpg" alt="Second Bedroom" loading="lazy" decoding="async"><figcaption>Second Bedroom</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-fcWeb-2.jpg" alt="Fitness Center" loading="lazy" decoding="async"><figcaption>Fitness Center</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-fcWeb-4.jpg" alt="Rogue Strength Equipment" loading="lazy" decoding="async"><figcaption>Rogue Strength Equipment</figcaption></figure>
          </div>
          <div class="marquee__set" aria-hidden="true">
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-2brWeb-1.jpg" alt="Living Room with Fireplace" loading="lazy" decoding="async"><figcaption>Living Room with Fireplace</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-2brWeb-5.jpg" alt="Two-Bedroom Living Area" loading="lazy" decoding="async"><figcaption>Two-Bedroom Living Area</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-2brWeb-9.jpg" alt="Dining and Kitchen" loading="lazy" decoding="async"><figcaption>Dining &amp; Kitchen</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-2brWeb-17.jpg" alt="Primary Bedroom" loading="lazy" decoding="async"><figcaption>Primary Bedroom</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-2brWeb-19.jpg" alt="Second Bedroom" loading="lazy" decoding="async"><figcaption>Second Bedroom</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-fcWeb-2.jpg" alt="Fitness Center" loading="lazy" decoding="async"><figcaption>Fitness Center</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-fcWeb-4.jpg" alt="Rogue Strength Equipment" loading="lazy" decoding="async"><figcaption>Rogue Strength Equipment</figcaption></figure>
          </div>
        </div>
      </div>
      <div class="marquee marquee--left marquee--slow">
        <div class="marquee__track">
          <div class="marquee__set">
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/Cedarwood-Two-Bedroom-1125-sqft-Kitchen.jpg" alt="Renovated Kitchen" loading="lazy" decoding="async"><figcaption>Renovated Kitchen</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/Cedarwood-Two-Bedroom-1125-sqft-Bathroom.jpg" alt="Renovated Bath" loading="lazy" decoding="async"><figcaption>Renovated Bath</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/Cedarwood-Two-Bedroom-1125-sqft-Unfurnished.jpg" alt="Cedarwood Living Area" loading="lazy" decoding="async"><figcaption>Cedarwood Living Area</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/Cedarwood-Two-Bedroom-1125-sqft-Unfurnished-1.jpg" alt="Cedarwood Bedroom" loading="lazy" decoding="async"><figcaption>Cedarwood Bedroom</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/Cedarwood-Two-Bedroom-1125-sqft-05192022_084907.jpg" alt="Cedarwood 2BR - 1,125 SF" loading="lazy" decoding="async"><figcaption>Cedarwood 2BR &middot; 1,125 SF</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-plWeb-2.jpg" alt="Package Lockers" loading="lazy" decoding="async"><figcaption>Package Lockers</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/turf-field.jpg" alt="Playground and Turf Field" loading="lazy" decoding="async"><figcaption>Playground &amp; Turf Field</figcaption></figure>
          </div>
          <div class="marquee__set" aria-hidden="true">
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/Cedarwood-Two-Bedroom-1125-sqft-Kitchen.jpg" alt="Renovated Kitchen" loading="lazy" decoding="async"><figcaption>Renovated Kitchen</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/Cedarwood-Two-Bedroom-1125-sqft-Bathroom.jpg" alt="Renovated Bath" loading="lazy" decoding="async"><figcaption>Renovated Bath</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/Cedarwood-Two-Bedroom-1125-sqft-Unfurnished.jpg" alt="Cedarwood Living Area" loading="lazy" decoding="async"><figcaption>Cedarwood Living Area</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/Cedarwood-Two-Bedroom-1125-sqft-Unfurnished-1.jpg" alt="Cedarwood Bedroom" loading="lazy" decoding="async"><figcaption>Cedarwood Bedroom</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/Cedarwood-Two-Bedroom-1125-sqft-05192022_084907.jpg" alt="Cedarwood 2BR - 1,125 SF" loading="lazy" decoding="async"><figcaption>Cedarwood 2BR &middot; 1,125 SF</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/gallery/mlb-plWeb-2.jpg" alt="Package Lockers" loading="lazy" decoding="async"><figcaption>Package Lockers</figcaption></figure>
          <figure><img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/turf-field.jpg" alt="Playground and Turf Field" loading="lazy" decoding="async"><figcaption>Playground &amp; Turf Field</figcaption></figure>
          </div>
        </div>
      </div>
  </div>
</section>

<section class="section section-cream2" id="ceo">
  <div class="wrap">
    <span class="eyebrow eyebrow-rust">Meet The CEO</span>
    <div class="ceo-grid">
      <figure class="ceo-photo">
        <img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/dr-nkem-ezeamama.jpg" alt="Dr. Nkem Ezeamama, CEO and Founder of Pheenyx Capital"
             width="1105" height="979" loading="lazy" decoding="async">
      </figure>
      <div>
        <div class="ceo-role">CEO &amp; Founder</div>
        <div class="ceo-name">Dr. Nkem Ezeamama</div>
        <div class="ceo-bio">
          <p>Dr. Nkem Ezeamama's path into real estate is anything but traditional, yet it's exactly what makes her one of the most disciplined and trusted operators in her space.</p>
          <p>As a physician who built her investment career from scratch, she understands the demands of high-earning professionals who want to grow wealth without sacrificing their time, identity, or peace of mind.</p>
          <p>She built Pheenyx Capital for people like her &mdash; driven individuals who want access to institutional-quality investments without navigating the complexity alone.</p>
          <p>Grounded in integrity, shaped by resilience, and backed by real results.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-navy" id="testimonials">
  <div class="wrap">
    <span class="eyebrow">What Investors Say</span>
    <h2>Trusted by 150+ investors who believe in what we do</h2>
    <p class="lede stone-text">Professionals across healthcare, business, and leadership trust Pheenyx Capital to guide their real estate investments with clarity, discipline, and care.</p>
    <div class="quote-grid">

      <figure class="quote-card">
        <div class="mark" aria-hidden="true">&ldquo;</div>
        <blockquote>I had never invested in real estate before. Hearing Dr. Nkem speak gave me clarity and confidence. Her honesty and deep knowledge made the decision feel grounded, not rushed and I&rsquo;ve been glad I took that step.</blockquote>
        <figcaption class="quote-who">
          <span class="quote-avatar" aria-hidden="true">RB</span>
          <span>
            <span class="n">Dr. Ritha Belizaire, MD</span>
            <span class="r">Colorectal Surgeon</span>
          </span>
        </figcaption>
      </figure>

      <figure class="quote-card">
        <div class="mark" aria-hidden="true">&ldquo;</div>
        <blockquote>As a surgeon, my time is limited. Pheenyx Capital helped me build wealth beyond my medical career, with a strategy rooted in trust, clarity, and long-term vision.</blockquote>
        <figcaption class="quote-who">
          <span class="quote-avatar" aria-hidden="true">BV</span>
          <span>
            <span class="n">Dr. Benjamin Vabi</span>
            <span class="r">Colorectal &amp; General Surgeon</span>
          </span>
        </figcaption>
      </figure>

      <figure class="quote-card">
        <div class="mark" aria-hidden="true">&ldquo;</div>
        <blockquote>Pheenyx Capital understands the demands of my profession. They guided me through real estate investing with patience and clarity, making the process straightforward and aligned with my long-term goals.</blockquote>
        <figcaption class="quote-who">
          <span class="quote-avatar" aria-hidden="true">PJ</span>
          <span>
            <span class="n">Dr. Paul Johnson</span>
            <span class="r">Colon &amp; Rectal Surgeon</span>
          </span>
        </figcaption>
      </figure>

      <figure class="quote-card">
        <div class="mark" aria-hidden="true">&ldquo;</div>
        <blockquote>The team at Pheenyx Capital understands healthcare professionals. Their approach to multifamily investing is thoughtful, well-explained, and built for people who want growth without added stress.</blockquote>
        <figcaption class="quote-who">
          <span class="quote-avatar" aria-hidden="true">AH</span>
          <span>
            <span class="n">Dr. Andrew Harrison</span>
            <span class="r">Emergency Medicine</span>
          </span>
        </figcaption>
      </figure>

      <figure class="quote-card">
        <div class="mark" aria-hidden="true">&ldquo;</div>
        <blockquote>Pheenyx Capital simplified real estate investing for me. They removed the complexity, explained the strategy clearly, and helped me invest with confidence in a tangible, long-term asset.</blockquote>
        <figcaption class="quote-who">
          <span class="quote-avatar" aria-hidden="true">AO</span>
          <span>
            <span class="n">Abigail Okeh</span>
            <span class="r">CEO</span>
          </span>
        </figcaption>
      </figure>

      <figure class="quote-card">
        <div class="mark" aria-hidden="true">&ldquo;</div>
        <blockquote>As an investor with Pheenyx Capital Investment, I value its disciplined, physician-led approach to multifamily investing, offering busy professionals transparent opportunities, strong education, and a community focused on long-term, sustainable wealth creation.</blockquote>
        <figcaption class="quote-who">
          <span class="quote-avatar" aria-hidden="true">PI</span>
          <span>
            <span class="n">U. Phillip Igbinadolor, DMD</span>
            <span class="r">Dentist</span>
          </span>
        </figcaption>
      </figure>

    </div>
  </div>
</section>

<section class="section section-cream2" id="press">
  <div class="wrap">
    <span class="eyebrow eyebrow-rust">In The Press</span>
    <h2>Covered by the outlets our investors read.</h2>
    <p class="lede">Independent coverage of Pheenyx Capital and Dr. Nkem Ezeamama, plus the stages she speaks from.</p>
  </div>
  <div class="rail">
    <div class="rail__track">
      <div class="rail__set">
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async">
              <span class="pcard__kind">Feature</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">How Pheenyx Capital Redefines Wealth for High Achievers</h3>
              <p class="pcard__excerpt">There's a quiet irony in success that few people talk about. The more accomplished you become, the less time you often have to enjoy it.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">November 2025</span>
              <button class="pcard__btn" type="button" data-press="usanews">Preview</button>
            </div>
          </article>
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async">
              <span class="pcard__kind">Feature</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">How Pheenyx Capital Helps High Achievers Build Wealth That Works for Them</h3>
              <p class="pcard__excerpt">In a world where professional success often comes at the cost of personal freedom, Dr. Nkem Ezeamama's story stands out as both a reflection and a rebellion.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">18 November 2025</span>
              <button class="pcard__btn" type="button" data-press="ceotimes">Preview</button>
            </div>
          </article>
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs-knockout.png" alt="SoMeDocs" loading="lazy" decoding="async">
              <span class="pcard__kind is-talk">Speaking</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">Freedom Through Ownership</h3>
              <p class="pcard__excerpt">Dr. Nkem Ezeamama presents at the SoMeDocs conference on Finances, Investing &amp; Real Estate for Healthcare Professionals.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">#SoMeDocsInvesting</span>
              <button class="pcard__btn" type="button" data-press="somedocs">Preview</button>
            </div>
          </article>
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async">
              <span class="pcard__kind">Feature</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">How Pheenyx Capital Redefines Wealth for High Achievers</h3>
              <p class="pcard__excerpt">There's a quiet irony in success that few people talk about. The more accomplished you become, the less time you often have to enjoy it.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">November 2025</span>
              <button class="pcard__btn" type="button" data-press="usanews">Preview</button>
            </div>
          </article>
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async">
              <span class="pcard__kind">Feature</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">How Pheenyx Capital Helps High Achievers Build Wealth That Works for Them</h3>
              <p class="pcard__excerpt">In a world where professional success often comes at the cost of personal freedom, Dr. Nkem Ezeamama's story stands out as both a reflection and a rebellion.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">18 November 2025</span>
              <button class="pcard__btn" type="button" data-press="ceotimes">Preview</button>
            </div>
          </article>
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs-knockout.png" alt="SoMeDocs" loading="lazy" decoding="async">
              <span class="pcard__kind is-talk">Speaking</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">Freedom Through Ownership</h3>
              <p class="pcard__excerpt">Dr. Nkem Ezeamama presents at the SoMeDocs conference on Finances, Investing &amp; Real Estate for Healthcare Professionals.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">#SoMeDocsInvesting</span>
              <button class="pcard__btn" type="button" data-press="somedocs">Preview</button>
            </div>
          </article>
      </div>
      <div class="rail__set" aria-hidden="true">
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async">
              <span class="pcard__kind">Feature</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">How Pheenyx Capital Redefines Wealth for High Achievers</h3>
              <p class="pcard__excerpt">There's a quiet irony in success that few people talk about. The more accomplished you become, the less time you often have to enjoy it.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">November 2025</span>
              <button class="pcard__btn" type="button" data-press="usanews">Preview</button>
            </div>
          </article>
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async">
              <span class="pcard__kind">Feature</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">How Pheenyx Capital Helps High Achievers Build Wealth That Works for Them</h3>
              <p class="pcard__excerpt">In a world where professional success often comes at the cost of personal freedom, Dr. Nkem Ezeamama's story stands out as both a reflection and a rebellion.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">18 November 2025</span>
              <button class="pcard__btn" type="button" data-press="ceotimes">Preview</button>
            </div>
          </article>
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs-knockout.png" alt="SoMeDocs" loading="lazy" decoding="async">
              <span class="pcard__kind is-talk">Speaking</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">Freedom Through Ownership</h3>
              <p class="pcard__excerpt">Dr. Nkem Ezeamama presents at the SoMeDocs conference on Finances, Investing &amp; Real Estate for Healthcare Professionals.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">#SoMeDocsInvesting</span>
              <button class="pcard__btn" type="button" data-press="somedocs">Preview</button>
            </div>
          </article>
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/usa-news.png" alt="USA News" loading="lazy" decoding="async">
              <span class="pcard__kind">Feature</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">How Pheenyx Capital Redefines Wealth for High Achievers</h3>
              <p class="pcard__excerpt">There's a quiet irony in success that few people talk about. The more accomplished you become, the less time you often have to enjoy it.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">November 2025</span>
              <button class="pcard__btn" type="button" data-press="usanews">Preview</button>
            </div>
          </article>
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/ceotimes.png" alt="CEO Times" loading="lazy" decoding="async">
              <span class="pcard__kind">Feature</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">How Pheenyx Capital Helps High Achievers Build Wealth That Works for Them</h3>
              <p class="pcard__excerpt">In a world where professional success often comes at the cost of personal freedom, Dr. Nkem Ezeamama's story stands out as both a reflection and a rebellion.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">18 November 2025</span>
              <button class="pcard__btn" type="button" data-press="ceotimes">Preview</button>
            </div>
          </article>
          <article class="pcard">
            <div class="pcard__top">
              <img class="pcard__logo" src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/press/somedocs-knockout.png" alt="SoMeDocs" loading="lazy" decoding="async">
              <span class="pcard__kind is-talk">Speaking</span>
            </div>
            <div class="pcard__body">
              <h3 class="pcard__title">Freedom Through Ownership</h3>
              <p class="pcard__excerpt">Dr. Nkem Ezeamama presents at the SoMeDocs conference on Finances, Investing &amp; Real Estate for Healthcare Professionals.</p>
            </div>
            <div class="pcard__foot">
              <span class="pcard__date">#SoMeDocsInvesting</span>
              <button class="pcard__btn" type="button" data-press="somedocs">Preview</button>
            </div>
          </article>
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
</div>

<section class="path-band" id="path">
  <div class="wrap path-inner">
    <div>
      <span class="eyebrow">Path to Invest</span>
      <h2>Get to know the deal before you commit.</h2>
      <p>Every two weeks, we walk through a different part of the deal, at your own pace.</p>
      <a href="#path" class="btn btn-ghost" data-webinar>See the full webinar schedule</a>
    </div>
    <div class="webinar-card">
      <span class="eyebrow mono">Webinar 1 · The Reveal</span>
      <h3>THE BIG REVEAL: Meet Our Biggest Deal Yet</h3>
      <p>A closer look at the property, location, numbers, and business plan behind Montrose Berkeley Lake.</p>
      <div class="webinar-date mono">Tuesday, August 18, 2026</div>
      <br>
      <a href="#path" class="btn btn-rust" data-webinar>Reserve Your Spot</a>
    </div>
  </div>
</section>

<section id="final-cta">
  <div class="wrap inner">
    <span class="eyebrow">Limited Allocation</span>
    <h2>The Deal You've Been <span class="italic">Waiting For.</span></h2>
    <div class="final-actions">
      <a href="#path" class="btn btn-rust" data-webinar>Reserve Your Spot</a>
      <a href="https://calendly.com/pheenyxcapital/30min" class="btn btn-ghost"
         target="_blank" rel="noopener noreferrer">Schedule a Call</a>
    </div>
  </div>
</section>

<div id="sticky-cta">
  <div class="wrap">
    <div class="info">
      <span class="name">THE BIG REVEAL: Meet Our Biggest Deal Yet</span>
      <span class="stat">Tuesday, August 18, 2026</span>
    </div>
    <div class="actions">
      <button class="btn btn-ghost cta-count" type="button" data-webinar>
        <span class="cta-count__k">Webinar in</span>
        <span class="cta-count__v" id="wb-countdown">&mdash;</span>
      </button>
      <a href="#path" class="btn btn-rust cta-reserve" data-webinar>Reserve Your Spot</a>
    </div>
  </div>
</div>

<div class="wmodal" id="webinar-modal" role="dialog" aria-modal="true" aria-label="Join the webinar" hidden>
  <div class="wmodal__scrim" data-wclose></div>
  <div class="wmodal__panel">
    <button class="wmodal__close" type="button" data-wclose aria-label="Close webinar">&times;</button>
    <div class="wmodal__frame" id="webinar-frame"></div>
  </div>
</div>

<footer>
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="https://cdn.jsdelivr.net/gh/Vicepp/Montrose-Berkeley-Lake-Landing-Page@main/images/pheenyx-logo.png" alt="Pheenyx Capital">
        <div class="mono" style="font-size:12px; color:#5c6480;">Multifamily Investments</div>
      </div>
      <div class="footer-links">
        <div>
          <div class="h">Page</div>
          <a href="#opportunity">Opportunity</a>
          <a href="#value-add">Value-Add</a>
        </div>
        <div>
          <div class="h">Contact</div>
          <a href="mailto:info@phcinvest.com">info@phcinvest.com</a>
          <a href="tel:+16158238262">(615) 823-8262</a>
          <a href="https://phcinvest.com" target="_blank" rel="noopener noreferrer">www.phcinvest.com</a>
        </div>
      </div>
    </div>
      <div class="social-row social-row--footer">
        <a href="https://www.linkedin.com/company/phcinvest/" target="_blank" rel="noopener noreferrer" aria-label="Pheenyx Capital on LinkedIn"> <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21H9z"/></svg> </a>
        <a href="https://www.facebook.com/phcinvest" target="_blank" rel="noopener noreferrer" aria-label="Pheenyx Capital on Facebook"> <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg> </a>
        <a href="https://www.youtube.com/@Phcinvest" target="_blank" rel="noopener noreferrer" aria-label="Pheenyx Capital on YouTube"> <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.9a3 3 0 0 0-2.12-2.12C19.5 4.27 12 4.27 12 4.27s-7.5 0-9.38.51A3 3 0 0 0 .5 6.9C0 8.78 0 12 0 12s0 3.22.5 5.1a3 3 0 0 0 2.12 2.12c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 0 0 2.12-2.12C24 15.22 24 12 24 12s0-3.22-.5-5.1zM9.6 15.6V8.4l6.24 3.6z"/></svg> </a>
        <a href="https://www.instagram.com/phcinvest/" target="_blank" rel="noopener noreferrer" aria-label="Pheenyx Capital on Instagram"> <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91a5.9 5.9 0 0 0 1.38 2.13 5.9 5.9 0 0 0 2.13 1.38c.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm7.85-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z"/></svg> </a>
        <a class="btn btn-rust social-call" href="https://calendly.com/pheenyxcapital/30min" target="_blank" rel="noopener noreferrer">Schedule a Call</a>
      </div>
    </div>
</footer>`

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
            <style>{`.mbl-root[data-hide-sticky="true"] #sticky-cta{display:none;}`}</style>
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

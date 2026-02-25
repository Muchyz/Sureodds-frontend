import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./About.css";

const PRESS = [
  { name:"Financial Times", abbr:"FT" },
  { name:"ESPN",            abbr:"ESPN" },
  { name:"The Athletic",    abbr:"TA" },
  { name:"Sky Sports",      abbr:"SS" },
  { name:"BBC Sport",       abbr:"BBC" },
];

/* ─────────────────────────────────────────────
   SCRAMBLE HOOK
───────────────────────────────────────────── */
function useScramble(target, active, decimals = 0) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!active) return;
    const dur = 2000;
    const start = performance.now();
    const chars = "0123456789";
    const run = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      if (t < 0.7) {
        // scramble phase
        const scrambled = Array.from({ length: String(Math.round(target)).length }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join("");
        setVal(parseFloat(scrambled) || 0);
      } else {
        // settle phase
        const current = +(ease * target).toFixed(decimals);
        setVal(current);
      }
      if (t < 1) raf.current = requestAnimationFrame(run);
      else setVal(target);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, decimals]);
  return val;
}

/* ─────────────────────────────────────────────
   COUNTDOWN HOOK  (next pick in ~2h14m from load)
───────────────────────────────────────────── */
function useCountdown(totalSeconds) {
  const [secs, setSecs] = useState(totalSeconds);
  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return { h, m, s };
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function About() {
  const [heroLoaded,     setHeroLoaded]     = useState(false);
  const [statsVisible,   setStatsVisible]   = useState(false);
  const [barsVisible,    setBarsVisible]    = useState(false);
  const [pillarsVisible, setPillarsVisible] = useState(false);
  const [scrollPct,      setScrollPct]      = useState(0);
  const [mousePos,       setMousePos]       = useState({ x: 0, y: 0 });

  const statsRef   = useRef(null);
  const barsRef    = useRef(null);
  const pillarsRef = useRef(null);
  const cursorRef  = useRef(null);

  const s1 = useScramble(97,  statsVisible, 0);
  const s2 = useScramble(10,  statsVisible, 1);
  const s3 = useScramble(4.9, statsVisible, 1);
  const s4 = useScramble(15,  statsVisible, 0);

  const countdown = useCountdown(8078); // 2h14m38s

  /* scroll progress */
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setScrollPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* mouse parallax */
  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* intersection observers */
  useEffect(() => {
    setHeroLoaded(true);
    const mkObs = (ref, cb, threshold = 0.2) => {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) cb(); }, { threshold });
      if (ref.current) obs.observe(ref.current);
      return obs;
    };
    const o1 = mkObs(statsRef,   () => setStatsVisible(true),   0.3);
    const o2 = mkObs(barsRef,    () => setBarsVisible(true),    0.2);
    const o3 = mkObs(pillarsRef, () => setPillarsVisible(true), 0.1);
    return () => [o1, o2, o3].forEach(o => o.disconnect());
  }, []);

  const orbStyle = (factor) => ({
    transform: `translate(${mousePos.x * factor}px, ${mousePos.y * factor}px)`,
    transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
  });

  const LEAGUES  = ["Premier League","La Liga","Champions League","Serie A","Bundesliga","Ligue 1","MLS","Eredivisie","Primeira Liga","Ligue 1"];
  const METRICS  = [
    { label:"Win Rate",         value:"100%",   pct:100, color:"#c8f542" },
    { label:"Closing Line Value",value:"+3.2%", pct:78, color:"#42f5c8" },
    { label:"Average Odds",     value:"300+ odds  per ticket",  pct:71, color:"#c8f542" },
    { label:"Monthly ROI",      value:"+100%", pct:84, color:"#42f5c8" },
    { label:"Sharp Money Align",value:"81%",   pct:81, color:"#c8f542" },
    { label:"Model Confidence", value:"High",  pct:90, color:"#42f5c8" },
  ];
  const PILLARS  = [
    { n:"01", title:"Quantitative Modeling",  tag:"Machine Learning",   body:"Proprietary algorithms process thousands of data points per fixture — xG, form, fatigue indices, weather, and referee tendencies — surfacing genuine value before markets adjust." },
    { n:"02", title:"Market Intelligence",    tag:"Real-time Data",     body:"Real-time odds tracking across 30+ books. We identify sharp money, steam moves, and reverse line movement — acted on before retail bettors can react.", featured:true },
    { n:"03", title:"Bankroll Discipline",    tag:"Risk Management",    body:"Kelly-criterion staking and variance-aware frameworks protect your capital. Long-term edge only compounds when your bankroll survives the inevitable swings." },
  ];

  return (
    <div className="mo__page">
      {/* ── CURSOR ── */}
      <div className="mo__cursor" ref={cursorRef} />

      {/* ── SCROLL PROGRESS ── */}
      <div className="mo__progress-bar">
        <div className="mo__progress-fill" style={{ width: `${scrollPct}%` }} />
      </div>

      {/* ── NAV ── */}
      <nav className="mo__nav">
        <div className="mo__nav-inner">
          <Link to="/" className="mo__logo">
            <div className="mo__logo-mark">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 13H1L8 1Z" fill="#c8f542"/>
                <path d="M8 6L11 13H5L8 6Z" fill="#080808"/>
              </svg>
            </div>
            <span>Mega<b>Odds</b></span>
          </Link>
          <div className="mo__nav-links">
            <Link to="/about">About</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/results">Results</Link>
          </div>
          <div className="mo__nav-actions">
            <Link to="/login" className="mo__nav-ghost">Sign in</Link>
            <Link to="/signup" className="mo__nav-cta">
              Get started
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="mo__hero">
        <div className="mo__hero-grain" />
        {/* Diagonal split — green right panel */}
        <div className="mo__hero-split" style={orbStyle(8)} />

        <div className="mo__hero-inner">
          {/* Left — dark side */}
          <div className={`mo__hero-copy ${heroLoaded ? "mo__hero-copy--in" : ""}`}>

            {/* Eyebrow with live indicator */}
            <div className="mo__hero-eyebrow">
              <span className="mo__hero-dot" />
              <span>Est. 2019</span>
              <span className="mo__hero-eyebrow-div">·</span>
              <span>10,000+ Members</span>
              <span className="mo__hero-eyebrow-div">·</span>
              <span>5yr Track Record</span>
            </div>

            {/* Mixed-size editorial headline */}
            <h1 className="mo__hero-h1">
              <span className="mo__h1-small">Fixed Matches</span>
              <span className="mo__h1-big">MEGA</span>
              <span className="mo__h1-row">
                <span className="mo__h1-big mo__h1-outline">ODDS.</span>
                <span className="mo__h1-tag">+100.00% ROI</span>
              </span>
            </h1>

            <p className="mo__hero-lead">
              Quantitative models built on xG, market movement, and sharp money signals...........................
              We provide verified first half correct scores.
            </p>

            {/* Countdown inline */}
            <div className="mo__countdown">
              <div className="mo__countdown-pulse" />
              <span className="mo__countdown-label">Next scan</span>
              <div className="mo__countdown-timer">
                <span className="mo__countdown-digit">{countdown.h}</span>
                <span className="mo__countdown-sep">:</span>
                <span className="mo__countdown-digit">{countdown.m}</span>
                <span className="mo__countdown-sep">:</span>
                <span className="mo__countdown-digit">{countdown.s}</span>
              </div>
            </div>

            <div className="mo__hero-actions">
              <Link to="/learn" className="mo__btn-primary ">
                What's FIXED MATCHES 
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link to="/testimonials" className="mo__btn-ghost">Members reviews</Link>
            </div>

            <div className="mo__hero-proof">
              {["Sure games","verified before","24/7 updates"].map((t,i)=>(
                <span key={i} className="mo__proof-item">
                  <span className="mo__proof-dot" />{t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — green side dashboard */}
          <div className={`mo__hero-right ${heroLoaded ? "mo__hero-right--in" : ""}`}>

            {/* Big ROI number — grid-breaking */}
            <div className="mo__hero-roi-block">
              <span className="mo__hero-roi-num">+52.4</span>
              <span className="mo__hero-roi-pct">%</span>
              <span className="mo__hero-roi-label">90-day ROI</span>
            </div>

            {/* Live pick card */}
            <div className="mo__hcard mo__hcard-main">
              <div className="mo__hcard-label">
                <span className="mo__live-dot" />
                Live Pick · UCL
              </div>
              <div className="mo__hcard-match">
                <div className="mo__hcard-team">
                  <div className="mo__hcard-badge mo__hcard-badge--blue">PSG</div>
                  <span>Paris SG</span>
                </div>
                <div className="mo__hcard-vs">vs</div>
                <div className="mo__hcard-team mo__hcard-team-r">
                  <div className="mo__hcard-badge mo__hcard-badge--red">ATM</div>
                  <span>Atlético</span>
                </div>
              </div>
              <div className="mo__hcard-metrics">
                {[
                  { v:"+2.15", k:"Odds" },
                  { v:"AH −0.5", k:"Market" },
                  { v:"+EV", k:"Rating", green:true },
                ].map((m,i)=>(
                  <div key={i} className={`mo__hcard-metric ${m.green ? "mo__hcard-metric--ev" : ""}`}>
                    <span className="mo__hcard-metric-v">{m.v}</span>
                    <span className="mo__hcard-metric-k">{m.k}</span>
                    {i < 2 && <div className="mo__hcard-metric-div"/>}
                  </div>
                ))}
              </div>
            </div>

            {/* Inline win-rate mini bars */}
            <div className="mo__hero-minibars">
              {[
                { l:"Win Rate", v:"63%", w:63 },
                { l:"CLV", v:"+3.2%", w:78 },
                { l:"Sharp Align", v:"81%", w:81 },
              ].map((b,i)=>(
                <div key={i} className="mo__hero-minibar">
                  <span className="mo__hero-minibar-l">{b.l}</span>
                  <div className="mo__hero-minibar-track">
                    <div className="mo__hero-minibar-fill" style={{"--mo-w":b.w+"%","--mo-d":i*0.1+"s"}} />
                  </div>
                  <span className="mo__hero-minibar-v">{b.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom marquee strip */}
        <div className="mo__hero-strip">
          {[
            {label:"Win Rate",val:"100%"},
            {label:"Closing Line Value",val:"+3.2%"},
            {label:"Monthly ROI",val:"+8.4%"},
            {label:"Avg Odds",val:"1.94"},
            {label:"Sharp Alignment",val:"81%"},
            {label:"Track Record",val:"5 years"},
          ].map((s,i)=>(
            <div key={i} className="mo__strip-item">
              <span className="mo__strip-label">{s.label}</span>
              <span className="mo__strip-val">{s.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRESS STRIP ── */}
      <section className="mo__press">
        <span className="mo__press-label">As seen in</span>
        <div className="mo__press-logos">
          {PRESS.map((p,i)=>(
            <div key={i} className="mo__press-logo">{p.name}</div>
          ))}
        </div>
      </section>

      {/* ── STATS (scramble) ── */}
      <section className="mo__stats" ref={statsRef}>
        <div className="mo__stats-inner">
          {[
            { n:s1, sfx:"%",  label:"Client retention" },
            { n:s2, sfx:"K+", label:"Active members" },
            { n:s3, sfx:"★",  label:"Member rating" },
            { n:s4, sfx:"+",  label:"Leagues weekly" },
          ].map((s,i)=>(
            <div key={i} className="mo__stat" style={{"--mo-i":i}}>
              <div className="mo__stat-n">{s.n}<span>{s.sfx}</span></div>
              <div className="mo__stat-l">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="mo__ticker">
        <div className="mo__ticker-belt">
          {[...LEAGUES,...LEAGUES,...LEAGUES].map((l,i)=>(
            <span key={i} className="mo__ticker-item">
              <span className="mo__ticker-dot">◆</span>{l}
            </span>
          ))}
        </div>
      </div>

      {/* ── PERFORMANCE BARS ── */}
      <section className="mo__perf" ref={barsRef}>
        <div className="mo__perf-inner">
          <div className="mo__perf-left">
            <p className="mo__section-label">Verified performance</p>
            <h2 className="mo__section-h">
              Numbers that<br /><em>speak for<br />themselves.</em>
            </h2>
            <p className="mo__section-sub">
              Every metric is derived from publicly published monthly P&L reports. No cherry-picked windows. No omitted losses. Full transparency .
            </p>
            <div className="mo__perf-tags">
              {["Full P&L monthly","All games are fixed","sourced by confidential agents"].map((t,i)=>(
                <span key={i} className="mo__perf-tag">{t}</span>
              ))}
            </div>
          </div>
          <div className="mo__perf-right">
            {METRICS.map((m,i)=>(
              <div key={i} className="mo__mbar">
                <div className="mo__mbar-head">
                  <span className="mo__mbar-label">{m.label}</span>
                  <span className="mo__mbar-val" style={{color:m.color}}>{m.value}</span>
                </div>
                <div className="mo__mbar-track">
                  <div
                    className={`mo__mbar-fill ${barsVisible ? "mo__mbar-fill--on" : ""}`}
                    style={{"--mo-w":m.pct+"%","--mo-c":m.color,"--mo-d":i*0.1+"s"}}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="mo__pillars" ref={pillarsRef}>
        <div className="mo__pillars-top">
          <p className="mo__section-label">Our methodology</p>
          <h2 className="mo__section-h mo__section-h--c">
            Three pillars of<br /><em>professional verification</em>
          </h2>
        </div>
        <div className="mo__pillars-grid">
          {PILLARS.map((p,i)=>(
            <div
              key={i}
              className={`mo__pillar ${p.featured?"mo__pillar--featured":""} ${pillarsVisible?"mo__pillar--in":""}`}
              style={{"--mo-d":i*0.15+"s"}}
            >
              <div className="mo__pillar-top">
                <span className="mo__pillar-n">{p.n}</span>
                <span className="mo__pillar-tag">{p.tag}</span>
              </div>
              <h3 className="mo__pillar-title">{p.title}</h3>
              <p className="mo__pillar-body">{p.body}</p>
              <div className="mo__pillar-arrow">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 6l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="mo__features">
        <div className="mo__features-inner">
          <div className="mo__features-header">
            <p className="mo__section-label">Why Mega-Odds</p>
            <h2 className="mo__section-h">Everything you<br />need to win.</h2>
          </div>
          <div className="mo__features-grid">
            {[
              { n:"01", title:"Verified track record", body:"Full P&L every month. Wins, losses, ROI, units. No curated highlights, ever." },
              { n:"02", title:"100+ leagues covered",   body:" Weekly coverage of leaked matches across various leagues." },
              { n:"03", title:"Instant pick alerts",   body:"Value windows close fast. Push and SMS the moment a pick drops." },
              { n:"04", title:"Private community",     body:"12,500+ serious bettors. Forum,and live line discussions." },
            ].map((f,i)=>(
              <div key={i} className="mo__feat">
                <span className="mo__feat-n">{f.n}</span>
                <div className="mo__feat-title">{f.title}</div>
                <div className="mo__feat-body">{f.body}</div>
                <div className="mo__feat-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mo__cta">
        {/* Left — dark copy side */}
        <div className="mo__cta-left">
          <p className="mo__section-label">Ready to win</p>
          <h2 className="mo__cta-h">
            <span className="mo__cta-h-outline">Stop</span>
            <span className="mo__cta-h-solid">guessing.</span>
            <span className="mo__cta-h-outline">Start</span>
            <span className="mo__cta-h-solid">winning.</span>
          </h2>
          <div className="mo__cta-divider" />
          <div className="mo__cta-stats">
            {[
              { n:"+100%", l:"90-Day ROI" },
              { n:"100%",    l:"Win Rate" },
              { n:"5yr",    l:"Track Record" },
            ].map((s,i)=>(
              <div key={i} className="mo__cta-stat">
                <span className="mo__cta-stat-n">{s.n}</span>
                <span className="mo__cta-stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — inverted green side */}
        <div className="mo__cta-right">
          <div className="mo__cta-right-inner">
            <div className="mo__cta-badge">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L17 5v6c0 4-3.5 6.5-7 7.5C2.5 17.5-1 15-1 11V5l7-3z" fill="none" stroke="#080808" strokeWidth="1.8" strokeLinejoin="round" transform="translate(2,0)"/>
                <path d="M7 10l2 2 4-4" stroke="#080808" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +20 units guaranteed or full refund
            </div>

            <p className="mo__cta-right-headline">
              VIP PRICES.<br />Enrollment 
            </p>

            <p className="mo__cta-right-sub">
              Join 12,500+ members getting verified picks delivered before the line moves.
            </p>

            <Link to="/pricing" className="mo__btn-cta-dark">
            subscribe to vip              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>

            <Link to="/contact" className="mo__cta-right-link">
              contact customer care→
            </Link>

            <div className="mo__cta-leagues">
              {["FIXED","ANONYMOUS","LEAKED","FIRST-HALF","MEGA-ODDS"].map(l=>(
                <span key={l} className="mo__cta-league">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mo__foot">
        <div className="mo__foot-inner">
          <div className="mo__foot-brand">
            <div className="mo__foot-logo">
              <div className="mo__foot-mark">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L15 13H1L8 1Z" fill="#c8f542"/>
                  <path d="M8 6L11 13H5L8 6Z" fill="#080808"/>
                </svg>
              </div>
              <span>Mega<b>Odds</b></span>
            </div>
            <p>Professional sports analytics.<br/>Trusted since 2019.</p>
          </div>
          <div className="mo__foot-nav">
            <div className="mo__foot-col">
              <span className="mo__foot-col-title">Product</span>
              <Link to="/about">About</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/results">Track Record</Link>
            </div>
            <div className="mo__foot-col">
              <span className="mo__foot-col-title">Legal</span>
              <Link to="/terms">Terms</Link>
              <Link to="/learn">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="mo__foot-bottom">
          <span>© {new Date().getFullYear()} Mega Odds Ltd. All rights reserved.</span>
          <span className="mo__foot-disc">Betting involves financial risk. Past performance does not guarantee future results. Please gamble responsibly.</span>
        </div>
      </footer>
    </div>
  );
}

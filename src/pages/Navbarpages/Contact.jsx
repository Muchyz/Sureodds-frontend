import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import "./Contact.css";

/* ── Particle canvas ───────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], raf;
    const GOLD = ["#f0c040","#d4a020","#b88010","#e8d080","#fff0a0"];
    const GREEN = ["#00ff8840","#00cc6830","#00ff8820"];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.3,
        color: Math.random() > 0.6 ? GOLD[Math.floor(Math.random()*GOLD.length)] : GREEN[Math.floor(Math.random()*GREEN.length)],
        alpha: Math.random() * 0.7 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.pulse += 0.018;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.8 + 0.2 * Math.sin(p.pulse)), 0, Math.PI * 2);
        ctx.fillStyle = p.color.length === 9 ? p.color : p.color + Math.floor(a * 255).toString(16).padStart(2,"0");
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(240,192,64,${(1 - dist/100) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="particle-canvas" />;
}

/* ── Animated counter ──────────────────────────────────────── */
function Counter({ target, suffix, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Main component ────────────────────────────────────────── */
export default function Contact() {
  const whatsappNumber = "705427449";
  const telegramUsername = "Muchyz";
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(null);
  const [tilt, setTilt] = useState({ wa:{x:0,y:0}, tg:{x:0,y:0} });
  const [glint, setGlint] = useState({ wa:null, tg:null });
  const waRef = useRef(null);
  const tgRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    const onMove = e => setMouse({ x: e.clientX / window.innerWidth * 100, y: e.clientY / window.innerHeight * 100 });
    window.addEventListener("mousemove", onMove);
    return () => { clearTimeout(t); window.removeEventListener("mousemove", onMove); };
  }, []);

  const onMove = (e, id, ref) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt(p => ({ ...p, [id]: { x: (y-.5)*12, y: ((.5-x)*12) } }));
    setGlint(p => ({ ...p, [id]: { x: x*100, y: y*100 } }));
    setHover(id);
  };
  const onLeave = id => {
    setTilt(p => ({ ...p, [id]: {x:0,y:0} }));
    setGlint(p => ({ ...p, [id]: null }));
    setHover(null);
  };

  const cards = [
    {
      id: "wa", ref: waRef,
      Icon: FaWhatsapp,
      label: "WhatsApp", eyebrow: "Instant Messaging",
      numDisplay: ["+254","705","427","449"],
      meta: [["Channel","WhatsApp"],["Speed","Instant"],["Status","Live"]],
      desc: "Voice notes, screenshots, analysis — delivered the moment it matters. Preferred channel of Kenya's top bettors.",
      href: `https://wa.me/254${whatsappNumber}`,
      btnText: "Message on WhatsApp",
      accentClass: "wa-accent",
      btnClass: "wa-btn",
      glowClass: "wa-glow",
    },
    {
      id: "tg", ref: tgRef,
      Icon: FaTelegramPlane,
      label: "Telegram", eyebrow: "Encrypted Channel",
      numDisplay: ["@","Muchyz"],
      meta: [["Channel","Telegram"],["Encryption","E2E"],["Status","Live"]],
      desc: "Join private VIP tip broadcasts, exclusive channels and encrypted one-on-one conversations. Zero surveillance.",
      href: `https://t.me/${telegramUsername}`,
      btnText: "Message on Telegram",
      accentClass: "tg-accent",
      btnClass: "tg-btn",
      glowClass: "tg-glow",
    }
  ];

  return (
    <div className={`contact-page ${mounted ? "pg-in" : ""}`}>

      {/* Canvas */}
      <ParticleCanvas />

      {/* Static overlays */}
      <div className="pg-grid" />
      <div className="pg-noise" />
      <div className="pg-vignette" />
      <div className="pg-scanline" />

      {/* Orbs */}
      <div className="orb o1" /><div className="orb o2" />
      <div className="orb o3" /><div className="orb o4" /><div className="orb o5" />

      {/* Cursor halo */}
      <div className="cursor-halo" style={{ left:`${mouse.x}%`, top:`${mouse.y}%` }} />

      {/* ── Ticker ── */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...Array(10)].map((_,i) => (
            <span key={i} className="t-chunk">
              <span className="t-gem">◆</span>MEGA-ODDS
              <span className="t-sep"> · </span>VIP CONCIERGE
              <span className="t-sep"> · </span>ELITE ACCESS
              <span className="t-sep"> · </span>WINNERS ONLY
              <span className="t-sep"> · </span>24/7 LIVE
              &nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <main className="pg-main">

        {/* ══ HERO ══ */}
        <section className="hero">
          <div className="hero-l">

            <div className="eyebrow-row">
              <span className="eyebrow-pulse"><span /></span>
              <span className="eyebrow-txt">Private Concierge</span>
            </div>

            <h1 className="headline">
              <span className="hl-top">Reach the</span>
              <div className="hl-main-wrap">
                <span className="hl-main">INNER</span>
                <span className="hl-stroke"> CIRCLE</span>
                <span className="hl-period">.</span>
              </div>
            </h1>

            <blockquote className="tagline">
              <span className="tq-mark">"</span>
              Where Serious Players Connect.
              <span className="tq-mark">"</span>
            </blockquote>

            <p className="hero-body">
              Direct line to our VIP team. No bots, no queues, no delays.
              Trusted by most serious bettors every day, every night.
            </p>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-num gold-txt"><Counter target={5} suffix="min" /></div>
                <div className="stat-lbl">Avg Response</div>
                <div className="stat-bar"><div className="stat-fill" style={{width:"95%"}} /></div>
              </div>
              <div className="stat-card">
                <div className="stat-num gold-txt">24/7</div>
                <div className="stat-lbl">Live Support</div>
                <div className="stat-bar"><div className="stat-fill" style={{width:"100%"}} /></div>
              </div>
              <div className="stat-card">
                <div className="stat-num gold-txt"><Counter target={100} suffix="%" /></div>
                <div className="stat-lbl">Confidential</div>
                <div className="stat-bar"><div className="stat-fill" style={{width:"100%"}} /></div>
              </div>
            </div>

            <div className="online-badge">
              <span className="ob-dot"><span className="ob-ring" /></span>
              <span className="ob-copy">Team is <strong>live now</strong> &nbsp;·&nbsp; avg. reply &lt;3 min</span>
            </div>

          </div>

          {/* Emblem */}
          <div className="hero-r">
            <div className="emblem">
              <svg className="em-svg" viewBox="0 0 240 240">
                <defs>
                  <radialGradient id="eglow">
                    <stop offset="0%" stopColor="#f0c040" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#f0c040" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <circle cx="120" cy="120" r="115" fill="none" stroke="rgba(240,192,64,0.18)" strokeWidth="1"/>
                <circle cx="120" cy="120" r="95"  fill="none" stroke="rgba(240,192,64,0.10)" strokeWidth="0.5" strokeDasharray="4 6"/>
                <circle cx="120" cy="120" r="75"  fill="none" stroke="rgba(240,192,64,0.07)" strokeWidth="0.5"/>
                <circle cx="120" cy="5"  r="5" fill="#f0c040" className="em-dot-orbit"/>
                <circle cx="120" cy="120" r="115" fill="url(#eglow)" opacity="0.4"/>
              </svg>
              <div className="em-face">
                <div className="em-crown">◆ VIP ◆</div>
                <div className="em-mo">MO</div>
                <div className="em-rule" />
                <div className="em-tag">MEGA · ODDS</div>
                <div className="em-tag em-sub-tag">ELITE · BETTING</div>
              </div>
              <div className="em-orbit-ring">
                <div className="em-orb-dot" />
              </div>
            </div>
          </div>
        </section>

        {/* ══ DIVIDER ══ */}
        <div className="section-div">
          <div className="sd-line" />
          <div className="sd-badge">
            <span className="sd-gem">◆</span>
            <span className="sd-txt">Choose Your Channel</span>
            <span className="sd-gem">◆</span>
          </div>
          <div className="sd-line" />
        </div>

        {/* ══ CARDS ══ */}
        <section className="cards-wrap">
          {cards.map(c => (
            <div
              key={c.id}
              ref={c.ref}
              className={`vcard ${c.accentClass} ${hover===c.id ? "vcard-hot" : ""}`}
              onMouseMove={e => onMove(e, c.id, c.ref)}
              onMouseLeave={() => onLeave(c.id)}
              style={{ transform: `perspective(1000px) rotateX(${tilt[c.id].x}deg) rotateY(${tilt[c.id].y}deg)` }}
            >
              {/* Glow halo */}
              <div className={`vcard-glow ${c.glowClass}`} />

              {/* Mouse glint */}
              {glint[c.id] && (
                <div className="vcard-glint" style={{
                  background: `radial-gradient(circle at ${glint[c.id].x}% ${glint[c.id].y}%, rgba(255,255,255,0.09) 0%, transparent 50%)`
                }}/>
              )}

              {/* Gold foil diagonal */}
              <div className="vcard-foil" />

              {/* Top accent stripe */}
              <div className="vcard-stripe" />

              {/* === CARD CONTENT === */}
              <div className="vcard-inner">

                {/* Header */}
                <div className="vc-header">
                  <div className="vc-chip">
                    <div className="chip-face">
                      <div className="chip-row" /><div className="chip-row" />
                      <div className="chip-row" /><div className="chip-col" />
                    </div>
                  </div>
                  <div className={`vc-icon-wrap ${c.id}-icon`}>
                    <c.Icon className="vc-icon" />
                    <div className="vc-icon-ring" />
                  </div>
                </div>

                {/* Eyebrow */}
                <div className="vc-eyebrow">
                  <span className="vc-ew-bar" />
                  <span className="vc-ew-txt">{c.eyebrow}</span>
                </div>

                {/* Name */}
                <h2 className="vc-name">{c.label}</h2>

                {/* Display number / handle */}
                <div className="vc-num">
                  {c.numDisplay.map((seg,i) => (
                    <span key={i} className="vc-seg">{seg}</span>
                  ))}
                </div>

                {/* Meta */}
                <div className="vc-meta">
                  {c.meta.map(([lbl,val],i) => (
                    <div key={i} className="vc-meta-item">
                      <span className="vmi-lbl">{lbl}</span>
                      <span className={`vmi-val ${lbl==="Status"?"vmi-live":""}`}>
                        {lbl==="Status" && <span className="live-pip" />}
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Desc */}
                <p className="vc-desc">{c.desc}</p>

                {/* CTA */}
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`vc-cta ${c.btnClass}`}
                >
                  <span className="cta-shine" />
                  <c.Icon className="cta-ico" />
                  <span className="cta-lbl">{c.btnText}</span>
                  <span className="cta-arr">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 9h14M9 2l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </a>

                {/* Bottom tag */}
                <div className="vc-foot">
                  <span className="vf-dot" /><span className="vf-txt">Available now · All messages encrypted</span>
                </div>

              </div>
            </div>
          ))}
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="pg-footer">
          <div className="pf-rule"><div className="pf-rule-fill" /></div>
          <div className="pf-content">
            <span className="pf-brand">◆ MEGA-ODDS ◆</span>
            <span className="pf-sep">·</span>
            <span className="pf-copy">Elite Betting Intelligence</span>
            <span className="pf-sep">·</span>
            <span className="pf-copy">All communications strictly confidential</span>
            <span className="pf-sep">·</span>
            <span className="pf-copy">© 2025</span>
          </div>
        </footer>

      </main>
    </div>
  );
}

import "./Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

/* ── Particle canvas background ── */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const COUNT = 90;
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.3,
      o: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,154,60,${p.o})`;
        ctx.fill();
      });
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(196,154,60,${0.06 * (1 - dist / 130)})`;
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

/* ── 3-D tilt card wrapper ── */
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 14;
    const y = ((e.clientY - top) / height - 0.5) * -14;
    el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px) scale(1.025)`;
    el.style.setProperty("--mx", `${((e.clientX - left) / width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - top) / height) * 100}%`);
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return (
    <div ref={ref} className={`pick-card ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="card-glare" />
      {children}
    </div>
  );
}

/* ── Animated number counter ── */
function CountUp({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const total = 60;
    const tick = () => {
      frame++;
      setVal(Math.round(target * Math.min(frame / total, 1)));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn]         = useState(false);
  const [yesterdayPicks, setYesterdayPicks] = useState([]);
  const [todayPicks, setTodayPicks]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [visible, setVisible]               = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchPublicPicks();
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fetchPublicPicks = async () => {
    try {
      const [yRes, tRes] = await Promise.all([
        api.get("/api/picks/yesterday"),
        api.get("/api/picks/today"),
      ]);
      setYesterdayPicks(yRes.data);
      setTodayPicks(tRes.data);
    } catch (err) {
      console.error("Failed to load picks:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (pick, idx) => (
    <TiltCard key={pick.id} className="reveal-card" style={{ animationDelay: `${idx * 0.08}s` }}>
      <div className={`pick-badge ${pick.status?.toLowerCase()}`}>
        <span className="badge-dot" />{pick.status}
      </div>
      <div className="card-number">#{String(idx + 1).padStart(2, "0")}</div>
      <div className="teams">
        <span className="team-name">{pick.team1}</span>
        <div className="vs-block">
          <span className="vs-line" /><span className="vs">VS</span><span className="vs-line" />
        </div>
        <span className="team-name">{pick.team2}</span>
      </div>
      <div className="pick-divider" />
      <div className="pick-meta">
        <div className="meta-item">
          <span className="meta-label">Kick-off</span>
          <span className="meta-value time">🕐 {pick.time}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Selection</span>
          <span className="meta-value prediction">⚽ {pick.prediction}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Odds</span>
          <span className="meta-value odds"><span className="odds-inner">{pick.odds}</span></span>
        </div>
      </div>
    </TiltCard>
  );

  const renderVIPCard = (pick, idx) => (
    <TiltCard key={pick.id} className="vip-pick-card reveal-card">
      <div className="vip-ribbon" />
      <div className="card-number vip-number">VIP</div>

      <Link to="/vip-access-denied" className="pick-badge vip-badge">
        <span className="badge-dot gold-dot" />Members Only 🪙
      </Link>

      <div className="teams">
        <span className="team-name">{pick.team1}</span>
        <div className="vs-block">
          <span className="vs-line gold-line" />
          <span className="vs gold-vs">VS</span>
          <span className="vs-line gold-line" />
        </div>
        <span className="team-name">{pick.team2}</span>
      </div>

      <div className="pick-divider gold-divider" />

      <div className="pick-meta">

        <div className="meta-item">
          <span className="meta-label">Kick-off</span>
          <span className="meta-value time">🕐 {pick.time}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Selection</span>
          <Link to="/vip-access-denied" className="meta-value prediction redacted-cell">
            <span className="redacted-prefix">⚽ 1st Half:</span>
            <span className="redacted-bar">UNLOCK🔐</span>
          </Link>
        </div>

        <div className="meta-item">
          <span className="meta-label">Odds</span>
          <Link to="/vip-access-denied" className="meta-value odds redacted-cell">
            <span className="redacted-bar redacted-bar--wide">LOCKED</span>
          </Link>
        </div>

      </div>
    </TiltCard>
  );

  const vipPicks  = todayPicks.filter((p) => p.is_vip === 1 || p.is_vip === true);
  const freePicks = todayPicks.filter((p) => !p.is_vip);

  return (
    <div className={`home ${visible ? "is-visible" : ""}`}>

      <ParticleField />

      <div className="bg-orbs">
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="orb orb-3" /><div className="orb orb-4" />
      </div>

      <div className="scanlines" />

      <div className="ticker-bar">
        <div className="ticker-label">LIVE</div>
        <div className="ticker-track">
          <div className="ticker-inner">
            {["MAN CITY 2.10 ▲","REAL MADRID 1.85 ▼","PSG 3.40 ▲","BARCELONA 2.20 ▲","LIVERPOOL 1.95 ▼","INTER MILAN 2.75 ▲","JUVENTUS 3.10 ▼","CHELSEA 2.50 ▲","MAN CITY 2.10 ▲","REAL MADRID 1.85 ▼","PSG 3.40 ▲","BARCELONA 2.20 ▲"].map((item, i) => (
              <span key={i} className={`ticker-item ${item.includes("▲") ? "tick-up" : "tick-down"}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="hero">
        <div className="hero-inner">

          <div className="eyebrow-row">
            <div className="eyebrow-line" />
            <span className="eyebrow-text">MEGA-ODDS INTELLIGENCE</span>
            <div className="eyebrow-line" />
          </div>

          <h1 className="hero-title">
            <span className="ht-outsmart">Outsmart</span>
            <span className="ht-odds-row">
              <span className="ht-the">the</span>
              <span className="ht-odds">Odds<span className="ht-dot">.</span></span>
            </span>
            <span className="ht-every-row">
              <span className="ht-every">Every</span>
              <span className="ht-bet">Bet.</span>
            </span>
          </h1>

          <p className="hero-text">
            <span className="ht-sub-block">
              <span className="ht-sub-accent">Private intelligence.</span>
              {" "}Real-time models. Fixed matches sourced from verified insiders —
              <span className="ht-sub-em"> delivered before the market moves.</span>
            </span>
          </p>

          <div className="hero-actions">
            {isLoggedIn ? (
              <>
                <Link to="/features">
                  <button className="cta-primary">
                    <span className="cta-label">Explore VIP Picks</span>
                    <span className="cta-icon">→</span>
                    <div className="cta-shine" />
                  </button>
                </Link>
                <Link to="/learn" className="cta-ghost">
                  Learn More
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <button className="cta-primary">
                    <span className="cta-label">Join the Inner Circle</span>
                    <span className="cta-icon">→</span>
                    <div className="cta-shine" />
                  </button>
                </Link>
                <Link to="/testimonials" className="cta-ghost">
                  See Proof
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Link>
              </>
            )}
          </div>

          <div className="stats-row">
            <div className="stat-block">
              <span className="stat-num"><CountUp target={10500} suffix="+" /></span>
              <span className="stat-lbl">Active Members</span>
            </div>
            <div className="stat-sep">✦</div>
            <div className="stat-block">
              <span className="stat-num"><CountUp target={100} suffix="%" /></span>
              <span className="stat-lbl">Verified Win Rate</span>
            </div>
            <div className="stat-sep">✦</div>
            <div className="stat-block">
              <span className="stat-num">VIP</span>
              <span className="stat-lbl">Fixed Matches</span>
            </div>
          </div>

        </div>
      </section>

      {!loading && yesterdayPicks.length > 0 && (
        <section className="picks-section">
          <div className="section-header">
            <div className="sh-ornament"><span className="sh-diamond" /><span className="sh-line" /></div>
            <div className="sh-center">
              <span className="sh-tag">RESULTS</span>
              <h2 className="picks-title">Previous Picks</h2>
            </div>
            <div className="sh-ornament mirror"><span className="sh-line" /><span className="sh-diamond" /></div>
          </div>
          <div className="picks-list">{yesterdayPicks.map((p, i) => renderCard(p, i))}</div>
        </section>
      )}

      {!loading && freePicks.length > 0 && (
        <section className="picks-section">
          <div className="section-header">
            <div className="sh-ornament"><span className="sh-diamond" /><span className="sh-line" /></div>
            <div className="sh-center">
              <span className="sh-tag">TODAY · FREE</span>
              <h2 className="picks-title">Today's Free Picks</h2>
            </div>
            <div className="sh-ornament mirror"><span className="sh-line" /><span className="sh-diamond" /></div>
          </div>
          <div className="picks-list">{freePicks.map((p, i) => renderCard(p, i))}</div>
        </section>
      )}

      {!loading && vipPicks.length > 0 && (
        <section className="picks-section vip-section">
          <div className="vip-header-glow" />
          <div className="section-header">
            <div className="sh-ornament gold"><span className="sh-diamond gold-dia" /><span className="sh-line gold-ln" /></div>
            <div className="sh-center">
              <span className="sh-tag gold-tag">MEMBERS ONLY</span>
              <h2 className="picks-title vip-title">Night VIP Bet</h2>
            </div>
            <div className="sh-ornament mirror gold"><span className="sh-line gold-ln" /><span className="sh-diamond gold-dia" /></div>
          </div>
          <div className="picks-list">{vipPicks.map((p, i) => renderVIPCard(p, i))}</div>
        </section>
      )}

      <footer className="footer">
        <span className="footer-diamond">✦</span>
        © {new Date().getFullYear()} Mega-Odds · All rights reserved
        <span className="footer-diamond">✦</span>
      </footer>

    </div>
  );
}

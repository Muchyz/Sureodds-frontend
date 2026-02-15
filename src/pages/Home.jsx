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
  return <canvas ref={canvasRef} className="home-particle-canvas" />;
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
    <div ref={ref} className={`home-pick-card ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="home-card-glare" />
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
      console.log("Yesterday picks:", yRes.data);
      console.log("Today picks:", tRes.data);
      setYesterdayPicks(yRes.data);
      setTodayPicks(tRes.data);
    } catch (err) {
      console.error("Failed to load picks:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (pick, idx) => (
    <TiltCard key={pick.id} className="home-reveal-card" style={{ animationDelay: `${idx * 0.08}s` }}>
      <div className={`home-pick-badge ${pick.status?.toLowerCase()}`}>
        <span className="home-badge-dot" />{pick.status}
      </div>
      <div className="home-card-number">#{String(idx + 1).padStart(2, "0")}</div>
      <div className="home-teams">
        <span className="home-team-name">{pick.team1}</span>
        <div className="home-vs-block">
          <span className="home-vs-line" /><span className="home-vs">VS</span><span className="home-vs-line" />
        </div>
        <span className="home-team-name">{pick.team2}</span>
      </div>
      <div className="home-pick-divider" />
      <div className="home-pick-meta">
        <div className="home-meta-item">
          <span className="home-meta-label">Kick-off</span>
          <span className="home-meta-value home-kickoff-time">🕐 {pick.time}</span>
        </div>
        <div className="home-meta-item">
          <span className="home-meta-label">Selection</span>
          <span className="home-meta-value home-prediction">⚽ {pick.prediction}</span>
        </div>
        <div className="home-meta-item">
          <span className="home-meta-label">Odds</span>
          <span className="home-meta-value home-odds"><span className="home-odds-inner">{pick.odds}</span></span>
        </div>
      </div>
    </TiltCard>
  );

  const renderVIPCard = (pick, idx) => (
    <TiltCard key={pick.id} className="home-vip-pick-card home-reveal-card">
      <div className="home-vip-ribbon" />
      <div className="home-card-number home-vip-number">VIP</div>

      <Link to="/vip-access-denied" className="home-pick-badge home-vip-badge">
        <span className="home-badge-dot home-gold-dot" />Members Only 🪙
      </Link>

      <div className="home-teams">
        <span className="home-team-name">{pick.team1}</span>
        <div className="home-vs-block">
          <span className="home-vs-line home-gold-line" />
          <span className="home-vs home-gold-vs">VS</span>
          <span className="home-vs-line home-gold-line" />
        </div>
        <span className="home-team-name">{pick.team2}</span>
      </div>

      <div className="home-pick-divider home-gold-divider" />

      <div className="home-pick-meta">

        <div className="home-meta-item">
          <span className="home-meta-label">Kick-off</span>
          <span className="home-meta-value home-kickoff-time">🕐 {pick.time}</span>
        </div>

        <div className="home-meta-item">
          <span className="home-meta-label">Selection</span>
          <Link to="/vip-access-denied" className="home-meta-value home-prediction home-redacted-cell">
            <span className="home-redacted-prefix">⚽ 1st Half:</span>
            <span className="home-redacted-bar">UNLOCK🔐</span>
          </Link>
        </div>

        <div className="home-meta-item">
          <span className="home-meta-label">Odds</span>
          <Link to="/vip-access-denied" className="home-meta-value home-odds home-redacted-cell">
            <span className="home-redacted-bar home-redacted-bar--wide">LOCKED</span>
          </Link>
        </div>

      </div>
    </TiltCard>
  );

  const vipPicks  = todayPicks.filter((p) => p.is_vip === 1 || p.is_vip === true);
  const freePicks = todayPicks.filter((p) => !p.is_vip);

  console.log("VIP picks:", vipPicks);
  console.log("Free picks:", freePicks);
  console.log("Loading:", loading);

  return (
    <div className={`home-page ${visible ? "home-is-visible" : ""}`}>

      <ParticleField />

      <div className="home-bg-orbs">
        <div className="home-orb home-orb-1" /><div className="home-orb home-orb-2" />
        <div className="home-orb home-orb-3" /><div className="home-orb home-orb-4" />
      </div>

      <div className="home-scanlines" />

      <div className="home-ticker-bar">
        <div className="home-ticker-label">LIVE</div>
        <div className="home-ticker-track">
          <div className="home-ticker-inner">
            {["MAN CITY 2.10 ▲","REAL MADRID 1.85 ▼","PSG 3.40 ▲","BARCELONA 2.20 ▲","LIVERPOOL 1.95 ▼","INTER MILAN 2.75 ▲","JUVENTUS 3.10 ▼","CHELSEA 2.50 ▲","MAN CITY 2.10 ▲","REAL MADRID 1.85 ▼","PSG 3.40 ▲","BARCELONA 2.20 ▲"].map((item, i) => (
              <span key={i} className={`home-ticker-item ${item.includes("▲") ? "home-tick-up" : "home-tick-down"}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="home-hero">
        <div className="home-hero-inner">

          <div className="home-eyebrow-row">
            <div className="home-eyebrow-line" />
            <span className="home-eyebrow-text">MEGA-ODDS INTELLIGENCE</span>
            <div className="home-eyebrow-line" />
          </div>

          <h1 className="home-hero-title">
            <span className="home-ht-outsmart">Outsmart</span>
            <span className="home-ht-odds-row">
              <span className="home-ht-the">the</span>
              <span className="home-ht-odds">Odds<span className="home-ht-dot">.</span></span>
            </span>
            <span className="home-ht-every-row">
              <span className="home-ht-every">Every</span>
              <span className="home-ht-bet">Bet.</span>
            </span>
          </h1>

          <p className="home-hero-text">
            <span className="home-ht-sub-block">
              <span className="home-ht-sub-accent">Private intelligence.</span>
              {" "}Real-time models. Fixed matches sourced from verified insiders —
              <span className="home-ht-sub-em"> delivered before the market moves.</span>
            </span>
          </p>

          <div className="home-hero-actions">
            {isLoggedIn ? (
              <>
                <Link to="/features">
                  <button className="home-cta-primary">
                    <span className="home-cta-label">Explore VIP Picks</span>
                    <span className="home-cta-icon">→</span>
                    <div className="home-cta-shine" />
                  </button>
                </Link>
                <Link to="/learn" className="home-cta-ghost">
                  Learn More
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <button className="home-cta-primary">
                    <span className="home-cta-label">Join the Inner Circle</span>
                    <span className="home-cta-icon">→</span>
                    <div className="home-cta-shine" />
                  </button>
                </Link>
                <Link to="/testimonials" className="home-cta-ghost">
                  See Proof
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Link>
              </>
            )}
          </div>

          <div className="home-stats-row">
            <div className="home-stat-block">
              <span className="home-stat-num"><CountUp target={10500} suffix="+" /></span>
              <span className="home-stat-lbl">Active Members</span>
            </div>
            <div className="home-stat-sep">✦</div>
            <div className="home-stat-block">
              <span className="home-stat-num"><CountUp target={100} suffix="%" /></span>
              <span className="home-stat-lbl">Verified Win Rate</span>
            </div>
            <div className="home-stat-sep">✦</div>
            <div className="home-stat-block">
              <span className="home-stat-num">VIP</span>
              <span className="home-stat-lbl">Fixed Matches</span>
            </div>
          </div>

        </div>
      </section>

      {!loading && yesterdayPicks.length > 0 && (
        <section className="home-picks-section">
          <div className="home-section-header">
            <div className="home-sh-ornament"><span className="home-sh-diamond" /><span className="home-sh-line" /></div>
            <div className="home-sh-center">
              <span className="home-sh-tag">RESULTS</span>
              <h2 className="home-picks-title">Previous Picks</h2>
            </div>
            <div className="home-sh-ornament home-mirror"><span className="home-sh-line" /><span className="home-sh-diamond" /></div>
          </div>
          <div className="home-picks-list">{yesterdayPicks.map((p, i) => renderCard(p, i))}</div>
        </section>
      )}

      {!loading && freePicks.length > 0 && (
        <section className="home-picks-section">
          <div className="home-section-header">
            <div className="home-sh-ornament"><span className="home-sh-diamond" /><span className="home-sh-line" /></div>
            <div className="home-sh-center">
              <span className="home-sh-tag">TODAY · FREE</span>
              <h2 className="home-picks-title">Today's Free Picks</h2>
            </div>
            <div className="home-sh-ornament home-mirror"><span className="home-sh-line" /><span className="home-sh-diamond" /></div>
          </div>
          <div className="home-picks-list">{freePicks.map((p, i) => renderCard(p, i))}</div>
        </section>
      )}

      {!loading && vipPicks.length > 0 && (
        <section className="home-picks-section home-vip-section">
          <div className="home-vip-header-glow" />
          <div className="home-section-header">
            <div className="home-sh-ornament home-gold"><span className="home-sh-diamond home-gold-dia" /><span className="home-sh-line home-gold-ln" /></div>
            <div className="home-sh-center">
              <span className="home-sh-tag home-gold-tag">MEMBERS ONLY</span>
              <h2 className="home-picks-title home-vip-title">Next VIP Bet</h2>
            </div>
            <div className="home-sh-ornament home-mirror home-gold"><span className="home-sh-line home-gold-ln" /><span className="home-sh-diamond home-gold-dia" /></div>
          </div>
          <div className="home-picks-list">{vipPicks.map((p, i) => renderVIPCard(p, i))}</div>
        </section>
      )}

      <footer className="home-footer">
        <span className="home-footer-diamond">✦</span>
        © {new Date().getFullYear()} Mega-Odds · All rights reserved
        <span className="home-footer-diamond">✦</span>
      </footer>

    </div>
  );
}

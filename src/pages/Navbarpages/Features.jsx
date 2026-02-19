import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Features.css";
import api from "@/api";

function Features() {
  const [features, setFeatures] = useState([]);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(true);
  const [time, setTime]         = useState(new Date());
  const [glitch, setGlitch]     = useState(false);

  useEffect(() => {
    api.get("/features")
      .then(r  => { setFeatures(r.data); setError(""); })
      .catch(() => {
        setError("Bets only visible to VIP's ...Upgrade to VIP to unlock features");
        setFeatures([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const clock = setInterval(() => setTime(new Date()), 1000);
    // Random glitch effect
    const glitcher = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 4000 + Math.random() * 3000);
    return () => { clearInterval(clock); clearInterval(glitcher); };
  }, []);

  const pad = n => String(n).padStart(2, "0");
  const liveTime = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <div className={`npx__root ${glitch ? "npx__root--glitch" : ""}`}>

      {/* CRT scanlines */}
      <div className="npx__scanlines" />
      {/* Grid overlay */}
      <div className="npx__grid" />

      {/* ── TOP BAR ── */}
      <div className="npx__topbar">
        <div className="npx__topbar-left">
          <span className="npx__pill npx__pill--pink">◆ VIP</span>
          <span className="npx__pill npx__pill--blue">LIVE</span>
        </div>
        <div className="npx__topbar-mid">
          <span className="npx__logo">BET<span className="npx__logo-accent">PRO</span></span>
        </div>
        <div className="npx__topbar-right">
          <span className="npx__clock">{liveTime}</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="npx__hero">

        {/* Stacked colliding type */}
        <div className="npx__type-stack">
          <span className="npx__t1">WIN</span>
          <span className="npx__t2">SMARTER</span>
          <span className="npx__t3">BET LIKE</span>
          <span className="npx__t4">A&nbsp;PRO</span>
          {/* Ghost duplicate for glitch depth */}
          <span className="npx__t2-ghost" aria-hidden="true">SMARTER</span>
        </div>

        {/* Floating side panel */}
        <div className="npx__hero-panel">
          <div className="npx__panel-header">
            <span className="npx__panel-dot npx__panel-dot--pink" />
            <span className="npx__panel-dot npx__panel-dot--blue" />
            <span className="npx__panel-dot npx__panel-dot--white" />
            <span className="npx__panel-title">INTEL FEED</span>
          </div>

          <div className="npx__panel-rows">
            {[
              { k: "ACCURACY",   v: "94%",   c: "pink"  },
              { k: "MEMBERS",    v: "12K+",  c: "blue"  },
              { k: "WIN STREAK", v: "23×",   c: "pink"  },
              { k: "PICKS/DAY",  v: "7",     c: "white" },
            ].map(r => (
              <div key={r.k} className="npx__panel-row">
                <span className="npx__panel-key">{r.k}</span>
                <span className={`npx__panel-val npx__panel-val--${r.c}`}>{r.v}</span>
              </div>
            ))}
          </div>

          <Link to="/pricing" className="npx__panel-cta">
            <span className="npx__cta-inner">UNLOCK VIP</span>
            <span className="npx__cta-bg" />
          </Link>

          <p className="npx__panel-note">Members only · No lock-in</p>
        </div>

        {/* Bottom hero sub */}
        <div className="npx__hero-sub-wrap">
          <div className="npx__sub-rule" />
          <p className="npx__hero-sub">
            Not tips. <em>Intelligence.</em> Real data. Inside edge. The unfair advantage.
          </p>
          <div className="npx__sub-rule npx__sub-rule--blue" />
        </div>

      </section>

      {/* ── MARQUEE ── */}
      <div className="npx__marquee-wrap">
        <div className="npx__marquee-track">
          {Array(6).fill("WIN SMARTER · REAL DATA · EXPERT PICKS · VIP ACCESS · DAILY INTEL · LIVE ODDS · INSIDE EDGE · BET LIKE A PRO · ").map((t, i) => (
            <span key={i} className="npx__marquee-text">{t}</span>
          ))}
        </div>
      </div>

      {/* Second marquee — opposite direction */}
      <div className="npx__marquee-wrap npx__marquee-wrap--rev">
        <div className="npx__marquee-track npx__marquee-track--rev">
          {Array(6).fill("◆ EXCLUSIVE ◆ INSIDER ◆ PREMIUM ◆ MEMBERS ONLY ◆ PROVEN ◆ 94% ACCURACY ◆ ").map((t, i) => (
            <span key={i} className="npx__marquee-text npx__marquee-text--dim">{t}</span>
          ))}
        </div>
      </div>

      {/* ── SECTION HEADER ── */}
      <div className="npx__section-hd">
        <span className="npx__section-num">01</span>
        <span className="npx__section-label">VIP FEATURES</span>
        <span className="npx__section-count">
          {!loading && !error ? `[${features.length}]` : "[—]"}
        </span>
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div className="npx__error">
          <div className="npx__error-head">
            <span className="npx__error-x">✕</span>
            <span className="npx__error-title">ACCESS LOCKED</span>
          </div>
          <p className="npx__error-msg">{error}</p>
          <Link to="/pricing" className="npx__error-cta">UPGRADE NOW →</Link>
        </div>
      )}

      {/* ── LOADING ── */}
      {loading && !error && (
        <div className="npx__loading">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="npx__load-bar-wrap" style={{ "--li": i }}>
              <div className="npx__load-bar" />
            </div>
          ))}
          <span className="npx__load-label">LOADING INTEL…</span>
        </div>
      )}

      {/* ── FEATURES ── */}
      {!loading && !error && features.length > 0 && (
        <section className="npx__grid">
          {features.map((f, i) => (
            <article
              key={f.id}
              className="npx__card"
              style={{ "--ci": i }}
            >
              {/* Colour accent edge — alternates pink/blue */}
              <div className={`npx__card-edge npx__card-edge--${i % 2 === 0 ? "pink" : "blue"}`} />

              <div className="npx__card-inner">
                {/* Number + tag row */}
                <div className="npx__card-toprow">
                  <span className="npx__card-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`npx__card-badge npx__card-badge--${i % 2 === 0 ? "pink" : "blue"}`}>
                    VIP
                  </span>
                </div>

                <h3 className="npx__card-title">{f.title}</h3>
                <p className="npx__card-desc">{f.description}</p>

                {f.image_url && (
                  <div className="npx__card-img-wrap">
                    <img src={f.image_url} alt={f.title} className="npx__card-img" loading="lazy" />
                    <div className="npx__card-img-tint" />
                  </div>
                )}

                <div className="npx__card-foot">
                  <span className="npx__card-foot-arrow">→</span>
                  <span className="npx__card-foot-label">EXCLUSIVE ACCESS</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="npx__footer">
        <div className="npx__footer-noise" />
        <div className="npx__footer-inner">
          <div className="npx__footer-logo">
            BET<span className="npx__logo-accent">PRO</span>
          </div>
          <p className="npx__footer-copy">
            12,000+ members holding the edge every day.
          </p>
          <Link to="/pricing" className="npx__footer-cta">
            JOIN NOW
          </Link>
        </div>
        <div className="npx__footer-bar" />
      </footer>

    </div>
  );
}

export default Features;

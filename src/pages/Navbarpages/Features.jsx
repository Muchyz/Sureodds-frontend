import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Features.css";
import api from "@/api";

function Features() {
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    api.get("/features")
      .then((res) => { setFeatures(res.data); setError(""); })
      .catch(() => {
        setError("Bets only visible to VIP's ...Upgrade to VIP to unlock features");
        setFeatures([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const tickerItems = [
    "REAL-TIME DATA", "EXPERT PICKS", "VIP ACCESS", "PROVEN RESULTS",
    "INSIDER ANALYSIS", "DAILY BETS", "WIN SMARTER", "BET LIKE A PRO",
  ];

  return (
    <div className="ug-club__root">

      {/* Texture layers */}
      <div className="ug-club__felt-bg" />
      <div className="ug-club__vignette" />

      {/* Racing stripe top */}
      <div className="ug-club__stripe-top">
        <div className="ug-club__stripe-gold" />
        <div className="ug-club__stripe-thin" />
      </div>

      {/* ── HERO ── */}
      <header className="ug-club__hero">

        {/* Crest / emblem */}
        <div className="ug-club__crest">
          <div className="ug-club__crest-ring ug-club__crest-ring--outer" />
          <div className="ug-club__crest-ring ug-club__crest-ring--inner" />
          <span className="ug-club__crest-diamond">◆</span>
        </div>

        <p className="ug-club__eyebrow">Members Only · Est. 2024</p>

        <h1 className="ug-club__hero-title">
          <span className="ug-club__hero-line ug-club__hero-line--1">WIN</span>
          <span className="ug-club__hero-line ug-club__hero-line--2">SMARTER.</span>
          <span className="ug-club__hero-line ug-club__hero-line--3">BET LIKE</span>
          <span className="ug-club__hero-line ug-club__hero-line--4">A PRO.</span>
        </h1>

        <p className="ug-club__hero-sub">
          Elite intelligence. Real data. Inside edge.<br />
          Not tips — an unfair advantage.
        </p>

        <Link to="/pricing" className="ug-club__hero-cta">
          <span className="ug-club__cta-track" />
          <span className="ug-club__cta-label">Unlock VIP Access</span>
          <span className="ug-club__cta-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </Link>

        {/* Scoreboard-style stats */}
        <div className="ug-club__scoreboard">
          {[
            { val: "94%", lbl: "Accuracy" },
            { val: "12K+", lbl: "Members" },
            { val: "Daily", lbl: "Fresh Picks" },
            { val: "24/7", lbl: "Live Data" },
          ].map((s) => (
            <div key={s.lbl} className="ug-club__score-cell">
              <span className="ug-club__score-val">{s.val}</span>
              <span className="ug-club__score-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── TICKER ── */}
      <div className="ug-club__ticker-wrap">
        <div className="ug-club__ticker-inner" ref={tickerRef}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ug-club__ticker-item">
              <span className="ug-club__ticker-diamond">◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── SECTION HEADER ── */}
      <div className="ug-club__section-hd">
        <div className="ug-club__section-rule" />
        <span className="ug-club__section-tag">VIP Intelligence Feed</span>
        <div className="ug-club__section-rule" />
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div className="ug-club__lockout">
          <div className="ug-club__lockout-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="ug-club__lockout-msg">{error}</p>
          <Link to="/pricing" className="ug-club__lockout-cta">
            View Membership Plans →
          </Link>
        </div>
      )}

      {/* ── LOADING ── */}
      {loading && !error && (
        <div className="ug-club__loading">
          <div className="ug-club__odds-board">
            {["—", "—", "—"].map((_, i) => (
              <div key={i} className="ug-club__odds-row">
                <div className="ug-club__odds-shimmer" style={{ "--d": `${i * 0.15}s` }} />
              </div>
            ))}
          </div>
          <p className="ug-club__loading-lbl">Pulling live intelligence…</p>
        </div>
      )}

      {/* ── FEATURES GRID ── */}
      {!loading && !error && features.length > 0 && (
        <section className="ug-club__grid">
          {features.map((f, index) => (
            <article
              key={f.id}
              className={`ug-club__card ${hoveredCard === f.id ? "ug-club__card--lit" : ""}`}
              onMouseEnter={() => setHoveredCard(f.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ "--ci": index }}
            >
              {/* Gold top bar */}
              <div className="ug-club__card-topbar" />

              {/* Race number */}
              <div className="ug-club__card-num">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className="ug-club__card-body">
                <div className="ug-club__card-meta">VIP · FEATURE</div>
                <h3 className="ug-club__card-title">{f.title}</h3>
                <p className="ug-club__card-desc">{f.description}</p>

                {f.image_url && (
                  <div className="ug-club__card-img-frame">
                    <img
                      src={f.image_url}
                      alt={f.title}
                      className="ug-club__card-img"
                      loading="lazy"
                    />
                    <div className="ug-club__card-img-overlay" />
                  </div>
                )}
              </div>

              <div className="ug-club__card-foot">
                <div className="ug-club__card-foot-rule" />
                <span className="ug-club__card-foot-lbl">Exclusive Access</span>
                <span className="ug-club__card-foot-arrow">→</span>
              </div>

              {/* Ambient glow */}
              <div className="ug-club__card-glow" />
            </article>
          ))}
        </section>
      )}

      {/* ── FOOTER BAND ── */}
      <footer className="ug-club__footer">
        <div className="ug-club__footer-inner">
          <div className="ug-club__footer-crest">◆</div>
          <p className="ug-club__footer-copy">
            Join 12,000+ members who hold the edge every day.
          </p>
          <Link to="/pricing" className="ug-club__footer-cta">
            Become a Member
          </Link>
        </div>
        <div className="ug-club__stripe-bottom">
          <div className="ug-club__stripe-gold" />
          <div className="ug-club__stripe-thin" />
        </div>
      </footer>

    </div>
  );
}

export default Features;

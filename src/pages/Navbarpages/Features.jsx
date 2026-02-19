import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Features.css";
import api from "@/api";

function Features() {
  const [features, setFeatures] = useState([]);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(true);
  const [time, setTime]         = useState(new Date());
  const gridRef                 = useRef(null);

  useEffect(() => {
    api.get("/features")
      .then(r  => { setFeatures(r.data); setError(""); })
      .catch(() => {
        setError("Bets only visible to VIP's ...Upgrade to VIP to unlock features");
        setFeatures([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll-triggered card reveal via IntersectionObserver
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".bst__card");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("bst__card--visible");
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );
    cards.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, [features]);

  // 3D tilt on cards
  const handleTilt = useCallback(e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  }, []);

  const resetTilt = useCallback(e => {
    e.currentTarget.style.transform = "";
  }, []);

  const pad = n => String(n).padStart(2, "0");
  const liveTime = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const tickerText = "WIN SMARTER · BET LIKE A PRO · REAL DATA · INSIDER EDGE · VIP ACCESS · EXPERT PICKS · LIVE ODDS · DAILY INTEL ·\u00A0";

  return (
    <div className="bst__root">

      {/* ── OUR STATUS BAR — sits below app navbar ── */}
      <div className="bst__statusbar">
        <span className="bst__status-left">
          <span className="bst__status-dot" />
          LIVE
        </span>
        <span className="bst__status-mid">VIP INTELLIGENCE TERMINAL</span>
        <span className="bst__status-right">{liveTime}</span>
      </div>

      {/* ── HERO ── */}
      <section className="bst__hero">
        <div className="bst__hero-texture" aria-hidden="true" />
        <div className="bst__bg-num"      aria-hidden="true">01</div>

        <div className="bst__hero-grid">

          {/* Left — headline */}
          <div className="bst__hero-left">
            <div className="bst__tag-row">
              <span className="bst__tag">◼ MEMBERS ONLY</span>
              <span className="bst__tag bst__tag--hot">
                <span className="bst__tag-dot" />
                LIVE
              </span>
            </div>

            <h1 className="bst__headline">
              <span className="bst__h-row">
                <span className="bst__h-outline">WIN</span>
              </span>
              <span className="bst__h-row bst__h-row--indent">
                <span className="bst__h-solid">SMARTER</span>
                <span className="bst__h-period">.</span>
              </span>
              <span className="bst__h-rule" />
              <span className="bst__h-row">
                <span className="bst__h-solid bst__h-solid--amber">BET</span>
                <span className="bst__h-outline bst__h-outline--sm">LIKE</span>
              </span>
              <span className="bst__h-row bst__h-row--right">
                <span className="bst__h-solid">A PRO.</span>
              </span>
            </h1>

            <p className="bst__sub">
              Not tips. Not hunches.<br />
              <em>Intelligence.</em> Real data. Inside edge.
            </p>

            <div className="bst__cta-row">
              <Link to="/pricing" className="bst__cta">
                UNLOCK VIP
                <span className="bst__cta-flash" />
              </Link>
              <span className="bst__cta-note">No lock-in. Cancel anytime.</span>
            </div>
          </div>

          {/* Right — data panel */}
          <div className="bst__hero-right">
            <div className="bst__data-panel">
              <div className="bst__data-header">
                <span>SYSTEM STATUS</span>
                <span className="bst__data-header-live">
                  <span className="bst__data-hd-dot" />
                  LIVE
                </span>
              </div>

              {[
                { label: "ACCURACY",    val: "100%",   bar: 100 },
                { label: "MEMBERS",     val: "12,500", bar: 78  },
                { label: "PICKS TODAY", val: "6",      bar: 70  },
                { label: "WIN RATE",  val: "100%",     bar: 100  },
              ].map(row => (
                <div key={row.label} className="bst__data-row">
                  <span className="bst__data-label">{row.label}</span>
                  <div className="bst__data-bar-wrap">
                    <div className="bst__data-bar" style={{ "--w": `${row.bar}%` }} />
                  </div>
                  <span className="bst__data-val">{row.val}</span>
                </div>
              ))}

              <div className="bst__data-footer">
                LAST UPDATED <span className="bst__data-time">{liveTime}</span>
              </div>
            </div>

            <div className="bst__flags">
              {["Real-time Data", "1st Half Fixed CS", "100% Proven Results"].map(f => (
                <div key={f} className="bst__flag">
                  <span className="bst__flag-check">✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CRAWL TICKER ── */}
      <div className="bst__crawl" aria-hidden="true">
        <div className="bst__crawl-inner">
          {Array(4).fill(tickerText).map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* ── VIP FEED HEADER ── */}
      <div className="bst__feed-hd">
        <div className="bst__feed-hd-left">
          <div className="bst__feed-live-dot" />
          <div className="bst__feed-hd-titles">
            <span className="bst__feed-eyebrow">MEMBERS ONLY</span>
            <span className="bst__feed-title">VIP Intelligence Feed</span>
          </div>
        </div>

        <div className="bst__feed-hd-meta">
          <div className="bst__feed-stat">
            <span className="bst__feed-stat-val">100%</span>
            <span className="bst__feed-stat-lbl">Accuracy</span>
          </div>
          <div className="bst__feed-stat-divider" />
          <div className="bst__feed-stat">
            <span className="bst__feed-stat-val">
              {!loading && !error ? features.length : "—"}
            </span>
            <span className="bst__feed-stat-lbl">Features</span>
          </div>
          <div className="bst__feed-stat-divider" />
          <div className="bst__feed-stat">
            <span className="bst__feed-stat-val bst__feed-stat-val--live">{liveTime}</span>
            <span className="bst__feed-stat-lbl">Live</span>
          </div>
        </div>
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div className="bst__error">
          <div className="bst__error-code">
            <span className="bst__error-num">403</span>
            <span className="bst__error-label">ACCESS DENIED</span>
          </div>
          <div className="bst__error-body">
            <p className="bst__error-label">{error}</p>
            <Link to="/pricing" className="bst__error-cta">VIEW PLANS →</Link>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {loading && !error && (
        <div className="bst__loading">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bst__load-row" style={{ "--di": i }}>
              <div className="bst__load-label" />
              <div className="bst__load-bar" />
              <div className="bst__load-val" />
            </div>
          ))}
        </div>
      )}

      {/* ── FEATURES ── */}
      {!loading && !error && features.length > 0 && (
        <section className="bst__grid" ref={gridRef}>
          {features.map((f, i) => (
            <article
              key={f.id}
              className="bst__card"
              style={{ "--ci": i }}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              {/* Sliding amber left border */}
              <div className="bst__card-rail" />

              <div className="bst__card-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="bst__card-content">
                <div className="bst__card-top">
                  <span className="bst__card-tag">VIP · FEATURE</span>
                  <span className="bst__card-status">
                    <span className="bst__card-status-dot" />
                    ACTIVE
                  </span>
                </div>

                <h3 className="bst__card-title">{f.title}</h3>
                <p className="bst__card-desc">{f.description}</p>

                {f.image_url && (
                  <div className="bst__card-img-wrap">
                    <img src={f.image_url} alt={f.title} className="bst__card-img" loading="lazy" />
                    <div className="bst__card-img-scan" />
                  </div>
                )}
              </div>

              <div className="bst__card-base">
                <div className="bst__card-base-rule" />
                <span className="bst__card-access">EXCLUSIVE ACCESS →</span>
              </div>

              <div className="bst__card-corner" />
            </article>
          ))}
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="bst__footer">
        <div className="bst__footer-topline" />
        <div className="bst__footer-inner">
          <div className="bst__footer-left">
            <p className="bst__footer-stat">12,000+</p>
            <p className="bst__footer-stat-lbl">Members holding the edge</p>
          </div>
          <div className="bst__footer-center">
            <Link to="/pricing" className="bst__footer-cta">
              BECOME A MEMBER
              <span className="bst__footer-cta-flash" />
            </Link>
          </div>
          <div className="bst__footer-right">
            <p className="bst__footer-stat">100%</p>
            <p className="bst__footer-stat-lbl">Accuracy rate</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Features;

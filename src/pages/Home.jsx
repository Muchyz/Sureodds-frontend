import "./Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

/* ─────────────────────────────────────────
   CountUp
───────────────────────────────────────── */
function CountUp({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let f = 0;
    const N = 70;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = () => {
      f++;
      setVal(Math.round(target * ease(Math.min(f / N, 1))));
      if (f < N) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────
   Pick Card (subtle 3-D tilt)
───────────────────────────────────────── */
function PickCard({ children, gold = false }) {
  const ref = useRef(null);
  const raf = useRef(null);

  const onMove = useCallback((e) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const r   = el.getBoundingClientRect();
      const rx  = ((e.clientX - r.left) / r.width  - 0.5) * 7;
      const ry  = ((e.clientY - r.top)  / r.height - 0.5) * -7;
      el.style.transform = `perspective(900px) rotateX(${ry}deg) rotateY(${rx}deg)`;
      el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width)  * 100}%`);
      el.style.setProperty("--gy", `${((e.clientY - r.top)  / r.height) * 100}%`);
    });
  }, []);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (ref.current) ref.current.style.transform = "";
  }, []);

  return (
    <article
      ref={ref}
      className={`pc ${gold ? "pc--gold" : ""}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="pc__glare" />
      {children}
    </article>
  );
}

/* ─────────────────────────────────────────
   Ticker
───────────────────────────────────────── */
const TICKER_DATA = [
  { c: "Man City",    v: "2.10", up: true  },
  { c: "Real Madrid", v: "1.85", up: false },
  { c: "PSG",         v: "3.40", up: true  },
  { c: "Barcelona",   v: "2.20", up: true  },
  { c: "Liverpool",   v: "1.95", up: false },
  { c: "Inter Milan", v: "2.75", up: true  },
  { c: "Juventus",    v: "3.10", up: false },
  { c: "Chelsea",     v: "2.50", up: true  },
  { c: "Arsenal",     v: "1.78", up: true  },
  { c: "Dortmund",    v: "3.60", up: false },
];

function Ticker() {
  const items = [...TICKER_DATA, ...TICKER_DATA];
  return (
    <div className="ticker">
      <div className="ticker__badge">
        <span className="ticker__live-dot" />
        LIVE
      </div>
      <div className="ticker__track" aria-hidden="true">
        <div className="ticker__rail">
          {items.map((d, i) => (
            <span key={i} className={`ticker__item ${d.up ? "is-up" : "is-dn"}`}>
              <span className="ticker__club">{d.c}</span>
              <span className="ticker__val">{d.v}</span>
              <span className="ticker__arrow">{d.up ? "▲" : "▼"}</span>
              <span className="ticker__sep" />
            </span>
          ))}
        </div>
      </div>
      <div className="ticker__fade ticker__fade--l" />
      <div className="ticker__fade ticker__fade--r" />
    </div>
  );
}

/* ─────────────────────────────────────────
   HOME
───────────────────────────────────────── */
export default function Home() {
  const [loggedIn, setLoggedIn]   = useState(false);
  const [yesterday, setYesterday] = useState([]);
  const [today, setToday]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [ready, setReady]         = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
    load();
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  async function load() {
    try {
      const [yr, td] = await Promise.all([
        api.get("/api/picks/yesterday"),
        api.get("/api/picks/today"),
      ]);
      setYesterday(yr.data);
      setToday(td.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const free = today.filter((p) => !p.is_vip);
  const vip  = today.filter((p) => p.is_vip === 1 || p.is_vip === true);

  /* free card */
  const renderFree = (pick, i) => (
    <PickCard key={pick.id}>
      <header className="pc__top">
        <span className={`badge badge--${(pick.status || "").toLowerCase()}`}>
          <span className="badge__dot" />
          {pick.status}
        </span>
        <span className="pc__idx">#{String(i + 1).padStart(2, "0")}</span>
      </header>

      <div className="pc__matchup">
        <span className="pc__team">{pick.team1}</span>
        <span className="pc__vs">VS</span>
        <span className="pc__team">{pick.team2}</span>
      </div>

      <div className="pc__rule" />

      <div className="pc__meta">
        <div className="pc__cell">
          <span className="pc__label">Kick-off</span>
          <span className="pc__value pc__value--time">🕐 {pick.time}</span>
        </div>
        <div className="pc__cell">
          <span className="pc__label">Selection</span>
          <span className="pc__value pc__value--sel">⚽ {pick.prediction}</span>
        </div>
        <div className="pc__cell">
          <span className="pc__label">Odds</span>
          <span className="pc__value pc__value--odds">{pick.odds}</span>
        </div>
      </div>
    </PickCard>
  );

  /* vip card */
  const renderVip = (pick, i) => (
    <PickCard key={pick.id} gold>
      <div className="pc__ribbon" />

      <header className="pc__top">
        <Link to="/vip-access-denied" className="badge badge--vip">
          <span className="badge__dot" />
          Members Only 🪙
        </Link>
        <span className="pc__idx pc__idx--gold">VIP</span>
      </header>

      <div className="pc__matchup">
        <span className="pc__team pc__team--gold">{pick.team1}</span>
        <span className="pc__vs pc__vs--gold">VS</span>
        <span className="pc__team pc__team--gold">{pick.team2}</span>
      </div>

      <div className="pc__rule pc__rule--gold" />

      <div className="pc__meta">
        <div className="pc__cell">
          <span className="pc__label">Kick-off</span>
          <span className="pc__value pc__value--time">🕐 {pick.time}</span>
        </div>
        <div className="pc__cell">
          <span className="pc__label">Selection</span>
          <Link to="/vip-access-denied" className="pc__value pc__redacted">
            <span className="pc__bar">UNLOCK 🔐</span>
          </Link>
        </div>
        <div className="pc__cell">
          <span className="pc__label">Odds</span>
          <Link to="/vip-access-denied" className="pc__value pc__redacted">
            <span className="pc__bar">LOCKED</span>
          </Link>
        </div>
      </div>
    </PickCard>
  );

  return (
    <div className={`page ${ready ? "page--ready" : ""}`}>

      {/* fixed top bar */}
      <Ticker />

      {/* background */}
      <div className="bg" aria-hidden="true">
        <div className="bg__grid" />
        <div className="bg__orb bg__orb--a" />
        <div className="bg__orb bg__orb--b" />
        <div className="bg__orb bg__orb--c" />
        <div className="bg__vignette" />
      </div>

      {/* ══ HERO ══════════════════════════════════ */}
      <section className="hero">
        <div className="container hero__inner">

          <div className="eyebrow">
            <span className="eyebrow__line" />
            <span className="eyebrow__text">Mega-Odds Intelligence</span>
            <span className="eyebrow__line" />
          </div>

          <h1 className="hero__h1">
            <span className="hero__word hero__word--a">Outsmart</span>
            <span className="hero__word hero__word--b">
              the&nbsp;<em>Odds</em><span className="hero__dot">.</span>
            </span>
            <span className="hero__word hero__word--c">Every Bet.</span>
          </h1>

          <p className="hero__lead">
            Verified insider intelligence processed through real-time predictive models —
            delivered before the market moves. Not a tipster. A <strong>system</strong>.
            Trusted by over <strong>10,000 members</strong> across 38 countries.
          </p>

          <div className="hero__ctas">
            {loggedIn ? (
              <>
                <Link to="/features" className="btn btn--primary">
                  Explore VIP Picks <span>→</span>
                </Link>
                <Link to="/learn" className="btn btn--ghost">Learn More</Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn btn--primary">
                  Join the Inner Circle <span>→</span>
                </Link>
                <Link to="/testimonials" className="btn btn--ghost">See Proof</Link>
              </>
            )}
          </div>

          <div className="stats">
            <div className="stats__block">
              <strong className="stats__num"><CountUp target={10500} suffix="+" /></strong>
              <span className="stats__lbl">Active Members</span>
            </div>
            <div className="stats__divider" />
            <div className="stats__block">
              <strong className="stats__num"><CountUp target={100} suffix="%" /></strong>
              <span className="stats__lbl">Win Rate</span>
            </div>
            <div className="stats__divider" />
            <div className="stats__block">
              <strong className="stats__num">VIP</strong>
              <span className="stats__lbl">Fixed Matches</span>
            </div>
            <div className="stats__divider" />
            <div className="stats__block">
              <strong className="stats__num"><CountUp target={38} /></strong>
              <span className="stats__lbl">Countries</span>
            </div>
          </div>

        </div>
      </section>

      {/* ══ TRUST STRIP ════════════════════════════ */}
      <div className="trust" aria-label="Trust indicators">
        {[
          "256-Bit Encrypted",
          "Insider Verified",
          "Real-Time Models",
          "Zero Picks Hidden",
          "Refund Guaranteed",
        ].map((t, i) => (
          <span key={i} className="trust__pill">
            <span className="trust__icon">◆</span>
            {t}
          </span>
        ))}
      </div>

      {/* ══ PICKS SECTIONS ═════════════════════════ */}

      {!loading && yesterday.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section__head">
              <div>
                <p className="section__tag">Yesterday · Results</p>
                <h2 className="section__title">Previous Picks</h2>
                <p className="section__sub">Full transparency — every result, unedited.</p>
              </div>
              <span className="section__count">{yesterday.length} picks</span>
            </div>
            <div className="picks-grid">
              {yesterday.map((p, i) => renderFree(p, i))}
            </div>
          </div>
        </section>
      )}

      {!loading && free.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section__head">
              <div>
                <p className="section__tag">Today · Complimentary</p>
                <h2 className="section__title">Today's Free Picks</h2>
                <p className="section__sub">A window into our methodology. The real edge is for members.</p>
              </div>
              <span className="section__count">{free.length} picks</span>
            </div>
            <div className="picks-grid">
              {free.map((p, i) => renderFree(p, i))}
            </div>
          </div>
        </section>
      )}

      {!loading && vip.length > 0 && (
        <section className="section section--vip">
          <div className="container">
            <div className="section__head">
              <div>
                <p className="section__tag section__tag--gold">Members Only · Classified</p>
                <h2 className="section__title section__title--gold">VIP Intelligence</h2>
                <p className="section__sub">Fixed match intelligence from verified insiders. Active members only.</p>
              </div>
              <Link to="/vip-access-denied" className="btn btn--gold">
                Unlock Access <span>→</span>
              </Link>
            </div>
            <div className="picks-grid">
              {vip.map((p, i) => renderVip(p, i))}
            </div>
          </div>
        </section>
      )}

      {/* ══ MANIFESTO ══════════════════════════════ */}
      <div className="manifesto">
        <span className="manifesto__line" />
        <blockquote className="manifesto__quote">
          "We do not predict. We <em>know</em>."
        </blockquote>
        <span className="manifesto__line" />
      </div>

      {/* ══ FOOTER ═════════════════════════════════ */}
      <footer className="footer">
        <span className="footer__gem">◆</span>
        © {new Date().getFullYear()} Mega-Odds Intelligence · All rights reserved
        <span className="footer__gem">◆</span>
      </footer>

    </div>
  );
}

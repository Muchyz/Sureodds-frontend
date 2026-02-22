import "./Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

/* ── Animated Number ── */
function CountUp({ target, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const [on, setOn] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.4 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  useEffect(() => {
    if (!on) return;
    let f = 0; const N = 90;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    const go = () => { f++; setVal(Math.round(target * ease(Math.min(f/N,1)))); if (f < N) requestAnimationFrame(go); };
    requestAnimationFrame(go);
  }, [on, target]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ── Mouse Parallax Card ── */
function ParallaxCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const raf = useRef(null);
  const move = useCallback((e) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
      el.style.transform = `perspective(1200px) rotateX(${y}deg) rotateY(${x}deg) scale(1.01)`;
      el.style.setProperty("--mx", `${(e.clientX - r.left) / r.width * 100}%`);
      el.style.setProperty("--my", `${(e.clientY - r.top) / r.height * 100}%`);
    });
  }, []);
  const leave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (ref.current) {
      ref.current.style.transition = "transform 0.7s cubic-bezier(.23,1,.32,1)";
      ref.current.style.transform = "";
      setTimeout(() => { if(ref.current) ref.current.style.transition = ""; }, 700);
    }
  }, []);
  return (
    <div ref={ref} className={className} style={style} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </div>
  );
}

/* ── Ticker ── */
const ODDS = [
  {n:"Man City",v:"2.10",up:true},{n:"Real Madrid",v:"1.85",up:false},
  {n:"PSG",v:"3.40",up:true},{n:"Barcelona",v:"2.20",up:true},
  {n:"Liverpool",v:"1.95",up:false},{n:"Inter Milan",v:"2.75",up:true},
  {n:"Juventus",v:"3.10",up:false},{n:"Chelsea",v:"2.50",up:true},
  {n:"Arsenal",v:"1.78",up:true},{n:"Bayern",v:"1.55",up:false},
];

function Ticker() {
  const items = [...ODDS,...ODDS,...ODDS];
  return (
    <div className="ticker">
      <div className="ticker__chip">
        <span className="ticker__dot" />
        <span>LIVE ODDS</span>
      </div>
      <div className="ticker__scroll">
        <div className="ticker__inner">
          {items.map((d,i) => (
            <span key={i} className={`titem ${d.up?"titem--up":"titem--dn"}`}>
              <span className="titem__name">{d.n}</span>
              <span className="titem__val">{d.v}</span>
              <span className="titem__arr">{d.up ? "▲" : "▼"}</span>
              <span className="titem__sep" />
            </span>
          ))}
        </div>
      </div>
      <div className="ticker__fade ticker__fade--l" />
      <div className="ticker__fade ticker__fade--r" />
    </div>
  );
}

/* ── Status Badge ── */
function Badge({ status }) {
  const s = (status || "").toLowerCase();
  const icons = { won:"🟢", lost:"✕", pending:"◎", live:"◉" };
  return (
    <span className={`badge badge--${s}`}>
      <span className="badge__icon">{icons[s] || "◎"}</span>
      {status}
    </span>
  );
}

/* ── Pick Card ── */
function PickCard({ pick, index, gold = false }) {
  return (
    <ParallaxCard
      className={`pcard ${gold ? "pcard--gold" : ""}`}
      style={{ "--delay": `${index * 0.08}s` }}
    >
      {gold && <div className="pcard__shimmer" />}
      <div className="pcard__glow" />

      <header className="pcard__head">
        {gold
          ? <Link to="/vip-access-denied" className="badge badge--vip">
              <span className="badge__icon">⬡</span>Members Only
            </Link>
          : <Badge status={pick.status} />
        }
        <span className={`pcard__num ${gold ? "pcard__num--gold" : ""}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </header>

      <div className="pcard__matchup">
        <span className="pcard__team">{pick.team1}</span>
        <div className="pcard__vs">
          <div className="vs__ring">
            <span className="vs__text">VS</span>
          </div>
        </div>
        <span className="pcard__team pcard__team--r">{pick.team2}</span>
      </div>

      <div className={`pcard__line ${gold ? "pcard__line--gold" : ""}`} />

      <footer className="pcard__foot">
        <div className="pcard__datum">
          <span className="datum__label">Kick-off</span>
          <span className="datum__val datum__val--time">{pick.time}</span>
        </div>
        <div className="pcard__datum">
          <span className="datum__label">Selection</span>
          {gold
            ? <Link to="/vip-access-denied" className="datum__redact">
                <span className="redact__bar">UNLOCK 🔐</span>
              </Link>
            : <span className="datum__val datum__val--pick">{pick.prediction}</span>
          }
        </div>
        <div className="pcard__datum">
          <span className="datum__label">Odds</span>
          {gold
            ? <Link to="/vip-access-denied" className="datum__redact">
                <span className="redact__bar redact__bar--odds">LOCKED</span>
              </Link>
            : <span className="datum__val datum__val--odds">{pick.odds}</span>
          }
        </div>
      </footer>
    </ParallaxCard>
  );
}

/* ── Skeleton Pick Card ── */
function SkeletonCard({ index, gold = false }) {
  return (
    <div
      className={`pcard pcard--skeleton ${gold ? "pcard--gold pcard--skeleton-gold" : ""}`}
      style={{ "--delay": `${index * 0.08}s`, opacity: 1, animation: "none" }}
    >
      {gold && <div className="pcard__shimmer" />}

      <header className="pcard__head" style={{ marginBottom: 22 }}>
        <div className="skel skel--badge" />
        <div className="skel skel--num" />
      </header>

      <div className="pcard__matchup" style={{ marginBottom: 20 }}>
        <div className="skel skel--team" />
        <div className="vs__ring" style={{ flexShrink: 0 }}>
          <span className="vs__text" style={{ opacity: 0.15 }}>VS</span>
        </div>
        <div className="skel skel--team skel--team-r" />
      </div>

      <div className="pcard__line" style={{ marginBottom: 18, opacity: 0.4 }} />

      <footer className="pcard__foot">
        {[0,1,2].map(i => (
          <div key={i} className="pcard__datum">
            <div className="skel skel--label" />
            <div className={`skel skel--val ${i === 2 ? "skel--val-odds" : ""}`} />
          </div>
        ))}
      </footer>
    </div>
  );
}

/* ── Skeleton Section ── */
function SkeletonSection({ tag, title, sub, count = 3, gold = false }) {
  return (
    <section className={`section ${gold ? "section--vip" : ""}`}>
      {gold && <div className="section__vip-aura" aria-hidden="true" />}
      <div className="section__container">
        <div className="section__head">
          <div className="section__meta">
            <span className="section__tag" style={{ color: gold ? "var(--g4)" : undefined }}>{tag}</span>
            <h2 className={`section__title ${gold ? "section__title--gold" : ""}`}>{title}</h2>
            <p className="section__sub">{sub}</p>
          </div>
          <div className="skel skel--count" />
        </div>
        <div className="cards-grid">
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} index={i} gold={gold} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════
   MAIN PAGE
══════════════════════════ */
export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [yesterday, setYesterday] = useState([]);
  const [today, setToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
    load();
    // Wait for fonts, then fire app:ready to dismiss the index.html splash screen
    const reveal = () => {
      setMounted(true);
      window.dispatchEvent(new Event('app:ready'));
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(reveal, 80));
    } else {
      setTimeout(reveal, 600);
    }
  }, []);

  async function load() {
    try {
      const [y, t] = await Promise.all([
        api.get("/api/picks/yesterday"),
        api.get("/api/picks/today")
      ]);
      setYesterday(y.data); setToday(t.data);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  }

  const free = today.filter(p => !p.is_vip);
  const vip  = today.filter(p => p.is_vip === 1 || p.is_vip === true);

  return (
    <div className={`page ${mounted ? "page--on" : ""}`}>

      <div className="ambience" aria-hidden="true">
        <div className="orb orb--a" /><div className="orb orb--b" /><div className="orb orb--c" />
        <div className="grain" /><div className="vignette" />
      </div>

      <Ticker />

      {/* ════ HERO ════ */}
      <section className="hero">
        <div className="hero__container">

          <div className="hero__left">
            <div className="hero__eyebrow">
              <div className="eyebrow__gem">◆</div>
              <span>Private Intelligence Network</span>
              <div className="eyebrow__dot" />
              <span>Est. 2021</span>
            </div>
            <h1 className="hero__title">
              <span className="ht__line ht__line--1">Outsmart</span>
              <span className="ht__line ht__line--2">
                <em>the</em><strong>Odds</strong><span className="ht__period">.</span>
              </span>
              <span className="ht__line ht__line--3">Every Bet.</span>
            </h1>
            <p className="hero__desc">
              Verified insider intelligence, delivered before the market moves.
              Not prediction — <em>knowledge</em>.
            </p>
            <div className="hero__actions">
              {loggedIn ? (
                <>
                  <Link to="/features" className="cta cta--primary"><span>Explore VIP Picks</span><div className="cta__arrow">→</div></Link>
                  <Link to="/learn" className="cta cta--ghost">View Results</Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="cta cta--primary"><span>Join the Inner Circle</span><div className="cta__arrow">→</div></Link>
                  <Link to="/testimonials" className="cta cta--ghost">See Proof</Link>
                </>
              )}
            </div>
            <div className="hero__badges">
              {["Insider Verified", "256-bit Encrypted", "Real-Time Models", "38 Countries"].map((t,i) => (
                <div key={i} className="hbadge"><span className="hbadge__gem">◆</span>{t}</div>
              ))}
            </div>
          </div>

          <div className="hero__right">
            <ParallaxCard className="hpanel">
              <div className="hpanel__bg" /><div className="hpanel__border" />
              <div className="hpanel__top">
                <div className="hpanel__label">Network Overview</div>
                <div className="hpanel__live"><span className="live__pip" /><span>LIVE</span></div>
              </div>
              <div className="hpanel__stats">
                {[
                  { num: 10500, suf: "+", label: "Active Members" },
                  { num: 100,   suf: "%", label: "Win Rate"       },
                  { num: 38,    suf: "",  label: "Countries"      },
                  { num: 4,     suf: "yr",label: "Track Record"   },
                ].map((s,i) => (
                  <div key={i} className="hstat">
                    <div className="hstat__num"><CountUp target={s.num} suffix={s.suf} /></div>
                    <div className="hstat__label">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="hpanel__divider" />
              <blockquote className="hpanel__quote">
                "Not a tipster. A <em>system</em>. Verified insider intelligence delivered before the market moves."
              </blockquote>
              <span className="corner corner--tl" /><span className="corner corner--tr" />
              <span className="corner corner--bl" /><span className="corner corner--br" />
            </ParallaxCard>
            <div className="hero__float-accent" aria-hidden="true">INTELLIGENCE</div>
          </div>
        </div>
        <div className="hero__scroll-hint">
          <div className="scroll__line" /><span className="scroll__label">Scroll</span>
        </div>
      </section>

      {/* ════ YESTERDAY PICKS ════ */}
      {loading ? (
        <SkeletonSection
          tag="Yesterday · Results"
          title="Previous Picks"
          sub="Full transparency — every result, unedited."
          count={3}
        />
      ) : yesterday.length > 0 && (
        <section className="section">
          <div className="section__container">
            <div className="section__head">
              <div className="section__meta">
                <span className="section__tag">Yesterday · Results</span>
                <h2 className="section__title">Previous Picks</h2>
                <p className="section__sub">Full transparency — every result, unedited.</p>
              </div>
              <div className="section__count">{yesterday.length} <span>picks</span></div>
            </div>
            <div className="cards-grid">
              {yesterday.map((p, i) => <PickCard key={p.id} pick={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ════ FREE PICKS ════ */}
      {loading ? (
        <SkeletonSection
          tag="Today · Complimentary"
          title="Today's Free Picks"
          sub="A window into our methodology. The real edge is reserved for members."
          count={3}
        />
      ) : free.length > 0 && (
        <section className="section">
          <div className="section__container">
            <div className="section__head">
              <div className="section__meta">
                <span className="section__tag">Today · Complimentary</span>
                <h2 className="section__title">Today's Free Picks</h2>
                <p className="section__sub">A window into our methodology. The real edge is reserved for members.</p>
              </div>
              <div className="section__count">{free.length} <span>picks</span></div>
            </div>
            <div className="cards-grid">
              {free.map((p, i) => <PickCard key={p.id} pick={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ════ VIP PICKS ════ */}
      {loading ? (
        <SkeletonSection
          tag="Members Only · Classified"
          title="VIP Intelligence"
          sub="Fixed match intelligence from verified insiders. Active members only."
          count={3}
          gold
        />
      ) : vip.length > 0 && (
        <section className="section section--vip">
          <div className="section__vip-aura" aria-hidden="true" />
          <div className="section__container">
            <div className="section__head">
              <div className="section__meta">
                <span className="section__tag section__tag--gold">Members Only · Classified</span>
                <h2 className="section__title section__title--gold">VIP Intelligence</h2>
                <p className="section__sub">Fixed match intelligence from verified insiders. Active members only.</p>
              </div>
              <Link to="/vip-access-denied" className="cta cta--gold">
                <span>Unlock Access</span><div className="cta__arrow">→</div>
              </Link>
            </div>
            <div className="cards-grid">
              {vip.map((p, i) => <PickCard key={p.id} pick={p} index={i} gold />)}
            </div>
          </div>
        </section>
      )}

      {/* ════ MANIFESTO ════ */}
      <div className="manifesto">
        <div className="manifesto__inner">
          <div className="manifesto__ornament">◆</div>
          <blockquote className="manifesto__text">"We do not predict.<br/>We <em>know</em>."</blockquote>
          <div className="manifesto__ornament">◆</div>
        </div>
      </div>

      {/* ════ FOOTER ════ */}
      <footer className="footer">
        <div className="footer__brand">
          <div className="footer__wordmark">MEGA-ODDS</div>
          <div className="footer__rule" />
          <p className="footer__tagline">"We do not predict. We <em>know</em>."</p>
        </div>
        <nav className="footer__nav">
          <div className="footer__col">
            <span className="footer__col-label">Intelligence</span>
            <Link to="/features"     className="footer__link">VIP Picks</Link>
            <Link to="/learn"        className="footer__link">What's fixed matches</Link>
            <Link to="/testimonials" className="footer__link">Testimonials</Link>
          </div>
          <div className="footer__col">
            <span className="footer__col-label">Account</span>
            <Link to="/signup"   className="footer__link">Join the Network</Link>
            <Link to="/login"    className="footer__link">Sign In</Link>
            <Link to="/pricing"  className="footer__link">Upgrade to VIP</Link>
          </div>
          <div className="footer__col">
            <span className="footer__col-label">Company</span>
            <Link to="/about"        className="footer__link">How It Works</Link>
            <Link to="/contact"      className="footer__link">Contact Us</Link>
            <Link to="/testimonials" className="footer__link">Members</Link>
          </div>
        </nav>
        <div className="footer__base">
          <div className="footer__base-inner">
            <span className="footer__copy">© {new Date().getFullYear()} Mega-Odds Intelligence</span>
            <span className="footer__copy-sep" />
            <span className="footer__copy">All rights reserved</span>
            <span className="footer__copy-sep" />
            <span className="footer__copy">Private &amp; Confidential</span>
            <span className="footer__copy-sep" />
            <span className="footer__copy">Est. 2021</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

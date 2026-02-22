import "./Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

function CountUp({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [on, setOn] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  useEffect(() => {
    if (!on) return;
    let f = 0; const N = 80;
    const ease = t => 1 - Math.pow(1 - t, 4);
    const go = () => { f++; setVal(Math.round(target * ease(Math.min(f / N, 1)))); if (f < N) requestAnimationFrame(go); };
    requestAnimationFrame(go);
  }, [on, target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function TiltCard({ children, className = "", gold = false, style = {} }) {
  const ref = useRef(null);
  const raf = useRef(null);
  const onMove = useCallback((e) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -8;
      el.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width)  * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top)  / r.height) * 100}%`);
    });
  }, []);
  const onLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return (
    <article ref={ref} className={`card ${gold ? "card--gold" : ""} ${className}`} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="card__glare" />
      {children}
    </article>
  );
}

const TDATA = [
  { n:"Man City",v:"2.10",up:true },{ n:"Real Madrid",v:"1.85",up:false },
  { n:"PSG",v:"3.40",up:true },{ n:"Barcelona",v:"2.20",up:true },
  { n:"Liverpool",v:"1.95",up:false },{ n:"Inter Milan",v:"2.75",up:true },
  { n:"Juventus",v:"3.10",up:false },{ n:"Chelsea",v:"2.50",up:true },
  { n:"Arsenal",v:"1.78",up:true },{ n:"Bayern",v:"1.55",up:false },
];

function Ticker() {
  const all = [...TDATA,...TDATA];
  return (
    <div className="ticker">
      <div className="ticker__badge"><span className="ticker__pip" />LIVE ODDS</div>
      <div className="ticker__track">
        <div className="ticker__rail">
          {all.map((d,i)=>(
            <span key={i} className={`ticker__item ${d.up?"up":"dn"}`}>
              <span className="t-name">{d.n}</span>
              <span className="t-val">{d.v}</span>
              <span className="t-arr">{d.up?"▲":"▼"}</span>
              <span className="t-sep"/>
            </span>
          ))}
        </div>
        <div className="ticker__fade ticker__fade--l"/>
        <div className="ticker__fade ticker__fade--r"/>
      </div>
    </div>
  );
}

function Badge({ status }) {
  const s = (status||"").toLowerCase();
  return <span className={`badge badge--${s}`}><span className="badge__pip"/>{status}</span>;
}

export default function Home() {
  const [loggedIn,setLoggedIn] = useState(false);
  const [yesterday,setYesterday] = useState([]);
  const [today,setToday] = useState([]);
  const [loading,setLoading] = useState(true);
  const [ready,setReady] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
    load();
    const t = setTimeout(()=>setReady(true),80);
    return ()=>clearTimeout(t);
  }, []);

  async function load() {
    try {
      const [y,t] = await Promise.all([api.get("/api/picks/yesterday"),api.get("/api/picks/today")]);
      setYesterday(y.data); setToday(t.data);
    } catch(e){console.error(e);} finally{setLoading(false);}
  }

  const free = today.filter(p=>!p.is_vip);
  const vip  = today.filter(p=>p.is_vip===1||p.is_vip===true);

  const renderFree = (pick,i) => (
    <TiltCard key={pick.id} style={{animationDelay:`${i*0.06}s`}}>
      <div className="card__top">
        <Badge status={pick.status}/>
        <span className="card__idx">#{String(i+1).padStart(2,"0")}</span>
      </div>
      <div className="card__matchup">
        <span className="card__team">{pick.team1}</span>
        <div className="card__vs"><span className="vs-bar"/><span className="vs-text">VS</span><span className="vs-bar"/></div>
        <span className="card__team">{pick.team2}</span>
      </div>
      <div className="card__rule"/>
      <div className="card__meta">
        <div className="meta-cell">
          <span className="meta-label">Kick-off</span>
          <span className="meta-val meta-val--time">{pick.time}</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">Selection</span>
          <span className="meta-val meta-val--pick">{pick.prediction}</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">Odds</span>
          <span className="meta-val meta-val--odds">{pick.odds}</span>
        </div>
      </div>
    </TiltCard>
  );

  const renderVip = (pick,i) => (
    <TiltCard key={pick.id} gold style={{animationDelay:`${i*0.06}s`}}>
      <div className="card__shimmer"/>
      <div className="card__top">
        <Link to="/vip-access-denied" className="badge badge--vip"><span className="badge__pip"/>Members Only 🪙</Link>
        <span className="card__idx card__idx--gold">VIP</span>
      </div>
      <div className="card__matchup">
        <span className="card__team card__team--gold">{pick.team1}</span>
        <div className="card__vs"><span className="vs-bar vs-bar--gold"/><span className="vs-text vs-text--gold">VS</span><span className="vs-bar vs-bar--gold"/></div>
        <span className="card__team card__team--gold">{pick.team2}</span>
      </div>
      <div className="card__rule card__rule--gold"/>
      <div className="card__meta">
        <div className="meta-cell">
          <span className="meta-label">Kick-off</span>
          <span className="meta-val meta-val--time">{pick.time}</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">Selection</span>
          <Link to="/vip-access-denied" className="meta-val meta-locked">
            <span className="lock-bar">UNLOCK 🔐</span>
          </Link>
        </div>
        <div className="meta-cell">
          <span className="meta-label">Odds</span>
          <Link to="/vip-access-denied" className="meta-val meta-locked">
            <span className="lock-bar">LOCKED</span>
          </Link>
        </div>
      </div>
    </TiltCard>
  );

  return (
    <div className={`pg ${ready?"pg--on":""}`}>
      <Ticker/>
      <div className="bg" aria-hidden="true">
        <div className="bg__grid"/>
        <div className="bg__orb bg__orb--a"/><div className="bg__orb bg__orb--b"/><div className="bg__orb bg__orb--c"/>
        <div className="bg__vig"/>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero__inner">
          <div className="hero__col hero__col--left">
            <p className="hero__eyebrow">
              <span className="eyebrow__dash"/>
              Private Intelligence Network · Est. 2021
              <span className="eyebrow__dash"/>
            </p>
            <h1 className="hero__h1">
              <span className="h1-a">Outsmart</span>
              <span className="h1-b"><em>the</em> Odds<span className="h1-dot">.</span></span>
              <span className="h1-c">Every Bet.</span>
            </h1>
            <div className="hero__ctas">
              {loggedIn
                ? <><Link to="/features" className="btn btn--prime">Explore VIP Picks <span>→</span></Link><Link to="/learn" className="btn btn--ghost">Learn More</Link></>
                : <><Link to="/signup" className="btn btn--prime">Join the Inner Circle <span>→</span></Link><Link to="/testimonials" className="btn btn--ghost">See Proof</Link></>
              }
            </div>
            <div className="hero__pills">
              {["Insider Verified","256-bit Encrypted","Real-Time Models","38 Countries"].map((t,i)=>(
                <span key={i} className="pill"><span className="pill__gem">◆</span>{t}</span>
              ))}
            </div>
          </div>

          <div className="hero__col hero__col--right">
            <div className="panel">
              <div className="panel__head">
                <span className="panel__label">Network Overview</span>
                <span className="panel__live"><span className="panel__pip"/>LIVE</span>
              </div>
              <div className="panel__stats">
                <div className="panel__stat">
                  <strong className="panel__num"><CountUp target={10500} suffix="+"/></strong>
                  <span className="panel__desc">Active Members</span>
                </div>
                <div className="panel__stat">
                  <strong className="panel__num"><CountUp target={100} suffix="%"/></strong>
                  <span className="panel__desc">Win Rate</span>
                </div>
                <div className="panel__stat">
                  <strong className="panel__num"><CountUp target={38}/></strong>
                  <span className="panel__desc">Countries</span>
                </div>
                <div className="panel__stat">
                  <strong className="panel__num"><CountUp target={4} suffix="yr"/></strong>
                  <span className="panel__desc">Track Record</span>
                </div>
              </div>
              <p className="panel__quote">"Not a tipster. A <em>system</em>. Verified insider intelligence delivered before the market moves."</p>
              <div className="panel__br panel__br--tl"/><div className="panel__br panel__br--tr"/>
              <div className="panel__br panel__br--bl"/><div className="panel__br panel__br--br"/>
            </div>
          </div>
        </div>
        <div className="hero__scroll" aria-hidden="true">
          <span className="scroll-line"/><span className="scroll-label">Scroll</span>
        </div>
      </section>

      {/* PICKS */}
      {!loading && yesterday.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <div className="sec__head">
              <div><p className="sec__tag">Yesterday · Results</p><h2 className="sec__title">Previous Picks</h2><p className="sec__sub">Full transparency — every result, unedited.</p></div>
              <span className="sec__count">{yesterday.length} picks</span>
            </div>
            <div className="picks-grid">{yesterday.map((p,i)=>renderFree(p,i))}</div>
          </div>
        </section>
      )}

      {!loading && free.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <div className="sec__head">
              <div><p className="sec__tag">Today · Complimentary</p><h2 className="sec__title">Today's Free Picks</h2><p className="sec__sub">A window into our methodology. The real edge is reserved for members.</p></div>
              <span className="sec__count">{free.length} picks</span>
            </div>
            <div className="picks-grid">{free.map((p,i)=>renderFree(p,i))}</div>
          </div>
        </section>
      )}

      {!loading && vip.length > 0 && (
        <section className="sec sec--vip">
          <div className="sec__vip-glow" aria-hidden="true"/>
          <div className="wrap">
            <div className="sec__head">
              <div><p className="sec__tag sec__tag--gold">Members Only · Classified</p><h2 className="sec__title sec__title--gold">VIP Intelligence</h2><p className="sec__sub">Fixed match intelligence from verified insiders. Active members only.</p></div>
              <Link to="/vip-access-denied" className="btn btn--gold-outline">Unlock Access <span>→</span></Link>
            </div>
            <div className="picks-grid">{vip.map((p,i)=>renderVip(p,i))}</div>
          </div>
        </section>
      )}

      {/* MANIFESTO */}
      <div className="manifesto">
        <span className="manifesto__line"/>
        <blockquote className="manifesto__text">"We do not predict. We <em>know</em>."</blockquote>
        <span className="manifesto__line"/>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer__gem">◆</span>
        © {new Date().getFullYear()} Mega-Odds Intelligence · All rights reserved · Private & Confidential
        <span className="footer__gem">◆</span>
      </footer>
    </div>
  );
}

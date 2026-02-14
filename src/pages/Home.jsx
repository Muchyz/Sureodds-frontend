import "./Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [yesterdayPicks, setYesterdayPicks] = useState([]);
  const [todayPicks, setTodayPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchPublicPicks();
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

  const renderYesterdayCard = (pick) => (
    <div key={pick.id} className="pick-card">
      <div className={`pick-badge ${pick.status?.toLowerCase()}`}>{pick.status}</div>
      <div className="teams">
        <span className="team-name">
          <span className="trophy">🏆</span>
          {pick.team1}
        </span>
        <span className="vs">VS</span>
        <span className="team-name">{pick.team2}</span>
      </div>
      <div className="pick-divider" />
      <div className="pick-meta">
        <div className="meta-item">
          <span className="meta-label">Time</span>
          <span className="meta-value time">{pick.time}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Bet</span>
          <span className="meta-value prediction">⚽ {pick.prediction}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Odds</span>
          <span className="meta-value odds">{pick.odds}</span>
        </div>
      </div>
    </div>
  );

  const renderVIPCard = (pick) => (
    <div key={pick.id} className="pick-card vip-pick-card">
      <div className="vip-ribbon">EXCLUSIVE</div>
      <Link to="/vip-access-denied" className="pick-badge vip-badge">
        VIP Only 🪙
      </Link>
      <div className="teams">
        <span className="team-name">
          <span className="trophy">🏆</span>
          {pick.team1}
        </span>
        <span className="vs">VS</span>
        <span className="team-name">{pick.team2}</span>
      </div>
      <div className="pick-divider" />
      <div className="pick-meta">
        <div className="meta-item">
          <span className="meta-label">Time</span>
          <span className="meta-value time">{pick.time}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Bet</span>
          <Link to="/vip-access-denied" className="meta-value prediction locked">
            <span className="lock-icon">🔒</span>
            <span>1st Half: Locked</span>
          </Link>
        </div>
        <div className="meta-item">
          <span className="meta-label">Odds</span>
          <Link to="/vip-access-denied" className="meta-value odds locked">
            <span className="lock-icon">🔒</span>
            <span>Locked</span>
          </Link>
        </div>
      </div>
    </div>
  );

  const vipPicks  = todayPicks.filter((p) => p.is_vip === 1 || p.is_vip === true);
  const freePicks = todayPicks.filter((p) => !p.is_vip);

  return (
    <div className="home">

      {/* Background orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* ── HERO ── */}
      <section className="hero">

        <span className="pill">
          <span className="pill-shine" />
          Sure Fixed Matches
        </span>

        <h1>
          Outsmart the Odds.<br />
          <span className="gradient-text">Every Bet.</span>
        </h1>

        <p className="hero-text">
          Mega-Odds fuses real-time data, sharp probability models, and
          insider intelligence — so you bet with precision, not guesswork.
        </p>

        <div className="hero-actions">
          {isLoggedIn ? (
            <>
              <Link to="/features">
                <button className="cta-primary">
                  <span>🔥 Explore VIP Picks</span>
                  <div className="button-glow" />
                </button>
              </Link>
              <Link to="/learn" className="cta-secondary">
                <span>Learn About Fixed Matches</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup">
                <button className="cta-primary">
                  <span>Join Now — It's Free</span>
                  <div className="button-glow" />
                </button>
              </Link>
              <Link to="/testimonials" className="cta-secondary">
                <span>See How It Works</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
            </>
          )}
        </div>

        {/* Stat Cards */}
        <section className="quick-cards">
          <div className="quick-card">
            <div className="card-shine" />
            <span className="stat-icon">⭐️</span>
            <h3>100%</h3>
            <p>Verified</p>
          </div>
          <div className="quick-card">
            <div className="card-shine" />
            <span className="stat-icon">🎯</span>
            <h3>10K+</h3>
            <p>Active Bettors</p>
          </div>
          <div className="quick-card">
            <div className="card-shine" />
            <span className="stat-icon">👑</span>
            <h3>VIP</h3>
            <p>Fixed Matches</p>
          </div>
        </section>
      </section>

      {/* ── YESTERDAY ── */}
      {!loading && yesterdayPicks.length > 0 && (
        <section className="picks-section">
          <div className="section-header">
            <span className="fire-icon">🔥</span>
            <h2 className="picks-title">Yesterday's Top Picks</h2>
          </div>
          <div className="picks-list">
            {yesterdayPicks.map(renderYesterdayCard)}
          </div>
        </section>
      )}

      {/* ── FREE TODAY ── */}
      {!loading && freePicks.length > 0 && (
        <section className="picks-section">
          <div className="section-header">
            <span className="fire-icon">🔥</span>
            <h2 className="picks-title">Today's Free Picks</h2>
          </div>
          <div className="picks-list">
            {freePicks.map(renderYesterdayCard)}
          </div>
        </section>
      )}

      {/* ── VIP ── */}
      {!loading && vipPicks.length > 0 && (
        <section className="picks-section vip-section">
          <div className="section-header">
            <span className="vip-icon">👑</span>
            <h2 className="picks-title vip-title">Night VIP Bet</h2>
          </div>
          <div className="picks-list">
            {vipPicks.map(renderVIPCard)}
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Mega-Odds — All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;

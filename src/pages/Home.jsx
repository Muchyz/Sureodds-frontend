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

  // ── Pick card renderers ──────────────────────────────────────────

  const renderYesterdayCard = (pick) => (
    <div key={pick.id} className="pick-card">
      <div className={`pick-badge ${pick.status?.toLowerCase()}`}>{pick.status}</div>
      <div className="teams">
        <span className="team-name">
          <span className="trophy"></span>
          {pick.team1}
        </span>
        <span className="vs">VS</span>
        <span className="team-name">{pick.team2}</span>
      </div>
      <div className="pick-divider"></div>
      <div className="pick-meta">
        <div className="meta-item">
          <span className="meta-label">Time</span>
          <span className="meta-value time">{pick.time}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Bet</span>
          <span className="meta-value prediction">⚽️ {pick.prediction}</span>
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
        VIP Only
      </Link>
      <div className="teams">
        <span className="team-name">
          <span className="trophy"></span>
          {pick.team1}
        </span>
        <span className="vs">VS</span>
        <span className="team-name">{pick.team2}</span>
      </div>
      <div className="pick-divider"></div>
      <div className="pick-meta">
        <div className="meta-item">
          <span className="meta-label">Time</span>
          <span className="meta-value time">{pick.time}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Bet</span>
          <Link to="/vip-access-denied" className="meta-value prediction locked">
            <span className="lock-icon"></span>
            <span>1st Half: Locked</span>
          </Link>
        </div>
        <div className="meta-item">
          <span className="meta-label">Odds</span>
          <Link to="/vip-access-denied" className="meta-value odds locked">
            <span className="lock-icon"></span>
            <span>--</span>
          </Link>
        </div>
      </div>
    </div>
  );

  // ── Split today picks into VIP and free ─────────────────────────
  const vipPicks  = todayPicks.filter((p) => p.is_vip === 1 || p.is_vip === true);
  const freePicks = todayPicks.filter((p) => !p.is_vip);

  return (
    <div className="home">
      {/* Animated background */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* HERO */}
      <section className="hero">
        <span className="pill">
          <span className="pill-shine"></span>
          SURE FIXED MATCHES
        </span>

        <h1>
          Outsmart the Odds. <br />
          <span className="gradient-text">Every Bet.</span>
        </h1>

        <p className="hero-text">
          Mega-Odds uses real-time data, probability models, and sharp insights
          to help you bet smarter — not harder.
        </p>

        <div className="hero-actions">
          {isLoggedIn ? (
            <>
              <Link to="/features">
                <button className="cta-primary">
                  <span>🔥 Explore VIP Picks</span>
                  <div className="button-glow"></div>
                </button>
              </Link>
              <Link to="/learn" className="cta-secondary">
                <span>Learn About Fixed Matches</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup">
                <button className="cta-primary">
                  <span>Join Now</span>
                  <div className="button-glow"></div>
                </button>
              </Link>
              <Link to="/testimonials" className="cta-secondary">
                <span>See How It Works</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            </>
          )}
        </div>

        {/* VALUE STATS */}
        <section className="quick-cards">
          <div className="quick-card">
            <div className="card-shine"></div>
            <div className="stat-icon">⭐️</div>
            <h3>100%</h3>
            <p>Verified</p>
          </div>
          <div className="quick-card">
            <div className="card-shine"></div>
            <div className="stat-icon">🎯</div>
            <h3>10K+</h3>
            <p>Active Bettors</p>
          </div>
          <div className="quick-card">
            <div className="card-shine"></div>
            <div className="stat-icon">👑</div>
            <h3>VIP</h3>
            <p>Fixed Matches</p>
          </div>
        </section>
      </section>

      {/* YESTERDAY'S PICKS */}
      <section className="picks-section">
        <div className="section-header">
          <span className="fire-icon"></span>
          <h2 className="picks-title">Yesterday's Top Picks</h2>
        </div>

        {loading ? (
          <div className="picks-loading">
            <div className="loading-spinner"></div>
            <p>Loading picks...</p>
          </div>
        ) : yesterdayPicks.length === 0 ? (
          <div className="picks-empty">
            <p>No picks for yesterday yet.</p>
          </div>
        ) : (
          <div className="picks-list">
            {yesterdayPicks.map(renderYesterdayCard)}
          </div>
        )}
      </section>

      {/* FREE TODAY PICKS (non-VIP) */}
      {freePicks.length > 0 && (
        <section className="picks-section">
          <div className="section-header">
            <span className="fire-icon"></span>
            <h2 className="picks-title">Today's Free Picks</h2>
          </div>
          <div className="picks-list">
            {freePicks.map(renderYesterdayCard)}
          </div>
        </section>
      )}

      {/* TODAY'S VIP PICKS */}
      <section className="picks-section vip-section">
        <div className="section-header">
          <span className="vip-icon"></span>
          <h2 className="picks-title vip-title">NIGHT VIP BET</h2>
        </div>

        {loading ? (
          <div className="picks-loading">
            <div className="loading-spinner"></div>
            <p>Loading VIP picks...</p>
          </div>
        ) : vipPicks.length === 0 ? (
          <div className="picks-empty">
            <p>VIP picks coming soon. <Link to="/signup">Get VIP access →</Link></p>
          </div>
        ) : (
          <div className="picks-list">
            {vipPicks.map(renderVIPCard)}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Mega-Odds. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;

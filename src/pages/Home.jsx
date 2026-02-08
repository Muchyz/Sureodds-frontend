import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      {/* Animated background elements */}
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
          Sure Odds uses real-time data, probability models, and sharp insights
          to help you bet smarter — not harder.
        </p>

        <div className="hero-actions">
          <Link to="/signup">
            <button className="cta-primary">
              <span>Join Now</span>
              <div className="button-glow"></div>
            </button>
          </Link>

          <Link to="/features" className="cta-secondary">
            <span>See How It Works</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>

        {/* VALUE STATS - Moved inside hero */}
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

      {/* TODAY'S PICKS */}
      <section className="picks-section">
        <div className="section-header">
          <span className="fire-icon">🔥</span>
          <h2 className="picks-title">Yesterday's Top Picks</h2>
        </div>

        <div className="picks-list">
          {/* PICK CARD 1 */}
          <div className="pick-card">
            <div className="pick-badge">Won</div>
            <div className="teams">
              <span className="team-name">
                <span className="trophy">🏆</span>
                Mantova 1911
              </span>
              <span className="vs">VS</span>
              <span className="team-name">SSC Bari</span>
            </div>

            <div className="pick-divider"></div>

            <div className="pick-meta">
              <div className="meta-item">
                <span className="meta-label">Time</span>
                <span className="meta-value time">17:00</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Prediction</span>
                <span className="meta-value prediction">⚽️ 1st Half: 1:1</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Odds</span>
                <span className="meta-value odds">8.20</span>
              </div>
            </div>
          </div>

          {/* PICK CARD 2 */}
          <div className="pick-card">
            <div className="pick-badge">Won</div>
            <div className="teams">
              <span className="team-name">
                <span className="trophy">🏆</span>
                Vukovar 91
              </span>
              <span className="vs">VS</span>
              <span className="team-name">Istra 1961</span>
            </div>

            <div className="pick-divider"></div>

            <div className="pick-meta">
              <div className="meta-item">
                <span className="meta-label">Time</span>
                <span className="meta-value time">17:00</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Prediction</span>
                <span className="meta-value prediction">⚽️ 1st Half: 1:0</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Odds</span>
                <span className="meta-value odds">6.80</span>
              </div>
            </div>
          </div>

          {/* PICK CARD 3 */}
          <div className="pick-card">
            <div className="pick-badge">Won</div>
            <div className="teams">
              <span className="team-name">
                <span className="trophy">🏆</span>
                SC Faetano
              </span>
              <span className="vs">VS</span>
              <span className="team-name">SP Cailungo</span>
            </div>

            <div className="pick-divider"></div>

            <div className="pick-meta">
              <div className="meta-item">
                <span className="meta-label">Time</span>
                <span className="meta-value time">17:00</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Prediction</span>
                <span className="meta-value prediction">⚽️ 1st Half: 0:2</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Odds</span>
                <span className="meta-value odds">8.40</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Mega-Odds. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;

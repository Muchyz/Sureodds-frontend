import "./Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

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
          Mega-Odds uses real-time data, probability models, and sharp insights
          to help you bet smarter — not harder.
        </p>

        <div className="hero-actions">
          {isLoggedIn ? (
            // If logged in, show "Explore VIP Picks" instead of "Join Now"
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
            // If not logged in, show "Join Now"
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






      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Mega-Odds. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;

import "./About.css";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about">
      {/* Animated background elements */}
      <div className="bg-orbs-about">
        <div className="orb-about orb-about-1"></div>
        <div className="orb-about orb-about-2"></div>
        <div className="orb-about orb-about-3"></div>
      </div>

      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="hero-glow"></div>
        <span className="badge">
          <span className="badge-shine"></span>
          <span className="badge-icon">⚡</span>
          PROFESSIONAL BETTING PLATFORM
        </span>
        <h1>
          Precision Over <span className="gradient-text-about">Luck</span>
        </h1>
        <p className="hero-subtitle">
          Mega-Odds is built for bettors who understand that
          long-term profit comes from <strong>data</strong>, <strong>discipline</strong>, and <strong>timing</strong> —
          not emotions.
        </p>
        
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Win Rate</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">15K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </section>

      {/* TRUST BAR - ENHANCED */}
      <section className="trust-section">
        <div className="trust-bar">
          <div className="trust-card">
            <div className="trust-icon">✓</div>
            <h2>Verified Picks</h2>
            <span>Tracked performance with full transparency</span>
          </div>
          <div className="trust-card">
            <div className="trust-icon">⚡</div>
            <h2>Market Timing</h2>
            <span>Real-time odds movement analysis</span>
          </div>
          <div className="trust-card">
            <div className="trust-icon">🛡️</div>
            <h2>Risk Control</h2>
            <span>Professional bankroll discipline</span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT - REDESIGNED */}
      <section className="about-content">
        <div className="section-label">
          <span className="label-line"></span>
          <span className="label-text">WHO WE ARE</span>
          <span className="label-line"></span>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="card-icon-wrapper">
              <span className="card-icon">🎯</span>
            </div>
            <h3>What We Do</h3>
            <p>
              We leak football markets daily using advanced form data,
              team metrics, odds behavior, and confidential odels sourced by our match fixing agents,
              to identify high-value opportunities before lines adjust.
            </p>
            <div className="card-accent"></div>
          </div>

          <div className="about-card featured-card">
            <div className="featured-badge">MOST POPULAR</div>
            <div className="card-icon-wrapper">
              <span className="card-icon">👑</span>
            </div>
            <h3>Who This Is For</h3>
            <p>
              Mega-Odds is designed for serious bettors seeking an edge.
              Our matches are mainly confidential, leaked matches with known outcomes 
              and a <strong>guaranteed win</strong> backed by insider intelligence.
            </p>
            <div className="card-accent featured-accent"></div>
          </div>

          <div className="about-card">
            <div className="card-icon-wrapper">
              <span className="card-icon">🔒</span>
            </div>
            <h3>Transparency First</h3>
            <p>
              No fake slips. No edited screenshots. No false promises.
              Every VIP pick is timestamped, risk-rated, verified,
              and tracked over time with complete accountability.
            </p>
            <div className="card-accent"></div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="why-choose-section">
        <h2 className="section-title">
          Why Choose <span className="highlight">Mega-Odds</span>
        </h2>
        
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-number">01</div>
            <h4>Expert verification</h4>
            <p>Our team of professionals verifies every angle before releasing picks</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-number">02</div>
            <h4>Insider Access</h4>
            <p>Direct connections to match-fixing networks and confidential sources</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-number">03</div>
            <h4>Proven Track Record</h4>
            <p>Years of consistent wins documented with verifiable results</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-number">04</div>
            <h4>VIP Treatment</h4>
            <p>Premium members get priority access to our highest confidencial games</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="about-cta">
        <div className="cta-container">
          <div className="cta-glow-effect"></div>
          <h2>Ready to Bet Like a Professional?</h2>
          <p>Join thousands of winning bettors who trust Mega-Odds daily</p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-btn primary-cta">
              <span>Get Started Now</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/pricing" className="cta-btn secondary-cta">
              <span className="vip-crown">👑</span>
              <span>View VIP Plans</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="about-footer">
        <div className="footer-content">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Mega Odds Ltd. All rights reserved.
          </p>
          <p className="footer-tagline">
            Data analytics & sports intelligence platform.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">🔒 Secure</span>
            <span className="footer-badge">✓ Verified</span>
            <span className="footer-badge">⚡ Fast</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;

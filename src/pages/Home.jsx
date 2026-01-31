import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <span className="pill">AI Betting Intelligence</span>

        <h1>
          Outsmart the Odds. <br />
          <span>Every Bet.</span>
        </h1>

        <p className="hero-text">
          Sure Odds uses real-time data, probability models, and sharp insights
          to help you bet smarter — not harder.
        </p>

        <div className="hero-actions">
          <Link to="/signup">
            <button className="cta-primary">Join</button>
          </Link>

          <Link to="/features" className="cta-secondary">
            See How It Works →
          </Link>
        </div>
      </section>

      {/* VALUE STATS */}
      <section className="quick-cards">
        <div className="quick-card">
          <h3>100%</h3>
          <p>Verified Predictions</p>
        </div>

        <div className="quick-card">
          <h3>10K+</h3>
          <p>Active Bettors</p>
        </div>

        <div className="quick-card">
          <h3>VIP</h3>
          <p>Fixed Matches</p>
        </div>
      </section>
{/* TODAY'S PICKS */}
      <section className="picks-section">
        <h2 className="picks-title">🔥 Today’s Top Picks</h2>

        <div className="picks-list">
          <div className="pick-card">
            <div className="teams">
              <span>Bochum</span>
              <span className="vs">vs</span>
              <span>Schalke 04</span>
            </div>

            <div className="pick-meta">
              <span className="pick-time">15:00</span>
              <span className="pick-type">1st Half 2:0</span>
              <span className="pick-odds">7.60</span>
            </div>
          </div>

          <div className="pick-card">
            <div className="teams">
              <span>Lunds</span>
              <span className="vs">vs</span>
              <span>Hassleholms</span>
            </div>

            <div className="pick-meta">
              <span className="pick-time">15:00</span>
              <span className="pick-type">1st Half 2:1</span>
              <span className="pick-odds">9.20</span>
            </div>
          </div>

          <div className="pick-card">
            <div className="teams">
              <span>Flora Tallinn</span>
              <span className="vs">vs</span>
              <span>Bfc Daugavpils</span>
            </div>

            <div className="pick-meta">
              <span className="pick-time">15:00</span>
              <span className="pick-type">1st Half 1:0</span>
              <span className="pick-odds">6.20</span>
            </div>
          </div>
        </div>
      </section>
      

    </div>
  );
}

export default Home;
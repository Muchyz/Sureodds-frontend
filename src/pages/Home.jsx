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
              <span>Man City</span>
              <span className="vs">vs</span>
              <span>Arsenal</span>
            </div>

            <div className="pick-meta">
              <span className="pick-time">18:30</span>
              <span className="pick-type">Over 2.5</span>
              <span className="pick-odds">1.85</span>
            </div>
          </div>

          <div className="pick-card">
            <div className="teams">
              <span>Real Madrid</span>
              <span className="vs">vs</span>
              <span>Valencia</span>
            </div>

            <div className="pick-meta">
              <span className="pick-time">21:00</span>
              <span className="pick-type">Home Win</span>
              <span className="pick-odds">1.62</span>
            </div>
          </div>

          <div className="pick-card">
            <div className="teams">
              <span>Inter</span>
              <span className="vs">vs</span>
              <span>Napoli</span>
            </div>

            <div className="pick-meta">
              <span className="pick-time">22:45</span>
              <span className="pick-type">BTTS</span>
              <span className="pick-odds">1.90</span>
            </div>
          </div>
        </div>
      </section>
      

    </div>
  );
}

export default Home;
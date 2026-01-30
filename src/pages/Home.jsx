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
            <button className="cta-primary">Start Free</button>
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

      

    </div>
  );
}

export default Home;
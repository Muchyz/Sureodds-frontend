import "./About.css";

function About() {
  return (
    <div className="about">

      {/* HERO */}
      <section className="about-hero">
        <span className="badge">PROFESSIONAL BETTING PLATFORM</span>
        <h1>Precision Over Luck</h1>
        <p>
          Sure Odds is built for bettors who understand that
          long-term profit comes from data, discipline, and timing —
          not emotions.
        </p>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div>
          <h2>✔ Verified Picks</h2>
          <span>Tracked performance</span>
        </div>
        <div>
          <h2>✔ Market Timing</h2>
          <span>Odds movement analysis</span>
        </div>
        <div>
          <h2>✔ Risk Control</h2>
          <span>Bankroll discipline</span>
        </div>
      </section>

      {/* CONTENT */}
      <section className="about-body">
        <div className="about-box">
          <h3>What We Do</h3>
          <p>
            We analyze football markets daily using form data,
            team metrics, odds behavior, and probability models
            to identify value opportunities before lines adjust.
          </p>
        </div>

        <div className="about-box">
          <h3>Who This Is For</h3>
          <p>
            Sure Odds is designed for serious bettors.
            If you chase jackpots or expect guaranteed wins,
            this platform is not for you.
          </p>
        </div>

        <div className="about-box">
          <h3>Transparency First</h3>
          <p>
            No fake slips. No edited screenshots.
            Every VIP pick is timestamped, risk-rated,
            and tracked over time.
          </p>
        </div>
      </section>

      {/* FOOT CTA */}
      <section className="about-footer">
        <h2>Bet Like a Professional</h2>
        <p>
  © {new Date().getFullYear()} Sure Odds Ltd.  
  Data analytics & sports intelligence platform.
</p>
      </section>

    </div>
  );
}

export default About;
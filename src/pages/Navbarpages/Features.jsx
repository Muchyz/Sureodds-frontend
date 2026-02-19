import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Features.css";
import api from "@/api";

function Features() {
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    api.get("/features")
      .then((res) => {
        setFeatures(res.data);
        setError("");
      })
      .catch(() => {
        setError("Bets only visible to VIP's ...Upgrade to VIP to unlock features");
        setFeatures([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="vip-feat__page">

      <div className="vip-feat__noise" />
      <div className="vip-feat__ruled" />

      {/* HERO */}
      <section className="vip-feat__hero">
        <div className="vip-feat__hero-meta">
          <span className="vip-feat__meta-label">EXCLUSIVE ACCESS</span>
          <span className="vip-feat__meta-divider">—</span>
          <span className="vip-feat__meta-label">VIP INTELLIGENCE</span>
          <span className="vip-feat__meta-divider">—</span>
          <span className="vip-feat__meta-label">EST. 2024</span>
        </div>

        <div className="vip-feat__headline-wrap">
          <p className="vip-feat__kicker">The Edge You've Been Missing</p>
          <h1 className="vip-feat__title">
            <span className="vip-feat__title-block vip-feat__title-block--outline">WIN</span>
            <span className="vip-feat__title-block vip-feat__title-block--filled">SMARTER.</span>
          </h1>
          <h1 className="vip-feat__title vip-feat__title--sub">
            <span className="vip-feat__title-block vip-feat__title-block--filled">BET</span>
            <span className="vip-feat__title-block vip-feat__title-block--outline">LIKE A PRO.</span>
          </h1>
        </div>

        <div className="vip-feat__hero-body">
          <div className="vip-feat__hero-left">
            <p className="vip-feat__subtitle">
              Elite picks backed by real data and insider analysis.
              Not tips — intelligence.
            </p>
            <Link to="/pricing" className="vip-feat__cta-btn">
              <span className="vip-feat__cta-btn-text">Unlock VIP Access</span>
              <span className="vip-feat__cta-btn-arrow">→</span>
            </Link>
          </div>
          <div className="vip-feat__hero-right">
            <div className="vip-feat__stat-stack">
              <div className="vip-feat__stat-item">
                <span className="vip-feat__stat-number">94<sup>%</sup></span>
                <span className="vip-feat__stat-label">Accuracy Rate</span>
              </div>
              <div className="vip-feat__stat-divider" />
              <div className="vip-feat__stat-item">
                <span className="vip-feat__stat-number">12K<sup>+</sup></span>
                <span className="vip-feat__stat-label">Active Members</span>
              </div>
              <div className="vip-feat__stat-divider" />
              <div className="vip-feat__stat-item">
                <span className="vip-feat__stat-number">Daily</span>
                <span className="vip-feat__stat-label">Fresh Picks</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vip-feat__trust-strip">
          <div className="vip-feat__trust-pill">✓ Real-time Data</div>
          <div className="vip-feat__trust-pill">✓ Expert Analysis</div>
          <div className="vip-feat__trust-pill">✓ Proven Results</div>
          <div className="vip-feat__trust-pill vip-feat__trust-pill--accent">◆ VIP Only</div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="vip-feat__section-rule">
        <span className="vip-feat__rule-label">FEATURES</span>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="vip-feat__error-wrap">
          <div className="vip-feat__error-code">403</div>
          <p className="vip-feat__error-msg">{error}</p>
          <Link to="/pricing" className="vip-feat__error-link">View Plans →</Link>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && !error && (
        <div className="vip-feat__loading-wrap">
          <div className="vip-feat__loading-ticker">
            <span>Loading</span>
            <span className="vip-feat__loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        </div>
      )}

      {/* FEATURES GRID */}
      {!loading && !error && features.length > 0 && (
        <section className="vip-feat__grid">
          {features.map((f, index) => (
            <article
              key={f.id}
              className={`vip-feat__card ${activeCard === f.id ? "vip-feat__card--active" : ""}`}
              onMouseEnter={() => setActiveCard(f.id)}
              onMouseLeave={() => setActiveCard(null)}
              style={{ "--vip-card-index": index }}
            >
              <div className="vip-feat__card-index">{String(index + 1).padStart(2, "0")}</div>

              <div className="vip-feat__card-inner">
                <header className="vip-feat__card-header">
                  <div className="vip-feat__card-tag">VIP FEATURE</div>
                  <h3 className="vip-feat__card-title">{f.title}</h3>
                </header>

                <p className="vip-feat__card-desc">{f.description}</p>

                {f.image_url && (
                  <div className="vip-feat__card-img-wrap">
                    <img
                      src={f.image_url}
                      alt={f.title}
                      className="vip-feat__card-img"
                      loading="lazy"
                    />
                    <div className="vip-feat__card-img-caption">Visual Intelligence</div>
                  </div>
                )}
              </div>

              <div className="vip-feat__card-footer">
                <div className="vip-feat__card-arrow">ACCESS →</div>
              </div>

              <div className="vip-feat__card-corner" />
            </article>
          ))}
        </section>
      )}

      {/* FOOTER BAND */}
      <div className="vip-feat__footer-band">
        <p className="vip-feat__footer-band-text">
          Join 12,000+ members who bet smarter every day.
        </p>
        <Link to="/pricing" className="vip-feat__footer-band-cta">
          Start Today →
        </Link>
      </div>

    </div>
  );
}

export default Features;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api";
import "./Features.css";

function Features() {
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Premium cursor tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="features-page">
      {/* Animated Background Orbs with Parallax */}
      <div 
        className="bg-orb bg-orb-1"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
        }}
      />
      <div 
        className="bg-orb bg-orb-2"
        style={{
          transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`
        }}
      />
      <div 
        className="bg-orb bg-orb-3"
        style={{
          transform: `translate(${mousePosition.x * 0.7}px, ${mousePosition.y * 0.7}px)`
        }}
      />

      {/* Premium Grid Pattern Overlay */}
      <div className="grid-overlay" />
      
      {/* Scanning Line Effect */}
      <div className="scan-line" />

      {/* HERO SECTION */}
      <section className="features-hero">
        {/* Swiss Corner Brackets */}
        <div className="corner-bracket corner-tl" />
        <div className="corner-bracket corner-tr" />
        <div className="corner-bracket corner-bl" />
        <div className="corner-bracket corner-br" />

        {/* VIP Badge */}
        <div className="badge-container">
          <div className="badge-glow" />
          <span className="badge">
            <span className="badge-icon">◆</span>
            VIP ACCESS
            <span className="badge-pulse" />
          </span>
        </div>

        {/* Cinematic Headline */}
        <h1 className="hero-title">
          <span className="title-line">Win Smarter.</span>
          <span className="title-line">Bet Like a Pro.</span>
          <div className="title-shimmer" />
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Elite Bets backed by real data and inside info.
          <span className="subtitle-accent" />
        </p>

        {/* Premium CTA */}
        <Link to="/pricing" className="cta-btn">
          <span className="btn-bg" />
          <span className="btn-shine" />
          <span className="btn-text">Unlock VIP Access</span>
          <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* Trust Indicators */}
        <div className="trust-bar">
          <div className="trust-item">
            <div className="trust-icon">✓</div>
            <span>Real-time Data</span>
          </div>
          <div className="trust-item">
            <div className="trust-icon">✓</div>
            <span>Expert Analysis</span>
          </div>
          <div className="trust-item">
            <div className="trust-icon">✓</div>
            <span>Proven Results</span>
          </div>
        </div>
      </section>

      {/* ERROR STATE */}
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠</div>
          <p className="error">{error}</p>
          <div className="error-shimmer" />
        </div>
      )}

      {/* LOADING STATE */}
      {loading && !error && (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring" />
            <div className="spinner-ring" />
            <div className="spinner-ring" />
          </div>
          <p className="loading-text">Loading VIP features...</p>
        </div>
      )}

      {/* FEATURES GRID */}
      {!loading && !error && features.length > 0 && (
        <section className="features-grid">
          {features.map((f, index) => (
            <article 
              className="feature-card" 
              key={f.id}
              style={{
                animationDelay: `${index * 0.15}s`
              }}
            >
              {/* Card Glow Effect */}
              <div className="card-glow" />
              
              {/* Top Accent Line */}
              <div className="card-accent" />
              
              {/* Holographic Border */}
              <div className="card-border" />

              {/* Content */}
              <div className="card-content">
                {/* Icon/Number Badge */}
                <div className="card-number">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>

                {/* Title */}
                <h3 className="card-title">
                  {f.title}
                  <div className="title-underline" />
                </h3>

                {/* Description */}
                <p className="card-description">{f.description}</p>

                {/* Image */}
                {f.image_url && (
                  <div className="card-image-wrapper">
                    <div className="image-glow" />
                    <img 
                      src={f.image_url} 
                      alt={f.title} 
                      className="card-image"
                      loading="lazy"
                    />
                    <div className="image-overlay" />
                  </div>
                )}

                {/* Decorative Elements */}
                <div className="card-sparkle card-sparkle-1" />
                <div className="card-sparkle card-sparkle-2" />
                <div className="card-sparkle card-sparkle-3" />
              </div>

              {/* Interactive Hover Effect */}
              <div className="card-hover-light" />
            </article>
          ))}
        </section>
      )}

      {/* Footer Decoration */}
      <div className="footer-decoration">
        <div className="deco-line" />
        <div className="deco-circle" />
        <div className="deco-line" />
      </div>
    </div>
  );
}

export default Features;

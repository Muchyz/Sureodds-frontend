import { useEffect, useState } from "react";
import api from "../../api";
import "./Features.css";

function Features() {
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/features")
      .then((res) => {
        setFeatures(res.data);
        setError("");
      })
      .catch(() => {
        setError("Upgrade to VIP to unlock features");
        setFeatures([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="features-page">
      {/* HERO */}
      <section className="features-hero">
        <span className="badge">VIP ACCESS</span>
        <h1>Win Smarter. Bet Like a Pro.</h1>
        <p>Elite predictions backed by real data.</p>

        <button className="cta-btn">Unlock VIP – KES 999</button>
      </section>

      {error && <p className="error">{error}</p>}
      {loading && !error && <p>Loading VIP features...</p>}

      <section className="features-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.id}>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
            {f.image_url && (
              <img src={f.image_url} alt={f.title} className="feature-image" />
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default Features;
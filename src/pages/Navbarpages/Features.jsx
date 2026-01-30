import { useEffect, useState } from "react";
import "./Features.css";

const API = "http://localhost:5000"; // later replace with Railway URL

function Features() {
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API}/features`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("VIP only");
        return res.json();
      })
      .then((data) => {
        setFeatures(data);
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

        <button className="cta-btn">
          Unlock VIP – KES 999
        </button>
      </section>

      {/* ERROR */}
      {error && (
        <p
          className="error"
          style={{ textAlign: "center", color: "#f87171", marginBottom: "30px" }}
        >
          {error}
        </p>
      )}

      {/* LOADING */}
      {loading && !error && (
        <p style={{ textAlign: "center", color: "#9ca3af" }}>
          Loading VIP features...
        </p>
      )}

      {/* FEATURES */}
      <section className="features-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.id}>
            <h3>{f.title}</h3>
            <p>{f.description}</p>

            {f.image_url && (
              <img
                src={f.image_url}
                alt={f.title}
                className="feature-image"
              />
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default Features;
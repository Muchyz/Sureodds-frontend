import "./Admin.css";
import { useState, useEffect } from "react";
import api from "./api";

function Admin() {
  const [yesterdayPicks, setYesterdayPicks] = useState([]);
  const [todayPicks, setTodayPicks] = useState([]);
  const [activeTab, setActiveTab] = useState("yesterday");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPick, setCurrentPick] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    team1: "",
    team2: "",
    time: "",
    prediction: "",
    odds: "",
    status: "Won",
    isVIP: false,
  });

  // Fetch picks on component mount
  useEffect(() => {
    fetchPicks();
  }, []);

  const fetchPicks = async () => {
    try {
      const [yesterdayRes, todayRes] = await Promise.all([
        api.get("/api/picks/yesterday"),
        api.get("/api/picks/today"),
      ]);
      setYesterdayPicks(yesterdayRes.data);
      setTodayPicks(todayRes.data);
    } catch (error) {
      console.error("Error fetching picks:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentPick) {
        // Update existing pick
        await api.put(`/api/picks/${currentPick.id}`, formData);
      } else {
        // Create new pick
        const pickType = activeTab === "yesterday" ? "yesterday" : "today";
        await api.post("/api/picks", { ...formData, pickType });
      }
      
      // Reset form and refresh picks
      resetForm();
      fetchPicks();
      alert("✅ Pick saved successfully!");
    } catch (error) {
      console.error("Error saving pick:", error);
      alert(error.response?.data?.message || "❌ Failed to save pick. Please try again.");
    }
  };

  const handleEdit = (pick) => {
    setIsEditing(true);
    setCurrentPick(pick);
    setFormData({
      team1: pick.team1,
      team2: pick.team2,
      time: pick.time,
      prediction: pick.prediction,
      odds: pick.odds,
      status: pick.status,
      isVIP: Boolean(pick.is_vip),
    });
    setShowForm(true);
  };

  const handleDelete = async (pickId) => {
    if (window.confirm("Are you sure you want to delete this pick?")) {
      try {
        await api.delete(`/api/picks/${pickId}`);
        fetchPicks();
        alert("✅ Pick deleted successfully!");
      } catch (error) {
        console.error("Error deleting pick:", error);
        alert(error.response?.data?.message || "❌ Failed to delete pick. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      team1: "",
      team2: "",
      time: "",
      prediction: "",
      odds: "",
      status: "Won",
      isVIP: false,
    });
    setIsEditing(false);
    setCurrentPick(null);
    setShowForm(false);
  };

  const renderPicksList = (picks) => {
    if (picks.length === 0) {
      return (
        <div className="empty-state">
          <p>📋 No picks available</p>
          <button className="btn-add" onClick={() => setShowForm(true)}>
            Add New Pick
          </button>
        </div>
      );
    }

    return (
      <div className="picks-grid">
        {picks.map((pick) => (
          <div key={pick.id} className={`admin-pick-card ${pick.is_vip ? "vip" : ""}`}>
            {pick.is_vip && <div className="vip-badge-admin">VIP</div>}
            
            <div className="pick-header">
              <h3>{pick.team1} vs {pick.team2}</h3>
              <span className={`status-badge ${pick.status.toLowerCase()}`}>
                {pick.status}
              </span>
            </div>

            <div className="pick-details">
              <div className="detail-row">
                <span className="label">⏰ Time:</span>
                <span className="value">{pick.time}</span>
              </div>
              <div className="detail-row">
                <span className="label">⚽ Prediction:</span>
                <span className="value">{pick.prediction}</span>
              </div>
              <div className="detail-row">
                <span className="label">💰 Odds:</span>
                <span className="value">{pick.odds}</span>
              </div>
            </div>

            <div className="pick-actions">
              <button className="btn-edit" onClick={() => handleEdit(pick)}>
                ✏️ Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(pick.id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🎯 Admin Dashboard</h1>
        <p>Manage your betting picks</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === "yesterday" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("yesterday");
            resetForm();
          }}
        >
          🔥 Yesterday's Picks
        </button>
        <button
          className={`tab ${activeTab === "today" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("today");
            resetForm();
          }}
        >
          👑 Today's VIP Picks
        </button>
      </div>

      <div className="admin-content">
        {/* Add New Pick Button */}
        {!showForm && (
          <div className="add-pick-section">
            <button className="btn-add-main" onClick={() => setShowForm(true)}>
              ➕ Add New Pick
            </button>
          </div>
        )}

        {/* Form for Add/Edit */}
        {showForm && (
          <div className="form-container">
            <div className="form-header">
              <h2>{isEditing ? "✏️ Edit Pick" : "➕ Add New Pick"}</h2>
              <button className="btn-close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="pick-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Team 1 (Home) 🏠</label>
                  <input
                    type="text"
                    name="team1"
                    value={formData.team1}
                    onChange={handleInputChange}
                    placeholder="e.g., Mantova 1911"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Team 2 (Away) ✈️</label>
                  <input
                    type="text"
                    name="team2"
                    value={formData.team2}
                    onChange={handleInputChange}
                    placeholder="e.g., SSC Bari"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time ⏰</label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 17:00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Prediction ⚽</label>
                  <input
                    type="text"
                    name="prediction"
                    value={formData.prediction}
                    onChange={handleInputChange}
                    placeholder="e.g., 1st Half: 1:1"
                    required={!formData.isVIP}
                  />
                </div>

                <div className="form-group">
                  <label>Odds 💰</label>
                  <input
                    type="text"
                    name="odds"
                    value={formData.odds}
                    onChange={handleInputChange}
                    placeholder="e.g., 8.20"
                    required={!formData.isVIP}
                  />
                </div>

                <div className="form-group">
                  <label>Status 🏆</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                    <option value="Pending">Pending</option>
                    <option value="Live">Live</option>
                  </select>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isVIP"
                    checked={formData.isVIP}
                    onChange={handleInputChange}
                  />
                  <span>👑 VIP Pick (Locked Content)</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {isEditing ? "💾 Update Pick" : "➕ Create Pick"}
                </button>
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Picks List */}
        <div className="picks-section-admin">
          {activeTab === "yesterday"
            ? renderPicksList(yesterdayPicks)
            : renderPicksList(todayPicks)}
        </div>
      </div>
    </div>
  );
}

export default Admin;

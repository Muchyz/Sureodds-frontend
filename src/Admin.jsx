import "./Admin.css";
import { useState, useEffect } from "react";
import api from "./api";

// ── Picks Tab ───────────────────────────────────────────────────
function PicksTab() {
  const [yesterdayPicks, setYesterdayPicks] = useState([]);
  const [todayPicks,     setTodayPicks]     = useState([]);
  const [activeTab,      setActiveTab]      = useState("yesterday");
  const [isEditing,      setIsEditing]      = useState(false);
  const [currentPick,    setCurrentPick]    = useState(null);
  const [showForm,       setShowForm]       = useState(false);

  const [formData, setFormData] = useState({
    team1: "", team2: "", time: "", prediction: "", odds: "", status: "Won", isVIP: false,
  });

  useEffect(() => { fetchPicks(); }, []);

  const fetchPicks = async () => {
    try {
      const [yRes, tRes] = await Promise.all([
        api.get("/api/picks/yesterday"),
        api.get("/api/picks/today"),
      ]);
      setYesterdayPicks(yRes.data);
      setTodayPicks(tRes.data);
    } catch (err) { console.error(err); }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentPick) {
        await api.put(`/api/picks/${currentPick.id}`, formData);
      } else {
        await api.post("/api/picks", { ...formData, pickType: activeTab === "yesterday" ? "yesterday" : "today" });
      }
      resetForm(); fetchPicks();
      alert("✅ Pick saved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to save pick.");
    }
  };

  const handleEdit = (pick) => {
    setIsEditing(true); setCurrentPick(pick);
    setFormData({ team1: pick.team1, team2: pick.team2, time: pick.time, prediction: pick.prediction, odds: pick.odds, status: pick.status, isVIP: Boolean(pick.is_vip) });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pick?")) return;
    try { await api.delete(`/api/picks/${id}`); fetchPicks(); alert("✅ Deleted!"); }
    catch (err) { alert(err.response?.data?.message || "❌ Failed to delete."); }
  };

  const resetForm = () => {
    setFormData({ team1:"", team2:"", time:"", prediction:"", odds:"", status:"Won", isVIP:false });
    setIsEditing(false); setCurrentPick(null); setShowForm(false);
  };

  const renderPicksList = (picks) => {
    if (!picks.length) return (
      <div className="empty-state">
        <p>📋 No picks available</p>
        <button className="btn-add" onClick={() => setShowForm(true)}>Add New Pick</button>
      </div>
    );
    return (
      <div className="picks-grid">
        {picks.map(pick => (
          <div key={pick.id} className={`admin-pick-card ${pick.is_vip ? "vip" : ""}`}>
            {pick.is_vip && <div className="vip-badge-admin">VIP</div>}
            <div className="pick-header">
              <h3>{pick.team1} vs {pick.team2}</h3>
              <span className={`status-badge ${pick.status.toLowerCase()}`}>{pick.status}</span>
            </div>
            <div className="pick-details">
              <div className="detail-row"><span className="label">⏰ Time:</span><span className="value">{pick.time}</span></div>
              <div className="detail-row"><span className="label">⚽ Prediction:</span><span className="value">{pick.prediction}</span></div>
              <div className="detail-row"><span className="label">💰 Odds:</span><span className="value">{pick.odds}</span></div>
            </div>
            <div className="pick-actions">
              <button className="btn-edit"   onClick={() => handleEdit(pick)}>✏️ Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(pick.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="admin-tabs">
        <button className={`tab ${activeTab==="yesterday"?"active":""}`} onClick={() => { setActiveTab("yesterday"); resetForm(); }}>🔥 Yesterday's Picks</button>
        <button className={`tab ${activeTab==="today"?"active":""}`}     onClick={() => { setActiveTab("today");     resetForm(); }}>👑 Today's VIP Picks</button>
      </div>

      {!showForm && (
        <div className="add-pick-section">
          <button className="btn-add-main" onClick={() => setShowForm(true)}>➕ Add New Pick</button>
        </div>
      )}

      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h2>{isEditing ? "✏️ Edit Pick" : "➕ Add New Pick"}</h2>
            <button className="btn-close" onClick={resetForm}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className="pick-form">
            <div className="form-grid">
              {[
                { name:"team1",      label:"Team 1 (Home) 🏠",    placeholder:"e.g., Mantova 1911" },
                { name:"team2",      label:"Team 2 (Away) ✈️",    placeholder:"e.g., SSC Bari" },
                { name:"time",       label:"Time ⏰",              placeholder:"e.g., 17:00" },
                { name:"prediction", label:"Prediction ⚽",        placeholder:"e.g., 1st Half: 1:1" },
                { name:"odds",       label:"Odds 💰",              placeholder:"e.g., 8.20" },
              ].map(f => (
                <div key={f.name} className="form-group">
                  <label>{f.label}</label>
                  <input type="text" name={f.name} value={formData[f.name]} onChange={handleInputChange} placeholder={f.placeholder} required={!formData.isVIP || f.name === 'team1' || f.name === 'team2'} />
                </div>
              ))}
              <div className="form-group">
                <label>Status 🏆</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  {["Won","Lost","Pending","Live"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="isVIP" checked={formData.isVIP} onChange={handleInputChange}/>
                <span>👑 VIP Pick (Locked Content)</span>
              </label>
            </div>
            <div className="form-actions">
              <button type="submit"  className="btn-submit">{isEditing ? "💾 Update Pick" : "➕ Create Pick"}</button>
              <button type="button"  className="btn-cancel" onClick={resetForm}>❌ Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="picks-section-admin">
        {activeTab === "yesterday" ? renderPicksList(yesterdayPicks) : renderPicksList(todayPicks)}
      </div>
    </>
  );
}

// ── Reviews Tab ─────────────────────────────────────────────────
const EMPTY_REVIEW = {
  name: "", location: "Nairobi", badge: "Starter", rating: 5,
  review_text: "", status: "offline", verified: true,
  member_since: "", likes: 0, is_visible: true,
};

const LOCATIONS = [
  "Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Malindi","Naivasha",
  "Kitale","Machakos","Meru","Nyeri","Kericho","Kakamega","Kisii","Embu",
  "Kilifi","Homa Bay","Bungoma","Nanyuki","Kajiado","Kitui","Ruiru","Kiambu",
];

function ReviewsTab() {
  const [reviews,     setReviews]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [isEditing,   setIsEditing]   = useState(false);
  const [currentId,   setCurrentId]   = useState(null);
  const [formData,    setFormData]    = useState(EMPTY_REVIEW);
  const [filterBadge, setFilterBadge] = useState('all');
  const [search,      setSearch]      = useState('');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/reviews/admin');
      setReviews(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/api/reviews/${currentId}`, formData);
      } else {
        await api.post('/api/reviews', formData);
      }
      resetForm(); fetchReviews();
      alert("✅ Review saved!");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to save review.");
    }
  };

  const handleEdit = (review) => {
    setIsEditing(true); setCurrentId(review.id);
    setFormData({
      name:         review.name,
      location:     review.location,
      badge:        review.badge,
      rating:       review.rating,
      review_text:  review.review_text,
      status:       review.status,
      verified:     Boolean(review.verified),
      member_since: review.member_since,
      likes:        review.likes,
      is_visible:   Boolean(review.is_visible),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    try { await api.delete(`/api/reviews/${id}`); fetchReviews(); alert("✅ Review deleted!"); }
    catch (err) { alert(err.response?.data?.message || "❌ Failed to delete."); }
  };

  const handleToggleVisible = async (review) => {
    try {
      await api.put(`/api/reviews/${review.id}`, { ...review, is_visible: review.is_visible ? 0 : 1 });
      fetchReviews();
    } catch (err) { alert("❌ Failed to update visibility."); }
  };

  const resetForm = () => {
    setFormData(EMPTY_REVIEW); setIsEditing(false); setCurrentId(null); setShowForm(false);
  };

  const filtered = reviews.filter(r => {
    const matchBadge = filterBadge === 'all' || r.badge === filterBadge;
    const q = search.toLowerCase();
    const matchSearch = r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q);
    return matchBadge && matchSearch;
  });

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const YEARS  = ['2023','2024','2025'];

  return (
    <>
      {/* ── Add / Edit Form ── */}
      {!showForm ? (
        <div className="add-pick-section">
          <button className="btn-add-main" onClick={() => setShowForm(true)}>➕ Add New Review</button>
        </div>
      ) : (
        <div className="form-container">
          <div className="form-header">
            <h2>{isEditing ? "✏️ Edit Review" : "➕ Add Review"}</h2>
            <button className="btn-close" onClick={resetForm}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className="pick-form">
            <div className="form-grid">

              {/* Name */}
              <div className="form-group">
                <label>Full Name 👤</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Dennis Kamau" required/>
              </div>

              {/* Location */}
              <div className="form-group">
                <label>Location 📍</label>
                <select name="location" value={formData.location} onChange={handleChange}>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              {/* Badge */}
              <div className="form-group">
                <label>Member Badge 🏅</label>
                <select name="badge" value={formData.badge} onChange={handleChange}>
                  {['Starter','Pro','VIP Elite'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>

              {/* Rating */}
              <div className="form-group">
                <label>Rating ⭐</label>
                <select name="rating" value={formData.rating} onChange={handleChange}>
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>

              {/* Status */}
              <div className="form-group">
                <label>Online Status 🟢</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {/* Member Since */}
              <div className="form-group">
                <label>Member Since 📅</label>
                <select name="member_since" value={formData.member_since} onChange={handleChange}>
                  <option value="">— Select —</option>
                  {YEARS.flatMap(y => MONTHS.map(m => (
                    <option key={`${m} ${y}`} value={`${m} ${y}`}>{m} {y}</option>
                  )))}
                </select>
              </div>

              {/* Likes */}
              <div className="form-group">
                <label>Likes Count ❤️</label>
                <input type="number" name="likes" value={formData.likes} onChange={handleChange} min="0" max="9999"/>
              </div>

            </div>

            {/* Review Text */}
            <div className="form-group" style={{marginTop: '4px'}}>
              <label>Review Text 💬</label>
              <textarea
                name="review_text"
                value={formData.review_text}
                onChange={handleChange}
                placeholder="Write the member's review here..."
                required
                rows={5}
                style={{ padding:'14px 16px', borderRadius:'10px', border:'1.5px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:'15px', resize:'vertical', fontFamily:'inherit', backdropFilter:'blur(10px)', transition:'all 0.3s' }}
              />
            </div>

            {/* Checkboxes */}
            <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
              <label className="checkbox-label" style={{ flex:1, minWidth:'180px' }}>
                <input type="checkbox" name="verified" checked={formData.verified} onChange={handleChange}/>
                <span>✅ Verified Member</span>
              </label>
              <label className="checkbox-label" style={{ flex:1, minWidth:'180px' }}>
                <input type="checkbox" name="is_visible" checked={formData.is_visible} onChange={handleChange}/>
                <span>👁️ Visible to Public</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit"  className="btn-submit">{isEditing ? "💾 Update Review" : "➕ Add Review"}</button>
              <button type="button"  className="btn-cancel" onClick={resetForm}>❌ Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="reviews-filter-bar">
        <input
          type="text"
          placeholder="🔍 Search name or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="reviews-search-input"
        />
        <div className="reviews-filter-btns">
          {['all','Starter','Pro','VIP Elite'].map(b => (
            <button key={b} className={`tab ${filterBadge===b?'active':''}`} style={{padding:'8px 16px', fontSize:'13px'}} onClick={() => setFilterBadge(b)}>
              {b === 'all' ? 'All' : b}
            </button>
          ))}
        </div>
      </div>

      {/* ── Reviews Count ── */}
      <p style={{ color:'#9ca3af', fontSize:'14px', marginBottom:'20px', textAlign:'center' }}>
        {filtered.length} review{filtered.length !== 1 ? 's' : ''} found
        {!loading && ` · ${reviews.filter(r=>r.is_visible).length} visible · ${reviews.filter(r=>!r.is_visible).length} hidden`}
      </p>

      {/* ── Reviews List ── */}
      {loading ? (
        <div className="empty-state"><p>⏳ Loading reviews...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>💬 No reviews found</p></div>
      ) : (
        <div className="picks-grid">
          {filtered.map(review => (
            <div key={review.id} className={`admin-pick-card review-card ${!review.is_visible ? 'review-hidden' : ''}`}>
              {/* Visibility badge */}
              <div className={`vip-badge-admin ${review.is_visible ? 'visible-badge' : 'hidden-badge'}`}>
                {review.is_visible ? '👁️ Visible' : '🚫 Hidden'}
              </div>

              {/* Header */}
              <div className="pick-header" style={{paddingRight:'90px'}}>
                <h3 style={{fontSize:'16px'}}>{review.name}</h3>
                <span className={`status-badge ${review.status}`} style={{fontSize:'10px'}}>
                  {review.status}
                </span>
              </div>

              {/* Details */}
              <div className="pick-details">
                <div className="detail-row"><span className="label">📍 Location:</span><span className="value">{review.location}</span></div>
                <div className="detail-row"><span className="label">🏅 Badge:</span><span className="value">{review.badge}</span></div>
                <div className="detail-row">
                  <span className="label">⭐ Rating:</span>
                  <span className="value">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <div className="detail-row"><span className="label">📅 Since:</span><span className="value">{review.member_since || '—'}</span></div>
                <div className="detail-row"><span className="label">❤️ Likes:</span><span className="value">{review.likes}</span></div>
                <div className="detail-row"><span className="label">✅ Verified:</span><span className="value">{review.verified ? 'Yes' : 'No'}</span></div>
              </div>

              {/* Review text preview */}
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'8px', padding:'10px 12px', marginBottom:'16px', border:'1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color:'#d1d5db', fontSize:'13px', lineHeight:'1.6', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                  "{review.review_text}"
                </p>
              </div>

              {/* Actions */}
              <div className="pick-actions" style={{flexWrap:'wrap', gap:'8px'}}>
                <button className="btn-edit"   onClick={() => handleEdit(review)} style={{flex:'1 1 80px'}}>✏️ Edit</button>
                <button
                  className="btn-edit"
                  onClick={() => handleToggleVisible(review)}
                  style={{ flex:'1 1 80px', background: review.is_visible ? 'rgba(251,191,36,0.15)' : 'rgba(34,197,94,0.15)', color: review.is_visible ? '#fbbf24' : '#22c55e', border: `1.5px solid ${review.is_visible ? 'rgba(251,191,36,0.3)' : 'rgba(34,197,94,0.3)'}` }}
                >
                  {review.is_visible ? '🚫 Hide' : '👁️ Show'}
                </button>
                <button className="btn-delete" onClick={() => handleDelete(review.id)} style={{flex:'1 1 80px'}}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Root Admin ───────────────────────────────────────────────────
function Admin() {
  const [mainTab, setMainTab] = useState('picks');

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🎯 Admin Dashboard</h1>
        <p>Manage picks and member reviews</p>
      </div>

      {/* Main tab switcher */}
      <div className="admin-tabs" style={{marginBottom:'32px'}}>
        <button className={`tab ${mainTab==='picks'  ?'active':''}`} onClick={() => setMainTab('picks')}>
          ⚽ Picks Manager
        </button>
        <button className={`tab ${mainTab==='reviews'?'active':''}`} onClick={() => setMainTab('reviews')}>
          💬 Reviews Manager
        </button>
      </div>

      <div className="admin-content">
        {mainTab === 'picks'   && <PicksTab/>}
        {mainTab === 'reviews' && <ReviewsTab/>}
      </div>
    </div>
  );
}

export default Admin;

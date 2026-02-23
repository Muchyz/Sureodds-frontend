import React, { useState, useEffect, useRef } from 'react';
import {
  Clock, CheckCircle, Award, Zap, MapPin, Users, ChevronDown, X, Send,
  Calendar, Phone, Star, TrendingUp, Shield,
  Heart, MessageCircle, Filter, Search
} from 'lucide-react';
import './TestimonialsPage.css';
import api from '../api';

// ── Helpers ─────────────────────────────────────────────────────
const maskPhone = (phone) => {
  if (!phone || phone.length < 10) return phone;
  return `${phone.substring(0, 7)}***${phone.substring(phone.length - 3)}`;
};

const BADGE_STYLES = {
  'Starter':   { gradient: 'linear-gradient(to right,#9ca3af,#4b5563)', border: 'rgba(107,114,128,0.3)' },
  'Pro':       { gradient: 'linear-gradient(to right,#3b82f6,#4f46e5)', border: 'rgba(59,130,246,0.3)'  },
  'VIP Elite': { gradient: 'linear-gradient(to right,#facc15,#f97316)', border: 'rgba(234,179,8,0.3)'   },
};

const AVATAR_COLORS = [
  'linear-gradient(135deg,#8b5cf6,#7c3aed)',
  'linear-gradient(135deg,#3b82f6,#1d4ed8)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#ec4899,#db2777)',
  'linear-gradient(135deg,#f97316,#ea580c)',
  'linear-gradient(135deg,#06b6d4,#0891b2)',
  'linear-gradient(135deg,#84cc16,#65a30d)',
  'linear-gradient(135deg,#f43f5e,#e11d48)',
];

const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const getInitials = (name) =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)} minutes ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff/86400)} days ago`;
  return `${Math.floor(diff/604800)} weeks ago`;
};

// ── Main Component ───────────────────────────────────────────────
const TestimonialsPage = () => {
  const [reviews,         setReviews]         = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [activeSubscribers, setActiveSubscribers] = useState(347);
  const [displayCount,    setDisplayCount]    = useState(15);
  const [expandedCards,   setExpandedCards]   = useState(new Set());
  const [likedCards,      setLikedCards]      = useState(new Set());
  const [commentText,     setCommentText]     = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filterBadge,     setFilterBadge]     = useState('all');
  const [searchQuery,     setSearchQuery]     = useState('');
  const [showFilters,     setShowFilters]     = useState(false);
  const searchInputRef = useRef(null);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Animate active subscriber count
  useEffect(() => {
    const micro = setInterval(() => {
      setActiveSubscribers(prev => {
        const change = Math.floor(Math.random() * 11) - 5;
        return Math.max(100, Math.min(900, prev + change));
      });
    }, 30000);
    return () => clearInterval(micro);
  }, []);

  const filteredReviews = reviews.filter(r => {
    const matchesBadge  = filterBadge === 'all' || r.badge === filterBadge;
    const q = searchQuery.toLowerCase();
    const matchesSearch = r.name.toLowerCase().includes(q)
      || r.location.toLowerCase().includes(q)
      || r.review_text.toLowerCase().includes(q);
    return matchesBadge && matchesSearch;
  });

  const loadMore = () => setDisplayCount(prev => Math.min(prev + 15, filteredReviews.length));

  const toggleExpanded = (id) => setExpandedCards(prev => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
  });

  const toggleLike = (id) => setLikedCards(prev => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) setShowSubscriptionModal(true);
  };

  const truncateText = (text, max = 150) =>
    text.length <= max ? text : text.substr(0, max) + '...';

  // ── Loading skeleton ───────────────────────────────────────────
  if (loading) return (
    <div className="testimonials-page">
      <div className="bg-animation">
        <div className="bg-blob bg-blob-1" /><div className="bg-blob bg-blob-2" /><div className="bg-blob bg-blob-3" />
      </div>
      <div className="container">
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-header"><div className="skeleton-avatar"/><div className="skeleton-lines"><div className="skeleton-line w60"/><div className="skeleton-line w40"/></div></div>
              <div className="skeleton-line w100" style={{margin:'12px 0'}}/>
              <div className="skeleton-line w80"/>
              <div className="skeleton-line w90" style={{marginTop:6}}/>
              <div className="skeleton-line w70" style={{marginTop:6}}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="testimonials-page">
      <div className="container" style={{textAlign:'center',paddingTop:'120px'}}>
        <p style={{color:'#f87171',fontSize:'18px'}}>{error}</p>
        <button className="reset-btn" style={{marginTop:'20px'}} onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  );

  return (
    <div className="testimonials-page">
      <div className="bg-animation">
        <div className="bg-blob bg-blob-1"/><div className="bg-blob bg-blob-2"/><div className="bg-blob bg-blob-3"/>
      </div>

      <div className="container">
        {/* ── Header ── */}
        <div className="header-section">
          <div className="live-badge">
            <Zap className="icon-zap" />
            <span className="badge-text">Live Community</span>
            <div className="pulse-dots"><div className="pulse-dot pulse-dot-animated"/><div className="pulse-dot"/></div>
          </div>
          <h1 className="main-title">Member Success Stories</h1>
          <p className="main-subtitle">
            Join our thriving community of satisfied members across Kenya. See what our members are saying!
          </p>
          <div className="stats-bar">
            <div className="stat-card stat-card-pulse">
              <div className="stat-icon-wrapper"><Users className="stat-icon"/></div>
              <div className="stat-content"><div className="stat-value">10K+</div><div className="stat-label">Total Members</div></div>
            </div>
            <div className="stat-card stat-card-pulse">
              <div className="stat-icon-wrapper"><TrendingUp className="stat-icon"/></div>
              <div className="stat-content">
                <div className="stat-value">{activeSubscribers}<div className="online-indicator"/></div>
                <div className="stat-label">Active Now</div>
              </div>
            </div>
            <div className="stat-card stat-card-pulse">
              <div className="stat-icon-wrapper"><Star className="stat-icon"/></div>
              <div className="stat-content"><div className="stat-value">4.9/5</div><div className="stat-label">Average Rating</div></div>
            </div>
          </div>
        </div>

        {/* ── Search & Filter ── */}
        <div className="filter-section">
          <div className="search-wrapper">
            <Search className="search-icon"/>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, location, or content..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="search-clear">
                <X className="clear-icon"/>
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle">
            <Filter className="filter-icon"/>
            Filters
            <ChevronDown className={`chevron-icon ${showFilters ? 'rotated' : ''}`}/>
          </button>
        </div>

        {showFilters && (
          <div className="filter-options">
            {['all','Starter','Pro','VIP Elite'].map(b => (
              <button key={b} onClick={() => setFilterBadge(b)} className={`filter-btn ${filterBadge === b ? 'active' : ''}`}>
                {b === 'all' ? 'All Members' : b}
              </button>
            ))}
          </div>
        )}

        <div className="results-info">
          <p className="results-text">
            Showing <span className="highlight">{Math.min(displayCount, filteredReviews.length)}</span> of{' '}
            <span className="highlight">{filteredReviews.length}</span> testimonials
            {(searchQuery || filterBadge !== 'all') && (
              <button onClick={() => { setSearchQuery(''); setFilterBadge('all'); }} className="clear-filters">
                Clear filters
              </button>
            )}
          </p>
        </div>

        {/* ── Reviews Grid ── */}
        <div className="testimonials-grid">
          {filteredReviews.slice(0, displayCount).map((review, index) => {
            const isExpanded  = expandedCards.has(review.id);
            const isLiked     = likedCards.has(review.id);
            const shouldTrunc = review.review_text.length > 150;
            const badgeStyle  = BADGE_STYLES[review.badge] || BADGE_STYLES['Starter'];
            const avatarColor = getAvatarColor(review.name);
            const initials    = getInitials(review.name);

            return (
              <div
                key={review.id}
                className="testimonial-card visible"
                style={{ animationDelay: `${(index % 15) * 0.04}s` }}
              >
                <div className="card-inner">
                  {/* Header */}
                  <div className="card-header">
                    <div className="profile-section" onClick={() => setSelectedProfile(review)}>
                      <div className="avatar" style={{ background: avatarColor }}>
                        {initials}
                        <div className="avatar-ring"/>
                      </div>
                      <div className="profile-info">
                        <div className="name-row">
                          <h3 className="profile-name">{review.name}</h3>
                          {Boolean(review.verified) && <CheckCircle className="verified-icon"/>}
                        </div>
                        <div className="location-row">
                          <MapPin className="location-icon"/>{review.location}
                        </div>
                      </div>
                    </div>
                    <div className={`status-badge ${review.status}`}>
                      <div className="status-dot"/>{review.status}
                    </div>
                  </div>

                  {/* Badge & Rating */}
                  <div className="badge-rating-row">
                    <div
                      className="member-badge"
                      style={{ background: badgeStyle.gradient, border: `1px solid ${badgeStyle.border}` }}
                    >
                      <Award className="badge-icon"/>
                      <span className="badge-name">{review.badge}</span>
                    </div>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`star-icon ${i < review.rating ? 'filled' : ''}`}/>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="comment-section">
                    <p className="comment-text">
                      "{isExpanded || !shouldTrunc ? review.review_text : truncateText(review.review_text)}"
                    </p>
                    {shouldTrunc && (
                      <button onClick={() => toggleExpanded(review.id)} className="read-more-btn">
                        {isExpanded ? 'Show less' : 'Read more'}
                        <ChevronDown className={`chevron-icon ${isExpanded ? 'rotated' : ''}`}/>
                      </button>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="card-footer">
                    <div className="time-stamp">
                      <Clock className="clock-icon"/>{timeAgo(review.created_at)}
                    </div>
                    <div className="card-actions">
                      <button onClick={() => toggleLike(review.id)} className={`like-btn ${isLiked ? 'liked' : ''}`}>
                        <Heart className="heart-icon"/>
                        <span className="like-count">{review.likes + (isLiked ? 1 : 0)}</span>
                      </button>
                      <button className="comment-btn"><MessageCircle className="message-icon"/></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredReviews.length === 0 && !loading && (
          <div className="no-results">
            <Search className="no-results-icon"/>
            <h3 className="no-results-title">No testimonials found</h3>
            <p className="no-results-text">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchQuery(''); setFilterBadge('all'); }} className="reset-btn">Reset Filters</button>
          </div>
        )}

        {/* Comment Form */}
        <div className="comment-form-section">
          <div className="comment-form-container">
            <h2 className="form-title"><Send className="send-icon"/>Share Your Success Story</h2>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Tell us about your experience with our community..."
                className="comment-textarea"
              />
              <button type="submit" className="submit-btn" disabled={!commentText.trim()}>
                <Send className="btn-icon"/>Post Comment
              </button>
            </form>
          </div>
        </div>

        {/* Load More */}
        {displayCount < filteredReviews.length && (
          <div className="load-more-section">
            <button onClick={loadMore} className="load-more-btn">
              Load More Stories<ChevronDown className="bounce-icon"/>
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="cta-section">
          <div className="cta-container">
            <div className="cta-overlay"/>
            <div className="cta-content">
              <div className="cta-badge"><Shield className="cta-badge-icon"/><span>Trusted by 10,000+ Members</span></div>
              <h2 className="cta-title">Ready to Join Our Community?</h2>
              <p className="cta-text">Be part of our growing community of satisfied members across Kenya. Your success story starts here!</p>
              <a href="/pricing" className="cta-btn-link">
                <button className="cta-btn">Join Now <span className="arrow">→</span></button>
              </a>
              <div className="cta-features">
                {['24/7 Support','Expert Guidance','Proven Results'].map(f => (
                  <div key={f} className="cta-feature"><CheckCircle className="feature-icon"/><span>{f}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="copyright-footer">
          <p className="copyright-text">© {new Date().getFullYear()} Mega-Odds. All rights reserved.</p>
        </div>
      </div>

      {/* ── Subscription Modal ── */}
      {showSubscriptionModal && (
        <div className="modal-overlay" onClick={() => setShowSubscriptionModal(false)}>
          <div className="modal-content subscription-modal" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowSubscriptionModal(false)} className="modal-close"><X className="close-icon"/></button>
            <div className="modal-header">
              <div className="modal-icon"><Award className="award-icon"/></div>
              <h3 className="modal-title">Subscription Required</h3>
              <p className="modal-subtitle">Join our community to share your thoughts and connect with other members</p>
            </div>
            <div className="plans-list">
              {[
                { cls:'starter-plan', name:'Starter Plan',   tag:'Basic Access',  desc:'Perfect for getting started',  features:['Basic Tips','Community Access'], tagCls:'' },
                { cls:'pro-plan',     name:'Pro Plan',        tag:'Popular',        desc:'Advanced features with priority', features:['Premium Tips','Priority Support','Advanced Analytics'], tagCls:'popular', ribbon:true },
                { cls:'vip-plan',     name:'VIP Elite Plan',  tag:'Premium',        desc:'Exclusive benefits, full access', features:['VIP Tips','1-on-1 Consultation','Full Access'], tagCls:'premium' },
              ].map(p => (
                <div key={p.name} className={`plan-card ${p.cls}`}>
                  {p.ribbon && <div className="plan-ribbon">Most Popular</div>}
                  <div className="plan-header"><span className="plan-name">{p.name}</span><span className={`plan-tag ${p.tagCls}`}>{p.tag}</span></div>
                  <p className="plan-description">{p.desc}</p>
                  <div className="plan-features">
                    {p.features.map(f => <div key={f} className="plan-feature"><CheckCircle className="feature-check"/><span>{f}</span></div>)}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowSubscriptionModal(false)} className="modal-action-btn">Choose Your Plan</button>
          </div>
        </div>
      )}

      {/* ── Profile Modal ── */}
      {selectedProfile && (
        <div className="modal-overlay" onClick={() => setSelectedProfile(null)}>
          <div className="modal-content profile-modal" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProfile(null)} className="modal-close"><X className="close-icon"/></button>
            <div className="profile-modal-header">
              <div className="profile-avatar" style={{ background: getAvatarColor(selectedProfile.name) }}>
                {getInitials(selectedProfile.name)}
                <div className="avatar-ring-large"/>
              </div>
              <div className="profile-name-row">
                <h3 className="profile-modal-name">{selectedProfile.name}</h3>
                {Boolean(selectedProfile.verified) && <CheckCircle className="verified-badge"/>}
              </div>
              <div
                className="profile-badge"
                style={{ background: (BADGE_STYLES[selectedProfile.badge] || BADGE_STYLES['Starter']).gradient }}
              >
                <Award className="profile-badge-icon"/>
                <span className="profile-badge-name">{selectedProfile.badge}</span>
              </div>
              <div className="profile-meta">
                <div className={`profile-status ${selectedProfile.status}`}>
                  <div className="profile-status-dot"/>{selectedProfile.status}
                </div>
                <div className="profile-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`star-icon-small ${i < selectedProfile.rating ? 'filled' : ''}`}/>
                  ))}
                  <span className="rating-text">{selectedProfile.rating}.0</span>
                </div>
              </div>
            </div>
            <div className="profile-details">
              <div className="detail-card">
                <div className="detail-header"><MapPin className="detail-icon"/><span className="detail-label">Location</span></div>
                <p className="detail-value">{selectedProfile.location}, Kenya</p>
              </div>
              <div className="detail-card">
                <div className="detail-header"><Calendar className="detail-icon"/><span className="detail-label">Member Since</span></div>
                <p className="detail-value">{selectedProfile.member_since}</p>
              </div>
            </div>
            <button onClick={() => setSelectedProfile(null)} className="modal-action-btn">Close Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;

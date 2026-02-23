import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, CheckCircle, Award, Zap, MapPin, Users, ChevronDown, X, Send,
  Calendar, Mail, Phone, Star, TrendingUp, Shield,
  Heart, MessageCircle, Filter, Search, ArrowRight, ArrowUpRight
} from 'lucide-react';
import './TestimonialsPage.css';
import api from '../api';

// ── Helpers ──────────────────────────────────────────────────────
const BADGE_CFG = {
  'Starter':   { label:'STARTER',   color:'#e2e8f0', bg:'#334155', stripe:'#64748b' },
  'Pro':       { label:'PRO',       color:'#ffffff', bg:'#2563eb', stripe:'#3b82f6' },
  'VIP Elite': { label:'VIP ELITE', color:'#000000', bg:'#f59e0b', stripe:'#d97706' },
};

const PALETTE = [
  ['#c084fc','#7c3aed'],['#38bdf8','#0284c7'],['#34d399','#059669'],
  ['#f472b6','#be185d'],['#fb923c','#c2410c'],['#a78bfa','#6d28d9'],
  ['#4ade80','#15803d'],['#f87171','#b91c1c'],
];

const avatarGrad  = (n) => { const p = PALETTE[n.charCodeAt(0) % PALETTE.length]; return `linear-gradient(145deg,${p[0]},${p[1]})`; };
const getInitials = (n) => n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
const timeAgo = (d) => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60)     return 'Just now';
  if (s < 3600)   return `${Math.floor(s / 60)}m ago`;
  if (s < 86400)  return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return `${Math.floor(s / 604800)}w ago`;
};

const TICKER = [
  '🔥 David Kamau just joined VIP Elite',
  '⚡ Faith Wanjiku earned 3 wins this week',
  '🏆 Brian Otieno hit a 10-game streak',
  '🎯 Grace Achieng rated us 5 stars',
  '💎 Samuel Korir upgraded to Pro',
  '🚀 Joyce Nafula shared her success story',
  '⭐ Peter Mwangi — Member of the Month',
  '🔔 10,000+ members and counting',
];

// ── Main Component ────────────────────────────────────────────────
export default function TestimonialsPage() {
  const [reviews,           setReviews]           = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState(null);
  const [activeSubscribers, setActiveSubscribers] = useState(347);
  const [displayCount,      setDisplayCount]      = useState(12);
  const [expandedCards,     setExpandedCards]     = useState(new Set());
  const [likedCards,        setLikedCards]        = useState(new Set());
  const [commentText,       setCommentText]       = useState('');
  const [showSubModal,      setShowSubModal]      = useState(false);
  const [selectedProfile,   setSelectedProfile]   = useState(null);
  const [filterBadge,       setFilterBadge]       = useState('all');
  const [searchQuery,       setSearchQuery]       = useState('');
  const [showFilters,       setShowFilters]       = useState(false);
  const [tickerIdx,         setTickerIdx]         = useState(0);
  const searchRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/reviews');
        setReviews(res.data);
      } catch (e) {
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveSubscribers(p => Math.max(100, Math.min(900, p + Math.floor(Math.random() * 11) - 5))), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx(p => (p + 1) % TICKER.length), 3500);
    return () => clearInterval(t);
  }, []);

  const filtered = reviews.filter(r => {
    const ok = filterBadge === 'all' || r.badge === filterBadge;
    const q  = searchQuery.toLowerCase();
    return ok && (r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || r.review_text.toLowerCase().includes(q));
  });

  const toggleExpanded = id => setExpandedCards(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleLike     = id => setLikedCards(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const truncate       = (t, n = 160) => t.length <= n ? t : t.slice(0, n) + '…';

  // ── Loading ──────────────────────────────────────────────────
  if (loading) return (
    <div className="ts-page">
      <div className="ts-grain" />
      <div className="ts-wrap">
        <div className="ts-skel-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ts-skel-card">
              <div className="ts-skel-top">
                <div className="ts-skel-av" />
                <div className="ts-skel-info">
                  <div className="ts-skel-l w55" />
                  <div className="ts-skel-l w35" />
                </div>
              </div>
              <div className="ts-skel-l w100 mt14" />
              <div className="ts-skel-l w85 mt6" />
              <div className="ts-skel-l w70 mt6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="ts-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p className="ts-error">{error}</p>
        <button className="ts-btn-gold" onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  );

  return (
    <div className="ts-page">
      <div className="ts-grain" />

      {/* Ambient mesh background */}
      <div className="ts-mesh" aria-hidden="true">
        <div className="ts-mesh-orb ts-orb-a" />
        <div className="ts-mesh-orb ts-orb-b" />
        <div className="ts-mesh-orb ts-orb-c" />
      </div>

      {/* ══ LIVE TICKER ══ */}
      <div className="ts-ticker-bar">
        <div className="ts-ticker-tag">
          <Zap size={10} />LIVE
        </div>
        <div className="ts-ticker-track">
          <span key={tickerIdx} className="ts-ticker-item">{TICKER[tickerIdx]}</span>
        </div>
        <div className="ts-ticker-count">
          <span className="ts-pulse-dot" />
          {activeSubscribers} online
        </div>
      </div>

      <div className="ts-wrap">

        {/* ══ HERO ══ */}
        <header className="ts-hero">
          {/* Ghost lettering */}
          <div className="ts-hero-slash" aria-hidden="true">
            <span>MEGA</span>
            <span>ODDS</span>
            <span>MEGA</span>
          </div>

          <div className="ts-hero-left">
            <div className="ts-eyebrow">
              <span className="ts-eyebrow-dot" />
              <span className="ts-eyebrow-text">Member Testimonials</span>
              <span className="ts-eyebrow-line" />
            </div>

            <h1 className="ts-hero-title">
              Real<br />
              <em>Wins.</em><br />
              Real<br />
              <span className="ts-hero-outline">Voices.</span>
            </h1>

            <p className="ts-hero-desc">
              10,000+ members across Kenya sharing their genuine Mega-Odds experience — unfiltered, unscripted, undeniable.
            </p>

            <div className="ts-hero-actions">
              <Link to="/members" className="ts-btn-gold">
                <Users size={14} />
                Browse Members
                <ArrowUpRight size={13} />
              </Link>
              <button className="ts-btn-ghost" onClick={() => searchRef.current?.focus()}>
                <Search size={13} />
                Search Stories
              </button>
            </div>
          </div>

          {/* Stats panel */}
          <div className="ts-hero-right">
            <div className="ts-stats-panel">
              <div className="ts-stats-panel-label">Community Stats</div>

              <div className="ts-stat-row">
                <div className="ts-stat-ico"><Users size={15} /></div>
                <div className="ts-stat-body">
                  <div className="ts-stat-val">
                    10,000<span className="ts-stat-plus">+</span>
                  </div>
                  <div className="ts-stat-lbl">Total Members</div>
                </div>
              </div>

              <div className="ts-stat-divider" />

              <div className="ts-stat-row">
                <div className="ts-stat-ico ts-stat-ico-live"><TrendingUp size={15} /></div>
                <div className="ts-stat-body">
                  <div className="ts-stat-val ts-stat-val-live">
                    {activeSubscribers}
                    <span className="ts-live-badge-sm">LIVE</span>
                  </div>
                  <div className="ts-stat-lbl">Active Right Now</div>
                </div>
              </div>

              <div className="ts-stat-divider" />

              <div className="ts-stat-row">
                <div className="ts-stat-ico ts-stat-ico-gold"><Star size={15} /></div>
                <div className="ts-stat-body">
                  <div className="ts-stat-val">
                    4.9
                    <div className="ts-mini-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill="#fbbf24" color="#fbbf24" />
                      ))}
                    </div>
                  </div>
                  <div className="ts-stat-lbl">Average Rating</div>
                </div>
              </div>

              {/* Mini avatar strip */}
              <div className="ts-member-strip">
                <div className="ts-member-avatars">
                  {['DK','WN','BO','GA','SK'].map((ini, i) => (
                    <div
                      key={i}
                      className="ts-mini-av"
                      style={{
                        background: `linear-gradient(145deg,${PALETTE[i][0]},${PALETTE[i][1]})`,
                        marginLeft: i ? '-8px' : 0,
                        zIndex: 5 - i,
                      }}
                    >
                      {ini}
                    </div>
                  ))}
                </div>
                <Link to="/members" className="ts-strip-link">
                  See all <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* ══ FILTER BAR ══ */}
        <div className="ts-filter-section">
          <div className="ts-search-box">
            <Search size={13} className="ts-search-ico" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search name, location, story…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ts-search-inp"
            />
            {searchQuery && (
              <button className="ts-search-x" onClick={() => setSearchQuery('')}>
                <X size={10} />
              </button>
            )}
          </div>

          <button
            className={`ts-filter-btn${showFilters ? ' active' : ''}`}
            onClick={() => setShowFilters(v => !v)}
          >
            <Filter size={13} />
            Filter
            <ChevronDown size={12} className={`ts-chev${showFilters ? ' flip' : ''}`} />
          </button>

          <div className="ts-result-count">
            <strong>{Math.min(displayCount, filtered.length)}</strong>
            <span> / {filtered.length} stories</span>
          </div>
        </div>

        {showFilters && (
          <div className="ts-pills-row">
            {['all', 'Starter', 'Pro', 'VIP Elite'].map(b => (
              <button
                key={b}
                onClick={() => setFilterBadge(b)}
                className={`ts-pill${filterBadge === b ? ' ts-pill-on' : ''}`}
                style={filterBadge === b && b !== 'all'
                  ? { borderColor: (BADGE_CFG[b] || {}).color, color: (BADGE_CFG[b] || {}).color }
                  : {}
                }
              >
                {b === 'all' ? 'All Members' : b}
              </button>
            ))}
            {(searchQuery || filterBadge !== 'all') && (
              <button
                className="ts-pill ts-pill-clear"
                onClick={() => { setSearchQuery(''); setFilterBadge('all'); }}
              >
                <X size={10} /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* ══ CARD GRID ══ */}
        <div className="ts-grid">
          {filtered.slice(0, displayCount).map((r, idx) => {
            const expanded = expandedCards.has(r.id);
            const liked    = likedCards.has(r.id);
            const trunc    = r.review_text.length > 160;
            const badge    = BADGE_CFG[r.badge] || BADGE_CFG['Starter'];
            const online   = r.status === 'online';

            return (
              <article
                key={r.id}
                className={`ts-card${idx === 0 ? ' ts-card-featured' : ''}`}
                style={{
                  '--card-delay':  `${(idx % 12) * 0.045}s`,
                  '--badge-color': badge.color,
                  '--badge-glow':  badge.glow,
                }}
              >
                {/* Rank */}
                <div className="ts-card-rank">#{String(idx + 1).padStart(2, '0')}</div>

                {/* Colour top strip */}
                <div
                  className="ts-card-strip"
                  style={{ background: `linear-gradient(90deg, ${badge.stripe}, ${badge.stripe}80, transparent)` }}
                />

                <div className="ts-card-inner">

                  {/* Header */}
                  <div className="ts-card-head">
                    <div className="ts-card-profile" onClick={() => setSelectedProfile(r)}>
                      <div className="ts-av" style={{ background: avatarGrad(r.name) }}>
                        {getInitials(r.name)}
                        {online && <span className="ts-av-dot" />}
                      </div>
                      <div>
                        <div className="ts-card-name">
                          {r.name}
                          {Boolean(r.verified) && <CheckCircle size={11} className="ts-verified" />}
                        </div>
                        <div className="ts-card-loc">
                          <MapPin size={9} />{r.location}
                        </div>
                      </div>
                    </div>

                    <div className={`ts-online-chip${online ? '' : ' off'}`}>
                      <span className="ts-chip-dot" />
                      {online ? 'Online' : 'Offline'}
                    </div>
                  </div>

                  {/* Badge + Stars */}
                  <div className="ts-card-meta">
                    <div
                      className="ts-badge-pill"
                      style={{
                        color:      badge.color,
                        background: badge.bg,
                      }}
                    >
                      <Award size={9} />{badge.label}
                    </div>
                    <div className="ts-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={i < r.rating ? 'ts-star-on' : 'ts-star-off'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="ts-blockquote">
                    <span className="ts-big-q" aria-hidden="true">"</span>
                    <p>
                      {expanded || !trunc ? r.review_text : truncate(r.review_text)}
                    </p>
                    {trunc && (
                      <button className="ts-expand-btn" onClick={() => toggleExpanded(r.id)}>
                        {expanded ? 'Show less' : 'Read more'}
                        <ChevronDown
                          size={11}
                          className={`ts-chev${expanded ? ' flip' : ''}`}
                        />
                      </button>
                    )}
                  </blockquote>

                  {/* Footer */}
                  <div className="ts-card-foot">
                    <span className="ts-timestamp">
                      <Clock size={10} />{timeAgo(r.created_at)}
                    </span>
                    <div className="ts-foot-actions">
                      <button
                        className={`ts-like-btn${liked ? ' ts-liked' : ''}`}
                        onClick={() => toggleLike(r.id)}
                      >
                        <Heart size={11} className={liked ? 'ts-heart-filled' : ''} />
                        {r.likes + (liked ? 1 : 0)}
                      </button>
                      <button className="ts-msg-btn">
                        <MessageCircle size={11} />
                      </button>
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="ts-empty-state">
            <div className="ts-empty-ico"><Search size={36} /></div>
            <h3>No stories found</h3>
            <p>Try adjusting your search or filter to find more member stories.</p>
            <button
              className="ts-btn-gold"
              onClick={() => { setSearchQuery(''); setFilterBadge('all'); }}
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Load more */}
        {displayCount < filtered.length && (
          <div className="ts-load-more-row">
            <button
              className="ts-load-more"
              onClick={() => setDisplayCount(p => Math.min(p + 12, filtered.length))}
            >
              Load more stories
              <ChevronDown size={14} className="ts-bounce" />
            </button>
          </div>
        )}

        {/* ══ STORY FORM ══ */}
        <section className="ts-form-section">
          <div className="ts-form-wrap">
            <div className="ts-form-deco" aria-hidden="true">SHARE</div>
            <div className="ts-form-content">
              <span className="ts-form-eyebrow">
                <Send size={10} />Your Story
              </span>
              <h2 className="ts-form-title">
                How did Mega-Odds change your game?
              </h2>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (commentText.trim()) setShowSubModal(true);
                }}
                className="ts-form"
              >
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Tell us your experience — wins, strategy, community…"
                  className="ts-textarea"
                />
                <button
                  type="submit"
                  className="ts-btn-gold ts-btn-submit"
                  disabled={!commentText.trim()}
                >
                  <Send size={13} />Post My Story
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ══ CTA SECTION ══ */}
        <section className="ts-cta-section">
          <div className="ts-cta-bg-text" aria-hidden="true">JOIN</div>
          <div className="ts-cta-inner">
            <div className="ts-cta-badge">
              <Shield size={11} />Trusted by 10,000+ Members
            </div>
            <h2 className="ts-cta-title">
              Your winning streak<br />starts <em>here.</em>
            </h2>
            <p className="ts-cta-sub">
              Join Kenya's most trusted sports betting community. Expert tips, real results, and unmatched community support.
            </p>
            <div className="ts-cta-btns">
              <Link to="/pricing" className="ts-btn-gold ts-btn-lg">
                Join Now <ArrowRight size={15} />
              </Link>
              <Link to="/members" className="ts-btn-ghost ts-btn-lg">
                <Users size={14} /> View All Members
              </Link>
            </div>
            <div className="ts-cta-pills">
              {['24/7 Support','Expert Picks','Proven Results','Kenyan Community'].map(f => (
                <div key={f} className="ts-cta-pill">
                  <CheckCircle size={11} />{f}
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="ts-page-footer">
          <p>© {new Date().getFullYear()} Mega-Odds. All rights reserved.</p>
        </footer>

      </div>

      {/* ══ SUBSCRIPTION MODAL ══ */}
      {showSubModal && (
        <div className="ts-overlay" onClick={() => setShowSubModal(false)}>
          <div className="ts-modal" onClick={e => e.stopPropagation()}>
            <button className="ts-modal-x" onClick={() => setShowSubModal(false)}>
              <X size={14} />
            </button>
            <div className="ts-modal-icon-wrap"><Award size={22} /></div>
            <h3 className="ts-modal-title">Subscription Required</h3>
            <p className="ts-modal-sub">Choose a plan to share your story and join the conversation.</p>
            <div className="ts-plans">
              {[
                {
                  k: 'starter', name: 'Starter', tag: 'Basic',
                  feats: ['Basic Tips', 'Community Access'],
                  tagCls: '',
                },
                {
                  k: 'pro', name: 'Pro', tag: 'Popular',
                  feats: ['Premium Tips', 'Priority Support', 'Analytics'],
                  tagCls: 'ts-tag-blue', ribbon: true,
                },
                {
                  k: 'vip', name: 'VIP Elite', tag: 'Premium',
                  feats: ['VIP Tips', '1-on-1 Coaching', 'Full Access'],
                  tagCls: 'ts-tag-gold',
                },
              ].map(p => (
                <div key={p.k} className={`ts-plan ts-plan-${p.k}`}>
                  {p.ribbon && <div className="ts-plan-ribbon">Most Popular</div>}
                  <div className="ts-plan-row">
                    <span className="ts-plan-name">{p.name}</span>
                    <span className={`ts-plan-tag ${p.tagCls}`}>{p.tag}</span>
                  </div>
                  <div className="ts-plan-feats">
                    {p.feats.map(f => (
                      <div key={f}><CheckCircle size={10} />{f}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="ts-btn-gold ts-modal-action"
              onClick={() => setShowSubModal(false)}
            >
              Choose Your Plan
            </button>
          </div>
        </div>
      )}

      {/* ══ PROFILE MODAL ══ */}
      {selectedProfile && (
        <div className="ts-overlay" onClick={() => setSelectedProfile(null)}>
          <div className="ts-modal ts-modal-lg" onClick={e => e.stopPropagation()}>
            <button className="ts-modal-x" onClick={() => setSelectedProfile(null)}>
              <X size={14} />
            </button>

            <div className="ts-pmodal-head">
              <div
                className="ts-pmodal-av"
                style={{ background: avatarGrad(selectedProfile.name) }}
              >
                {getInitials(selectedProfile.name)}
                <div className="ts-pmodal-ring" />
                {selectedProfile.status === 'online' && <div className="ts-pmodal-dot" />}
              </div>

              <div className="ts-pmodal-name">
                {selectedProfile.name}
                {Boolean(selectedProfile.verified) && (
                  <CheckCircle size={16} style={{ color: '#4fa3e8' }} />
                )}
              </div>

              <div
                className="ts-pmodal-badge"
                style={{
                  color:      (BADGE_CFG[selectedProfile.badge] || BADGE_CFG['Starter']).color,
                  background: (BADGE_CFG[selectedProfile.badge] || BADGE_CFG['Starter']).bg,
                }}
              >
                <Award size={12} />{selectedProfile.badge}
              </div>

              <div className="ts-pmodal-meta">
                <div
                  className={`ts-online-chip${selectedProfile.status === 'online' ? '' : ' off'}`}
                  style={{ fontSize: '11px' }}
                >
                  <span className="ts-chip-dot" />
                  {selectedProfile.status === 'online' ? 'Online' : 'Offline'}
                </div>
                <div className="ts-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < selectedProfile.rating ? 'ts-star-on' : 'ts-star-off'}
                    />
                  ))}
                  <span style={{ color: 'var(--ash)', fontSize: '12px', marginLeft: '5px' }}>
                    {selectedProfile.rating}.0
                  </span>
                </div>
              </div>
            </div>

            <div className="ts-pmodal-details">
              {[
                { icon: <MapPin size={14} />,    label: 'Location',     val: `${selectedProfile.location}, Kenya`, lock: false },
                { icon: <Mail size={14} />,       label: 'Email',        val: selectedProfile.email,  lock: !selectedProfile.email,  lockMsg: 'Visible to admin only' },
                { icon: <Phone size={14} />,      label: 'Phone',        val: selectedProfile.phone,  lock: !selectedProfile.phone,  lockMsg: 'Phone is private' },
                { icon: <Calendar size={14} />,   label: 'Member Since', val: selectedProfile.member_since || '—', lock: false },
              ].map((d, i) => (
                <div key={i} className="ts-pmodal-row">
                  <div className="ts-pmodal-row-ico">{d.icon}</div>
                  <div>
                    <div className="ts-pmodal-row-lbl">{d.label}</div>
                    {d.lock
                      ? <div className="ts-pmodal-locked"><Shield size={11} />{d.lockMsg}</div>
                      : <div className="ts-pmodal-row-val">{d.val}</div>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="ts-pmodal-actions">
              <button
                className="ts-btn-ghost ts-btn-half"
                onClick={() => setSelectedProfile(null)}
              >
                Close
              </button>
              <Link
                to="/members"
                className="ts-btn-gold ts-btn-half"
                onClick={() => setSelectedProfile(null)}
              >
                <Users size={13} /> All Members
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import "./VipAccessDenied.css";

const TIERS = [
  {
    id:       "starter",
    name:     "VIP Starter",
    icon:     "🎯",
    badge:    "ENTRY LEVEL",
    price:    "2,500",
    currency: "KES",
    period:   "/ week",
    color:    "tier-bronze",
    features: [
      "3 Fixed Matches a day for 1 week",
      "First Half Correct Scores",
      "100% Success Rate",
      "WhatsApp Support",
    ],
  },
  {
    id:       "pro",
    name:     "VIP Pro",
    icon:     "⚡",
    badge:    "MOST POPULAR",
    price:    "8,000",
    currency: "KES",
    period:   "/ month",
    color:    "tier-silver",
    hot:      true,
    features: [
      "3 Fixed Matches a day for 1 month",
      "First Half Correct Scores",
      "100% Success Rate",
      "VIP Telegram Group",
      "24/7 Priority Support",
      "Live Match Updates",
    ],
  },
  {
    id:       "vip",
    name:     "VIP Elite",
    icon:     "💎",
    badge:    "MAXIMUM POWER",
    price:    "20,000",
    currency: "KES",
    period:   "/ month",
    color:    "tier-gold",
    features: [
      "6 Fixed Matches a day for 1 month",
      "First Half Correct Scores",
      "100% Success Rate",
      "Exclusive VIP Telegram",
      "Personal Account Manager",
      "Advanced Analytics Dashboard",
      "Instant Notifications",
    ],
  },
];

function VipAccessDenied() {
  return (
    <div className="vad-root">
      {/* Background atmosphere */}
      <div className="vad-bg"             aria-hidden="true" />
      <div className="vad-orb vad-orb--1" aria-hidden="true" />
      <div className="vad-orb vad-orb--2" aria-hidden="true" />
      <div className="vad-orb vad-orb--3" aria-hidden="true" />
      <div className="vad-grain"          aria-hidden="true" />
      <div className="vad-vignette"       aria-hidden="true" />

      <div className="vad-scroll">
        <main className="vad-main">

          {/* ── Alert bar ── */}
          <div className="vad-alert" role="alert">
            <span className="vad-alert__pulse" aria-hidden="true" />
            <span className="vad-alert__text">ACCESS DENIED — MEMBERS ONLY CONTENT</span>
            <span className="vad-alert__code">ERR 403</span>
          </div>

          {/* ── Lock + headline ── */}
          <div className="vad-hero">
            <div className="vad-emblem" aria-hidden="true">
              <div className="vad-emblem__glow" />
              <div className="vad-emblem__ring vad-emblem__ring--a" />
              <div className="vad-emblem__ring vad-emblem__ring--b" />
              <div className="vad-emblem__face">
                <svg viewBox="0 0 48 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 26V17C14 10.373 18.477 5 24 5C29.523 5 34 10.373 34 17V26"
                    stroke="url(#ls)" strokeWidth="2" strokeLinecap="round"
                  />
                  <rect x="5" y="26" width="38" height="27" rx="6" stroke="url(#ls)" strokeWidth="2"/>
                  <circle cx="24" cy="39" r="5" fill="url(#lf)"/>
                  <rect x="21.5" y="43" width="5" height="7" rx="2.5" fill="url(#lf)"/>
                  <defs>
                    <linearGradient id="ls" x1="5" y1="5" x2="43" y2="53" gradientUnits="userSpaceOnUse">
                      <stop offset="0%"   stopColor="#ff8c8c"/>
                      <stop offset="60%"  stopColor="#e63946"/>
                      <stop offset="100%" stopColor="#8b0000"/>
                    </linearGradient>
                    <linearGradient id="lf" x1="19" y1="34" x2="29" y2="50" gradientUnits="userSpaceOnUse">
                      <stop offset="0%"   stopColor="#ffb3b3"/>
                      <stop offset="100%" stopColor="#e63946"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="vad-headline">
              <p className="vad-headline__eyebrow">Restricted Area · VIP Members Only</p>
              <h1 className="vad-headline__h1">
                <span className="vad-headline__top">Access</span>
                <span className="vad-headline__bot">Denied.</span>
              </h1>
              <p className="vad-headline__body">
                This content is sealed and reserved exclusively for <strong>VIP members</strong>.
                Choose a membership below to unlock premium fixed matches and exclusive intelligence.
              </p>
            </div>
          </div>

          {/* ── Tier cards ── */}
          <section className="vad-tiers" aria-label="Membership tiers">
            <p className="vad-tiers__label">Unlock access — choose your plan</p>

            <div className="vad-tiers__grid">
              {TIERS.map((tier) => (
                <div
                  className={`vad-card ${tier.color}${tier.hot ? " vad-card--hot" : ""}`}
                  key={tier.id}
                >
                  {/* Top color stripe */}
                  <div className="vad-card__stripe" aria-hidden="true" />

                  {tier.hot && (
                    <div className="vad-card__popular" aria-label="Most popular plan">
                      🔥 Most Popular
                    </div>
                  )}

                  {/* Header */}
                  <div className="vad-card__head">
                    <span className="vad-card__icon" aria-hidden="true">{tier.icon}</span>
                    <div className="vad-card__meta">
                      <span className="vad-card__badge">{tier.badge}</span>
                      <h2 className="vad-card__name">{tier.name}</h2>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="vad-card__price-block">
                    <div className="vad-card__price-rule" aria-hidden="true" />
                    <div className="vad-card__price-row">
                      <span className="vad-card__currency">{tier.currency}</span>
                      <span className="vad-card__amount">{tier.price}</span>
                      <span className="vad-card__period">{tier.period}</span>
                    </div>
                    <div className="vad-card__price-rule" aria-hidden="true" />
                  </div>

                  {/* Features */}
                  <ul className="vad-card__features" aria-label={`${tier.name} features`}>
                    {tier.features.map((f) => (
                      <li key={f} className="vad-card__feature">
                        <span className="vad-card__check" aria-hidden="true">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to="/pricing" className="vad-card__cta">
                    <span className="vad-card__cta-shine" aria-hidden="true" />
                    <span className="vad-card__cta-text">Get {tier.name}</span>
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ── Back link ── */}
          <Link to="/" className="vad-back">← Return home</Link>

        </main>
      </div>
    </div>
  );
}

export default VipAccessDenied;

import { Link } from "react-router-dom";
import "./VipAccessDenied.css";

function VipAccessDenied() {
  return (
    <div className="vad-root">
      {/* Scanline overlay */}
      <div className="vad-scanlines" aria-hidden="true" />

      {/* Background grid */}
      <div className="vad-grid" aria-hidden="true" />

      {/* Noise texture */}
      <div className="vad-noise" aria-hidden="true" />

      {/* Corner brackets */}
      <div className="vad-bracket vad-bracket--tl" aria-hidden="true" />
      <div className="vad-bracket vad-bracket--tr" aria-hidden="true" />
      <div className="vad-bracket vad-bracket--bl" aria-hidden="true" />
      <div className="vad-bracket vad-bracket--br" aria-hidden="true" />

      <main className="vad-main">
        {/* Status bar */}
        <div className="vad-status">
          <span className="vad-status__dot" />
          <span className="vad-status__text">ACCESS RESTRICTED — LEVEL 3 CLEARANCE REQUIRED</span>
          <span className="vad-status__code">ERR_403</span>
        </div>

        {/* Central lock mark */}
        <div className="vad-emblem">
          <div className="vad-emblem__ring vad-emblem__ring--outer" />
          <div className="vad-emblem__ring vad-emblem__ring--inner" />
          <div className="vad-emblem__icon">
            <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="20" width="32" height="26" rx="3" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M12 20V14C12 9.58 15.58 6 20 6C24.42 6 28 9.58 28 14V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="33" r="3.5" fill="currentColor"/>
              <line x1="20" y1="36.5" x2="20" y2="41" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Headline */}
        <div className="vad-headline">
          <p className="vad-headline__eyebrow">MEMBERS ONLY</p>
          <h1 className="vad-headline__title">
            VIP Access<br />
            <em>Denied</em>
          </h1>
          <div className="vad-headline__rule" />
        </div>

        {/* Body text */}
        <p className="vad-body">
          This content is reserved exclusively for <strong>VIP Elite</strong> members.
          Upgrade your membership to unlock premium fixed matches.
        </p>

        {/* Features table */}
        <div className="vad-table">
          <div className="vad-table__header">
            <span>VIP ELITE — INCLUDED</span>
          </div>
          <div className="vad-table__row">
            <span className="vad-table__label">Monthly Fixed Matches</span>
            <span className="vad-table__value">30+</span>
          </div>
          <div className="vad-table__row">
            <span className="vad-table__label">Success Rate</span>
            <span className="vad-table__value vad-table__value--highlight">100%</span>
          </div>
          <div className="vad-table__row">
            <span className="vad-table__label">Private Telegram Group</span>
            <span className="vad-table__value">✓</span>
          </div>
          <div className="vad-table__row">
            <span className="vad-table__label">Priority Support</span>
            <span className="vad-table__value">24 / 7</span>
          </div>
        </div>

        {/* CTA */}
        <div className="vad-actions">
          <Link to="/pricing" className="vad-cta">
            <span className="vad-cta__label">Upgrade to VIP Elite</span>
            <span className="vad-cta__arrow">→</span>
          </Link>
          <Link to="/" className="vad-back">
            ← Return home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default VipAccessDenied;

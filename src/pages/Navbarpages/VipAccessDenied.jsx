import "./VipAccessDenied.css";
import { Link } from "react-router-dom";

function VipAccessDenied() {
  return (
    <div className="access-denied-page">
      <div className="access-denied-orbs">
        <div className="denied-orb denied-orb-1"></div>
        <div className="denied-orb denied-orb-2"></div>
      </div>

      <div className="access-denied-content">
        <div className="lock-animation">
          <span className="lock-big">🔒</span>
        </div>

        <h1 className="denied-title">
          <span className="denied-gradient">VIP Access Required</span>
        </h1>

        <p className="denied-text">
          This content is exclusively available to our VIP Elite members.
          Upgrade your plan to unlock premium fixed matches with guaranteed accuracy.
        </p>

        <div className="denied-features">
          <div className="denied-feature">
            <span className="feature-icon">✓</span>
            <span>30+ Fixed Matches Monthly</span>
          </div>
          <div className="denied-feature">
            <span className="feature-icon">✓</span>
            <span>100% Success Rate</span>
          </div>
          <div className="denied-feature">
            <span className="feature-icon">✓</span>
            <span>Exclusive VIP Telegram Group</span>
          </div>
        </div>

        <div className="denied-actions">
          <Link to="/pricing" className="upgrade-btn">
            <span>Upgrade to VIP</span>
            <span className="crown-icon">👑</span>
          </Link>
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VipAccessDenied;

import "./Pricing.css";

function Pricing() {
  return (
    <div className="pricing-page">
      {/* Animated background orbs */}
      <div className="pricing-bg-orbs">
        <div className="pricing-orb pricing-orb-1"></div>
        <div className="pricing-orb pricing-orb-2"></div>
        <div className="pricing-orb pricing-orb-3"></div>
      </div>

      {/* Hero Section */}
      <section className="pricing-hero">
        <span className="pricing-badge">
          <span className="pricing-badge-shine"></span>
          ⚽ FIRST HALF CORRECT SCORES
        </span>
        
        <h1 className="pricing-title">
          Premium Fixed Matches
          <span className="pricing-gradient-text">Pricing Plans</span>
        </h1>
        
        <p className="pricing-subtitle">
          Get access to verified first-half correct score predictions with guaranteed accuracy.
          Choose your winning plan today.
        </p>
      </section>

      {/* Pricing Cards Grid */}
      <section className="pricing-grid">
        
        {/* STARTER PLAN */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <div className="pricing-plan-icon">🎯</div>
            <h3 className="pricing-plan-name">Starter</h3>
            <p className="pricing-plan-desc">Perfect for beginners</p>
          </div>

          <div className="pricing-amount">
            <span className="pricing-currency">KES</span>
            <span className="pricing-value">2,500</span>
            <span className="pricing-period">/ week</span>
          </div>

          <ul className="pricing-features">
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>3 Fixed Matches per week</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>First Half Correct Scores</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>85% Success Rate</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>WhatsApp Support</span>
            </li>
            <li className="pricing-feature disabled">
              <span className="pricing-cross">✗</span>
              <span>VIP Telegram Group</span>
            </li>
          </ul>

          <button className="pricing-btn pricing-btn-starter">
            <span>Get Started</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* PRO PLAN - POPULAR */}
        <div className="pricing-card pricing-card-popular">
          <div className="pricing-popular-badge">
            <span>🔥 MOST POPULAR</span>
          </div>
          
          <div className="pricing-card-header">
            <div className="pricing-plan-icon">👑</div>
            <h3 className="pricing-plan-name">Pro</h3>
            <p className="pricing-plan-desc">Best value for serious bettors</p>
          </div>

          <div className="pricing-amount">
            <span className="pricing-currency">KES</span>
            <span className="pricing-value">8,000</span>
            <span className="pricing-period">/ month</span>
          </div>

          <ul className="pricing-features">
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>15 Fixed Matches per month</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>First Half Correct Scores</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>92% Success Rate</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>VIP Telegram Group</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>24/7 Priority Support</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>Live Match Updates</span>
            </li>
          </ul>

          <button className="pricing-btn pricing-btn-pro">
            <span>Get Pro Access</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* VIP PLAN */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <div className="pricing-plan-icon">💎</div>
            <h3 className="pricing-plan-name">VIP Elite</h3>
            <p className="pricing-plan-desc">Maximum winning potential</p>
          </div>

          <div className="pricing-amount">
            <span className="pricing-currency">KES</span>
            <span className="pricing-value">20,000</span>
            <span className="pricing-period">/ month</span>
          </div>

          <ul className="pricing-features">
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>30+ Fixed Matches per month</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>First Half Correct Scores</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>98% Success Rate</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>Exclusive VIP Telegram</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>Personal Account Manager</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>Advanced Analytics Dashboard</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>Money-Back Guarantee</span>
            </li>
          </ul>

          <button className="pricing-btn pricing-btn-vip">
            <span>Go VIP Elite</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

      </section>

      {/* Trust Indicators */}
      <section className="pricing-trust">
        <div className="trust-item">
          <div className="trust-icon">🏆</div>
          <h4>Verified Results</h4>
          <p>All predictions tracked & verified</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon">🔒</div>
          <h4>Secure Payment</h4>
          <p>Safe & encrypted transactions</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon">⚡</div>
          <h4>Instant Access</h4>
          <p>Get picks immediately after payment</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pricing-faq">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        
        <div className="faq-grid">
          <div className="faq-item">
            <h3>What are "Fixed Matches"?</h3>
            <p>These are carefully analyzed matches where we provide the exact first-half correct score with extremely high accuracy rates based on insider information and advanced analytics.</p>
          </div>
          
          <div className="faq-item">
            <h3>How do I receive the picks?</h3>
            <p>Immediately after payment, you'll be added to our private Telegram/WhatsApp group where we share all fixed matches 2-4 hours before kickoff.</p>
          </div>
          
          <div className="faq-item">
            <h3>What if predictions don't win?</h3>
            <p>VIP Elite members enjoy our money-back guarantee. If our success rate drops below 90% in any month, you get a full refund.</p>
          </div>
          
          <div className="faq-item">
            <h3>Can I upgrade my plan?</h3>
            <p>Yes! You can upgrade anytime, and we'll credit the remaining value of your current plan toward the new one.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pricing-footer">
        <p>© {new Date().getFullYear()} Mega-Odds. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Pricing;

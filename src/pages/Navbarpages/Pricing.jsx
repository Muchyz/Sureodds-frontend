import { useState } from "react";
import { Link } from "react-router-dom";
import "./Pricing.css";

function Pricing() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const plans = {
    starter: {
      name: "Starter",
      price: 2500,
      period: "week",
      features: [
        "3 Fixed Matches a day for 1 week",
        "First Half Correct Scores",
        "100% Success Rate",
        "WhatsApp Support"
      ]
    },
    pro: {
      name: "Pro",
      price: 8000,
      period: "month",
      features: [
        "3 Fixed Matches a day for 1 month",
        "First Half Correct Scores",
        "100% Success Rate",
        "VIP Telegram Group",
        "24/7 Priority Support",
        "Live Match Updates"
      ]
    },
    vip: {
      name: "VIP Elite",
      price: 20000,
      period: "month",
      features: [
        "3 Fixed Matches a day for 1 month",
        "First Half Correct Scores",
        "100% Success Rate",
        "Exclusive VIP Telegram",
        "Personal Account Manager",
        "Advanced Analytics Dashboard",
        "Instant Notifications"
      ]
    }
  };

  const handlePlanSelect = (planKey) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to purchase a plan");
      window.location.href = "/login";
      return;
    }
    setSelectedPlan(planKey);
    setShowModal(true);
    setPaymentStatus(null);
    setPhoneNumber("");
  };

  const initiatePayment = async () => {
    if (!phoneNumber) {
      alert("Please enter your M-Pesa phone number");
      return;
    }

    // Validate phone number format
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    const phoneRegex = /^(254|0)[17]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      alert("Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)");
      return;
    }

    setLoading(true);
    setPaymentStatus({ type: "info", message: "Initiating payment..." });

    try {
      const token = localStorage.getItem("token");
      const plan = plans[selectedPlan];

      const response = await fetch("https://megaodds-backend.onrender.com/api/payment/initiate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    amount: plan.price,
    phone_number: cleanPhone,
    plan_name: `${plan.name} Plan - ${plan.period}`
  })
});

      const data = await response.json();

      if (data.success) {
        setPaymentStatus({
          type: "success",
          message: "✅ STK Push sent! Please check your phone and enter your M-Pesa PIN."
        });

        // Start polling for payment status
        pollPaymentStatus(data.invoice_id);
      } else {
        setPaymentStatus({
          type: "error",
          message: data.message || "Payment initiation failed. Please try again."
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus({
        type: "error",
        message: "Network error. Please check your connection and try again."
      });
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (invoiceId) => {
    const token = localStorage.getItem("token");
    let attempts = 0;
    const maxAttempts = 30; // Poll for ~3 minutes (6s * 30)

    const checkStatus = async () => {
      try {
        const response = await fetch(
  `https://megaodds-backend.onrender.com/api/payment/status/${invoiceId}`,
  {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }
);

        const data = await response.json();

        if (data.success && (data.status === "COMPLETE" || data.status === "COMPLETED")) {
          setPaymentStatus({
            type: "success",
            message: "🎉 Payment successful! Your VIP access has been activated. Redirecting..."
          });
          setLoading(false);

          // Update local storage
          localStorage.setItem("is_vip", "1");

          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = "/vip-section";
          }, 2000);

          return true; // Stop polling
        } else if (data.status === "FAILED") {
          setPaymentStatus({
            type: "error",
            message: "❌ Payment failed. Please try again or contact support."
          });
          setLoading(false);
          return true; // Stop polling
        }

        attempts++;
        if (attempts >= maxAttempts) {
          setPaymentStatus({
            type: "warning",
            message: "⏱️ Payment is taking longer than expected. We'll notify you once it's confirmed."
          });
          setLoading(false);
          return true; // Stop polling
        }

        // Continue polling
        setTimeout(checkStatus, 6000); // Check every 6 seconds
      } catch (error) {
        console.error("Status check error:", error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 6000);
        } else {
          setPaymentStatus({
            type: "warning",
            message: "Unable to verify payment status. Please contact support if money was deducted."
          });
          setLoading(false);
        }
      }
    };

    checkStatus();
  };

  const closeModal = () => {
    if (loading) {
      const confirm = window.confirm("Payment is in progress. Are you sure you want to close?");
      if (!confirm) return;
    }
    setShowModal(false);
    setPhoneNumber("");
    setPaymentStatus(null);
    setSelectedPlan(null);
    setLoading(false);
  };

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
          Get access to verified & fixed first-half correct score with guaranteed accuracy.
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
              <span>3 Fixed Matches a day for 1 week</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>First Half Correct Scores</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>100% Success Rate</span>
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

          <button 
            className="pricing-btn pricing-btn-starter"
            onClick={() => handlePlanSelect('starter')}
          >
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
              <span>3 Fixed Matches a day for 1 month</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>First Half Correct Scores</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>100% Success Rate</span>
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

          <button 
            className="pricing-btn pricing-btn-pro"
            onClick={() => handlePlanSelect('pro')}
          >
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
              <span>6 Fixed Matches a day for 1 month</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>First Half Correct Scores</span>
            </li>
            <li className="pricing-feature">
              <span className="pricing-check">✓</span>
              <span>100% Success Rate</span>
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
              <span>Instant Notifications</span>
            </li>
          </ul>

          <button 
            className="pricing-btn pricing-btn-vip"
            onClick={() => handlePlanSelect('vip')}
          >
            <span>Go VIP Elite</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

      </section>

      {/* Payment Modal */}
      {showModal && (
        <div className="payment-modal-overlay" onClick={closeModal}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <h2>Complete Your Payment</h2>
              <p className="modal-plan-name">{plans[selectedPlan]?.name} Plan</p>
            </div>

            <div className="modal-amount">
              <span className="modal-currency">KES</span>
              <span className="modal-value">{plans[selectedPlan]?.price.toLocaleString()}</span>
              <span className="modal-period">/ {plans[selectedPlan]?.period}</span>
            </div>

            <div className="modal-form">
              <label htmlFor="phone">M-Pesa Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="07XX XXX XXX or 2547XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
                className="phone-input"
              />
              
              <button
                onClick={initiatePayment}
                disabled={loading || !phoneNumber}
                className="pay-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>Pay with M-Pesa</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 12L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

              {paymentStatus && (
                <div className={`payment-status payment-status-${paymentStatus.type}`}>
                  {paymentStatus.message}
                </div>
              )}

              <div className="payment-info">
                <p>📱 You will receive an STK push on your phone</p>
                <p>🔐 Enter your M-Pesa PIN to complete payment</p>
                <p>⚡ VIP access is granted immediately after payment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <section className="pricing-trust">
        <div className="trust-item">
          <div className="trust-icon">🏆</div>
          <h4>Verified Results</h4>
          <p>All Games tracked & verified</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon">🔒</div>
          <h4>Secure Payment</h4>
          <p>Safe & encrypted M-Pesa transactions</p>
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
            <p>"Fixed matches" refer to sports games where the outcome has been pre-determined, usually illegally, rather than being decided fairly by the players' performance.</p>
            <Link to="/Learn" className="faq-learn-more">
              Learn more about fixed matches →
            </Link>
          </div>
          
          <div className="faq-item">
            <h3>How do I receive the picks?</h3>
            <p>Immediately after payment, you'll be added to our private Telegram/WhatsApp group where we share all fixed matches 2-4 hours before kickoff. You also get direct VIP section access.</p>
          </div>
          
          <div className="faq-item">
            <h3>Is M-Pesa payment secure?</h3>
            <p>Yes! We use Intasend's secure payment gateway. Your payment is encrypted and processed directly through M-Pesa's official system.</p>
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

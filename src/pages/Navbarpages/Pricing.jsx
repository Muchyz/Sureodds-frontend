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
        "6 Fixed Matches a day for 1 month",
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
    const maxAttempts = 30;

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
          localStorage.setItem("is_vip", "1");
          setTimeout(() => {
            window.location.href = "/vip-section";
          }, 2000);
          return true;
        } else if (data.status === "FAILED") {
          setPaymentStatus({
            type: "error",
            message: "❌ Payment failed. Please try again or contact support."
          });
          setLoading(false);
          return true;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          setPaymentStatus({
            type: "warning",
            message: "⏱️ Payment is taking longer than expected. We'll notify you once it's confirmed."
          });
          setLoading(false);
          return true;
        }

        setTimeout(checkStatus, 6000);
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
    <div className="megaodds-pricing-page">

      <div className="megaodds-bg-orbs">
        <div className="megaodds-orb megaodds-orb-1"></div>
        <div className="megaodds-orb megaodds-orb-2"></div>
        <div className="megaodds-orb megaodds-orb-3"></div>
      </div>

      <section className="megaodds-hero">
        <span className="megaodds-badge">
          <span className="megaodds-badge-shine"></span>
          ⚽ FIRST HALF CORRECT SCORES
        </span>
        <h1 className="megaodds-title">
          Premium Fixed Matches
          <span className="megaodds-gradient-text">Pricing Plans</span>
        </h1>
        <p className="megaodds-subtitle">
          Get access to verified & fixed first-half correct scores with guaranteed accuracy.
          Choose your winning plan today.
        </p>
      </section>

      <section className="megaodds-pricing-grid">

        {/* STARTER */}
        <div className="megaodds-card">
          <div className="megaodds-card-header">
            <div className="megaodds-plan-icon">🎯</div>
            <h3 className="megaodds-plan-name">Starter</h3>
            <p className="megaodds-plan-desc">Perfect for beginners</p>
          </div>
          <div className="megaodds-amount">
            <span className="megaodds-currency">KES</span>
            <span className="megaodds-value">2,500</span>
            <span className="megaodds-period">/ week</span>
          </div>
          <ul className="megaodds-features">
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>3 Fixed Matches a day for 1 week</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>First Half Correct Scores</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>100% Success Rate</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>WhatsApp Support</span></li>
            <li className="megaodds-feature megaodds-disabled"><span className="megaodds-cross">✗</span><span>VIP Telegram Group</span></li>
          </ul>
          <button className="megaodds-btn megaodds-btn-starter" onClick={() => handlePlanSelect('starter')}>
            <span>Get Started</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* PRO */}
        <div className="megaodds-card megaodds-card-popular">
          <div className="megaodds-popular-badge"><span>🔥 MOST POPULAR</span></div>
          <div className="megaodds-card-header">
            <div className="megaodds-plan-icon">👑</div>
            <h3 className="megaodds-plan-name">Pro</h3>
            <p className="megaodds-plan-desc">Best value for serious bettors</p>
          </div>
          <div className="megaodds-amount">
            <span className="megaodds-currency">KES</span>
            <span className="megaodds-value">8,000</span>
            <span className="megaodds-period">/ month</span>
          </div>
          <ul className="megaodds-features">
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>3 Fixed Matches a day for 1 month</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>First Half Correct Scores</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>100% Success Rate</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>VIP Telegram Group</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>24/7 Priority Support</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>Live Match Updates</span></li>
          </ul>
          <button className="megaodds-btn megaodds-btn-pro" onClick={() => handlePlanSelect('pro')}>
            <span>Get Pro Access</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* VIP */}
        <div className="megaodds-card">
          <div className="megaodds-card-header">
            <div className="megaodds-plan-icon">💎</div>
            <h3 className="megaodds-plan-name">VIP Elite</h3>
            <p className="megaodds-plan-desc">Maximum winning potential</p>
          </div>
          <div className="megaodds-amount">
            <span className="megaodds-currency">KES</span>
            <span className="megaodds-value">20,000</span>
            <span className="megaodds-period">/ month</span>
          </div>
          <ul className="megaodds-features">
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>6 Fixed Matches a day for 1 month</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>First Half Correct Scores</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>100% Success Rate</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>Exclusive VIP Telegram</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>Personal Account Manager</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>Advanced Analytics Dashboard</span></li>
            <li className="megaodds-feature"><span className="megaodds-check">✓</span><span>Instant Notifications</span></li>
          </ul>
          <button className="megaodds-btn megaodds-btn-vip" onClick={() => handlePlanSelect('vip')}>
            <span>Go VIP Elite</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

      </section>

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="megaodds-modal-overlay" onClick={closeModal}>
          <div className="megaodds-modal" onClick={(e) => e.stopPropagation()}>

            <button className="megaodds-modal-close" onClick={closeModal}>×</button>

            <div className="megaodds-modal-header">
              <h2>Complete Your Payment</h2>
              <p className="megaodds-modal-plan-name">{plans[selectedPlan]?.name} Plan</p>
            </div>

            <div className="megaodds-modal-amount">
              <span className="megaodds-modal-currency">KES</span>
              <span className="megaodds-modal-value">{plans[selectedPlan]?.price.toLocaleString()}</span>
              <span className="megaodds-modal-period">/ {plans[selectedPlan]?.period}</span>
            </div>

            <div className="megaodds-modal-form">
              <label htmlFor="phone">M-Pesa Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="07XX XXX XXX or 2547XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
                className="megaodds-phone-input"
              />

              <button
                onClick={initiatePayment}
                disabled={loading || !phoneNumber}
                className="megaodds-pay-button"
              >
                {loading ? (
                  <>
                    <span className="megaodds-spinner"></span>
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
                <div className={`megaodds-payment-status megaodds-payment-status-${paymentStatus.type}`}>
                  {paymentStatus.message}
                </div>
              )}

              <div className="megaodds-payment-info">
                <p>📱 You will receive an STK push on your phone</p>
                <p>🔐 Enter your M-Pesa PIN to complete payment</p>
                <p>⚡ VIP access is granted immediately after payment</p>
              </div>
            </div>

          </div>
        </div>
      )}

      <section className="megaodds-trust">
        <div className="megaodds-trust-item">
          <div className="megaodds-trust-icon">🏆</div>
          <h4>Verified Results</h4>
          <p>All Games tracked & verified</p>
        </div>
        <div className="megaodds-trust-item">
          <div className="megaodds-trust-icon">🔒</div>
          <h4>Secure Payment</h4>
          <p>Safe & encrypted M-Pesa transactions</p>
        </div>
        <div className="megaodds-trust-item">
          <div className="megaodds-trust-icon">⚡</div>
          <h4>Instant Access</h4>
          <p>Get picks immediately after payment</p>
        </div>
      </section>

      <section className="megaodds-faq">
        <h2 className="megaodds-faq-title">Frequently Asked Questions</h2>
        <div className="megaodds-faq-grid">
          <div className="megaodds-faq-item">
            <h3>What are "Fixed Matches"?</h3>
            <p>"Fixed matches" refer to sports games where the outcome has been pre-determined, usually illegally, rather than being decided fairly by the players' performance.</p>
            <Link to="/Learn" className="megaodds-faq-learn-more">Learn more about fixed matches →</Link>
          </div>
          <div className="megaodds-faq-item">
            <h3>How do I receive the picks?</h3>
            <p>Immediately after payment, you'll be added to our private Telegram/WhatsApp group where we share all fixed matches 2-4 hours before kickoff. You also get direct VIP section access.</p>
          </div>
          <div className="megaodds-faq-item">
            <h3>Is M-Pesa payment secure?</h3>
            <p>Yes! We use Intasend's secure payment gateway. Your payment is encrypted and processed directly through M-Pesa's official system.</p>
          </div>
          <div className="megaodds-faq-item">
            <h3>Can I upgrade my plan?</h3>
            <p>Yes! You can upgrade anytime, and we'll credit the remaining value of your current plan toward the new one.</p>
          </div>
        </div>
      </section>

      <footer className="megaodds-footer">
        <p>© {new Date().getFullYear()} Mega-Odds. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Pricing;

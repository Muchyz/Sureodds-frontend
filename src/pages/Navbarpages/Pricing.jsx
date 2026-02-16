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
      icon: "🎯",
      label: "ENTRY LEVEL",
      color: "cyan",
      features: [
        "3 Fixed Matches a day for 1 week",
        "First Half Correct Scores",
        "100% Success Rate",
        "WhatsApp Support"
      ],
      locked: ["VIP Telegram Group"]
    },
    pro: {
      name: "Pro",
      price: 8000,
      period: "month",
      icon: "⚡",
      label: "MOST POPULAR",
      color: "green",
      features: [
        "3 Fixed Matches a day for 1 month",
        "First Half Correct Scores",
        "100% Success Rate",
        "VIP Telegram Group",
        "24/7 Priority Support",
        "Live Match Updates"
      ],
      locked: []
    },
    vip: {
      name: "VIP Elite",
      price: 20000,
      period: "month",
      icon: "💎",
      label: "MAXIMUM POWER",
      color: "gold",
      features: [
        "6 Fixed Matches a day for 1 month",
        "First Half Correct Scores",
        "100% Success Rate",
        "Exclusive VIP Telegram",
        "Personal Account Manager",
        "Advanced Analytics Dashboard",
        "Instant Notifications"
      ],
      locked: []
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
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        const data = await response.json();
        if (data.success && (data.status === "COMPLETE" || data.status === "COMPLETED")) {
          setPaymentStatus({
            type: "success",
            message: "🎉 Payment successful! Your VIP access has been activated. Redirecting..."
          });
          setLoading(false);
          localStorage.setItem("is_vip", "1");
          setTimeout(() => { window.location.href = "/vip-section"; }, 2000);
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
    <div className="mo-page">

      {/* Grid texture overlay */}
      <div className="mo-grid-texture" aria-hidden="true"></div>

      {/* Scan-line overlay */}
      <div className="mo-scanlines" aria-hidden="true"></div>

      {/* Corner accents */}
      <div className="mo-corner mo-corner-tl" aria-hidden="true"></div>
      <div className="mo-corner mo-corner-tr" aria-hidden="true"></div>

      {/* HERO */}
      <section className="mo-hero">
        <div className="mo-hero-tag">⚽ FIRST HALF CORRECT SCORES</div>

        <div className="mo-hero-stat-row">
          <div className="mo-stat"><span className="mo-stat-num">100%</span><span className="mo-stat-label">Win Rate</span></div>
          <div className="mo-stat-divider"></div>
          <div className="mo-stat"><span className="mo-stat-num">3–6</span><span className="mo-stat-label">Daily Picks</span></div>
          <div className="mo-stat-divider"></div>
          <div className="mo-stat"><span className="mo-stat-num">24/7</span><span className="mo-stat-label">Support</span></div>
        </div>

        <h1 className="mo-hero-title">
          <span className="mo-title-top">PREMIUM FIXED</span>
          <span className="mo-title-bottom">MATCH PLANS</span>
        </h1>

        <p className="mo-hero-sub">
          Verified first-half correct scores. Guaranteed accuracy. Choose your tier.
        </p>
      </section>

      {/* CARDS */}
      <section className="mo-cards">

        {/* STARTER */}
        <div className="mo-card mo-card-cyan">
          <div className="mo-card-corner-tl"></div>
          <div className="mo-card-corner-br"></div>
          <div className="mo-card-tier">TIER 01</div>
          <div className="mo-card-top">
            <div className="mo-card-icon">🎯</div>
            <div>
              <div className="mo-card-label cyan-text">ENTRY LEVEL</div>
              <div className="mo-card-name">Starter</div>
            </div>
          </div>
          <div className="mo-card-price-block">
            <div className="mo-card-price-line"></div>
            <div className="mo-card-price-row">
              <span className="mo-price-cur">KES</span>
              <span className="mo-price-num">2,500</span>
              <span className="mo-price-per">/ week</span>
            </div>
            <div className="mo-card-price-line"></div>
          </div>
          <ul className="mo-features">
            <li><span className="mo-chk cyan-chk">▶</span>3 Fixed Matches a day for 1 week</li>
            <li><span className="mo-chk cyan-chk">▶</span>First Half Correct Scores</li>
            <li><span className="mo-chk cyan-chk">▶</span>100% Success Rate</li>
            <li><span className="mo-chk cyan-chk">▶</span>WhatsApp Support</li>
            <li className="mo-locked"><span className="mo-chk locked-chk">✕</span>VIP Telegram Group</li>
          </ul>
          <button className="mo-btn mo-btn-cyan" onClick={() => handlePlanSelect('starter')}>
            <span className="mo-btn-text">GET STARTED</span>
            <span className="mo-btn-arrow">→</span>
          </button>
        </div>

        {/* PRO */}
        <div className="mo-card mo-card-green mo-card-featured">
          <div className="mo-card-corner-tl"></div>
          <div className="mo-card-corner-br"></div>
          <div className="mo-featured-strip">🔥 MOST POPULAR</div>
          <div className="mo-card-tier">TIER 02</div>
          <div className="mo-card-top">
            <div className="mo-card-icon">⚡</div>
            <div>
              <div className="mo-card-label green-text">MOST POPULAR</div>
              <div className="mo-card-name">Pro</div>
            </div>
          </div>
          <div className="mo-card-price-block">
            <div className="mo-card-price-line green-line"></div>
            <div className="mo-card-price-row">
              <span className="mo-price-cur">KES</span>
              <span className="mo-price-num green-num">8,000</span>
              <span className="mo-price-per">/ month</span>
            </div>
            <div className="mo-card-price-line green-line"></div>
          </div>
          <ul className="mo-features">
            <li><span className="mo-chk green-chk">▶</span>3 Fixed Matches a day for 1 month</li>
            <li><span className="mo-chk green-chk">▶</span>First Half Correct Scores</li>
            <li><span className="mo-chk green-chk">▶</span>100% Success Rate</li>
            <li><span className="mo-chk green-chk">▶</span>VIP Telegram Group</li>
            <li><span className="mo-chk green-chk">▶</span>24/7 Priority Support</li>
            <li><span className="mo-chk green-chk">▶</span>Live Match Updates</li>
          </ul>
          <button className="mo-btn mo-btn-green" onClick={() => handlePlanSelect('pro')}>
            <span className="mo-btn-text">GET PRO ACCESS</span>
            <span className="mo-btn-arrow">→</span>
          </button>
        </div>

        {/* VIP */}
        <div className="mo-card mo-card-gold">
          <div className="mo-card-corner-tl"></div>
          <div className="mo-card-corner-br"></div>
          <div className="mo-card-tier">TIER 03</div>
          <div className="mo-card-top">
            <div className="mo-card-icon">💎</div>
            <div>
              <div className="mo-card-label gold-text">MAXIMUM POWER</div>
              <div className="mo-card-name">VIP Elite</div>
            </div>
          </div>
          <div className="mo-card-price-block">
            <div className="mo-card-price-line gold-line"></div>
            <div className="mo-card-price-row">
              <span className="mo-price-cur">KES</span>
              <span className="mo-price-num gold-num">20,000</span>
              <span className="mo-price-per">/ month</span>
            </div>
            <div className="mo-card-price-line gold-line"></div>
          </div>
          <ul className="mo-features">
            <li><span className="mo-chk gold-chk">▶</span>6 Fixed Matches a day for 1 month</li>
            <li><span className="mo-chk gold-chk">▶</span>First Half Correct Scores</li>
            <li><span className="mo-chk gold-chk">▶</span>100% Success Rate</li>
            <li><span className="mo-chk gold-chk">▶</span>Exclusive VIP Telegram</li>
            <li><span className="mo-chk gold-chk">▶</span>Personal Account Manager</li>
            <li><span className="mo-chk gold-chk">▶</span>Advanced Analytics Dashboard</li>
            <li><span className="mo-chk gold-chk">▶</span>Instant Notifications</li>
          </ul>
          <button className="mo-btn mo-btn-gold" onClick={() => handlePlanSelect('vip')}>
            <span className="mo-btn-text">GO VIP ELITE</span>
            <span className="mo-btn-arrow">→</span>
          </button>
        </div>

      </section>

      {/* PAYMENT MODAL */}
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
                  <><span className="spinner"></span>Processing...</>
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

      {/* TRUST STRIP */}
      <section className="mo-trust">
        <div className="mo-trust-item">
          <span className="mo-trust-icon">🏆</span>
          <div>
            <div className="mo-trust-title">Verified Results</div>
            <div className="mo-trust-sub">All games tracked & verified</div>
          </div>
        </div>
        <div className="mo-trust-sep"></div>
        <div className="mo-trust-item">
          <span className="mo-trust-icon">🔒</span>
          <div>
            <div className="mo-trust-title">Secure Payment</div>
            <div className="mo-trust-sub">Safe & encrypted M-Pesa</div>
          </div>
        </div>
        <div className="mo-trust-sep"></div>
        <div className="mo-trust-item">
          <span className="mo-trust-icon">⚡</span>
          <div>
            <div className="mo-trust-title">Instant Access</div>
            <div className="mo-trust-sub">Picks immediately after payment</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mo-faq">
        <div className="mo-faq-header">
          <span className="mo-faq-tag">// FAQ</span>
          <h2 className="mo-faq-title">FREQUENTLY ASKED</h2>
        </div>
        <div className="mo-faq-grid">
          <div className="mo-faq-item">
            <div className="mo-faq-num">01</div>
            <h3>What are "Fixed Matches"?</h3>
            <p>Sports games where the outcome has been pre-determined, usually illegally, rather than being decided fairly by the players' performance.</p>
            <Link to="/Learn" className="mo-faq-link">Learn more →</Link>
          </div>
          <div className="mo-faq-item">
            <div className="mo-faq-num">02</div>
            <h3>How do I receive the picks?</h3>
            <p>Immediately after payment you'll be added to our private Telegram/WhatsApp group. Picks shared 2–4 hours before kickoff, plus direct VIP section access.</p>
          </div>
          <div className="mo-faq-item">
            <div className="mo-faq-num">03</div>
            <h3>Is M-Pesa payment secure?</h3>
            <p>Yes. We use Intasend's secure payment gateway. Your payment is encrypted and processed directly through M-Pesa's official system.</p>
          </div>
          <div className="mo-faq-item">
            <div className="mo-faq-num">04</div>
            <h3>Can I upgrade my plan?</h3>
            <p>Yes! Upgrade anytime and we'll credit the remaining value of your current plan toward the new one.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mo-footer">
        <div className="mo-footer-line"></div>
        <p>© {new Date().getFullYear()} MEGA-ODDS. ALL RIGHTS RESERVED.</p>
      </footer>

    </div>
  );
}

export default Pricing;

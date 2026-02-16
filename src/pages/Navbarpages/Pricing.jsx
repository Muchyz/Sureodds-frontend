import { useState } from "react";
import { Link } from "react-router-dom";
import "./Pricing.css";

function Pricing() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [transactionCode, setTransactionCode] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [verifyingManual, setVerifyingManual] = useState(false);

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
    setShowManualPayment(false);
    setTransactionCode("");
    // Generate unique reference number for this transaction
    setReferenceNumber(`MO${Date.now()}`);
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
          plan_name: `${plan.name} Plan - ${plan.period}`,
          reference_number: referenceNumber
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
        // Show manual payment fallback
        setPaymentStatus({
          type: "error",
          message: "⚠️ STK Push failed. Please use manual payment option below."
        });
        setShowManualPayment(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus({
        type: "error",
        message: "⚠️ Connection error. Please use manual payment option below."
      });
      setShowManualPayment(true);
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
            message: "⚠️ Payment failed. Please use manual payment option below."
          });
          setShowManualPayment(true);
          setLoading(false);
          return true;
        }
        attempts++;
        if (attempts >= maxAttempts) {
          setPaymentStatus({
            type: "warning",
            message: "⏱️ Payment is taking longer than expected. You can use manual payment below."
          });
          setShowManualPayment(true);
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
            message: "Unable to verify payment. You can use manual payment below."
          });
          setShowManualPayment(true);
          setLoading(false);
        }
      }
    };
    checkStatus();
  };

  const verifyManualPayment = async () => {
    if (!transactionCode) {
      alert("Please enter your M-Pesa transaction code");
      return;
    }

    setVerifyingManual(true);
    
    try {
      const token = localStorage.getItem("token");
      const plan = plans[selectedPlan];
      
      const response = await fetch("https://megaodds-backend.onrender.com/api/payment/verify-manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          transaction_code: transactionCode.toUpperCase(),
          reference_number: referenceNumber,
          amount: plan.price,
          plan_name: `${plan.name} Plan - ${plan.period}`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setPaymentStatus({
          type: "success",
          message: "🎉 Payment verified! Your VIP access has been activated. Redirecting..."
        });
        localStorage.setItem("is_vip", "1");
        setTimeout(() => { window.location.href = "/vip-section"; }, 2000);
      } else {
        setPaymentStatus({
          type: "error",
          message: data.message || "❌ Invalid transaction code. Please check and try again."
        });
      }
    } catch (error) {
      console.error("Manual verification error:", error);
      setPaymentStatus({
        type: "error",
        message: "Network error. Please try again or contact support."
      });
    } finally {
      setVerifyingManual(false);
    }
  };

  const closeModal = () => {
    if (loading || verifyingManual) {
      const confirm = window.confirm("Payment is in progress. Are you sure you want to close?");
      if (!confirm) return;
    }
    setShowModal(false);
    setPhoneNumber("");
    setPaymentStatus(null);
    setSelectedPlan(null);
    setLoading(false);
    setShowManualPayment(false);
    setTransactionCode("");
    setVerifyingManual(false);
  };

  return (
    <div className="mo-page">

      <div className="mo-grid-texture" aria-hidden="true"></div>
      <div className="mo-scanlines" aria-hidden="true"></div>

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

      {/* M-PESA PAYMENT MODAL */}
      {showModal && (
        <div className="mpesa-overlay" onClick={closeModal}>
          <div className="mpesa-modal" onClick={(e) => e.stopPropagation()}>

            {/* Green header with real M-Pesa logo SVG */}
            <div className="mpesa-header">
              <button className="mpesa-close" onClick={closeModal} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              {/* M-Pesa official logo recreation */}
              <div className="mpesa-logo-wrap">
                <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" className="mpesa-logo-svg">
                  {/* M */}
                  <text x="0" y="48" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="52" fill="white">M</text>
                  {/* red dash */}
                  <rect x="58" y="10" width="8" height="40" rx="3" fill="#e4002b"/>
                  {/* PESA in white */}
                  <text x="72" y="48" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="52" fill="white">PESA</text>
                </svg>
              </div>
              <p className="mpesa-header-sub">Lipa na M-Pesa · Secure Payment</p>
            </div>

            {/* Summary row */}
            <div className="mpesa-summary">
              <div className="mpesa-merchant-row">
                <div className="mpesa-merchant-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div>
                  <div className="mpesa-merchant-name">MEGA-ODDS</div>
                  <div className="mpesa-plan-badge">{plans[selectedPlan]?.name} Plan · {plans[selectedPlan]?.period}</div>
                </div>
              </div>
              <div className="mpesa-amount-block">
                <span className="mpesa-amount-label">AMOUNT</span>
                <div className="mpesa-amount-row">
                  <span className="mpesa-kes">KES</span>
                  <span className="mpesa-amount-num">{plans[selectedPlan]?.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mpesa-divider" />

            {/* Form */}
            <div className="mpesa-form">
              {!showManualPayment ? (
                <>
                  <label className="mpesa-label" htmlFor="mpesa-phone">
                    M-Pesa Phone Number
                  </label>
                  <div className="mpesa-phone-wrap">
                    <span className="mpesa-phone-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                      </svg>
                    </span>
                    <input
                      id="mpesa-phone"
                      type="tel"
                      placeholder="e.g. 0712345678 or 254712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={loading}
                      className="mpesa-phone-input"
                    />
                  </div>

                  <button
                    onClick={initiatePayment}
                    disabled={loading || !phoneNumber}
                    className="mpesa-pay-btn"
                  >
                    {loading ? (
                      <><span className="mpesa-spinner"></span><span>Processing...</span></>
                    ) : (
                      <>
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                          <line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                        <span>Pay KES {plans[selectedPlan]?.price.toLocaleString()}</span>
                      </>
                    )}
                  </button>

                  {paymentStatus && (
                    <div className={`mpesa-status mpesa-status-${paymentStatus.type}`}>
                      {paymentStatus.message}
                    </div>
                  )}

                  <div className="mpesa-steps">
                    <div className="mpesa-steps-title">HOW IT WORKS</div>
                    <div className="mpesa-step">
                      <div className="mpesa-step-num">1</div>
                      <div className="mpesa-step-text">Enter your Safaricom number &amp; tap Pay</div>
                    </div>
                    <div className="mpesa-step">
                      <div className="mpesa-step-num">2</div>
                      <div className="mpesa-step-text">An STK push prompt appears on your phone</div>
                    </div>
                    <div className="mpesa-step">
                      <div className="mpesa-step-num">3</div>
                      <div className="mpesa-step-text">Enter your M-Pesa PIN to confirm payment</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="manual-payment-section">
                    <div className="manual-payment-header">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2"/>
                        <line x1="2" y1="10" x2="22" y2="10"/>
                      </svg>
                      <h3>Manual Payment</h3>
                    </div>
                    
                    <div className="manual-payment-instructions">
                      <p className="manual-payment-title">Complete payment manually using these details:</p>
                      
                      <div className="payment-detail-box">
                        <div className="payment-detail-item">
                          <span className="payment-detail-label">1. Go to M-Pesa</span>
                          <span className="payment-detail-value">Lipa na M-Pesa → Paybill</span>
                        </div>
                        
                        <div className="payment-detail-item highlight">
                          <span className="payment-detail-label">2. Business Number</span>
                          <span className="payment-detail-value selectable">247247</span>
                        </div>
                        
                        <div className="payment-detail-item highlight">
                          <span className="payment-detail-label">3. Account Number</span>
                          <span className="payment-detail-value selectable">0040179069768</span>
                        </div>
                        
                        <div className="payment-detail-item">
                          <span className="payment-detail-label">4. Amount</span>
                          <span className="payment-detail-value amount">KES {plans[selectedPlan]?.price.toLocaleString()}</span>
                        </div>
                        
                        <div className="payment-detail-item">
                          <span className="payment-detail-label">5. Reference</span>
                          <span className="payment-detail-value selectable">{referenceNumber}</span>
                        </div>
                      </div>

                      <div className="manual-payment-note">
                        💡 After completing payment, you'll receive an M-Pesa confirmation message with a transaction code (e.g., QH23KLM890)
                      </div>
                    </div>

                    <div className="mpesa-divider" style={{margin: '20px 0'}} />

                    <label className="mpesa-label" htmlFor="transaction-code">
                      Enter M-Pesa Transaction Code
                    </label>
                    <div className="mpesa-phone-wrap">
                      <span className="mpesa-phone-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10 9 9 9 8 9"/>
                        </svg>
                      </span>
                      <input
                        id="transaction-code"
                        type="text"
                        placeholder="e.g., QH23KLM890"
                        value={transactionCode}
                        onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                        disabled={verifyingManual}
                        className="mpesa-phone-input"
                        style={{textTransform: 'uppercase'}}
                      />
                    </div>

                    <button
                      onClick={verifyManualPayment}
                      disabled={verifyingManual || !transactionCode}
                      className="mpesa-pay-btn"
                    >
                      {verifyingManual ? (
                        <><span className="mpesa-spinner"></span><span>Verifying...</span></>
                      ) : (
                        <>
                          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          <span>Verify Payment</span>
                        </>
                      )}
                    </button>

                    {paymentStatus && (
                      <div className={`mpesa-status mpesa-status-${paymentStatus.type}`}>
                        {paymentStatus.message}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="mpesa-trust-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Secured by Safaricom M-Pesa · Powered by Intasend</span>
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
            <div className="mo-trust-sub">All games tracked &amp; verified</div>
          </div>
        </div>
        <div className="mo-trust-sep"></div>
        <div className="mo-trust-item">
          <span className="mo-trust-icon">🔒</span>
          <div>
            <div className="mo-trust-title">Secure Payment</div>
            <div className="mo-trust-sub">Safe &amp; encrypted M-Pesa</div>
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

      <footer className="mo-footer">
        <div className="mo-footer-line"></div>
        <p>© {new Date().getFullYear()} MEGA-ODDS. ALL RIGHTS RESERVED.</p>
      </footer>

    </div>
  );
}

export default Pricing;

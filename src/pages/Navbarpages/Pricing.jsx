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
  const [detectedProvider, setDetectedProvider] = useState(null);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copied to clipboard!`);
    }).catch(() => {
      alert("Failed to copy. Please copy manually.");
    });
  };

  const detectProvider = (phone) => {
    const clean = phone.replace(/[\s\+\-]/g, "");
    const local = clean.startsWith("254") ? "0" + clean.substring(3) : clean;
    const prefix4 = local.substring(0, 4);
    const mpesaPrefixes = [
      "0700","0701","0702","0703","0704","0705","0706","0707","0708","0709",
      "0710","0711","0712","0713","0714","0715","0716","0717","0718","0719",
      "0720","0721","0722","0723","0724","0725","0726","0727","0728","0729",
      "0740","0741","0742","0743","0744","0745","0746","0747","0748","0749",
      "0757","0758","0759","0768","0769",
      "0790","0791","0792","0793","0794","0795","0796","0797","0798","0799",
      "0110","0111","0112","0113","0114","0115","0116","0117","0118","0119",
    ];
    return mpesaPrefixes.includes(prefix4) ? "mpesa" : "airtel";
  };

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
        "WhatsApp Support",
      ],
      locked: ["VIP Telegram Group"],
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
        "Live Match Updates",
      ],
      locked: [],
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
        "Instant Notifications",
      ],
      locked: [],
    },
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
    setDetectedProvider(null);
    setReferenceNumber(`MO${Date.now()}`);
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhoneNumber(val);
    if (val.replace(/\s/g, "").length >= 10) {
      setDetectedProvider(detectProvider(val));
    } else {
      setDetectedProvider(null);
    }
  };

  const initiatePayment = async () => {
    if (!phoneNumber) {
      alert("Please enter your phone number");
      return;
    }

    const cleanPhone = phoneNumber.replace(/\s/g, "");
    const phoneRegex = /^(254|0)[17]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      alert("Please enter a valid Kenyan phone number (e.g., 0712345678)");
      return;
    }

    // If Airtel detected, skip STK and go straight to manual
    const provider = detectProvider(cleanPhone);
    if (provider === "airtel") {
      setShowManualPayment(true);
      setPaymentStatus({
        type: "warning",
        message: "⚠️ Airtel Money STK push is not supported yet. Please use manual payment below.",
      });
      return;
    }

    setLoading(true);
    setPaymentStatus({ type: "info", message: "Initiating M-Pesa payment..." });

    try {
      const token = localStorage.getItem("token");
      const plan = plans[selectedPlan];
      const response = await fetch("https://megaodds-backend.onrender.com/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: plan.price,
          phone_number: cleanPhone,
          plan_name: `${plan.name} Plan - ${plan.period}`,
          reference_number: referenceNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus({
          type: "success",
          message: "✅ M-Pesa STK Push sent! Check your phone and enter your PIN.",
        });
        pollPaymentStatus(data.invoice_id);
      } else {
        setPaymentStatus({
          type: "error",
          message: "⚠️ Payment prompt failed. Please use the manual payment option below.",
        });
        setShowManualPayment(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus({
        type: "error",
        message: "⚠️ Connection error. Please use the manual payment option below.",
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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();

        if (data.success && (data.status === "COMPLETE" || data.status === "COMPLETED")) {
          setPaymentStatus({
            type: "success",
            message: "🎉 Payment successful! Your VIP access has been activated. Redirecting...",
          });
          setLoading(false);
          localStorage.setItem("is_vip", "1");
          setTimeout(() => { window.location.href = "/vip-section"; }, 2000);
          return;
        }

        if (data.status === "FAILED") {
          setPaymentStatus({
            type: "error",
            message: "⚠️ Payment failed or cancelled. Please use manual payment below.",
          });
          setShowManualPayment(true);
          setLoading(false);
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          setPaymentStatus({
            type: "warning",
            message: "⏱️ Payment is taking longer than expected. You can complete it manually below.",
          });
          setShowManualPayment(true);
          setLoading(false);
          return;
        }

        setTimeout(checkStatus, 6000);
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 6000);
        } else {
          setPaymentStatus({
            type: "warning",
            message: "Unable to verify payment automatically. Use manual payment below.",
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
      alert("Please enter your M-Pesa or Airtel Money transaction code");
      return;
    }

    setVerifyingManual(true);
    setPaymentStatus(null);

    try {
      const token = localStorage.getItem("token");
      const plan = plans[selectedPlan];

      const response = await fetch("https://megaodds-backend.onrender.com/api/payment/verify-manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transaction_code: transactionCode.toUpperCase(),
          reference_number: referenceNumber,
          amount: plan.price,
          plan_name: `${plan.name} Plan - ${plan.period}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus({
          type: "success",
          message: "🎉 Payment verified! Your VIP access has been activated. Redirecting...",
        });
        localStorage.setItem("is_vip", "1");
        setTimeout(() => { window.location.href = "/vip-section"; }, 2000);
      } else {
        setPaymentStatus({
          type: "error",
          message: data.message || "❌ Payment not found. Please check your transaction code or contact support.",
        });
      }
    } catch (error) {
      setPaymentStatus({
        type: "error",
        message: "❌ Verification failed. Please check your code and try again or contact support.",
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
    setDetectedProvider(null);
  };

  return (
    <div className="mo-page">
      <div className="mo-grid-texture" aria-hidden="true"></div>
      <div className="mo-scanlines" aria-hidden="true"></div>

      {/* HERO */}
      <section className="mo-hero">
        <div className="mo-hero-tag">⚽ FIRST HALF CORRECT SCORES</div>
        <div className="mo-hero-stat-row">
          <div className="mo-stat">
            <span className="mo-stat-num">100%</span>
            <span className="mo-stat-label">Win Rate</span>
          </div>
          <div className="mo-stat-divider"></div>
          <div className="mo-stat">
            <span className="mo-stat-num">3–6</span>
            <span className="mo-stat-label">Daily Picks</span>
          </div>
          <div className="mo-stat-divider"></div>
          <div className="mo-stat">
            <span className="mo-stat-num">24/7</span>
            <span className="mo-stat-label">Support</span>
          </div>
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
          <button className="mo-btn mo-btn-cyan" onClick={() => handlePlanSelect("starter")}>
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
          <button className="mo-btn mo-btn-green" onClick={() => handlePlanSelect("pro")}>
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
          <button className="mo-btn mo-btn-gold" onClick={() => handlePlanSelect("vip")}>
            <span className="mo-btn-text">GO VIP ELITE</span>
            <span className="mo-btn-arrow">→</span>
          </button>
        </div>
      </section>

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="mpesa-overlay" onClick={closeModal}>
          <div className="mpesa-modal" onClick={(e) => e.stopPropagation()}>

            <div className="mpesa-header">
              <button className="mpesa-close" onClick={closeModal} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="mpesa-logo-wrap">
                <div className="mpesa-logo-text">📱 Mobile Money</div>
              </div>
              <p className="mpesa-header-sub">M-Pesa &amp; Airtel Money · Secure Payment</p>
            </div>

            <div className="mpesa-summary">
              <div className="mpesa-merchant-row">
                <div className="mpesa-merchant-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <div className="mpesa-merchant-name">MEGA-ODDS</div>
                  <div className="mpesa-plan-badge">
                    {plans[selectedPlan]?.name} Plan · {plans[selectedPlan]?.period}
                  </div>
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

            <div className="mpesa-form">
              {!showManualPayment ? (
                <>
                  <label className="mpesa-label" htmlFor="mpesa-phone">
                    Phone Number
                  </label>

                  {detectedProvider && (
                    <div className={`provider-badge provider-badge-${detectedProvider}`}>
                      {detectedProvider === "mpesa"
                        ? "📲 M-Pesa detected — STK push will be sent"
                        : "📲 Airtel detected — please use manual payment below"}
                    </div>
                  )}

                  <div className="mpesa-phone-wrap">
                    <span className="mpesa-phone-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                      </svg>
                    </span>
                    <input
                      id="mpesa-phone"
                      type="tel"
                      placeholder="M-Pesa: 07XXXXXXXX  |  Airtel: use manual payment"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
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
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
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
                      <div className="mpesa-step-text">Enter your M-Pesa number &amp; tap Pay</div>
                    </div>
                    <div className="mpesa-step">
                      <div className="mpesa-step-num">2</div>
                      <div className="mpesa-step-text">An STK push prompt appears on your phone</div>
                    </div>
                    <div className="mpesa-step">
                      <div className="mpesa-step-num">3</div>
                      <div className="mpesa-step-text">Enter your M-Pesa PIN to confirm and unlock VIP</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {paymentStatus && (
                    <div className={`mpesa-status mpesa-status-${paymentStatus.type}`}>
                      {paymentStatus.message}
                    </div>
                  )}

                  <div className="manual-payment-section">
                    <div className="manual-payment-header">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                      <h3>Manual Payment</h3>
                    </div>

                    <div className="manual-payment-instructions">
                      <p className="manual-payment-title">Pay via M-Pesa or Airtel Money Paybill:</p>

                      <div className="payment-detail-box">
                        <div className="payment-detail-item">
                          <span className="payment-detail-label">1. Go to M-Pesa or Airtel Money</span>
                          <span className="payment-detail-value">Lipa na M-Pesa → Paybill</span>
                        </div>

                        <div className="payment-detail-item highlight">
                          <span className="payment-detail-label">2. Business Number</span>
                          <div className="payment-value-with-copy">
                            <span className="payment-detail-value selectable payment-number">247247</span>
                            <button className="copy-btn" onClick={() => copyToClipboard("247247", "Business Number")} type="button">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                              Copy
                            </button>
                          </div>
                        </div>

                        <div className="payment-detail-item highlight">
                          <span className="payment-detail-label">3. Account Number</span>
                          <div className="payment-value-with-copy">
                            <span className="payment-detail-value selectable payment-number">0040179069768</span>
                            <button className="copy-btn" onClick={() => copyToClipboard("0040179069768", "Account Number")} type="button">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                              Copy
                            </button>
                          </div>
                        </div>

                        <div className="payment-detail-item">
                          <span className="payment-detail-label">4. Amount</span>
                          <span className="payment-detail-value amount">KES {plans[selectedPlan]?.price.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="manual-payment-note">
                        💡 After paying, enter the transaction code from your confirmation SMS (e.g., QH23KLM890 for M-Pesa or AI12345678 for Airtel)
                      </div>
                    </div>

                    <div className="mpesa-divider" style={{ margin: "20px 0" }} />

                    <label className="mpesa-label" htmlFor="transaction-code">
                      Enter Transaction Code to unlock VIP
                    </label>
                    <div className="mpesa-phone-wrap">
                      <span className="mpesa-phone-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </span>
                      <input
                        id="transaction-code"
                        type="text"
                        placeholder="e.g., QH23KLM890 or AI12345678"
                        value={transactionCode}
                        onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                        disabled={verifyingManual}
                        className="mpesa-phone-input"
                        style={{ textTransform: "uppercase" }}
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
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Verify Payment</span>
                        </>
                      )}
                    </button>

                    {!verifyingManual && paymentStatus && (paymentStatus.type === "success" || paymentStatus.type === "error") && (
                      <div className={`mpesa-status mpesa-status-${paymentStatus.type}`}>
                        {paymentStatus.message}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="mpesa-trust-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Secured by Safaricom M-Pesa &amp; Airtel Money · Powered by Paystack</span>
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
            <div className="mo-trust-sub">M-Pesa &amp; Airtel Money via Paystack</div>
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
            <h3>Which payment methods are accepted?</h3>
            <p>M-Pesa STK push (Safaricom) and manual Paybill payment for both M-Pesa and Airtel Money users.</p>
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

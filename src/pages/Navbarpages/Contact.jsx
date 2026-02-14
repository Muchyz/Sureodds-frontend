import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import "./Contact.css";

function Contact() {
  const whatsappNumber = "705427449";
  const telegramUsername = "Muchyz";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`contact-pro ${visible ? "visible" : ""}`}>

      <div className="contact-pro-inner">

        {/* ── Page Header ── */}
        <div className="pro-header">
          <span className="pro-eyebrow">Get in Touch</span>
          <h1 className="pro-title">Contact Us</h1>
          <p className="pro-subtitle">
            Reach our team directly through WhatsApp or Telegram.
            We respond within minutes, around the clock.
          </p>
        </div>

        {/* ── Status Banner ── */}
        <div className="status-banner">
          <span className="status-dot" />
          <span className="status-text">Team is online · Average response under 5 minutes</span>
        </div>

        {/* ── Cards ── */}
        <div className="pro-cards">

          {/* WhatsApp */}
          <div className="pro-card">
            <div className="pro-card-top wa-top">
              <div className="pro-card-icon-wrap wa-icon-wrap">
                <FaWhatsapp className="pro-card-icon" />
              </div>
              <span className="pro-card-tag">Most Popular</span>
            </div>
            <div className="pro-card-body">
              <h2 className="pro-card-title">WhatsApp</h2>
              <p className="pro-card-desc">
                Fast, direct messaging. Send text, voice notes or documents instantly.
              </p>
              <div className="pro-contact-row">
                <span className="pcr-label">Direct Line</span>
                <span className="pcr-value">+254 {whatsappNumber}</span>
              </div>
              <a
                href={`https://wa.me/254${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pro-cta wa-cta"
              >
                <FaWhatsapp className="pro-cta-icon" />
                Message on WhatsApp
              </a>
            </div>
          </div>

          {/* Telegram */}
          <div className="pro-card">
            <div className="pro-card-top tg-top">
              <div className="pro-card-icon-wrap tg-icon-wrap">
                <FaTelegramPlane className="pro-card-icon" />
              </div>
              <span className="pro-card-tag">Encrypted</span>
            </div>
            <div className="pro-card-body">
              <h2 className="pro-card-title">Telegram</h2>
              <p className="pro-card-desc">
                Secure, encrypted messaging. Great for files, groups and private conversations.
              </p>
              <div className="pro-contact-row">
                <span className="pcr-label">Username</span>
                <span className="pcr-value">@{telegramUsername}</span>
              </div>
              <a
                href={`https://t.me/${telegramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pro-cta tg-cta"
              >
                <FaTelegramPlane className="pro-cta-icon" />
                Message on Telegram
              </a>
            </div>
          </div>

        </div>

        {/* ── Trust row ── */}
        <div className="trust-row">
          <div className="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <span>24 / 7 Support</span>
          </div>
          <div className="trust-sep" />
          <div className="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
            <span>Private &amp; Confidential</span>
          </div>
          <div className="trust-sep" />
          <div className="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Verified Team</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;

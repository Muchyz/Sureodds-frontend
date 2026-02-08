import React, { useRef, useEffect, useState } from "react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { RiVipCrownFill } from "react-icons/ri";
import "./Contact.css";

function Contact() {
  const whatsappNumber = "705427449";
  const telegramUsername = "Muchyz";

  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState({ whatsapp: false, telegram: false });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="contact-page-premium" ref={containerRef}>
      {/* Animated Background */}
      <div className="premium-background">
        <div className="gradient-mesh">
          <div className="mesh-circle mesh-1"></div>
          <div className="mesh-circle mesh-2"></div>
          <div className="mesh-circle mesh-3"></div>
          <div className="mesh-circle mesh-4"></div>
          <div className="mesh-circle mesh-5"></div>
        </div>
        <div className="animated-grid"></div>
        <div className="radial-glow" style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${i * 0.3}s`,
            '--duration': `${15 + Math.random() * 10}s`,
            '--x': `${Math.random() * 100}vw`,
            '--y': `${Math.random() * 100}vh`
          }}></div>
        ))}
      </div>

      <div className="content-container">
        {/* Premium Header */}
        <div className="premium-header">
          <div className="vip-badge">
            <RiVipCrownFill className="crown-icon" />
            <span className="badge-text">Premium Connect</span>
            <div className="badge-shine"></div>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">Let's Create</span>
            <span className="title-line title-gradient">Something Amazing</span>
            <div className="title-underline">
              <div className="underline-fill"></div>
            </div>
          </h1>
          
          <p className="hero-subtitle">
            Connect instantly through your preferred premium messaging platform
          </p>

          <div className="trust-indicators">
            <div className="trust-item">
              <HiLightningBolt className="trust-icon" />
              <span>Instant Response</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <HiSparkles className="trust-icon" />
              <span>24/7 Available</span>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="cards-grid">
          {/* WhatsApp Luxury Card */}
          <div
            className={`luxury-card whatsapp-card ${isHovering.whatsapp ? 'is-hovering' : ''}`}
            onMouseEnter={() => setIsHovering({ ...isHovering, whatsapp: true })}
            onMouseLeave={() => setIsHovering({ ...isHovering, whatsapp: false })}
          >
            <div className="card-glow-effect whatsapp-glow"></div>
            <div className="card-inner">
              <div className="card-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-line"></div>
              </div>

              <div className="icon-container">
                <div className="icon-background whatsapp-bg">
                  <div className="icon-pulse"></div>
                </div>
                <FaWhatsapp className="platform-icon" />
                <div className="icon-particles">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="icon-particle"></div>
                  ))}
                </div>
              </div>

              <div className="card-info">
                <h3 className="platform-name">WhatsApp</h3>
                <p className="platform-desc">Lightning-fast messaging</p>
                
                <div className="contact-display">
                  <div className="contact-label">Direct Line</div>
                  <div className="contact-value">+254 {whatsappNumber}</div>
                </div>

                <a
                  href={`https://wa.me/254${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-button whatsapp-button"
                >
                  <span className="button-bg"></span>
                  <span className="button-content">
                    <span className="button-text">Start Chat</span>
                    <span className="button-arrow">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </span>
                  <div className="button-shine"></div>
                </a>
              </div>

              <div className="card-shimmer"></div>
            </div>
          </div>

          {/* Telegram Luxury Card */}
          <div
            className={`luxury-card telegram-card ${isHovering.telegram ? 'is-hovering' : ''}`}
            onMouseEnter={() => setIsHovering({ ...isHovering, telegram: true })}
            onMouseLeave={() => setIsHovering({ ...isHovering, telegram: false })}
          >
            <div className="card-glow-effect telegram-glow"></div>
            <div className="card-inner">
              <div className="card-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-line"></div>
              </div>

              <div className="icon-container">
                <div className="icon-background telegram-bg">
                  <div className="icon-pulse"></div>
                </div>
                <FaTelegramPlane className="platform-icon" />
                <div className="icon-particles">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="icon-particle"></div>
                  ))}
                </div>
              </div>

              <div className="card-info">
                <h3 className="platform-name">Telegram</h3>
                <p className="platform-desc">Secure & encrypted</p>
                
                <div className="contact-display">
                  <div className="contact-label">Username</div>
                  <div className="contact-value">@{telegramUsername}</div>
                </div>

                <a
                  href={`https://t.me/${telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-button telegram-button"
                >
                  <span className="button-bg"></span>
                  <span className="button-content">
                    <span className="button-text">Start Chat</span>
                    <span className="button-arrow">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </span>
                  <div className="button-shine"></div>
                </a>
              </div>

              <div className="card-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Premium Footer */}
        <div className="premium-footer">
          <div className="response-badge">
            <div className="online-indicator">
              <span className="indicator-dot"></span>
              <span className="indicator-pulse"></span>
            </div>
            <span className="response-text">
              <strong>Online Now</strong> • Average response: &lt;5 minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

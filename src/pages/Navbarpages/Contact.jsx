import React, { useRef, useEffect } from "react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import "./Contact.css";

function Contact() {
  const whatsappNumber = "705427449";
  const telegramUsername = "Muchyz";

  const whatsappRef = useRef(null);
  const telegramRef = useRef(null);
  const pageRef = useRef(null);

  const tiltCard = (e, ref) => {
    const card = ref.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;
    card.style.transform = `rotateY(${dx * 15}deg) rotateX(${-dy * 15}deg) scale(1.05)`;
  };

  const resetCard = (ref) => {
    ref.current.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
  };

  // Parallax background effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      pageRef.current.style.transform = `translateX(${x}px) translateY(${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="contact-page" ref={pageRef}>
      <div className="background-bubbles"></div>
      <h2>Contact Me Instantly</h2>
      <p>Click below to chat via WhatsApp or Telegram</p>

      <div className="contact-grid">
        {/* WhatsApp */}
        <div
          className="contact-box whatsapp"
          ref={whatsappRef}
          onMouseMove={(e) => tiltCard(e, whatsappRef)}
          onMouseLeave={() => resetCard(whatsappRef)}
        >
          <FaWhatsapp className="icon" />
          <h3>WhatsApp</h3>
          <p className="number">+254{whatsappNumber}</p>
          <a
            href={`https://wa.me/254${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Chat Now
          </a>
        </div>

        {/* Telegram */}
        <div
          className="contact-box telegram"
          ref={telegramRef}
          onMouseMove={(e) => tiltCard(e, telegramRef)}
          onMouseLeave={() => resetCard(telegramRef)}
        >
          <FaTelegramPlane className="icon" />
          <h3>Telegram</h3>
          <p className="number">@Telegram</p>
          <a
            href={`https://t.me/${telegramUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Chat Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;
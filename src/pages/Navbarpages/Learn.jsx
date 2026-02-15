import React, { useState } from 'react';
import { Shield, AlertTriangle, Scale, TrendingUp, ChevronDown, Zap, Target } from 'lucide-react';
import './Learn.css';

export default function FixedMatchesInfo() {
  const [expandedCase, setExpandedCase] = useState(null);

  const cases = [
    {
      id: 1,
      title: "Brazilian Championship Referees",
      year: "2005",
      country: "🇧🇷 Brazil",
      description: "Two referees in Brazil's top football league accepted bribes to manipulate match results. Edílson Pereira de Carvalho admitted taking money to fix multiple matches, leading to annulments, lifetime bans, and criminal charges.",
      severity: "High",
      amount: "$50K+"
    },
    {
      id: 2,
      title: "Marseille Bribery Scandal",
      year: "1993",
      country: "🇫🇷 France",
      description: "Olympique de Marseille officials bribed Valenciennes players to underperform. The scandal was exposed by a player who refused the bribe. Marseille was stripped of the domestic title, and several were convicted of corruption.",
      severity: "Critical",
      amount: "$200K+"
    },
    {
      id: 3,
      title: "Chinese Football Match-Fixing",
      year: "1999-2000s",
      country: "🇨🇳 China",
      description: "Multiple controversies involving referees and officials taking bribes across seasons. Referee Lu Jun and a referee committee director were banned for life and convicted for influencing league outcomes.",
      severity: "Critical",
      amount: "$1M+"
    },
    {
      id: 4,
      title: "Lebanese Football Scandal",
      year: "2013",
      country: "🇱🇧 Lebanon",
      description: "Part of a global FIFA investigation, numerous Lebanese players were found guilty of accepting bribes from betting companies to lose matches deliberately. Several received lifetime bans and fines.",
      severity: "High",
      amount: "$100K+"
    },
    {
      id: 5,
      title: "Turkey Betting Probe",
      year: "2025",
      country: "🇹🇷 Turkey",
      description: "Turkish authorities detained dozens of referees and a club president in an ongoing match-fixing investigation. The Turkish Football Federation suspended nearly 150 officials for betting on games they officiated.",
      severity: "Critical",
      amount: "$2M+"
    },
    {
      id: 6,
      title: "German Scandal (Robert Hoyzer)",
      year: "2005",
      country: "🇩🇪 Germany",
      description: "Referee Robert Hoyzer admitted receiving goods and money to fix several matches, including German Cup games. He was banned for life and imprisoned. The case involved a betting syndicate profiting from rigged results.",
      severity: "High",
      amount: "$75K+"
    }
  ];

  const redFlags = [
    { icon: "📊", title: "Betting Anomalies", text: "Unusual betting patterns with massive stakes on unlikely outcomes" },
    { icon: "⚡", title: "Performance Shifts", text: "Star players suddenly underperforming in critical moments" },
    { icon: "🎯", title: "Referee Bias", text: "Suspicious calls or repeated mistakes favoring one side" }
  ];

  return (
    <div className="fixed-matches-container">
      {/* Brutalist grid background */}
      <div className="grid-overlay"></div>
      
      <div className="noise-texture"></div>

      <header className="main-header">
        <div className="header-badge">CLASSIFIED</div>
        <div className="header-content">
          <div className="header-accent-line"></div>
          <h1 className="main-title">
            <span className="title-number">01.</span>
            FIXED MATCHES
          </h1>
          <p className="main-subtitle">Investigation Report / Match Manipulation Archive</p>
          <div className="header-meta">
            <span className="meta-item">
              <Shield size={14} />
              CONFIDENTIAL
            </span>
            <span className="meta-item">
              <Target size={14} />
              6 DOCUMENTED CASES
            </span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-label">OVERVIEW</div>
          <h2 className="hero-title">What Are Fixed Matches?</h2>
          <p className="hero-description">
            Sports competitions where outcomes are predetermined through illegal arrangements rather than fair play. 
            Pre-arranged results orchestrated through bribery, coercion, or collusion between players, officials, and criminal syndicates.
          </p>
        </section>

        {/* Methods Grid */}
        <section className="methods-section">
          <div className="section-header">
            <span className="section-number">02.</span>
            <h3 className="section-title">MANIPULATION METHODS</h3>
          </div>

          <div className="methods-grid">
            <div className="method-card">
              <div className="method-number">A</div>
              <div className="method-icon">💰</div>
              <h4 className="method-title">DIRECT BRIBERY</h4>
              <p className="method-text">Cash payments to players, referees, or coaches to influence match outcomes</p>
              <div className="method-stat">Most Common</div>
            </div>

            <div className="method-card">
              <div className="method-number">B</div>
              <div className="method-icon">🎭</div>
              <h4 className="method-title">SYNDICATE CONTROL</h4>
              <p className="method-text">Organized crime networks manipulating betting markets through coordinated fixing</p>
              <div className="method-stat">High Risk</div>
            </div>

            <div className="method-card">
              <div className="method-number">C</div>
              <div className="method-icon">🤝</div>
              <h4 className="method-title">TEAM COLLUSION</h4>
              <p className="method-text">Multiple teams agreeing on specific results to benefit league standings or betting</p>
              <div className="method-stat">Strategic</div>
            </div>
          </div>
        </section>

        {/* Red Flags */}
        <section className="red-flags-section">
          <div className="section-header">
            <span className="section-number">03.</span>
            <h3 className="section-title">WARNING INDICATORS</h3>
          </div>

          <div className="red-flags-grid">
            {redFlags.map((flag, index) => (
              <div key={index} className="flag-card">
                <div className="flag-icon">{flag.icon}</div>
                <div className="flag-content">
                  <h5 className="flag-title">{flag.title}</h5>
                  <p className="flag-text">{flag.text}</p>
                </div>
                <div className="flag-indicator">
                  <Zap size={16} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Consequences */}
        <section className="consequences-section">
          <div className="consequences-box">
            <div className="consequences-header">
              <Scale size={32} />
              <div>
                <h3 className="consequences-title">LEGAL CONSEQUENCES</h3>
                <p className="consequences-subtitle">Penalties for match manipulation</p>
              </div>
            </div>
            <div className="consequences-list">
              <div className="consequence-item">
                <span className="consequence-bullet">01</span>
                <p>Criminal prosecution with potential imprisonment</p>
              </div>
              <div className="consequence-item">
                <span className="consequence-bullet">02</span>
                <p>Lifetime bans from professional sports</p>
              </div>
              <div className="consequence-item">
                <span className="consequence-bullet">03</span>
                <p>Significant financial penalties and asset seizure</p>
              </div>
              <div className="consequence-item">
                <span className="consequence-bullet">04</span>
                <p>Team sanctions including title stripping and relegation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cases */}
        <section className="cases-section">
          <div className="section-header">
            <span className="section-number">04.</span>
            <h3 className="section-title">DOCUMENTED CASES</h3>
            <span className="section-count">{cases.length} Reports</span>
          </div>

          <div className="cases-grid">
            {cases.map((case_, index) => (
              <div 
                key={case_.id} 
                className={`case-card ${expandedCase === case_.id ? 'expanded' : ''}`}
                onClick={() => setExpandedCase(expandedCase === case_.id ? null : case_.id)}
              >
                <div className="case-header">
                  <div className="case-id">CASE {String(index + 1).padStart(2, '0')}</div>
                  <div className="case-flag">{case_.country.split(' ')[0]}</div>
                </div>

                <div className="case-main">
                  <h4 className="case-title">{case_.title}</h4>
                  <div className="case-meta-row">
                    <span className="case-year">{case_.year}</span>
                    <span className="case-location">{case_.country.split(' ')[1]}</span>
                    <span className={`case-severity ${case_.severity.toLowerCase()}`}>
                      {case_.severity}
                    </span>
                  </div>
                  <div className="case-amount">{case_.amount} Estimated</div>
                </div>

                <div className="case-expand-indicator">
                  <ChevronDown 
                    size={20}
                    className={`chevron ${expandedCase === case_.id ? 'rotated' : ''}`}
                  />
                </div>

                <div className={`case-details ${expandedCase === case_.id ? 'visible' : ''}`}>
                  <div className="details-divider"></div>
                  <p className="case-description">{case_.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-label">CLASSIFICATION</div>
            <div className="footer-value">EDUCATIONAL / CONFIDENTIAL</div>
          </div>
          <div className="footer-col">
            <div className="footer-label">DOCUMENT ID</div>
            <div className="footer-value">FM-2026-001</div>
          </div>
          <div className="footer-col">
            <div className="footer-label">LAST UPDATED</div>
            <div className="footer-value">FEB 2026</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

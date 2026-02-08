import React, { useState } from 'react';
import { Shield, AlertTriangle, Scale, TrendingUp, ChevronDown } from 'lucide-react';
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
      severity: "High"
    },
    {
      id: 2,
      title: "Marseille Bribery Scandal",
      year: "1993",
      country: "🇫🇷 France",
      description: "Olympique de Marseille officials bribed Valenciennes players to underperform. The scandal was exposed by a player who refused the bribe. Marseille was stripped of the domestic title, and several were convicted of corruption.",
      severity: "Critical"
    },
    {
      id: 3,
      title: "Chinese Football Match-Fixing",
      year: "1999-2000s",
      country: "🇨🇳 China",
      description: "Multiple controversies involving referees and officials taking bribes across seasons. Referee Lu Jun and a referee committee director were banned for life and convicted for influencing league outcomes.",
      severity: "Critical"
    },
    {
      id: 4,
      title: "Lebanese Football Scandal",
      year: "2013",
      country: "🇱🇧 Lebanon",
      description: "Part of a global FIFA investigation, numerous Lebanese players were found guilty of accepting bribes from betting companies to lose matches deliberately. Several received lifetime bans and fines.",
      severity: "High"
    },
    {
      id: 5,
      title: "Turkey Betting Probe",
      year: "2025",
      country: "🇹🇷 Turkey",
      description: "Turkish authorities detained dozens of referees and a club president in an ongoing match-fixing investigation. The Turkish Football Federation suspended nearly 150 officials for betting on games they officiated.",
      severity: "Critical"
    },
    {
      id: 6,
      title: "German Scandal (Robert Hoyzer)",
      year: "2005",
      country: "🇩🇪 Germany",
      description: "Referee Robert Hoyzer admitted receiving goods and money to fix several matches, including German Cup games. He was banned for life and imprisoned. The case involved a betting syndicate profiting from rigged results.",
      severity: "High"
    }
  ];

  const redFlags = [
    "Unusual betting patterns (huge bets on unlikely outcomes)",
    "Sudden poor performance from star players",
    "Weird referee decisions or repeated mistakes in key moments"
  ];

  return (
    <div className="fixed-matches-container">
      <div className="animated-background">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
      </div>

      <header className="main-header">
        <div className="header-content">
          <div className="header-icon">
            <Shield size={32} />
          </div>
          <div className="header-text">
            <h1 className="main-title">Fixed Matches</h1>
            <p className="main-subtitle">Understanding Match Manipulation & Its Consequences</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="intro-section">
          <div className="glass-card large-card">
            <h2 className="section-title">
              <AlertTriangle size={32} />
              What Are Fixed Matches?
            </h2>
            <p className="intro-text">
              "Fixed matches" refer to sports games (or sometimes other competitions) where the outcome has been pre-determined, usually illegally, rather than being decided fairly by the players' performance. In other words, someone arranges for a specific result before the match happens.
            </p>

            <div className="method-grid">
              <div className="method-card">
                <div className="method-icon">💰</div>
                <h3 className="method-title">Bribery</h3>
                <p className="method-description">Players, referees, or coaches are paid to influence the outcome</p>
              </div>

              <div className="method-card">
                <div className="method-icon">🎭</div>
                <h3 className="method-title">Syndicates</h3>
                <p className="method-description">Organized crime groups control betting markets and manipulate results</p>
              </div>

              <div className="method-card">
                <div className="method-icon">🤝</div>
                <h3 className="method-title">Collusion</h3>
                <p className="method-description">Teams collude to ensure a certain score or outcome</p>
              </div>
            </div>

            <div className="info-box">
              <h3 className="info-title">Common Examples</h3>
              <div className="examples-grid">
                <div className="example-item">
                  <span className="bullet"></span>
                  <p>A goalkeeper deliberately letting in goals</p>
                </div>
                <div className="example-item">
                  <span className="bullet"></span>
                  <p>A player intentionally missing penalties</p>
                </div>
                <div className="example-item">
                  <span className="bullet"></span>
                  <p>Referees making biased calls to favor one team</p>
                </div>
                <div className="example-item">
                  <span className="bullet"></span>
                  <p>Coordinating draws or scorelines that benefit bettors</p>
                </div>
              </div>
            </div>

            <div className="motivations-section">
              <h3 className="info-title">
                <TrendingUp size={24} />
                Why People Do It
              </h3>
              <div className="motivation-list">
                <div className="motivation-item">
                  <p>To win bets on the outcome <span className="highlight">(most common)</span></p>
                </div>
                <div className="motivation-item">
                  <p>To ensure promotion/relegation in leagues</p>
                </div>
                <div className="motivation-item">
                  <p>To manipulate rankings in tournaments</p>
                </div>
              </div>
            </div>

            <div className="consequences-box">
              <h3 className="consequences-title">
                <Scale size={24} />
                Legal Consequences
              </h3>
              <div className="consequences-list">
                <p>• Hefty fines, bans, or even jail time for players, referees, or organizers</p>
                <p>• Teams can lose titles or face relegation</p>
                <p>• Betting companies may void bets and report illegal activity</p>
              </div>
            </div>

            <div className="red-flags-section">
              <h3 className="info-title">🚩 Red Flags for Spotting Fixed Matches</h3>
              <div className="red-flags-list">
                {redFlags.map((flag, index) => (
                  <div key={index} className="red-flag-item">
                    <p>{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="cases-section">
          <div className="cases-header">
            <h2 className="cases-title">Real Reported Cases</h2>
            <p className="cases-subtitle">Documented incidents of match manipulation across the globe</p>
          </div>

          <div className="cases-grid">
            {cases.map((case_) => (
              <div key={case_.id} className="case-card">
                <div 
                  className="case-header"
                  onClick={() => setExpandedCase(expandedCase === case_.id ? null : case_.id)}
                >
                  <div className="case-header-content">
                    <div className="case-title-section">
                      <div className="case-top">
                        <span className="case-flag">{case_.country.split(' ')[0]}</span>
                        <h3 className="case-name">{case_.title}</h3>
                      </div>
                      <div className="case-meta">
                        <span className="case-country">{case_.country.split(' ')[1]}</span>
                        <span className="case-year">{case_.year}</span>
                        <span className={`severity-badge ${case_.severity.toLowerCase()}`}>
                          {case_.severity}
                        </span>
                      </div>
                    </div>
                    <ChevronDown 
                      size={24} 
                      className={`chevron ${expandedCase === case_.id ? 'expanded' : ''}`}
                    />
                  </div>
                  
                  <div className={`case-description ${expandedCase === case_.id ? 'expanded' : ''}`}>
                    <div className="description-content">
                      <p>{case_.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <p>This information is for educational purposes & highly confidential..</p>
      </footer>
    </div>
  );
}
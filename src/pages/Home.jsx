import "./Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="home">
      {/* Animated background elements */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* HERO */}
      <section className="hero">
        <span className="pill">
          <span className="pill-shine"></span>
          SURE FIXED MATCHES
        </span>

        <h1>
          Outsmart the Odds. <br />
          <span className="gradient-text">Every Bet.</span>
        </h1>

        <p className="hero-text">
          Mega-Odds uses real-time data, probability models, and sharp insights
          to help you bet smarter — not harder.
        </p>

        <div className="hero-actions">
          {isLoggedIn ? (
            // If logged in, show "Explore VIP Picks" instead of "Join Now"
            <>
              <Link to="/features">
                <button className="cta-primary">
                  <span>🔥 Explore VIP Picks</span>
                  <div className="button-glow"></div>
                </button>
              </Link>

              <Link to="/learn" className="cta-secondary">
                <span>Learn About Fixed Matches</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            </>
          ) : (
            // If not logged in, show "Join Now"
            <>
              <Link to="/signup">
                <button className="cta-primary">
                  <span>Join Now</span>
                  <div className="button-glow"></div>
                </button>
              </Link>

              <Link to="/testimonials" className="cta-secondary">
                <span>See How It Works</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            </>
          )}
        </div>

        {/* VALUE STATS - Moved inside hero */}
        <section className="quick-cards">
          <div className="quick-card">
            <div className="card-shine"></div>
            <div className="stat-icon">⭐️</div>
            <h3>100%</h3>
            <p>Verified</p>
          </div>

          <div className="quick-card">
            <div className="card-shine"></div>
            <div className="stat-icon">🎯</div>
            <h3>10K+</h3>
            <p>Active Bettors</p>
          </div>

          <div className="quick-card">
            <div className="card-shine"></div>
            <div className="stat-icon">👑</div>
            <h3>VIP</h3>
            <p>Fixed Matches</p>
          </div>
        </section>
      </section>

      {/* YESTERDAY'S PICKS */}
      <section className="picks-section">
        <div className="section-header">
          <span className="fire-icon">🔥</span>
          <h2 className="picks-title">Yesterday's Top Picks</h2>
        </div>

        <div className="picks-list">
          {/* PICK CARD 1 */}
          <div className="pick-card">
            <div className="pick-badge">Won</div>
            <div className="teams">
              <span className="team-name">
                <span className="trophy">🏆</span>
                
                As Gubbio

                
              </span>
              <span className="vs">VS</span>
              <span className="team-name">
                
                Vis Pesaro 1898
                
              </span>
            </div>

            <div className="pick-divider"></div>

            <div className="pick-meta">
              <div className="meta-item">
                <span className="meta-label">Time</span>
                <span className="meta-value time">
                  
                  22:30
                  
                  </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Bet</span>
                <span className="meta-value prediction">
                  
                  ⚽️ 1st Half: 0:0
                  
                  </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Odds</span>
                <span className="meta-value odds">
                  
                  4.60
                  
                  </span>
              </div>
            </div>
          </div>

          {/* PICK CARD 2 */}
          <div className="pick-card ">
            <div className="pick-badge">Won</div>
            <div className="teams">
              <span className="team-name">
                <span className="trophy">🏆</span>
                
                
                Marica Fc Rj
                
                
              </span>
              <span className="vs">VS</span>
              <span className="team-name">
                
                Sampaio Correa
                
                
                </span>
            </div>

            <div className="pick-divider"></div>

            <div className="pick-meta">
              <div className="meta-item">
                <span className="meta-label">Time</span>
                <span className="meta-value time">
                  
                  23:00
                  
                  
                  </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Bet</span>
          <span className="meta-value prediction">
                  
                  ⚽️ 1st Half: Other
                  
                  
                  </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Odds</span>
                <span className="meta-value odds">
                  
                  15.20
                  
                  
                  </span>
              </div>
            </div>
          </div>

          {/* PICK CARD 3 */}
          <div className="pick-card">
            <div className="pick-badge">Won</div>
            <div className="teams">
              <span className="team-name">
                <span className="trophy">🏆</span>
                
                
                Retro Fc Pe
                
                
              </span>
              <span className="vs">VS</span>
              <span className="team-name">
                
                Sc Recife Pe
                
                </span>
            </div>

            <div className="pick-divider"></div>

            <div className="pick-meta">
              <div className="meta-item">
                <span className="meta-label">Time</span>
                <span className="meta-value time">
                  
                  23:00
                  
                  </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Bet</span>
                <span className="meta-value prediction">
                  
                  
                  ⚽️ 1st Half: 0:0
                  
                  </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Odds</span>
                <span className="meta-value odds">
                  
                  4.80
                  
                  </span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* TODAY'S VIP PICKS */}
      <section className="picks-section vip-section">
        <div className="section-header">
          <span className="vip-icon">👑</span>
          <h2 className="picks-title vip-title">UPCOMING VIP BET</h2>
        </div>

        <div className="picks-list">
          {/* VIP PICK CARD 1 */}
          <div className="pick-card vip-pick-card">
            <div className="vip-ribbon">EXCLUSIVE</div>
            <Link to="/vip-access-denied" className="pick-badge vip-badge">
              VIP Only
            </Link>
            <div className="teams">
              <span className="team-name">
                <span className="trophy">🏆</span>
                
                
                Pau Fc


                
                
              </span>
              <span className="vs">VS</span>
              <span className="team-name">
                
                
                Boulogne
                
                
                </span>
            </div>

            <div className="pick-divider"></div>

            <div className="pick-meta">
              <div className="meta-item">
                <span className="meta-label">Time</span>
                <span className="meta-value time">
                  
                  
                  22:00
                  
                  
                  
                  </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Bet</span>
                <Link to="/vip-access-denied" className="meta-value prediction locked">
                  <span className="lock-icon">🔒</span>
                  <span>1st Half: Locked</span>
                </Link>
              </div>
              <div className="meta-item">
                <span className="meta-label">Odds</span>
                <Link to="/vip-access-denied" className="meta-value odds locked">
                  <span className="lock-icon">🔒</span>
                  <span>--</span>
                </Link>
              </div>
            </div>
          </div>

          {/* VIP PICK CARD 2 */}
          <div className="pick-card vip-pick-card">
            <div className="vip-ribbon">EXCLUSIVE</div>
            <Link to="/vip-access-denied" className="pick-badge vip-badge">
              VIP Only
            </Link>
            <div className="teams">
              <span className="team-name">
                <span className="trophy">🏆</span>
                
                
                
                Almere City Fc
                
                
                
              </span>
              <span className="vs">VS</span>
              <span className="team-name">
                
                
                Helmond Sport
                
                
                </span>
            </div>

            <div className="pick-divider"></div>

            <div className="pick-meta">
              <div className="meta-item">
                <span className="meta-label">Time</span>
                 <span className="meta-value time">
                   
                   
                  22:00
                   
                   
                   </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Bet</span>
                <Link to="/vip-access-denied" className="meta-value prediction locked">
                  <span className="lock-icon">🔒</span>
                  <span>1st Half: Locked</span>
                </Link>
              </div>
              <div className="meta-item">
                <span className="meta-label">Odds</span>
                <Link to="/vip-access-denied" className="meta-value odds locked">
                  <span className="lock-icon">🔒</span>
                  <span>--</span>
                </Link>
              </div>
            </div>
          </div>

          {/* VIP PICK CARD 3 */}
          <div className="pick-card vip-pick-card">
            <div className="vip-ribbon">EXCLUSIVE</div>
            <Link to="/vip-access-denied" className="pick-badge vip-badge">
              VIP Only
            </Link>
            <div className="teams">
              <span className="team-name">
                <span className="trophy">🏆</span>
                
                Fc Dordrecht
                
                
              </span>
              <span className="vs">VS</span>
              <span className="team-name">
                
                
                Fc Emmen
                
                
              </span>
            </div>

            <div className="pick-divider"></div>

            <div className="pick-meta">
              <div className="meta-item">
                <span className="meta-label">Time</span>
                <span className="meta-value time">
                  
                  
                  11:30
                  
                  
                  
                  </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Bet</span>
                <Link to="/vip-access-denied" className="meta-value prediction locked">
                  <span className="lock-icon">🔒</span>
                  <span>1st Half: Locked</span>
                </Link>
              </div>
              <div className="meta-item">
                <span className="meta-label">Odds</span>
                <Link to="/vip-access-denied" className="meta-value odds locked">
                  <span className="lock-icon">🔒</span>
                  <span>--</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Mega-Odds. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;

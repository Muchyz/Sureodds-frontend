import { useEffect, useState } from "react";
import "./Matches.css";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(
          "https://api.sportsrc.org/?data=matches&category=football"
        );
        
        if (!res.ok) throw new Error('Failed to fetch matches');
        
        const json = await res.json();
        setMatches(json.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // 🎲 fake odds generator
  const odds = () => ({
    home: (Math.random() * (3 - 1.3) + 1.3).toFixed(2),
    draw: (Math.random() * (4 - 2.5) + 2.5).toFixed(2),
    away: (Math.random() * (3 - 1.3) + 1.3).toFixed(2),
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    if (isToday) return `Today ${timeStr}`;
    if (isTomorrow) return `Tomorrow ${timeStr}`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="matches-page">
      <div className="page-header">
        <h1 className="matches-title">Live Football Matches</h1>
        <p className="matches-subtitle">Real-time odds and fixtures</p>
      </div>

      {loading && (
        <div className="status-container">
          <div className="loading-spinner"></div>
          <p className="status">Loading matches...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error">Unable to load matches. Please try again later.</p>
        </div>
      )}

      <div className="matches-grid">
        {matches.map((match, index) => {
          const o = odds();
          const home = match.teams?.home?.name || match.title.split(" vs ")[0];
          const away = match.teams?.away?.name || match.title.split(" vs ")[1];

          return (
            <div 
              className="match-card" 
              key={match.id}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="match-header">
                <span className="match-badge">Premier</span>
                <span className="match-time">{formatDate(match.date)}</span>
              </div>

              <div className="teams-container">
                <div className="team">
                  <div className="team-logo">{home.charAt(0)}</div>
                  <span className="team-name">{home}</span>
                </div>
                
                <div className="versus">
                  <div className="vs-circle">VS</div>
                </div>
                
                <div className="team">
                  <div className="team-logo">{away.charAt(0)}</div>
                  <span className="team-name">{away}</span>
                </div>
              </div>

              <div className="odds-section">
                <div className="odds-label">Match Odds</div>
                <div className="match-odds">
                  <button className="odd-btn">
                    <span className="odd-label">Home</span>
                    <span className="odd-value">{o.home}</span>
                  </button>
                  <button className="odd-btn">
                    <span className="odd-label">Draw</span>
                    <span className="odd-value">{o.draw}</span>
                  </button>
                  <button className="odd-btn">
                    <span className="odd-label">Away</span>
                    <span className="odd-value">{o.away}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Matches;
import { useEffect, useState } from "react";
import "./LiveMatches.css";

function LiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_KEY = "f9c8e55b005f499daf78c5f3601c2a22";

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const res = await fetch(
          "https://v3.football.api-sports.io/fixtures?live=all",
          {
            headers: {
              "x-apisports-key": API_KEY,
            },
          }
        );
        const data = await res.json();
        setMatches(data.response || []);
        setLastUpdated(new Date());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  const getMatchStatus = (status) => {
    if (status.short === "HT") return "Half Time";
    if (status.short === "1H") return "1st Half";
    if (status.short === "2H") return "2nd Half";
    if (status.short === "ET") return "Extra Time";
    if (status.short === "P") return "Penalties";
    return status.long;
  };

  const isWinning = (homeGoals, awayGoals, isHome) => {
    if (homeGoals === awayGoals) return false;
    return isHome ? homeGoals > awayGoals : awayGoals > homeGoals;
  };

  const filteredMatches = matches.filter((m) => {
    const search = searchTerm.toLowerCase();
    return (
      m.teams.home.name.toLowerCase().includes(search) ||
      m.teams.away.name.toLowerCase().includes(search) ||
      m.league.name.toLowerCase().includes(search)
    );
  });

  return (
    <div className="live-wrapper">
      <div className="header-bar">
        <div className="live-indicator">
          <span className="dot"></span>
          LIVE
        </div>
        <div className="header-center">
          <h1>LiveScore</h1>
          {lastUpdated && (
            <span className="last-updated">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="count-badge">{matches.length}</div>
      </div>

      {matches.length > 0 && (
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search teams or leagues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="clear-btn">
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {loading && <div className="status">Loading matches...</div>}
      {!loading && matches.length === 0 && (
        <div className="status">No live matches right now</div>
      )}
      {!loading && matches.length > 0 && filteredMatches.length === 0 && (
        <div className="status">No matches found for "{searchTerm}"</div>
      )}

      <div className="matches-container">
        {filteredMatches.map((m) => (
          <div className="match-item" key={m.fixture.id}>
            <div className="match-header">
              <div className="league-info">
                {m.league.logo && (
                  <img src={m.league.logo} alt="" className="league-logo" />
                )}
                <span className="league">{m.league.name}</span>
              </div>
              <span className="status">{getMatchStatus(m.fixture.status)}</span>
              <span className="time">{m.fixture.status.elapsed}'</span>
            </div>

            <div className="teams-grid">
              <div className={`team-row ${isWinning(m.goals.home, m.goals.away, true) ? 'winning' : ''}`}>
                <div className="team-info">
                  {m.teams.home.logo && (
                    <img src={m.teams.home.logo} alt="" className="team-logo" />
                  )}
                  <span className="team-name">{m.teams.home.name}</span>
                </div>
                <span className="team-score">{m.goals.home}</span>
              </div>
              <div className={`team-row ${isWinning(m.goals.home, m.goals.away, false) ? 'winning' : ''}`}>
                <div className="team-info">
                  {m.teams.away.logo && (
                    <img src={m.teams.away.logo} alt="" className="team-logo" />
                  )}
                  <span className="team-name">{m.teams.away.name}</span>
                </div>
                <span className="team-score">{m.goals.away}</span>
              </div>
            </div>

            <div className="match-footer">
              {m.fixture.venue?.name && (
                <span className="venue">📍 {m.fixture.venue.name}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveMatches;

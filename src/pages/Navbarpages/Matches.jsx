import { useEffect, useState } from "react";
import "./Matches.css";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(
          "https://api.sportsrc.org/?data=matches&category=football"
        );
        const json = await res.json();
        setMatches(json.data || []);
      } catch (err) {
        console.error(err);
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

  return (
    <div className="matches-page">
      <h1 className="matches-title">Upcoming Football Matches</h1>

      {loading && <p>Loading...</p>}

      {matches.map((match) => {
        const o = odds();

        const home =
          match.teams?.home?.name || match.title.split(" vs ")[0];

        const away =
          match.teams?.away?.name || match.title.split(" vs ")[1];

        return (
          <div className="match-row" key={match.id}>
            <div className="match-info">
              <strong>{home}</strong>
              <span className="vs">vs</span>
              <strong>{away}</strong>

              <div className="date">
                {new Date(match.date).toLocaleString()}
              </div>
            </div>

            <div className="odds">
              <button>{o.home}</button>
              <button>{o.draw}</button>
              <button>{o.away}</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Matches;
import { useEffect, useState } from "react";
import "./LiveMatches.css";

function LiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="live-wrapper">
      <h1 className="live-title">🔴 Live Matches</h1>

      {loading && <p className="status">Loading live games…</p>}
      {!loading && matches.length === 0 && (
        <p className="status">No live matches right now</p>
      )}

      <div className="live-list">
        {matches.map((m) => (
          <div className="live-card" key={m.fixture.id}>
            <div className="teams-row">
              <span className="team">{m.teams.home.name}</span>
              <span className="score">
                {m.goals.home} : {m.goals.away}
              </span>
              <span className="team">{m.teams.away.name}</span>
            </div>

            <div className="meta-row">
              <span className="league">
                {m.league.name}
              </span>
              <span className="time">
                {m.fixture.status.elapsed}'
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveMatches;
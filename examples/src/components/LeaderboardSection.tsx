import { useState } from "react";
import {
  useLeaderboard,
  Leaderboard,
  CurrentUserRank,
} from "questro/leaderboard";
import { usePoints } from "questro/points";
import { userId } from "../data/mockData";

export function LeaderboardSection() {
  const { entries, updateScore } = useLeaderboard();
  const { balance } = usePoints();
  const [showAnimation, setShowAnimation] = useState(false);
  const currentUserEntry = entries.find((e) => e.userId === userId);
  const userRank = currentUserEntry?.rank || 0;

  const syncScore = () => {
    updateScore(userId, balance, "You");
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const boostScore = (amount: number) => {
    const newScore = (currentUserEntry?.score || 0) + amount;
    updateScore(userId, newScore, "You");
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "📊";
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#fbbf24";
    if (rank === 2) return "#94a3b8";
    if (rank === 3) return "#fb923c";
    return "#64748b";
  };

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Try Leaderboard</h3>
            <div className="demo-badge">Top {entries.length}</div>
          </div>

          {/* Explicação */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#fae8ff",
              border: "1px solid #f0abfc",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "20px", marginRight: "8px" }}>💡</span>
              <div
                style={{ fontSize: "14px", fontWeight: 700, color: "#86198f" }}
              >
                How Leaderboard Works
              </div>
            </div>
            <div
              style={{ fontSize: "13px", color: "#86198f", lineHeight: "1.6" }}
            >
              <strong>Score Syncing:</strong> Use &quot;Sync with Points&quot;
              to update leaderboard from points balance
              <br />
              <strong>Ranking System:</strong> Players sorted by score, rank
              updates automatically
              <br />
              <strong>Competition Stats:</strong> Track your rank, gap to #1,
              total score, and player count
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              Score Actions
            </div>
            <div
              className="demo-actions"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              <button onClick={syncScore} className="demo-action-button">
                🔄 Sync with Points
              </button>
              <button
                onClick={() => boostScore(50)}
                className="demo-action-button"
              >
                ⚡ Boost +50
              </button>
              <button
                onClick={() => boostScore(100)}
                className="demo-action-button"
              >
                🚀 Boost +100
              </button>
              <button
                onClick={() => boostScore(250)}
                className="demo-action-button"
                style={{ backgroundColor: "#8b5cf6" }}
              >
                💫 Mega Boost +250
              </button>
            </div>
          </div>

          <CurrentUserRank
            entry={currentUserEntry}
            totalEntries={entries.length}
          />

          {showAnimation && (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f0fdf4",
                border: "2px solid #10b981",
                borderRadius: "10px",
                marginBottom: "16px",
                textAlign: "center",
                animation: "pulse 0.5s ease-in-out",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                {getRankEmoji(userRank)}
              </div>
              <div
                style={{ fontSize: "14px", fontWeight: 700, color: "#15803d" }}
              >
                Score Updated!
              </div>
              <div style={{ fontSize: "12px", color: "#16a34a" }}>
                You are now rank #{userRank}
              </div>
            </div>
          )}

          <div className="leaderboard-container">
            <Leaderboard
              entries={entries}
              currentUserId={userId}
              maxEntries={5}
              showAvatar
            />
          </div>

          <div
            style={{
              marginTop: "24px",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "20px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              Competition Stats
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: getRankColor(userRank),
                  }}
                >
                  {getRankEmoji(userRank)} #{userRank}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  Your Rank
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#6366f1",
                  }}
                >
                  {currentUserEntry
                    ? entries[0].score - currentUserEntry.score
                    : 0}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  Points to #1
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#10b981",
                  }}
                >
                  {currentUserEntry?.score || 0}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  Total Score
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#f59e0b",
                  }}
                >
                  {entries.length}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  Total Players
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Components</h3>

        <div className="code-block">
          <div className="code-label">Leaderboard</div>
          <pre className="code-snippet">{`<Leaderboard 
  entries={entries}
  currentUserId={userId}
  maxEntries={10}
  showAvatar
/>`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">CurrentUserRank</div>
          <pre className="code-snippet">{`<CurrentUserRank 
  entry={userEntry}
  totalEntries={entries.length}
/>`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">LeaderboardFilters</div>
          <pre className="code-snippet">{`<LeaderboardFilters 
  period={period}
  metric={metric}
  onPeriodChange={setPeriod}
  onMetricChange={setMetric}
/>`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">useLeaderboard Hook</div>
          <pre className="code-snippet">{`const { entries, updateScore } = useLeaderboard();

// Update user score
updateScore('user-id', 500, 'Username');`}</pre>
        </div>
      </div>
    </div>
  );
}

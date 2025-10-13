import { useState } from "react";
import {
  useBadges,
  BadgeGrid,
  BadgeCount,
  BadgeProgressBar,
} from "questro/badges";
import { badges } from "../data/mockData";

export function BadgesSection() {
  const { updateProgress, checkAndUnlockBadges, unlockedBadges, getProgress } =
    useBadges();
  const [selectedBadge, setSelectedBadge] = useState(badges[0]);

  const simulateActions = () => {
    // Simula completar uma ação
    updateProgress("actions-completed", 1);
    checkAndUnlockBadges();
  };

  const simulatePoints = () => {
    // Simula ganhar pontos
    updateProgress("points-earned", 25);
    checkAndUnlockBadges();
  };

  const simulateStreak = () => {
    // Simula streak
    const current = getProgress("streak-count")?.current || 0;
    updateProgress("streak-count", current + 1);
    checkAndUnlockBadges();
  };

  const getBadgeProgress = (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (!badge) return { current: 0, target: 0, percentage: 0 };

    const condition = badge.conditions[0];
    const progress = getProgress(condition.type);
    const current = progress?.current || 0;
    const target = condition.value;
    const percentage = Math.min((current / target) * 100, 100);

    return { current, target, percentage };
  };

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Try Badge System</h3>
            <div className="demo-badge">
              {unlockedBadges.length}/{badges.length} Unlocked
            </div>
          </div>

          {/* Explicação */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
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
                style={{ fontSize: "14px", fontWeight: 700, color: "#15803d" }}
              >
                How Badges Work
              </div>
            </div>
            <div
              style={{ fontSize: "13px", color: "#15803d", lineHeight: "1.6" }}
            >
              <strong>Progress Tracking:</strong> Each badge tracks specific
              conditions (actions, points, streak, level)
              <br />
              <strong>Unlock Mechanism:</strong> Badge unlocks automatically
              when progress reaches target
              <br />
              <strong>Rarity System:</strong> Common → Uncommon → Rare → Epic
              (different colors & difficulty)
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
              Simulate Activities
            </div>
            <div className="demo-actions">
              <button onClick={simulateActions} className="action-button">
                ✅ Complete Action
              </button>
              <button onClick={simulatePoints} className="action-button">
                💎 Earn +25 Points
              </button>
              <button onClick={simulateStreak} className="action-button">
                🔥 Increase Streak
              </button>
              <button
                onClick={() => {
                  updateProgress("level-reached", 10);
                  checkAndUnlockBadges();
                }}
                className="action-button"
              >
                📈 Reach Level 10
              </button>
            </div>
          </div>

          <div className="badge-showcase">
            <BadgeGrid badges={badges} />
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
                marginBottom: "16px",
              }}
            >
              Badge Progress Tracker
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "16px",
                overflowX: "auto",
              }}
            >
              {badges.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      selectedBadge.id === badge.id ? "#0f172a" : "#f8fafc",
                    color: selectedBadge.id === badge.id ? "#fff" : "#64748b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {badge.icon}
                </button>
              ))}
            </div>

            <div
              style={{
                padding: "20px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <div style={{ fontSize: "32px", marginRight: "12px" }}>
                  {selectedBadge.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {selectedBadge.name}
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    {selectedBadge.description}
                  </div>
                </div>
                <div
                  style={{
                    padding: "4px 12px",
                    backgroundColor:
                      selectedBadge.rarity === "common"
                        ? "#dbeafe"
                        : selectedBadge.rarity === "uncommon"
                        ? "#dcfce7"
                        : selectedBadge.rarity === "rare"
                        ? "#fef3c7"
                        : "#f3e8ff",
                    color:
                      selectedBadge.rarity === "common"
                        ? "#1e40af"
                        : selectedBadge.rarity === "uncommon"
                        ? "#15803d"
                        : selectedBadge.rarity === "rare"
                        ? "#a16207"
                        : "#6b21a8",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase" as const,
                  }}
                >
                  {selectedBadge.rarity}
                </div>
              </div>

              <BadgeProgressBar badgeId={selectedBadge.id} />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "13px",
                  color: "#64748b",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  Progress: {getBadgeProgress(selectedBadge.id).current} /{" "}
                  {getBadgeProgress(selectedBadge.id).target}
                </span>
                <span style={{ fontWeight: 600, color: "#6366f1" }}>
                  {Math.round(getBadgeProgress(selectedBadge.id).percentage)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Components</h3>

        <div className="code-block">
          <div className="code-label">BadgeGrid</div>
          <pre className="code-snippet">{`<BadgeGrid badges={badges} />`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">BadgeCard - Custom Render</div>
          <pre className="code-snippet">{`<BadgeCard badge={badge}>
  {(badge, isUnlocked) => (
    <div style={{ opacity: isUnlocked ? 1 : 0.3 }}>
      <span>{badge.icon}</span>
      <h4>{badge.name}</h4>
    </div>
  )}
</BadgeCard>`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">BadgeCount</div>
          <pre className="code-snippet">{`<BadgeCount />`}</pre>
          <div className="code-preview">
            <BadgeCount style={{ fontSize: "18px", fontWeight: 600 }} />
          </div>
        </div>

        <div className="code-block">
          <div className="code-label">useBadges Hook</div>
          <pre className="code-snippet">{`const { updateProgress, checkAndUnlockBadges } = useBadges();

// Update progress
updateProgress('actions-completed', 5);

// Check and unlock
checkAndUnlockBadges();`}</pre>
        </div>
      </div>
    </div>
  );
}

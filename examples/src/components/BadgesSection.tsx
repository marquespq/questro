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
  const [lastUnlocked, setLastUnlocked] = useState<(typeof badges)[0] | null>(
    null
  );

  // Função auxiliar para atualizar progresso por tipo de condição
  const updateProgressByType = (conditionType: string, value: number) => {
    // Encontra todos os badges que têm essa condição
    badges.forEach((badge) => {
      const hasCondition = badge.conditions.some(
        (c) => c.type === conditionType
      );
      if (hasCondition) {
        const currentProgress = getProgress(badge.id);
        const newValue = (currentProgress?.current || 0) + value;
        updateProgress(badge.id, newValue);
      }
    });

    // Verifica se algum badge foi desbloqueado
    const newlyUnlocked = checkAndUnlockBadges();
    if (newlyUnlocked.length > 0) {
      const unlockedBadge = badges.find(
        (b) => b.id === newlyUnlocked[0].badgeId
      );
      if (unlockedBadge) {
        setLastUnlocked(unlockedBadge);
        setTimeout(() => setLastUnlocked(null), 3000);
      }
    }
  };

  const simulateActions = () => {
    // Simula completar uma ação
    updateProgressByType("actions-completed", 1);
  };

  const simulatePoints = () => {
    // Simula ganhar pontos
    updateProgressByType("points-earned", 25);
  };

  const simulateStreak = () => {
    // Simula streak
    updateProgressByType("streak-count", 1);
  };

  const getBadgeProgress = (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (!badge) return { current: 0, target: 0, percentage: 0 };

    const progress = getProgress(badgeId);
    const current = progress?.current || 0;
    const target = progress?.target || 0;
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

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
                onClick={() => updateProgressByType("level-reached", 10)}
                className="action-button"
              >
                📈 Reach Level 10
              </button>
            </div>
          </div>

          {/* Notificação de Badge Desbloqueado */}
          {lastUnlocked && (
            <div
              style={{
                marginBottom: "24px",
                padding: "16px",
                backgroundColor: "#f0fdf4",
                border: "2px solid #10b981",
                borderRadius: "12px",
                animation: "slideInDown 0.3s ease-out",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div style={{ fontSize: "32px" }}>{lastUnlocked.icon}</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#15803d",
                      marginBottom: "4px",
                    }}
                  >
                    🎉 Badge Unlocked!
                  </div>
                  <div style={{ fontSize: "13px", color: "#16a34a" }}>
                    {lastUnlocked.name}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    animation: "bounce 0.5s ease-in-out",
                  }}
                >
                  ✨
                </div>
              </div>
            </div>
          )}

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

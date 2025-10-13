import { useQuests, QuestCard, QuestStats } from "questro/quests";
import { usePoints } from "questro/points";

export function QuestsSection() {
  const {
    availableQuests,
    activeQuests,
    completedQuests,
    startQuest,
    abandonQuest,
    updateProgress,
  } = useQuests();
  const { addPoints } = usePoints();

  const handleStartQuest = (questId: string) => {
    startQuest(questId);
  };

  const simulateProgress = () => {
    if (activeQuests.length > 0) {
      const quest = activeQuests[0];
      const objective = quest.objectives.find((obj) => !obj.completed);

      if (objective) {
        // Adiciona pontos também
        addPoints(10, {
          action: "quest-progress",
          description: "Quest progress made",
        });
        updateProgress(quest.id, objective.id, 1);
      }
    }
  };

  const completeAllObjectives = () => {
    if (activeQuests.length > 0) {
      const quest = activeQuests[0];
      quest.objectives.forEach((obj) => {
        if (!obj.completed) {
          const remaining = obj.target - obj.current;
          updateProgress(quest.id, obj.id, remaining);
        }
      });

      // Recompensa por completar
      if (quest.rewards.points) {
        addPoints(quest.rewards.points, {
          action: "quest-complete",
          description: `Completed: ${quest.title}`,
        });
      }
    }
  };

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Try Quest System</h3>
            <QuestStats
              activeCount={activeQuests.length}
              completedCount={completedQuests.length}
              availableCount={availableQuests.length}
            />
          </div>

          {/* Explicação */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#fef3c7",
              border: "1px solid #fde047",
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
                style={{ fontSize: "14px", fontWeight: 700, color: "#92400e" }}
              >
                How Quests Work
              </div>
            </div>
            <div
              style={{ fontSize: "13px", color: "#92400e", lineHeight: "1.6" }}
            >
              <strong>Quest Types:</strong> One-time quests reset never, daily
              quests reset every day
              <br />
              <strong>Objective Tracking:</strong> Multi-step objectives track
              progress individually (0/5 actions)
              <br />
              <strong>Rewards:</strong> Earn points automatically when quest
              completes (added to balance)
            </div>
          </div>

          {activeQuests.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: "12px",
                }}
              >
                Quest Actions
              </div>
              <div
                className="demo-actions"
                style={{ gridTemplateColumns: "1fr 1fr" }}
              >
                <button
                  onClick={simulateProgress}
                  className="demo-action-button"
                >
                  ➕ Make Progress (+1)
                </button>
                <button
                  onClick={completeAllObjectives}
                  className="demo-action-button"
                  style={{ backgroundColor: "#10b981" }}
                >
                  ✅ Complete All
                </button>
              </div>
            </div>
          )}

          <div className="quests-container">
            {availableQuests.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#64748b",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Available Quests
                </div>
                <QuestCard
                  quest={availableQuests[0]}
                  onStart={() => handleStartQuest(availableQuests[0].id)}
                  showActions
                />
              </div>
            )}

            {activeQuests.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#6366f1",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Active Quest
                </div>
                <QuestCard
                  quest={activeQuests[0]}
                  onAbandon={() => abandonQuest(activeQuests[0].id)}
                  showActions
                />
              </div>
            )}

            {completedQuests.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#10b981",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Completed ({completedQuests.length})
                </div>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "10px",
                  }}
                >
                  {completedQuests.map((quest) => (
                    <div
                      key={quest.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontSize: "24px", marginRight: "12px" }}>
                        {quest.icon}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#15803d",
                          }}
                        >
                          {quest.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#16a34a" }}>
                          +{quest.rewards.points} points earned
                        </div>
                      </div>
                      <div style={{ fontSize: "20px" }}>✅</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {availableQuests.length === 0 &&
              activeQuests.length === 0 &&
              completedQuests.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#94a3b8",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    🎯
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 600 }}>
                    No quests available
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    Check back later for new missions!
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Components</h3>

        <div className="code-block">
          <div className="code-label">QuestCard</div>
          <pre className="code-snippet">{`<QuestCard 
  quest={quest}
  onStart={() => startQuest(quest.id)}
  showActions
/>`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">QuestList</div>
          <pre className="code-snippet">{`<QuestList 
  quests={quests}
  onQuestStart={startQuest}
  onQuestAbandon={abandonQuest}
/>`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">QuestStats</div>
          <pre className="code-snippet">{`<QuestStats 
  activeCount={3}
  completedCount={10}
  availableCount={5}
/>`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">useQuests Hook</div>
          <pre className="code-snippet">{`const { startQuest, updateProgress } = useQuests();

// Start a quest
startQuest('quest-id');

// Update objective progress
updateProgress('quest-id', 'objective-id', 5);`}</pre>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { usePoints } from "questro/points";
import { useBadges } from "questro/badges";
import { useQuests } from "questro/quests";

type EventLog = {
  id: number;
  module: string;
  event: string;
  data: string;
  time: string;
};

export function EventsSection() {
  const { addPoints, balance } = usePoints();
  const { checkAndUnlockBadges, unlockedBadges } = useBadges();
  const { startQuest, availableQuests } = useQuests();
  const [events, setEvents] = useState<EventLog[]>([]);
  const [selectedModule, setSelectedModule] = useState<
    "all" | "points" | "badges" | "quests"
  >("all");

  // Função helper para logar eventos
  const logEvent = (module: string, event: string, data: unknown) => {
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(), // Garante ID único
        module,
        event,
        data: JSON.stringify(data, null, 2),
        time: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Event listeners examples
  useEffect(() => {
    // Log initial mount
    logEvent("system", "component:mounted", { timestamp: Date.now() });
  }, []);

  const triggerEvent = (type: string) => {
    switch (type) {
      case "points-add": {
        const pointsAdded = 50;
        addPoints(pointsAdded, {
          action: "event-demo",
          description: "Triggered from Events section",
        });

        // Log o evento
        logEvent("points", "points:added", {
          amount: pointsAdded,
          newBalance: balance + pointsAdded,
          reason: {
            action: "event-demo",
            description: "Triggered from Events section",
          },
        });
        break;
      }
      case "badge-check": {
        const newlyUnlocked = checkAndUnlockBadges();

        logEvent("badges", "badges:checked", {
          totalUnlocked: unlockedBadges.length,
          newlyUnlocked: newlyUnlocked.length,
          badgeIds: newlyUnlocked.map((b) => b.badgeId),
        });

        // Log cada badge desbloqueado
        newlyUnlocked.forEach((badge) => {
          logEvent("badges", "badge:unlocked", {
            badgeId: badge.badgeId,
            unlockedAt: badge.unlockedAt,
          });
        });
        break;
      }
      case "quest-start": {
        if (availableQuests.length > 0) {
          const quest = availableQuests[0];
          startQuest(quest.id);

          logEvent("quests", "quest:started", {
            questId: quest.id,
            title: quest.title,
            difficulty: quest.difficulty,
            objectives: quest.objectives.length,
          });
        } else {
          logEvent("quests", "quest:error", {
            error: "No available quests to start",
          });
        }
        break;
      }
    }
  };

  const modules = [
    { id: "all", name: "All Events", icon: "🌐", color: "#6366f1" },
    { id: "points", name: "Points", icon: "📊", color: "#3b82f6" },
    { id: "badges", name: "Badges", icon: "🏆", color: "#10b981" },
    { id: "quests", name: "Quests", icon: "🎯", color: "#f59e0b" },
  ];

  const filteredEvents =
    selectedModule === "all"
      ? events
      : events.filter((e) => e.module === selectedModule);

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Event System</h3>
            <div className="demo-badge">{events.length} Events Logged</div>
          </div>

          {/* Explicação */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#f0f9ff",
              border: "1px solid #bae6fd",
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
                style={{ fontSize: "14px", fontWeight: 700, color: "#075985" }}
              >
                How Events Work
              </div>
            </div>
            <div
              style={{ fontSize: "13px", color: "#075985", lineHeight: "1.6" }}
            >
              <strong>Real-time Notifications:</strong> Listen to all
              gamification events
              <br />
              <strong>Type-safe:</strong> Full TypeScript support for event data
              <br />
              <strong>Unsubscribe:</strong> Clean up listeners automatically on
              unmount
            </div>
          </div>

          {/* Module Filter */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              Filter by Module
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() =>
                    setSelectedModule(module.id as typeof selectedModule)
                  }
                  style={{
                    padding: "8px 16px",
                    backgroundColor:
                      selectedModule === module.id ? module.color : "#fff",
                    color: selectedModule === module.id ? "#fff" : "#64748b",
                    border: `2px solid ${
                      selectedModule === module.id ? module.color : "#e2e8f0"
                    }`,
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {module.icon} {module.name}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Events */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              Trigger Events
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
              }}
            >
              <button
                onClick={() => triggerEvent("points-add")}
                className="action-button"
              >
                💎 Add Points
              </button>
              <button
                onClick={() => triggerEvent("badge-check")}
                className="action-button"
              >
                🏆 Check Badges
              </button>
              <button
                onClick={() => triggerEvent("quest-start")}
                className="action-button"
              >
                🎯 Start Quest
              </button>
            </div>
          </div>

          {/* Event Log */}
          <div
            style={{
              backgroundColor: "#0f172a",
              borderRadius: "12px",
              padding: "16px",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#94a3b8",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Event Log ({filteredEvents.length})
            </div>
            {filteredEvents.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#64748b",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>👂</div>
                <div style={{ fontSize: "14px" }}>
                  No events yet. Try triggering some actions!
                </div>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {filteredEvents
                  .slice(-10)
                  .reverse()
                  .map((event) => (
                    <div
                      key={event.id}
                      style={{
                        padding: "12px",
                        backgroundColor: "#1e293b",
                        borderRadius: "8px",
                        borderLeft: `3px solid ${
                          modules.find((m) => m.id === event.module)?.color ||
                          "#6366f1"
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#f1f5f9",
                          }}
                        >
                          {event.event}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          {event.time}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                          maxHeight: "100px",
                          overflowY: "auto",
                        }}
                      >
                        {event.data}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Event Listeners</h3>

        <div className="code-block">
          <div className="code-label">Points Events</div>
          <pre className="code-snippet">{`import { usePoints } from 'questro/points';

function MyComponent() {
  const points = usePoints();
  
  useEffect(() => {
    // Points changed
    console.log('Balance:', points.balance);
    console.log('Lifetime:', points.lifetime);
  }, [points.balance, points.lifetime]);
}`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">Available Events by Module</div>
          <pre className="code-snippet">{`// Points Module
- State changes tracked via hooks

// Badges Module
- badge:unlocked - When badge unlocked
- badge:progress - Progress updated

// Quests Module  
- quest:started
- quest:completed
- quest:failed
- objective:completed

// Leaderboard Module
- rank:changed - User rank updated
- score:updated - Score changed`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">Event Type Safety</div>
          <pre className="code-snippet">{`type BadgeUnlockedEvent = {
  badge: Badge;
  unlockedBadge: UnlockedBadge;
};

type QuestCompletedEvent = {
  quest: Quest;
};

// Events are fully typed!`}</pre>
        </div>
      </div>
    </div>
  );
}

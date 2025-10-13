import { useState, useEffect } from "react";
import {
  usePoints,
  PointsDisplay,
  LifetimePointsDisplay,
} from "questro/points";

export function PointsSection() {
  const { balance, lifetime, addPoints, subtractPoints, transactions } =
    usePoints();
  const [lastChange, setLastChange] = useState<{
    amount: number;
    time: number;
  } | null>(null);

  useEffect(() => {
    if (transactions.length > 0) {
      const last = transactions[transactions.length - 1];
      setLastChange({ amount: last.amount, time: Date.now() });
      const timer = setTimeout(() => setLastChange(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [transactions]);

  const handleAction = (action: string, points: number) => {
    if (action === "add") {
      addPoints(points, {
        action: `demo-${action}`,
        description: `Added ${points} points`,
      });
    } else {
      subtractPoints(points, {
        action: `demo-${action}`,
        description: `Spent ${points} points`,
      });
    }
  };

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Try Points System</h3>
            <div className="demo-badge">Live Demo</div>
          </div>

          {/* Explicação */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
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
                style={{ fontSize: "14px", fontWeight: 700, color: "#1e40af" }}
              >
                How Points Work
              </div>
            </div>
            <div
              style={{ fontSize: "13px", color: "#1e40af", lineHeight: "1.6" }}
            >
              <strong>Current Balance:</strong> Available points to spend
              <br />
              <strong>Lifetime Points:</strong> Total earned (never decreases)
              <br />
              <strong>Transactions:</strong> Complete history of all point
              changes
            </div>
          </div>

          <div className="demo-stats">
            <div className="stat-box">
              <div className="stat-label">Current Balance</div>
              <div className="stat-value" style={{ position: "relative" }}>
                {balance}
                {lastChange && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "10px",
                      color: lastChange.amount > 0 ? "#10b981" : "#ef4444",
                      fontSize: "18px",
                      fontWeight: 700,
                      animation: "fadeOut 2s forwards",
                    }}
                  >
                    {lastChange.amount > 0 ? "+" : ""}
                    {lastChange.amount}
                  </div>
                )}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Lifetime Points</div>
              <div className="stat-value">{lifetime}</div>
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
              Quick Actions
            </div>
            <div className="demo-actions">
              <button
                onClick={() => handleAction("add", 10)}
                className="action-button"
              >
                🎯 Task Complete +10
              </button>
              <button
                onClick={() => handleAction("add", 50)}
                className="action-button"
              >
                ⭐ Achievement +50
              </button>
              <button
                onClick={() => handleAction("add", 100)}
                className="action-button"
              >
                🏆 Level Up +100
              </button>
              <button
                onClick={() => handleAction("subtract", 25)}
                className="action-button-danger"
              >
                💰 Purchase -25
              </button>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              Recent Transactions ({transactions.length})
            </div>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {transactions
                .slice(-5)
                .reverse()
                .map((tx, i) => (
                  <div
                    key={tx.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                      backgroundColor: i % 2 === 0 ? "#f8fafc" : "transparent",
                      borderRadius: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {tx.reason.description || tx.reason.action}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: tx.amount > 0 ? "#10b981" : "#ef4444",
                      }}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount}
                    </div>
                  </div>
                ))}
              {transactions.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#94a3b8",
                    fontSize: "14px",
                  }}
                >
                  No transactions yet. Try the buttons above!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Components</h3>

        <div className="code-block">
          <div className="code-label">PointsDisplay</div>
          <pre className="code-snippet">{`<PointsDisplay />`}</pre>
          <div className="code-preview">
            <PointsDisplay style={{ fontSize: "24px", fontWeight: 700 }} />
          </div>
        </div>

        <div className="code-block">
          <div className="code-label">LifetimePointsDisplay</div>
          <pre className="code-snippet">{`<LifetimePointsDisplay />`}</pre>
          <div className="code-preview">
            <LifetimePointsDisplay
              style={{ fontSize: "24px", fontWeight: 700, color: "#8b5cf6" }}
            />
          </div>
        </div>

        <div className="code-block">
          <div className="code-label">usePoints Hook</div>
          <pre className="code-snippet">{`const { balance, addPoints, subtractPoints } = usePoints();

// Add points
addPoints(50, { action: 'task-complete' });

// Remove points  
subtractPoints(25, { action: 'purchase' });`}</pre>
        </div>
      </div>
    </div>
  );
}

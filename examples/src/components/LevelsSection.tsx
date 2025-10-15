import { useState } from "react";
import { useLevels, LevelDisplay, XPBar } from "questro/levels";

export function LevelsSection() {
  const { levelData, addXP, removeXP, setLevel, getXPForLevel } = useLevels();
  const [selectedFormula] = useState<string>("linear");

  const handleAddXP = (amount: number) => {
    addXP(amount, `Added ${amount} XP from demo`);
  };

  const handleRemoveXP = (amount: number) => {
    removeXP(amount, `Removed ${amount} XP from demo`);
  };

  const xpForNextLevel = getXPForLevel(levelData.level + 1);
  const progress = (levelData.currentXP / xpForNextLevel) * 100;

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Try Levels/XP System</h3>
            <div className="demo-badge">Live Demo</div>
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
                style={{ fontSize: "14px", fontWeight: 700, color: "#166534" }}
              >
                How Levels Work
              </div>
            </div>
            <div
              style={{ fontSize: "13px", color: "#166534", lineHeight: "1.6" }}
            >
              <strong>Current Level:</strong> Your progression stage
              <br />
              <strong>Current XP:</strong> Experience points in current level
              <br />
              <strong>XP for Next Level:</strong> Total XP needed to level up
              <br />
              <strong>Formulas:</strong> Different progression curves (linear,
              exponential, fibonacci, rpg)
            </div>
          </div>

          {/* Stats Display */}
          <div className="demo-stats">
            <div className="stat-box">
              <div className="stat-label">Current Level</div>
              <div className="stat-value" style={{ color: "#8b5cf6" }}>
                {levelData.level}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Current XP</div>
              <div className="stat-value" style={{ color: "#3b82f6" }}>
                {levelData.currentXP}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">XP Needed</div>
              <div className="stat-value" style={{ color: "#10b981" }}>
                {xpForNextLevel}
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                Progress to Level {levelData.level + 1}
              </span>
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                {progress.toFixed(1)}%
              </span>
            </div>
            <XPBar height="24px" showPercentage={false} animated />
          </div>

          {/* Formula Info */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              Progression Formula: {selectedFormula}
            </div>
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#64748b",
                fontStyle: "italic",
              }}
            >
              {selectedFormula === "linear" &&
                "Consistent XP increase (100, 200, 300...)"}
              {selectedFormula === "exponential" &&
                "Progressive difficulty (100, 150, 225...)"}
              {selectedFormula === "fibonacci" &&
                "Natural growth (100, 150, 250...)"}
              {selectedFormula === "rpg" &&
                "RPG-style scaling (100, 110, 121...)"}
            </div>
          </div>

          {/* Actions */}
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
                onClick={() => handleAddXP(25)}
                className="action-button"
              >
                🎯 Task +25 XP
              </button>
              <button
                onClick={() => handleAddXP(50)}
                className="action-button"
              >
                ⭐ Quest +50 XP
              </button>
              <button
                onClick={() => handleAddXP(100)}
                className="action-button"
              >
                🏆 Achievement +100 XP
              </button>
              <button
                onClick={() => handleRemoveXP(20)}
                className="action-button-danger"
              >
                ⚠️ Penalty -20 XP
              </button>
            </div>
          </div>

          {/* Level Controls */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              Level Controls
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setLevel(1)}
                className="action-button-secondary"
                style={{ flex: 1 }}
              >
                Reset to Level 1
              </button>
              <button
                onClick={() => setLevel(5)}
                className="action-button-secondary"
                style={{ flex: 1 }}
              >
                Jump to Level 5
              </button>
              <button
                onClick={() => setLevel(10)}
                className="action-button-secondary"
                style={{ flex: 1 }}
              >
                Jump to Level 10
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Components</h3>

        <div className="code-block">
          <div className="code-label">LevelDisplay</div>
          <pre className="code-snippet">{`<LevelDisplay 
  showXP 
  showPercentage 
/>`}</pre>
          <div className="code-preview">
            <LevelDisplay showXP showPercentage />
          </div>
        </div>

        <div className="code-block">
          <div className="code-label">XPBar</div>
          <pre className="code-snippet">{`<XPBar 
  height="32px"
  showPercentage
  showXP
  animated 
/>`}</pre>
          <div className="code-preview">
            <XPBar height="32px" showPercentage showXP animated />
          </div>
        </div>

        <div className="code-block">
          <div className="code-label">useLevels Hook</div>
          <pre className="code-snippet">{`const { level, currentXP, xpForNextLevel, addXP } = useLevels();

// Add XP
addXP(100, { action: 'quest-complete' });

// Remove XP
removeXP(50, { action: 'penalty' });

// Set specific level
setLevel(5);`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">Progression Formulas</div>
          <pre className="code-snippet">{`// Configure in Provider
<LevelsProvider config={{
  userId: 'user-123',
  initialLevel: 1,
  formula: 'exponential', // linear, exponential, fibonacci, rpg
  baseXP: 100,
  multiplier: 1.5
}}>
  <App />
</LevelsProvider>`}</pre>
        </div>
      </div>
    </div>
  );
}

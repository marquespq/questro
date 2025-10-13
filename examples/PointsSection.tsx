import {
  usePoints,
  PointsDisplay,
  LifetimePointsDisplay,
} from "questro/points";
import { styles } from "../styles/appStyles";

export function PointsSection() {
  const { balance, lifetime, addPoints, subtractPoints } = usePoints();

  return (
    <div style={styles.moduleSection}>
      <div style={styles.moduleDemo}>
        <div style={styles.demoCard}>
          <div style={styles.demoHeader}>
            <h3 style={styles.demoTitle}>Try Points System</h3>
            <div style={styles.demoBadge}>Live Demo</div>
          </div>

          <div style={styles.demoStats}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Current Balance</div>
              <div style={styles.statValue}>{balance}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Lifetime Points</div>
              <div style={styles.statValue}>{lifetime}</div>
            </div>
          </div>

          <div style={styles.demoActions}>
            <button
              onClick={() => addPoints(10, { action: "demo" })}
              style={styles.actionButton}
            >
              + Add 10 points
            </button>
            <button
              onClick={() => addPoints(50, { action: "demo" })}
              style={styles.actionButton}
            >
              + Add 50 points
            </button>
            <button
              onClick={() => addPoints(100, { action: "demo" })}
              style={styles.actionButton}
            >
              + Add 100 points
            </button>
            <button
              onClick={() => subtractPoints(25, { action: "demo" })}
              style={styles.actionButtonDanger}
            >
              - Remove 25 points
            </button>
          </div>
        </div>
      </div>

      <div style={styles.moduleCode}>
        <h3 style={styles.codeTitle}>Components</h3>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>PointsDisplay</div>
          <pre style={styles.codeSnippet}>{`<PointsDisplay />`}</pre>
          <div style={styles.codePreview}>
            <PointsDisplay style={{ fontSize: "24px", fontWeight: 700 }} />
          </div>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>LifetimePointsDisplay</div>
          <pre style={styles.codeSnippet}>{`<LifetimePointsDisplay />`}</pre>
          <div style={styles.codePreview}>
            <LifetimePointsDisplay
              style={{ fontSize: "24px", fontWeight: 700, color: "#8b5cf6" }}
            />
          </div>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>usePoints Hook</div>
          <pre
            style={styles.codeSnippet}
          >{`const { balance, addPoints, subtractPoints } = usePoints();

// Add points
addPoints(50, { action: 'task-complete' });

// Remove points  
subtractPoints(25, { action: 'purchase' });`}</pre>
        </div>
      </div>
    </div>
  );
}

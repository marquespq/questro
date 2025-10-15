import { useState } from "react";
import { usePoints } from "questro/points";
import { useBadges } from "questro/badges";
import { useNotifications } from "questro/notifications";

export function LivePlayground() {
  const { balance, addPoints } = usePoints();
  const { updateProgress, checkAndUnlockBadges, unlockedBadges } = useBadges();
  const { show } = useNotifications();
  const [clickCount, setClickCount] = useState(0);

  const handleAction = (action: "task" | "bonus" | "achievement") => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    switch (action) {
      case "task":
        addPoints(10, {
          action: "task-complete",
          description: "Task completed",
        });
        show({
          title: "Success!",
          message: "+10 points! Task completed",
          type: "success",
        });
        break;
      case "bonus":
        addPoints(50, { action: "bonus-claim", description: "Bonus claimed" });
        show({
          title: "Bonus!",
          message: "🎉 +50 bonus points!",
          type: "success",
        });
        break;
      case "achievement":
        addPoints(100, {
          action: "achievement",
          description: "Achievement unlocked",
        });
        updateProgress("first_achievement", 1);
        checkAndUnlockBadges();
        show({
          title: "Achievement!",
          message: "🏆 Achievement unlocked!",
          type: "success",
        });
        break;
    }

    // Auto-unlock badges based on points
    if (
      balance + (action === "task" ? 10 : action === "bonus" ? 50 : 100) >=
      100
    ) {
      updateProgress(
        "centurion",
        balance + (action === "task" ? 10 : action === "bonus" ? 50 : 100)
      );
      const newUnlocks = checkAndUnlockBadges();
      if (newUnlocks.length > 0) {
        show({
          title: "Badge!",
          message: "🏆 Centurion badge unlocked!",
          type: "success",
        });
      }
    }
  };

  const reset = () => {
    setClickCount(0);
    show({ title: "Reset", message: "Counter reset!", type: "info" });
  };

  return (
    <div className="playground-section">
      <div className="section-header">
        <h2 className="section-title">Live Playground</h2>
        <p className="section-subtitle">
          Click the buttons below to see questro in action. All changes are live
          and persist in localStorage.
        </p>
      </div>

      <div className="playground-container">
        <div className="playground-left">
          <div className="playground-display">
            <div className="playground-stat">
              <div className="playground-stat-label">Current Balance</div>
              <div className="playground-stat-value">{balance}</div>
              <div className="playground-stat-unit">points</div>
            </div>
            <div className="playground-stat">
              <div className="playground-stat-label">Actions Performed</div>
              <div className="playground-stat-value">{clickCount}</div>
              <div className="playground-stat-unit">clicks</div>
            </div>
            <div className="playground-stat">
              <div className="playground-stat-label">Badges Unlocked</div>
              <div className="playground-stat-value">
                {unlockedBadges.length}
              </div>
              <div className="playground-stat-unit">total</div>
            </div>
          </div>

          <div className="playground-actions">
            <button
              className="playground-button primary"
              onClick={() => handleAction("task")}
            >
              <span className="button-icon">✓</span>
              <span className="button-text">
                <strong>Complete Task</strong>
                <small>+10 points</small>
              </span>
            </button>
            <button
              className="playground-button secondary"
              onClick={() => handleAction("bonus")}
            >
              <span className="button-icon">⭐</span>
              <span className="button-text">
                <strong>Claim Bonus</strong>
                <small>+50 points</small>
              </span>
            </button>
            <button
              className="playground-button accent"
              onClick={() => handleAction("achievement")}
            >
              <span className="button-icon">🏆</span>
              <span className="button-text">
                <strong>Unlock Achievement</strong>
                <small>+100 points + badge</small>
              </span>
            </button>
            <button className="playground-button reset" onClick={reset}>
              Reset Counter
            </button>
          </div>
        </div>

        <div className="playground-right">
          <div className="playground-code-section">
            <h3 className="playground-code-title">Implementation</h3>
            <pre className="playground-code">
              <code>{`import { usePoints } from 'questro/points';
import { useBadges } from 'questro/badges';

function MyComponent() {
  const { balance, addPoints } = usePoints();
  const { updateProgress, checkAndUnlockBadges } = useBadges();

  const handleTaskComplete = () => {
    addPoints(10, {
      action: 'task-complete',
      description: 'Task completed'
    });
    
    // Auto-unlock badge at milestone
    if (balance >= 100) {
      updateProgress('centurion', balance);
      checkAndUnlockBadges();
    }
  };

  return (
    <div>
      <p>Balance: {balance}</p>
      <button onClick={handleTaskComplete}>
        Complete Task
      </button>
    </div>
  );
}`}</code>
            </pre>
          </div>

          <div className="playground-info">
            <h4>💡 What's happening?</h4>
            <ul>
              <li>
                <strong>State Management:</strong> Points and badges persist in
                localStorage
              </li>
              <li>
                <strong>Real-time Updates:</strong> UI updates instantly on
                every action
              </li>
              <li>
                <strong>Event System:</strong> Notifications trigger
                automatically
              </li>
              <li>
                <strong>Type Safety:</strong> Full TypeScript support with
                IntelliSense
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

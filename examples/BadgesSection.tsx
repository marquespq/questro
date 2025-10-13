import { useBadges, BadgeGrid, BadgeCount } from "questro/badges";
import { badges } from "../data/mockData";
import { styles } from "../styles/appStyles";

export function BadgesSection() {
  const { updateProgress, checkAndUnlockBadges, unlockedBadges } = useBadges();

  const handleUnlock = () => {
    updateProgress("actions-completed", 1);
    checkAndUnlockBadges();
  };

  return (
    <div style={styles.moduleSection}>
      <div style={styles.moduleDemo}>
        <div style={styles.demoCard}>
          <div style={styles.demoHeader}>
            <h3 style={styles.demoTitle}>Try Badge System</h3>
            <div style={styles.demoBadge}>
              {unlockedBadges.length}/{badges.length} Unlocked
            </div>
          </div>

          <div style={styles.badgeShowcase}>
            <BadgeGrid badges={badges} />
          </div>

          <button onClick={handleUnlock} style={styles.unlockButton}>
            🎯 Make Progress to Unlock Badge
          </button>
        </div>
      </div>

      <div style={styles.moduleCode}>
        <h3 style={styles.codeTitle}>Components</h3>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>BadgeGrid</div>
          <pre
            style={styles.codeSnippet}
          >{`<BadgeGrid badges={badges} />`}</pre>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>BadgeCard - Custom Render</div>
          <pre style={styles.codeSnippet}>{`<BadgeCard badge={badge}>
  {(badge, isUnlocked) => (
    <div style={{ opacity: isUnlocked ? 1 : 0.3 }}>
      <span>{badge.icon}</span>
      <h4>{badge.name}</h4>
    </div>
  )}
</BadgeCard>`}</pre>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>BadgeCount</div>
          <pre style={styles.codeSnippet}>{`<BadgeCount />`}</pre>
          <div style={styles.codePreview}>
            <BadgeCount style={{ fontSize: "18px", fontWeight: 600 }} />
          </div>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>useBadges Hook</div>
          <pre
            style={styles.codeSnippet}
          >{`const { updateProgress, checkAndUnlockBadges } = useBadges();

// Update progress
updateProgress('actions-completed', 5);

// Check and unlock
checkAndUnlockBadges();`}</pre>
        </div>
      </div>
    </div>
  );
}

import {
  useLeaderboard,
  Leaderboard,
  CurrentUserRank,
} from "questro/leaderboard";
import { userId } from "../data/mockData";
import { styles } from "../styles/appStyles";

export function LeaderboardSection() {
  const { entries } = useLeaderboard();
  const currentUserEntry = entries.find((e) => e.userId === userId);

  return (
    <div style={styles.moduleSection}>
      <div style={styles.moduleDemo}>
        <div style={styles.demoCard}>
          <div style={styles.demoHeader}>
            <h3 style={styles.demoTitle}>Try Leaderboard</h3>
            <div style={styles.demoBadge}>Top 5</div>
          </div>

          <CurrentUserRank
            entry={currentUserEntry}
            totalEntries={entries.length}
          />

          <div style={styles.leaderboardContainer}>
            <Leaderboard
              entries={entries}
              currentUserId={userId}
              maxEntries={5}
              showAvatar
            />
          </div>
        </div>
      </div>

      <div style={styles.moduleCode}>
        <h3 style={styles.codeTitle}>Components</h3>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>Leaderboard</div>
          <pre style={styles.codeSnippet}>{`<Leaderboard 
  entries={entries}
  currentUserId={userId}
  maxEntries={10}
  showAvatar
/>`}</pre>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>CurrentUserRank</div>
          <pre style={styles.codeSnippet}>{`<CurrentUserRank 
  entry={userEntry}
  totalEntries={entries.length}
/>`}</pre>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>LeaderboardFilters</div>
          <pre style={styles.codeSnippet}>{`<LeaderboardFilters 
  period={period}
  metric={metric}
  onPeriodChange={setPeriod}
  onMetricChange={setMetric}
/>`}</pre>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>useLeaderboard Hook</div>
          <pre
            style={styles.codeSnippet}
          >{`const { entries, updateScore } = useLeaderboard();

// Update user score
updateScore('user-id', 500, 'Username');`}</pre>
        </div>
      </div>
    </div>
  );
}

import type { LeaderboardEntry, LeaderboardPeriod, LeaderboardMetric } from './types';

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  maxEntries?: number;
  showAvatar?: boolean;
  className?: string;
}

export function Leaderboard({
  entries,
  currentUserId,
  maxEntries = 10,
  showAvatar = true,
  className = '',
}: LeaderboardProps) {
  const displayEntries = entries.slice(0, maxEntries);

  return (
    <div className={`leaderboard ${className}`} style={styles.container}>
      <div style={styles.list}>
        {displayEntries.map((entry) => (
          <LeaderboardRow
            key={entry.userId}
            entry={entry}
            isCurrentUser={entry.userId === currentUserId}
            showAvatar={showAvatar}
          />
        ))}
      </div>
      {entries.length === 0 && <div style={styles.empty}>No entries yet</div>}
    </div>
  );
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  showAvatar: boolean;
}

function LeaderboardRow({ entry, isCurrentUser, showAvatar }: LeaderboardRowProps) {
  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const medal = getMedalEmoji(entry.rank);

  return (
    <div
      style={{
        ...styles.row,
        ...(isCurrentUser ? styles.rowHighlight : {}),
      }}
    >
      <div style={styles.rank}>{medal || `#${entry.rank}`}</div>

      {showAvatar && (
        <div style={styles.avatar}>
          {entry.avatar ? (
            <img src={entry.avatar} alt={entry.username} style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarPlaceholder}>{entry.username.charAt(0).toUpperCase()}</div>
          )}
        </div>
      )}

      <div style={styles.username}>{entry.username}</div>

      <div style={styles.score}>{entry.score.toLocaleString()}</div>
    </div>
  );
}

export interface LeaderboardFiltersProps {
  period: LeaderboardPeriod;
  metric: LeaderboardMetric;
  onPeriodChange: (period: LeaderboardPeriod) => void;
  onMetricChange: (metric: LeaderboardMetric) => void;
  className?: string;
}

export function LeaderboardFilters({
  period,
  metric,
  onPeriodChange,
  onMetricChange,
  className = '',
}: LeaderboardFiltersProps) {
  const periods: LeaderboardPeriod[] = ['daily', 'weekly', 'monthly', 'all-time'];
  const metrics: LeaderboardMetric[] = ['points', 'badges', 'quests-completed'];

  return (
    <div className={`leaderboard-filters ${className}`} style={styles.filters}>
      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>Period:</label>
        <div style={styles.filterButtons}>
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              style={{
                ...styles.filterButton,
                ...(period === p ? styles.filterButtonActive : {}),
              }}
            >
              {p.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>Metric:</label>
        <div style={styles.filterButtons}>
          {metrics.map((m) => (
            <button
              key={m}
              onClick={() => onMetricChange(m)}
              style={{
                ...styles.filterButton,
                ...(metric === m ? styles.filterButtonActive : {}),
              }}
            >
              {m.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface CurrentUserRankProps {
  entry?: LeaderboardEntry;
  totalEntries: number;
  className?: string;
}

export function CurrentUserRank({ entry, totalEntries, className = '' }: CurrentUserRankProps) {
  if (!entry) {
    return (
      <div className={`current-user-rank ${className}`} style={styles.currentUserRank}>
        <p style={styles.notRanked}>You are not ranked yet</p>
      </div>
    );
  }

  const percentile = totalEntries > 0 ? Math.round((1 - entry.rank / totalEntries) * 100) : 0;

  return (
    <div className={`current-user-rank ${className}`} style={styles.currentUserRank}>
      <div style={styles.currentUserInfo}>
        <div style={styles.currentUserLabel}>Your Rank</div>
        <div style={styles.currentUserValue}>#{entry.rank}</div>
      </div>
      <div style={styles.currentUserInfo}>
        <div style={styles.currentUserLabel}>Your Score</div>
        <div style={styles.currentUserValue}>{entry.score.toLocaleString()}</div>
      </div>
      <div style={styles.currentUserInfo}>
        <div style={styles.currentUserLabel}>Percentile</div>
        <div style={styles.currentUserValue}>Top {percentile}%</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s',
  },
  rowHighlight: {
    backgroundColor: '#eff6ff',
    borderLeft: '4px solid #3b82f6',
  },
  rank: {
    fontSize: '18px',
    fontWeight: 700,
    minWidth: '50px',
    color: '#111827',
  },
  avatar: {
    marginRight: '12px',
  },
  avatarImg: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },
  avatarPlaceholder: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 600,
    color: '#6b7280',
  },
  username: {
    flex: 1,
    fontSize: '16px',
    fontWeight: 500,
    color: '#374151',
  },
  score: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#111827',
  },
  empty: {
    padding: '32px',
    textAlign: 'center' as const,
    color: '#9ca3af',
    fontSize: '14px',
  },
  filters: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  filterGroup: {
    marginBottom: '12px',
  },
  filterLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#374151',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  filterButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    fontWeight: 500,
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textTransform: 'capitalize' as const,
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderColor: '#3b82f6',
  },
  currentUserRank: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '2px solid #3b82f6',
  },
  currentUserInfo: {
    textAlign: 'center' as const,
  },
  currentUserLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
    textTransform: 'uppercase' as const,
  },
  currentUserValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#111827',
  },
  notRanked: {
    margin: 0,
    color: '#9ca3af',
    fontSize: '14px',
  },
};

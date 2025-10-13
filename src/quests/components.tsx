import type { Quest, QuestObjective, QuestDifficulty } from './types';

export interface QuestCardProps {
  quest: Quest;
  onStart?: () => void;
  onAbandon?: () => void;
  showActions?: boolean;
  className?: string;
}

export function QuestCard({
  quest,
  onStart,
  onAbandon,
  showActions = true,
  className = '',
}: QuestCardProps) {
  const totalObjectives = quest.objectives.length;
  const completedObjectives = quest.objectives.filter((obj) => obj.completed).length;
  const progressPercentage =
    totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;

  const difficultyColors: Record<QuestDifficulty, string> = {
    easy: '#4ade80',
    medium: '#fbbf24',
    hard: '#f87171',
    expert: '#a78bfa',
  };

  return (
    <div className={`quest-card ${className}`} style={styles.card}>
      <div style={styles.header}>
        {quest.icon && <span style={styles.icon}>{quest.icon}</span>}
        <div style={styles.headerInfo}>
          <h3 style={styles.title}>{quest.title}</h3>
          <span
            style={{
              ...styles.difficulty,
              backgroundColor: difficultyColors[quest.difficulty],
            }}
          >
            {quest.difficulty}
          </span>
        </div>
      </div>

      <p style={styles.description}>{quest.description}</p>

      <div style={styles.objectives}>
        <h4 style={styles.objectivesTitle}>Objectives:</h4>
        {quest.objectives.map((obj) => (
          <ObjectiveItem key={obj.id} objective={obj} />
        ))}
      </div>

      {quest.status === 'in-progress' && (
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progressPercentage}%`,
              }}
            />
          </div>
          <span style={styles.progressText}>
            {completedObjectives}/{totalObjectives} completed
          </span>
        </div>
      )}

      {quest.rewards && (
        <div style={styles.rewards}>
          <span style={styles.rewardsLabel}>Rewards:</span>
          {quest.rewards.points && (
            <span style={styles.rewardItem}>🎯 {quest.rewards.points} pts</span>
          )}
          {quest.rewards.badgeId && <span style={styles.rewardItem}>🏆 Badge</span>}
        </div>
      )}

      {showActions && (
        <div style={styles.actions}>
          {quest.status === 'available' && onStart && (
            <button onClick={onStart} style={{ ...styles.button, ...styles.buttonStart }}>
              Start Quest
            </button>
          )}
          {quest.status === 'in-progress' && onAbandon && (
            <button onClick={onAbandon} style={{ ...styles.button, ...styles.buttonAbandon }}>
              Abandon
            </button>
          )}
          {quest.status === 'completed' && <span style={styles.statusCompleted}>✓ Completed</span>}
        </div>
      )}
    </div>
  );
}

interface ObjectiveItemProps {
  objective: QuestObjective;
}

function ObjectiveItem({ objective }: ObjectiveItemProps) {
  const percentage =
    objective.target > 0 ? Math.round((objective.current / objective.target) * 100) : 0;

  return (
    <div style={styles.objectiveItem}>
      <div style={styles.objectiveHeader}>
        <span style={objective.completed ? styles.objectiveCompleted : styles.objectiveText}>
          {objective.completed ? '✓' : '○'} {objective.description}
        </span>
        <span style={styles.objectiveProgress}>
          {objective.current}/{objective.target}
        </span>
      </div>
      {!objective.completed && objective.target > 0 && (
        <div style={styles.objectiveBar}>
          <div style={{ ...styles.objectiveBarFill, width: `${percentage}%` }} />
        </div>
      )}
    </div>
  );
}

export interface QuestListProps {
  quests: Quest[];
  onQuestStart?: (questId: string) => void;
  onQuestAbandon?: (questId: string) => void;
  showActions?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function QuestList({
  quests,
  onQuestStart,
  onQuestAbandon,
  showActions = true,
  emptyMessage = 'No quests available',
  className = '',
}: QuestListProps) {
  if (quests.length === 0) {
    return <div style={styles.emptyMessage}>{emptyMessage}</div>;
  }

  return (
    <div className={`quest-list ${className}`} style={styles.list}>
      {quests.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          onStart={onQuestStart ? () => onQuestStart(quest.id) : undefined}
          onAbandon={onQuestAbandon ? () => onQuestAbandon(quest.id) : undefined}
          showActions={showActions}
        />
      ))}
    </div>
  );
}

export interface QuestStatsProps {
  activeCount: number;
  completedCount: number;
  availableCount: number;
  className?: string;
}

export function QuestStats({
  activeCount,
  completedCount,
  availableCount,
  className = '',
}: QuestStatsProps) {
  return (
    <div className={`quest-stats ${className}`} style={styles.stats}>
      <div style={styles.statItem}>
        <span style={styles.statValue}>{activeCount}</span>
        <span style={styles.statLabel}>Active</span>
      </div>
      <div style={styles.statItem}>
        <span style={styles.statValue}>{completedCount}</span>
        <span style={styles.statLabel}>Completed</span>
      </div>
      <div style={styles.statItem}>
        <span style={styles.statValue}>{availableCount}</span>
        <span style={styles.statLabel}>Available</span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: '#ffffff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  icon: {
    fontSize: '32px',
    marginRight: '12px',
  },
  headerInfo: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
  },
  difficulty: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#ffffff',
    textTransform: 'capitalize' as const,
  },
  description: {
    margin: '0 0 16px 0',
    color: '#6b7280',
    fontSize: '14px',
  },
  objectives: {
    marginBottom: '16px',
  },
  objectivesTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    fontWeight: 600,
  },
  objectiveItem: {
    marginBottom: '8px',
  },
  objectiveHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  objectiveText: {
    fontSize: '14px',
    color: '#374151',
  },
  objectiveCompleted: {
    fontSize: '14px',
    color: '#10b981',
    textDecoration: 'line-through',
  },
  objectiveProgress: {
    fontSize: '14px',
    color: '#6b7280',
  },
  objectiveBar: {
    height: '4px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  objectiveBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.3s ease',
  },
  progress: {
    marginBottom: '16px',
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: '#6b7280',
  },
  rewards: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    padding: '8px',
    backgroundColor: '#fef3c7',
    borderRadius: '4px',
  },
  rewardsLabel: {
    fontSize: '14px',
    fontWeight: 600,
  },
  rewardItem: {
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonStart: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  buttonAbandon: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  },
  statusCompleted: {
    color: '#10b981',
    fontWeight: 600,
    fontSize: '14px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  emptyMessage: {
    textAlign: 'center' as const,
    padding: '32px',
    color: '#9ca3af',
    fontSize: '14px',
  },
  stats: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  statItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#111827',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    marginTop: '4px',
  },
};

import { useState } from 'react';
import { generateId, now } from 'questro';
import { PointsProvider, usePoints, PointsDisplay } from 'questro/points';
import { BadgesProvider, useBadges, BadgeGrid, type Badge } from 'questro/badges';
import { QuestsProvider, useQuests, QuestList, QuestStats, type Quest } from 'questro/quests';
import {
  LeaderboardProvider,
  useLeaderboard,
  Leaderboard,
  LeaderboardFilters,
  CurrentUserRank,
  type LeaderboardEntry,
} from 'questro/leaderboard';

const userId = 'user-123';

const sampleBadges: Badge[] = [
  {
    id: generateId(),
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    rarity: 'common',
    category: 'progress',
    conditions: [{ type: 'lessons-completed', value: 1 }],
    points: 50,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: 'Quick Learner',
    description: 'Complete 5 lessons',
    icon: '⚡',
    rarity: 'uncommon',
    category: 'progress',
    conditions: [{ type: 'lessons-completed', value: 5 }],
    points: 200,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: 'Quest Master',
    description: 'Complete 3 quests',
    icon: '🏆',
    rarity: 'rare',
    category: 'achievement',
    conditions: [{ type: 'quests-completed', value: 3 }],
    points: 300,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: 'Top Performer',
    description: 'Reach top 10 in leaderboard',
    icon: '👑',
    rarity: 'epic',
    category: 'achievement',
    conditions: [{ type: 'leaderboard-rank', value: 10 }],
    points: 500,
    hidden: true,
    createdAt: now(),
    updatedAt: now(),
  },
];

const sampleQuests: Quest[] = [
  {
    id: generateId(),
    title: 'Complete Your Profile',
    description: 'Fill in all required profile information',
    icon: '👤',
    difficulty: 'easy',
    recurrence: 'one-time',
    status: 'available',
    objectives: [
      { id: generateId(), description: 'Add profile picture', target: 1, current: 0, completed: false },
      { id: generateId(), description: 'Write bio', target: 1, current: 0, completed: false },
    ],
    rewards: { points: 100 },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    title: 'Daily Practice',
    description: 'Complete 3 practice sessions today',
    icon: '📚',
    difficulty: 'medium',
    recurrence: 'daily',
    status: 'available',
    objectives: [
      { id: generateId(), description: 'Complete practice sessions', target: 3, current: 0, completed: false },
    ],
    rewards: { points: 150 },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    title: 'Master Challenge',
    description: 'Complete all advanced modules',
    icon: '🎓',
    difficulty: 'hard',
    recurrence: 'one-time',
    status: 'available',
    objectives: [
      { id: generateId(), description: 'Complete Module 1', target: 1, current: 0, completed: false },
      { id: generateId(), description: 'Complete Module 2', target: 1, current: 0, completed: false },
      { id: generateId(), description: 'Complete Module 3', target: 1, current: 0, completed: false },
      { id: generateId(), description: 'Pass final exam', target: 1, current: 0, completed: false },
    ],
    rewards: { points: 500, badgeId: sampleBadges[2].id },
    createdAt: now(),
    updatedAt: now(),
  },
];

const sampleLeaderboardEntries: LeaderboardEntry[] = [
  { userId: '1', username: 'Alice', score: 5200, rank: 1, avatar: '', updatedAt: now() },
  { userId: '2', username: 'Bob', score: 4800, rank: 2, avatar: '', updatedAt: now() },
  { userId: '3', username: 'Charlie', score: 4500, rank: 3, avatar: '', updatedAt: now() },
  { userId: '4', username: 'Diana', score: 4200, rank: 4, avatar: '', updatedAt: now() },
  { userId: '5', username: 'Eve', score: 3800, rank: 5, avatar: '', updatedAt: now() },
  { userId: userId, username: 'You', score: 3200, rank: 6, avatar: '', updatedAt: now() },
  { userId: '7', username: 'Frank', score: 2900, rank: 7, avatar: '', updatedAt: now() },
  { userId: '8', username: 'Grace', score: 2500, rank: 8, avatar: '', updatedAt: now() },
];

function GamificationDashboard() {
  const { balance, lifetime, addPoints, subtractPoints } = usePoints();
  const { unlockedBadges, lockedBadges, updateProgress, checkAndUnlockBadges } = useBadges();
  const { activeQuests, completedQuests, availableQuests, startQuest, abandonQuest, updateProgress: updateQuestProgress } = useQuests();
  const { entries, currentUserEntry, updateScore, period, metric, setPeriod, setMetric } = useLeaderboard();

  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [questsCompleted, setQuestsCompleted] = useState(0);

  const handleCompleteLesson = () => {
    addPoints(100, { action: 'lesson-complete', description: 'Completed a lesson' });
    const newCount = lessonsCompleted + 1;
    setLessonsCompleted(newCount);
    
    updateProgress('lessons-completed', newCount);
    checkAndUnlockBadges();

    if (currentUserEntry) {
      updateScore(userId, currentUserEntry.score + 100, 'You');
    }
  };

  const handleCompleteQuiz = () => {
    addPoints(50, { action: 'quiz-complete', description: 'Completed a quiz' });
    updateProgress('perfect-quiz', 1);
    checkAndUnlockBadges();
    
    if (currentUserEntry) {
      updateScore(userId, currentUserEntry.score + 50, 'You');
    }
  };

  const handleStartQuest = (questId: string) => {
    startQuest(questId);
  };

  const handleAbandonQuest = (questId: string) => {
    abandonQuest(questId);
  };

  const handleSimulateQuestProgress = () => {
    if (activeQuests.length > 0) {
      const quest = activeQuests[0];
      const firstIncompleteObjective = quest.objectives.find(obj => !obj.completed);
      if (firstIncompleteObjective) {
        updateQuestProgress(quest.id, firstIncompleteObjective.id, firstIncompleteObjective.current + 1);
        
        const allObjectivesComplete = quest.objectives.every(obj => 
          obj.id === firstIncompleteObjective.id ? firstIncompleteObjective.current + 1 >= firstIncompleteObjective.target : obj.completed
        );
        
        if (allObjectivesComplete) {
          const newQuestsCount = questsCompleted + 1;
          setQuestsCompleted(newQuestsCount);
          updateProgress('quests-completed', newQuestsCount);
          checkAndUnlockBadges();
          
          if (quest.rewards.points && currentUserEntry) {
            addPoints(quest.rewards.points, { action: 'quest-complete', description: 'Completed a quest' });
            updateScore(userId, currentUserEntry.score + quest.rewards.points, 'You');
          }
        }
      }
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎮 Questro Demo</h1>
        <p style={styles.subtitle}>Complete gamification library showcase</p>
      </header>

      <div style={styles.grid}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Points System</h2>
          <PointsDisplay />
          <div style={styles.pointsInfo}>
            <div style={styles.infoRow}>
              <span>Current:</span>
              <strong>{balance} pts</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Lifetime:</span>
              <strong>{lifetime} pts</strong>
            </div>
          </div>
          <div style={styles.actions}>
            <button onClick={handleCompleteLesson} style={{ ...styles.button, ...styles.buttonPrimary }}>
              Complete Lesson (+100 pts)
            </button>
            <button onClick={handleCompleteQuiz} style={{ ...styles.button, ...styles.buttonSecondary }}>
              Complete Quiz (+50 pts)
            </button>
            <button onClick={() => subtractPoints(50, { action: 'penalty', description: 'Applied penalty' })} style={{ ...styles.button, ...styles.buttonDanger }}>
              Apply Penalty (-50 pts)
            </button>
          </div>
          <p style={styles.hint}>Lessons completed: {lessonsCompleted}</p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>🏅 Badges</h2>
          <div style={styles.badgesSummary}>
            <div style={styles.badgeStat}>
              <span style={styles.badgeStatValue}>{unlockedBadges.length}</span>
              <span style={styles.badgeStatLabel}>Unlocked</span>
            </div>
            <div style={styles.badgeStat}>
              <span style={styles.badgeStatValue}>{lockedBadges.length}</span>
              <span style={styles.badgeStatLabel}>Locked</span>
            </div>
          </div>
          <BadgeGrid badges={lockedBadges} showLocked={true} showHidden={false} />
        </section>
      </div>

      <div style={styles.grid}>
        <section style={{ ...styles.card, gridColumn: '1 / -1' }}>
          <h2 style={styles.cardTitle}>🎯 Quests</h2>
          <QuestStats
            activeCount={activeQuests.length}
            completedCount={completedQuests.length}
            availableCount={availableQuests.length}
          />
          
          {activeQuests.length > 0 && (
            <div>
              <h3 style={styles.sectionTitle}>Active Quests</h3>
              <QuestList
                quests={activeQuests}
                onQuestAbandon={handleAbandonQuest}
              />
              <button onClick={handleSimulateQuestProgress} style={{ ...styles.button, ...styles.buttonPrimary, marginTop: '12px' }}>
                Simulate Progress on Active Quest
              </button>
            </div>
          )}
          
          {availableQuests.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={styles.sectionTitle}>Available Quests</h3>
              <QuestList
                quests={availableQuests}
                onQuestStart={handleStartQuest}
              />
            </div>
          )}
          
          {completedQuests.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={styles.sectionTitle}>Completed Quests</h3>
              <QuestList
                quests={completedQuests}
                showActions={false}
              />
            </div>
          )}
        </section>
      </div>

      <div style={styles.grid}>
        <section style={{ ...styles.card, gridColumn: '1 / -1' }}>
          <h2 style={styles.cardTitle}>🏆 Leaderboard</h2>
          <LeaderboardFilters
            period={period}
            metric={metric}
            onPeriodChange={setPeriod}
            onMetricChange={setMetric}
          />
          <CurrentUserRank entry={currentUserEntry} totalEntries={entries.length} />
          <Leaderboard entries={entries} currentUserId={userId} maxEntries={10} />
        </section>
      </div>
    </div>
  );
}

function App() {
  return (
    <PointsProvider config={{ userId, initialBalance: 0, minBalance: 0 }}>
      <BadgesProvider config={{ userId, badges: sampleBadges }}>
        <QuestsProvider quests={sampleQuests} config={{ maxActiveQuests: 3 }}>
          <LeaderboardProvider entries={sampleLeaderboardEntries} config={{ userId, metric: 'points' }}>
            <GamificationDashboard />
          </LeaderboardProvider>
        </QuestsProvider>
      </BadgesProvider>
    </PointsProvider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 700,
    margin: '0 0 8px 0',
    color: '#111827',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 600,
    margin: '0 0 16px 0',
    color: '#111827',
  },
  pointsInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    margin: '16px 0',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginTop: '16px',
  },
  button: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  buttonSecondary: {
    backgroundColor: '#10b981',
    color: '#ffffff',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  },
  hint: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '12px',
    textAlign: 'center' as const,
  },
  badgesSummary: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  badgeStat: {
    flex: 1,
    textAlign: 'center' as const,
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  badgeStatValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: 700,
    color: '#111827',
  },
  badgeStatLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    margin: '0 0 12px 0',
    color: '#374151',
  },
};

export default App;

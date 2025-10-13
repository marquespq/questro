/**
 * Example: Educational App with Points and Badges
 *
 * This example demonstrates how to use Questro in an educational setting
 * where students earn points for completing lessons and unlock badges
 * for achieving milestones.
 */

import { useState } from 'react';
import {
  PointsProvider,
  BadgesProvider,
  usePoints,
  useBadges,
  PointsDisplay,
  BadgeGrid,
  BadgeCount,
  LocalStorageAdapter,
  now,
  generateId,
} from 'questro';
import type { Badge } from 'questro';

// Define badges for the educational app
const educationalBadges: Badge[] = [
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
    name: 'Perfect Score',
    description: 'Get 100% on a quiz',
    icon: '💯',
    rarity: 'rare',
    category: 'achievement',
    conditions: [{ type: 'perfect-quiz', value: 1 }],
    points: 300,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: 'Week Streak',
    description: 'Study for 7 days in a row',
    icon: '🔥',
    rarity: 'epic',
    category: 'habit',
    conditions: [{ type: 'daily-streak', value: 7 }],
    points: 500,
    hidden: true,
    createdAt: now(),
    updatedAt: now(),
  },
];

// Student Dashboard Component
function StudentDashboard() {
  const { lifetime, addPoints } = usePoints();
  const { unlockedBadges, lockedBadges, updateProgress, checkAndUnlockBadges } = useBadges();

  const [lessonsCompleted, setLessonsCompleted] = useState(0);

  const completeLesson = () => {
    // Award points
    addPoints(100, {
      action: 'lesson-completed',
      description: 'Completed a lesson',
    });

    // Update lesson progress
    const newCount = lessonsCompleted + 1;
    setLessonsCompleted(newCount);

    // Update badge progress for lesson-related badges
    educationalBadges
      .filter((badge) => badge.conditions.some((c) => c.type === 'lessons-completed'))
      .forEach((badge) => {
        updateProgress(badge.id, newCount);
      });

    // Check if any badges should be unlocked
    checkAndUnlockBadges();
  };

  const getPerfectScore = () => {
    // Award bonus points
    addPoints(300, {
      action: 'perfect-quiz',
      description: 'Got perfect score on quiz',
    });

    // Update badge progress for perfect quiz badge
    const perfectBadge = educationalBadges.find(
      (badge) => badge.conditions[0]?.type === 'perfect-quiz'
    );
    if (perfectBadge) {
      updateProgress(perfectBadge.id, 1);
    }

    checkAndUnlockBadges();
  };

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <header style={{ marginBottom: '3rem' }}>
        <h1>📚 Learning Dashboard</h1>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <strong>Current Points:</strong>{' '}
            <PointsDisplay format={(balance) => `${balance.toLocaleString()} pts`} />
          </div>
          <div>
            <strong>Lifetime Points:</strong> {lifetime.toLocaleString()}
          </div>
          <div>
            <strong>Badges:</strong> <BadgeCount type="unlocked" /> / <BadgeCount type="total" />
          </div>
        </div>
      </header>

      {/* Actions */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>📖 Actions</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={completeLesson}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Complete Lesson (+100 pts)
          </button>
          <button
            onClick={getPerfectScore}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Perfect Quiz Score (+300 pts)
          </button>
        </div>
        <p style={{ marginTop: '1rem', color: '#666' }}>Lessons completed: {lessonsCompleted}</p>
      </section>

      {/* Unlocked Badges */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>🏆 Unlocked Badges ({unlockedBadges.length})</h2>
        {unlockedBadges.length === 0 ? (
          <p style={{ color: '#999' }}>No badges unlocked yet. Keep learning!</p>
        ) : (
          <BadgeGrid showLocked={false}>
            {(badge) => (
              <div
                key={badge.id}
                style={{
                  padding: '1.5rem',
                  border: '2px solid #4CAF50',
                  borderRadius: '12px',
                  backgroundColor: '#f0f8f0',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{badge.name}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{badge.description}</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#4CAF50' }}>
                  +{badge.points} pts
                </div>
              </div>
            )}
          </BadgeGrid>
        )}
      </section>

      {/* Locked Badges */}
      <section>
        <h2>🔒 Locked Badges ({lockedBadges.length})</h2>
        <BadgeGrid showLocked={true} showHidden={false}>
          {(badge) => (
            <div
              key={badge.id}
              style={{
                padding: '1.5rem',
                border: '2px solid #ddd',
                borderRadius: '12px',
                backgroundColor: '#f9f9f9',
                opacity: 0.7,
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem', filter: 'grayscale(100%)' }}>
                {badge.icon}
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{badge.name}</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{badge.description}</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#999' }}>
                +{badge.points} pts
              </div>
            </div>
          )}
        </BadgeGrid>
      </section>
    </div>
  );
}

// App wrapper with providers
export default function EducationalApp() {
  const userId = 'student-123';

  return (
    <PointsProvider
      config={{
        userId,
        initialBalance: 0,
        onBalanceChange: (balance) => {
          console.log('Balance changed:', balance);
        },
      }}
      storage={new LocalStorageAdapter()}
      storageKey={`edu-points:${userId}`}
    >
      <BadgesProvider
        config={{
          userId,
          badges: educationalBadges,
          onBadgeUnlocked: (badge) => {
            console.log('Badge unlocked:', badge.name);
            // Here you could show a toast notification
          },
        }}
        storage={new LocalStorageAdapter()}
        storageKey={`edu-badges:${userId}`}
      >
        <StudentDashboard />
      </BadgesProvider>
    </PointsProvider>
  );
}

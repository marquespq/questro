import { useState, useEffect } from 'react';
import { usePoints } from 'questro/points';
import { useBadges } from 'questro/badges';
import { useQuests } from 'questro/quests';
import { useNotifications } from 'questro/notifications';
import { badges } from '../data/mockData';

type TabType = 'points' | 'quests' | 'badges';

export function LivePlayground() {
  const { balance, addPoints } = usePoints();
  const { updateProgress, checkAndUnlockBadges, unlockedBadges, allBadges } = useBadges();
  const {
    availableQuests,
    activeQuests,
    completedQuests,
    startQuest,
    abandonQuest,
    updateProgress: updateQuestProgress,
  } = useQuests();
  const { show } = useNotifications();
  const [clickCount, setClickCount] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('points');

  // Get full badge data for unlocked badges
  const unlockedBadgesData = unlockedBadges
    .map((ub) => allBadges.find((badge) => badge.id === ub.badgeId))
    .filter((badge): badge is NonNullable<typeof badge> => badge !== undefined);

  // Badge IDs from mockData
  const gettingStartedBadge = badges[0]; // "Getting Started" - Complete first action
  const risingStarBadge = badges[1]; // "Rising Star" - Earn 100 points
  const onFireBadge = badges[2]; // "On Fire" - Complete 5 actions in a row

  // Auto-unlock badges based on criteria
  useEffect(() => {
    // Getting Started: First action (clickCount >= 1)
    if (clickCount >= 1) {
      updateProgress(gettingStartedBadge.id, 1);
    }

    // Rising Star: 100 points
    if (balance >= 100) {
      updateProgress(risingStarBadge.id, balance);
    }

    // On Fire: 5 actions
    if (clickCount >= 5) {
      updateProgress(onFireBadge.id, clickCount);
    }

    // Check and unlock
    const newUnlocks = checkAndUnlockBadges();

    // Show notification for new badges
    if (newUnlocks.length > 0) {
      newUnlocks.forEach((unlock) => {
        const badge = allBadges.find((b) => b.id === unlock.badgeId);
        if (badge) {
          show({
            title: 'Badge Unlocked!',
            message: `🏆 ${badge.name} - ${badge.description}`,
            type: 'success',
          });
        }
      });
    }
  }, [
    balance,
    clickCount,
    gettingStartedBadge.id,
    risingStarBadge.id,
    onFireBadge.id,
    updateProgress,
    checkAndUnlockBadges,
    allBadges,
    show,
  ]);

  const handleAction = (action: 'task' | 'bonus' | 'achievement') => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    switch (action) {
      case 'task':
        addPoints(10, {
          action: 'task-complete',
          description: 'Task completed',
        });
        show({
          title: 'Success!',
          message: '+10 points! Task completed',
          type: 'success',
        });
        break;
      case 'bonus':
        addPoints(50, { action: 'bonus-claim', description: 'Bonus claimed' });
        show({
          title: 'Bonus!',
          message: '🎉 +50 bonus points!',
          type: 'success',
        });
        break;
      case 'achievement':
        addPoints(100, {
          action: 'achievement',
          description: 'Achievement unlocked',
        });
        show({
          title: 'Achievement!',
          message: '🏆 +100 points!',
          type: 'success',
        });
        break;
    }
  };

  const handleQuestProgress = () => {
    if (activeQuests.length > 0) {
      const quest = activeQuests[0];
      const objective = quest.objectives.find((obj) => !obj.completed);

      if (objective) {
        const newProgress = objective.current + 1;
        updateQuestProgress(quest.id, objective.id, newProgress);
        addPoints(10, {
          action: 'quest-progress',
          description: 'Quest progress made',
        });
        show({
          title: 'Progress!',
          message: '+10 points! Quest objective updated',
          type: 'success',
        });
      }
    }
  };

  const handleCompleteQuest = () => {
    if (activeQuests.length > 0) {
      const quest = activeQuests[0];
      quest.objectives.forEach((obj) => {
        if (!obj.completed) {
          updateQuestProgress(quest.id, obj.id, obj.target);
        }
      });

      if (quest.rewards.points) {
        addPoints(quest.rewards.points, {
          action: 'quest-complete',
          description: `Completed: ${quest.title}`,
        });
        show({
          title: 'Quest Complete!',
          message: `🎯 ${quest.title} completed! +${quest.rewards.points} points`,
          type: 'success',
        });
      }
    }
  };

  const reset = () => {
    setClickCount(0);
    show({ title: 'Reset', message: 'Counter reset!', type: 'info' });
  };

  return (
    <div className="playground-section">
      <div className="section-header">
        <h2 className="section-title">Live Playground</h2>
        <p className="section-subtitle">
          Click the buttons below to see questro in action. All changes are live and persist in
          localStorage.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '0',
        }}
      >
        <button
          onClick={() => setActiveTab('points')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            background: activeTab === 'points' ? '#6366f1' : 'transparent',
            color: activeTab === 'points' ? '#fff' : '#64748b',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderBottom: activeTab === 'points' ? '2px solid #6366f1' : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          🎯 Points System
        </button>
        <button
          onClick={() => setActiveTab('quests')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            background: activeTab === 'quests' ? '#6366f1' : 'transparent',
            color: activeTab === 'quests' ? '#fff' : '#64748b',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderBottom: activeTab === 'quests' ? '2px solid #6366f1' : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          📋 Quests
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            background: activeTab === 'badges' ? '#6366f1' : 'transparent',
            color: activeTab === 'badges' ? '#fff' : '#64748b',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderBottom: activeTab === 'badges' ? '2px solid #6366f1' : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          🏆 Badges
        </button>
      </div>

      {/* Points Tab */}
      {activeTab === 'points' && (
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
                <div className="playground-stat-value">{unlockedBadges.length}</div>
                <div className="playground-stat-unit">total</div>
              </div>
            </div>

            <div className="playground-actions">
              <button className="playground-button primary" onClick={() => handleAction('task')}>
                <span className="button-icon">✓</span>
                <span className="button-text">
                  <strong>Complete Task</strong>
                  <small>+10 points</small>
                </span>
              </button>
              <button className="playground-button secondary" onClick={() => handleAction('bonus')}>
                <span className="button-icon">⭐</span>
                <span className="button-text">
                  <strong>Claim Bonus</strong>
                  <small>+50 points</small>
                </span>
              </button>
              <button
                className="playground-button accent"
                onClick={() => handleAction('achievement')}
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
              <h4>💡 What&apos;s happening?</h4>
              <ul>
                <li>
                  <strong>State Management:</strong> Points and badges persist in localStorage
                </li>
                <li>
                  <strong>Real-time Updates:</strong> UI updates instantly on every action
                </li>
                <li>
                  <strong>Event System:</strong> Notifications trigger automatically
                </li>
                <li>
                  <strong>Type Safety:</strong> Full TypeScript support with IntelliSense
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quests Tab */}
      {activeTab === 'quests' && (
        <div className="playground-container">
          <div className="playground-left">
            <div className="playground-display">
              <div className="playground-stat">
                <div className="playground-stat-label">Available Quests</div>
                <div className="playground-stat-value">{availableQuests.length}</div>
                <div className="playground-stat-unit">ready</div>
              </div>
              <div className="playground-stat">
                <div className="playground-stat-label">Active Quests</div>
                <div className="playground-stat-value">{activeQuests.length}</div>
                <div className="playground-stat-unit">in progress</div>
              </div>
              <div className="playground-stat">
                <div className="playground-stat-label">Completed</div>
                <div className="playground-stat-value">{completedQuests.length}</div>
                <div className="playground-stat-unit">total</div>
              </div>
            </div>

            {/* Quest Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Available Quests */}
              {availableQuests.map((quest) => (
                <div
                  key={quest.id}
                  style={{
                    padding: '20px',
                    backgroundColor: '#fff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '32px', marginRight: '12px' }}>{quest.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#0f172a',
                          marginBottom: '4px',
                        }}
                      >
                        {quest.title}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{quest.description}</div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        textTransform: 'uppercase',
                      }}
                    >
                      {quest.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => startQuest(quest.id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      backgroundColor: '#6366f1',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Start Quest
                  </button>
                </div>
              ))}

              {/* Active Quests */}
              {activeQuests.map((quest) => (
                <div
                  key={quest.id}
                  style={{
                    padding: '20px',
                    backgroundColor: '#eef2ff',
                    border: '2px solid #6366f1',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(99,102,241,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '32px', marginRight: '12px' }}>{quest.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#0f172a',
                          marginBottom: '4px',
                        }}
                      >
                        {quest.title}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                        {quest.description}
                      </div>
                      {quest.objectives.map((obj) => (
                        <div key={obj.id} style={{ marginBottom: '8px' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '4px',
                            }}
                          >
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              {obj.description}
                            </span>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: obj.completed ? '#10b981' : '#6366f1',
                              }}
                            >
                              {obj.current}/{obj.target}
                            </span>
                          </div>
                          <div
                            style={{
                              height: '6px',
                              backgroundColor: '#e0e7ff',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${(obj.current / obj.target) * 100}%`,
                                backgroundColor: obj.completed ? '#10b981' : '#6366f1',
                                transition: 'width 0.3s',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleQuestProgress}
                      style={{
                        flex: 1,
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: 600,
                        backgroundColor: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      Make Progress
                    </button>
                    <button
                      onClick={handleCompleteQuest}
                      style={{
                        flex: 1,
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: 600,
                        backgroundColor: '#6366f1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      Complete Quest
                    </button>
                    <button
                      onClick={() => abandonQuest(quest.id)}
                      style={{
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      Abandon
                    </button>
                  </div>
                </div>
              ))}

              {/* Completed Quests */}
              {completedQuests.length > 0 && (
                <div
                  style={{
                    padding: '20px',
                    backgroundColor: '#f0fdf4',
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#15803d',
                      marginBottom: '12px',
                    }}
                  >
                    ✅ Completed Quests
                  </div>
                  {completedQuests.map((quest) => (
                    <div
                      key={quest.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid #bbf7d0',
                      }}
                    >
                      <span style={{ fontSize: '24px', marginRight: '12px' }}>{quest.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#15803d' }}>
                          {quest.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#16a34a' }}>
                          +{quest.rewards.points} points earned
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="playground-right">
            <div className="playground-code-section">
              <h3 className="playground-code-title">Quest Implementation</h3>
              <pre className="playground-code">
                <code>{`import { useQuests } from 'questro/quests';
import { usePoints } from 'questro/points';

function QuestTracker() {
  const {
    availableQuests,
    activeQuests,
    startQuest,
    updateProgress
  } = useQuests();
  const { addPoints } = usePoints();

  const handleQuestProgress = (questId, objectiveId) => {
    // Update quest objective
    updateProgress(questId, objectiveId, 1);
    
    // Award points for progress
    addPoints(10, {
      action: 'quest-progress'
    });
  };

  return (
    <div>
      <h3>Available: {availableQuests.length}</h3>
      <h3>Active: {activeQuests.length}</h3>
      
      {activeQuests.map(quest => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}`}</code>
              </pre>
            </div>

            <div className="playground-info">
              <h4>💡 Quest System</h4>
              <ul>
                <li>
                  <strong>Multi-Objective:</strong> Quests can have multiple tracked objectives
                </li>
                <li>
                  <strong>Progress Tracking:</strong> Each objective tracks current/target progress
                </li>
                <li>
                  <strong>Recurrence:</strong> One-time or daily recurring quests
                </li>
                <li>
                  <strong>Rewards:</strong> Points and badges awarded on completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="playground-container">
          <div className="playground-left">
            <div className="playground-display">
              <div className="playground-stat">
                <div className="playground-stat-label">Badges Unlocked</div>
                <div className="playground-stat-value">{unlockedBadges.length}</div>
                <div className="playground-stat-unit">total</div>
              </div>
              <div className="playground-stat">
                <div className="playground-stat-label">Current Points</div>
                <div className="playground-stat-value">{balance}</div>
                <div className="playground-stat-unit">pts</div>
              </div>
              <div className="playground-stat">
                <div className="playground-stat-label">Actions Made</div>
                <div className="playground-stat-value">{clickCount}</div>
                <div className="playground-stat-unit">total</div>
              </div>
            </div>

            {/* Info box sobre como desbloquear badges */}
            <div
              style={{
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#eff6ff',
                border: '1px solid #3b82f6',
                borderRadius: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '20px', marginRight: '8px' }}>🎯</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af' }}>
                  How to Unlock Badges
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#1e40af', lineHeight: '1.8' }}>
                <strong>🎯 Getting Started:</strong> Complete your first action (1 click)
                <br />
                <strong>⭐ Rising Star:</strong> Earn 100 points total
                <br />
                <strong>🔥 On Fire:</strong> Complete 5 actions
                <br />
                <br />
                <em>Go to the Points tab and click the action buttons!</em>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '16px',
              }}
            >
              {unlockedBadgesData.map((badge) => (
                <div
                  key={badge.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#fff',
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(16,185,129,0.1)',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>{badge.icon}</div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '4px',
                    }}
                  >
                    {badge.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                    {badge.description}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#f0fdf4',
                      color: '#15803d',
                      display: 'inline-block',
                    }}
                  >
                    {badge.rarity}
                  </div>
                </div>
              ))}

              {unlockedBadgesData.length === 0 && (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>No badges yet</div>
                  <div style={{ fontSize: '14px' }}>Complete actions to unlock badges!</div>
                </div>
              )}
            </div>
          </div>

          <div className="playground-right">
            <div className="playground-code-section">
              <h3 className="playground-code-title">Badge Implementation</h3>
              <pre className="playground-code">
                <code>{`import { useBadges } from 'questro/badges';

function BadgeTracker() {
  const {
    unlockedBadges,
    updateProgress,
    checkAndUnlockBadges
  } = useBadges();

  const handleMilestone = (value) => {
    // Update badge progress
    updateProgress('centurion', value);
    
    // Check if any badges unlocked
    const newBadges = checkAndUnlockBadges();
    
    if (newBadges.length > 0) {
      console.log('New badges!', newBadges);
    }
  };

  return (
    <div>
      <p>Unlocked: {unlockedBadges.length}</p>
      {unlockedBadges.map(badge => (
        <Badge key={badge.id} data={badge} />
      ))}
    </div>
  );
}`}</code>
              </pre>
            </div>

            <div className="playground-info">
              <h4>💡 Badge System</h4>
              <ul>
                <li>
                  <strong>Conditions:</strong> Badges unlock when conditions are met
                </li>
                <li>
                  <strong>Rarity Levels:</strong> Common, uncommon, rare, epic, legendary
                </li>
                <li>
                  <strong>Categories:</strong> Achievement, streak, level, special
                </li>
                <li>
                  <strong>Progress Tracking:</strong> Track multiple conditions per badge
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

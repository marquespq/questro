import { useState, useEffect } from 'react';
import { usePoints } from 'questro/points';
import { useBadges } from 'questro/badges';
import { useQuests } from 'questro/quests';
import { useNotifications } from 'questro/notifications';
import { useLevels } from 'questro/levels';
import { useLeaderboard } from 'questro/leaderboard';
import { badges } from '../data/mockData';

type TabType = 'points' | 'quests' | 'badges' | 'levels' | 'leaderboard';

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
  const { levelData, addXP, levelHistory } = useLevels();
  const { entries, updateScore } = useLeaderboard();
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
        <button
          onClick={() => setActiveTab('levels')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            background: activeTab === 'levels' ? '#6366f1' : 'transparent',
            color: activeTab === 'levels' ? '#fff' : '#64748b',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderBottom: activeTab === 'levels' ? '2px solid #6366f1' : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          ⭐ Levels
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            background: activeTab === 'leaderboard' ? '#6366f1' : 'transparent',
            color: activeTab === 'leaderboard' ? '#fff' : '#64748b',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderBottom:
              activeTab === 'leaderboard' ? '2px solid #6366f1' : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          🥇 Leaderboard
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      marginBottom: '12px',
                    }}
                  >
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      marginBottom: '12px',
                    }}
                  >
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
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#64748b',
                          marginBottom: '12px',
                        }}
                      >
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
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#15803d',
                          }}
                        >
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
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#1e40af',
                  }}
                >
                  How to Unlock Badges
                </div>
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#1e40af',
                  lineHeight: '1.8',
                }}
              >
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
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#64748b',
                      marginBottom: '8px',
                    }}
                  >
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

      {/* Levels Tab - Level Up Animation */}
      {activeTab === 'levels' && (
        <div className="playground-container">
          <div className="playground-left">
            <div className="playground-display">
              <div className="playground-stat">
                <div className="playground-stat-label">Current Level</div>
                <div
                  className="playground-stat-value"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {levelData.level}
                </div>
                <div className="playground-stat-unit">level</div>
              </div>
              <div className="playground-stat">
                <div className="playground-stat-label">Current XP</div>
                <div className="playground-stat-value">{levelData.currentXP}</div>
                <div className="playground-stat-unit">xp</div>
              </div>
              <div className="playground-stat">
                <div className="playground-stat-label">Next Level</div>
                <div className="playground-stat-value">{levelData.xpToLevelUp}</div>
                <div className="playground-stat-unit">xp needed</div>
              </div>
            </div>

            {/* XP Progress Bar with Animation */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                  }}
                >
                  Level {levelData.level} Progress
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#6366f1',
                  }}
                >
                  {Math.round(levelData.progress)}%
                </span>
              </div>
              <div
                style={{
                  height: '24px',
                  backgroundColor: '#e0e7ff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${levelData.progress}%`,
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    transition: 'width 0.5s ease-out',
                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 2s infinite',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Level Up History with Animation */}
            {levelHistory.length > 0 && (
              <div
                style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  color: '#fff',
                  marginBottom: '24px',
                  animation: 'slideInUp 0.5s ease-out',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    textAlign: 'center',
                    marginBottom: '12px',
                  }}
                >
                  🎉
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    textAlign: 'center',
                    marginBottom: '8px',
                  }}
                >
                  Recent Level Ups
                </div>
                {levelHistory
                  .slice(-3)
                  .reverse()
                  .map((event, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>
                          Level {event.previousLevel} → {event.newLevel}
                        </span>
                        <span style={{ fontSize: '12px', opacity: 0.9 }}>
                          Total: {event.totalXP} XP
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* XP Action Buttons */}
            <div className="playground-actions">
              <button
                className="playground-button primary"
                onClick={() => {
                  addXP(50, 'Demo action');
                  show({
                    title: 'XP Gained!',
                    message: '+50 XP earned!',
                    type: 'success',
                  });
                }}
              >
                <span className="button-icon">⚡</span>
                <span className="button-text">
                  <strong>Gain 50 XP</strong>
                  <small>Quick boost</small>
                </span>
              </button>
              <button
                className="playground-button secondary"
                onClick={() => {
                  addXP(200, 'Big achievement');
                  show({
                    title: 'Big Win!',
                    message: '+200 XP! 🎉',
                    type: 'success',
                  });
                }}
              >
                <span className="button-icon">💫</span>
                <span className="button-text">
                  <strong>Gain 200 XP</strong>
                  <small>Major achievement</small>
                </span>
              </button>
            </div>
          </div>

          <div className="playground-right">
            <div className="playground-code-section">
              <h3 className="playground-code-title">Levels Implementation</h3>
              <pre className="playground-code">
                <code>{`import { useLevels } from 'questro/levels';

function LevelTracker() {
  const { levelData, addXP } = useLevels();

  const handleAction = () => {
    // Add XP for action
    addXP(50, 'Task completed');
  };

  return (
    <div>
      <h3>Level {levelData.level}</h3>
      <ProgressBar 
        current={levelData.currentXP}
        max={levelData.xpToNextLevel}
      />
      <p>Total XP: {levelData.totalXP}</p>
    </div>
  );
}`}</code>
              </pre>
            </div>

            <div className="playground-info">
              <h4>💡 Level System</h4>
              <ul>
                <li>
                  <strong>XP Tracking:</strong> Earn XP through actions and activities
                </li>
                <li>
                  <strong>Auto Level Up:</strong> Automatically level up when XP threshold reached
                </li>
                <li>
                  <strong>Progress Bar:</strong> Visual feedback with animated XP bar
                </li>
                <li>
                  <strong>Level History:</strong> Track all level up events
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Tab - Podium Display */}
      {activeTab === 'leaderboard' && (
        <div className="playground-container">
          <div className="playground-left">
            {/* Podium Display */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '16px',
                marginBottom: '32px',
                padding: '40px 20px',
              }}
            >
              {/* 2nd Place */}
              {entries[1] && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'slideInUp 0.5s ease-out 0.2s both',
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      marginBottom: '12px',
                      boxShadow: '0 4px 12px rgba(148,163,184,0.4)',
                    }}
                  >
                    🥈
                  </div>
                  <div
                    style={{
                      width: '120px',
                      padding: '20px 16px',
                      background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                      borderRadius: '12px 12px 0 0',
                      textAlign: 'center',
                      color: '#fff',
                      height: '140px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        marginBottom: '8px',
                      }}
                    >
                      {entries[1].username}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{entries[1].score}</div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>points</div>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {entries[0] && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'slideInUp 0.5s ease-out both',
                  }}
                >
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px',
                      marginBottom: '12px',
                      boxShadow: '0 8px 20px rgba(251,191,36,0.6)',
                      animation: 'pulse 2s infinite',
                    }}
                  >
                    🏆
                  </div>
                  <div
                    style={{
                      width: '140px',
                      padding: '24px 16px',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      borderRadius: '12px 12px 0 0',
                      textAlign: 'center',
                      color: '#fff',
                      height: '180px',
                      boxShadow: '0 4px 20px rgba(251,191,36,0.4)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        marginBottom: '8px',
                      }}
                    >
                      {entries[0].username}
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>{entries[0].score}</div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>points</div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {entries[2] && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'slideInUp 0.5s ease-out 0.4s both',
                  }}
                >
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      marginBottom: '12px',
                      boxShadow: '0 4px 12px rgba(251,146,60,0.4)',
                    }}
                  >
                    🥉
                  </div>
                  <div
                    style={{
                      width: '110px',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
                      borderRadius: '12px 12px 0 0',
                      textAlign: 'center',
                      color: '#fff',
                      height: '120px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        marginBottom: '8px',
                      }}
                    >
                      {entries[2].username}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700 }}>{entries[2].score}</div>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>points</div>
                  </div>
                </div>
              )}
            </div>

            {/* Rest of Leaderboard */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {entries.slice(3).map((entry, idx) => (
                <div
                  key={entry.userId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: entry.userId === 'demo-user' ? '#eff6ff' : '#fff',
                    border:
                      entry.userId === 'demo-user' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    animation: `slideInRight 0.3s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: '#64748b',
                      marginRight: '16px',
                    }}
                  >
                    #{idx + 4}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    >
                      {entry.username}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#6366f1',
                    }}
                  >
                    {entry.score}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Point Actions */}
            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(255, 107, 107, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 107, 107, 0.1)',
              }}
            >
              <h4
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  color: '#64748b',
                }}
              >
                Quick Actions
              </h4>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  className="playground-button"
                  onClick={() => {
                    addPoints(10, {
                      action: 'quick-action',
                      description: 'Quick points',
                    });
                    show({
                      title: '+10 Points',
                      message: 'Points added successfully!',
                      type: 'success',
                    });
                  }}
                  style={{ flex: 1 }}
                >
                  +10
                </button>
                <button
                  className="playground-button"
                  onClick={() => {
                    addPoints(50, {
                      action: 'quick-action',
                      description: 'Quick points',
                    });
                    show({
                      title: '+50 Points',
                      message: 'Points added successfully!',
                      type: 'success',
                    });
                  }}
                  style={{ flex: 1 }}
                >
                  +50
                </button>
                <button
                  className="playground-button"
                  onClick={() => {
                    addPoints(100, {
                      action: 'quick-action',
                      description: 'Quick points',
                    });
                    show({
                      title: '+100 Points',
                      message: 'Points added successfully!',
                      type: 'success',
                    });
                  }}
                  style={{ flex: 1 }}
                >
                  +100
                </button>
              </div>
            </div>

            {/* Update Score Button */}
            <div style={{ marginTop: '12px' }}>
              <button
                className="playground-button primary"
                onClick={() => {
                  // Sync leaderboard score with current points balance
                  console.log('Current balance:', balance);
                  updateScore('demo-user', balance, 'You');
                  show({
                    title: 'Score Synced!',
                    message: `Leaderboard updated with ${balance} points!`,
                    type: 'success',
                  });
                }}
                style={{ width: '100%' }}
              >
                <span className="button-icon">🔄</span>
                <span className="button-text">
                  <strong>Sync Score with Points</strong>
                  <small>Current: {balance} points</small>
                </span>
              </button>
            </div>
          </div>

          <div className="playground-right">
            <div className="playground-code-section">
              <h3 className="playground-code-title">Leaderboard Implementation</h3>
              <pre className="playground-code">
                <code>{`import { useLeaderboard } from 'questro/leaderboard';

function LeaderboardView() {
  const { entries, updateScore } = useLeaderboard();

  const handleScoreUpdate = (userId, score) => {
    updateScore(userId, score);
  };

  return (
    <div>
      {entries.map((entry, idx) => (
        <div key={entry.userId}>
          <span>#{idx + 1}</span>
          <span>{entry.username}</span>
          <span>{entry.score}</span>
        </div>
      ))}
    </div>
  );
}`}</code>
              </pre>
            </div>

            <div className="playground-info">
              <h4>💡 Leaderboard System</h4>
              <ul>
                <li>
                  <strong>Podium Display:</strong> Top 3 players with visual medals
                </li>
                <li>
                  <strong>Auto Ranking:</strong> Scores automatically sorted
                </li>
                <li>
                  <strong>Highlight User:</strong> Current user highlighted in blue
                </li>
                <li>
                  <strong>Real-time Updates:</strong> Scores update instantly
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

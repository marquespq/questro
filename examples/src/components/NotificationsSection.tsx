import { useNotifications, NotificationContainer } from 'questro/notifications';

export function NotificationsSection() {
  const {
    success,
    error,
    info,
    warning,
    levelUp,
    badgeUnlocked,
    questCompleted,
    streakMilestone,
    streakWarning,
  } = useNotifications();

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Try Notifications System</h3>
            <div className="demo-badge">Live Demo</div>
          </div>

          {/* Explicação */}
          <div
            style={{
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bfdbfe',
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
              <span style={{ fontSize: '20px', marginRight: '8px' }}>💡</span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af' }}>
                How Notifications Work
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#1e40af', lineHeight: '1.6' }}>
              <strong>Toast Queue:</strong> Auto-dismissing notifications with max queue limit
              <br />
              <strong>Types:</strong> Success, Error, Info, Warning, Level Up, Achievement
              <br />
              <strong>Gamification:</strong> Pre-built shortcuts for level ups, badges, quests,
              streaks
              <br />
              <strong>Positioning:</strong> 6 positions (top/bottom × left/center/right)
            </div>
          </div>

          {/* Basic Notifications */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#64748b',
                marginBottom: '12px',
              }}
            >
              Basic Notifications
            </div>
            <div className="demo-actions">
              <button
                onClick={() => success('Success!', 'Operation completed successfully')}
                className="action-button"
                style={{ backgroundColor: '#10b981' }}
              >
                ✅ Success
              </button>
              <button
                onClick={() => error('Error!', 'Something went wrong')}
                className="action-button"
                style={{ backgroundColor: '#ef4444' }}
              >
                ❌ Error
              </button>
              <button
                onClick={() => info('Info', "Here's some information")}
                className="action-button"
                style={{ backgroundColor: '#3b82f6' }}
              >
                ℹ️ Info
              </button>
              <button
                onClick={() => warning('Warning!', 'Please be careful')}
                className="action-button"
                style={{ backgroundColor: '#f59e0b' }}
              >
                ⚠️ Warning
              </button>
            </div>
          </div>

          {/* Gamification Shortcuts */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#64748b',
                marginBottom: '12px',
              }}
            >
              Gamification Shortcuts
            </div>
            <div className="demo-actions">
              <button
                onClick={() => levelUp(10)}
                className="action-button"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                }}
              >
                🎉 Level Up (10)
              </button>
              <button
                onClick={() => badgeUnlocked('Master Coder')}
                className="action-button"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                }}
              >
                🏆 Badge Unlocked
              </button>
              <button
                onClick={() => questCompleted('Daily Tasks', 100)}
                className="action-button"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                }}
              >
                🎯 Quest Complete
              </button>
            </div>
            <div className="demo-actions" style={{ marginTop: '12px' }}>
              <button
                onClick={() => streakMilestone(7)}
                className="action-button"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
                }}
              >
                🔥 7-Day Streak
              </button>
              <button
                onClick={() => streakWarning(2)}
                className="action-button"
                style={{ backgroundColor: '#f59e0b' }}
              >
                ⚠️ Streak Warning (2h)
              </button>
            </div>
          </div>

          {/* Advanced Options */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#64748b',
                marginBottom: '12px',
              }}
            >
              Advanced Options
            </div>
            <div className="demo-actions">
              <button
                onClick={() => info('Tip', 'Use the show() method for full control', '💡')}
                className="action-button"
              >
                � Custom Icon
              </button>
              <button
                onClick={() => success('Multiple', 'Try clicking all buttons quickly!')}
                className="action-button"
              >
                � Queue Test
              </button>
            </div>
          </div>

          {/* Info */}
          <div
            style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '20px',
              fontSize: '13px',
              color: '#64748b',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <strong>Tip:</strong> Notifications appear at the top-right by default
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Max Queue:</strong> 5 notifications at once (configurable)
            </div>
            <div>
              <strong>Auto-dismiss:</strong> 3 seconds by default (configurable per notification)
            </div>
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Components</h3>

        <div className="code-block">
          <div className="code-label">NotificationContainer</div>
          <pre className="code-snippet">{`// Add once at app root
<NotificationContainer 
  position="top-right"
  maxVisible={5}
/>`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">Basic Notifications</div>
          <pre className="code-snippet">{`const { success, error, info, warning } = useNotifications();

// Show notifications
success("Success!", "Operation completed");
error("Error!", "Something went wrong");
info("Info", "Here's some information");
warning("Warning!", "Please be careful");`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">Gamification Shortcuts</div>
          <pre className="code-snippet">{`const { 
  levelUp, 
  badgeUnlocked, 
  questCompleted,
  streakMilestone,
  streakWarning
} = useNotifications();

// Pre-built gamification notifications
levelUp(10); // Level 10 reached
badgeUnlocked("Master Coder");
questCompleted("Daily Tasks", 100);
streakMilestone(7); // 7-day streak
streakWarning(2); // 2 hours left`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">Advanced Options</div>
          <pre className="code-snippet">{`// Custom duration
success("Title", "Message", { duration: 5000 });

// Persistent (no auto-dismiss)
info("Important", "Read me!", { duration: 0 });

// With action button
success("Done!", "Click to undo", {
  action: {
    label: "Undo",
    onClick: () => handleUndo()
  }
});

// With sound
levelUp(5, { sound: true });

// Custom icon
info("Custom", "Message", { icon: "🎨" });`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">Configure Notifications</div>
          <pre className="code-snippet">{`// In Provider
<NotificationsProvider 
  config={{
    maxNotifications: 5,
    defaultDuration: 3000,
    position: 'top-right'
  }}
>
  <App />
  <NotificationContainer />
</NotificationsProvider>`}</pre>
        </div>
      </div>

      {/* Notification Container - always at the end */}
      <NotificationContainer position="top-right" maxVisible={5} />
    </div>
  );
}

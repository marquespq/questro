import { useStreaks, StreakDisplay, StreakCalendar } from 'questro/streaks';

export function StreaksSection() {
  const { streakData, recordActivity, useFreeze: activateFreeze } = useStreaks();

  const handleRecordActivity = () => {
    recordActivity();
  };

  const handleUseFreeze = () => {
    activateFreeze();
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Try Streaks System</h3>
            <div className="demo-badge">Live Demo</div>
          </div>

          {/* Explicação */}
          <div
            style={{
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: '#fef3c7',
              border: '1px solid #fde68a',
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
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400e' }}>
                How Streaks Work
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.6' }}>
              <strong>Current Streak:</strong> Days/weeks/months in a row with activity
              <br />
              <strong>Longest Streak:</strong> Your best streak record
              <br />
              <strong>Freeze:</strong> Skip a day without breaking your streak
              <br />
              <strong>Types:</strong> Daily (24h), Weekly (7d), Monthly (calendar month)
            </div>
          </div>

          {/* Streak Display */}
          <div style={{ marginBottom: '24px' }}>
            <StreakDisplay showFreezes showLongest showWarning />
          </div>

          {/* Stats */}
          <div className="demo-stats">
            <div className="stat-box">
              <div className="stat-label">Current Streak</div>
              <div className="stat-value" style={{ color: '#f97316' }}>
                🔥 {streakData.current}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Longest Streak</div>
              <div className="stat-value" style={{ color: '#eab308' }}>
                ⭐ {streakData.longest}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Freezes Left</div>
              <div className="stat-value" style={{ color: '#3b82f6' }}>
                ❄️ {streakData.freezes}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#64748b',
                marginBottom: '12px',
              }}
            >
              Quick Actions
            </div>
            <div className="demo-actions">
              <button onClick={handleRecordActivity} className="action-button">
                ✅ Record Activity Today
              </button>
              <button
                onClick={handleUseFreeze}
                className="action-button"
                disabled={streakData.freezes === 0}
              >
                ❄️ Use Freeze ({streakData.freezes} left)
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#64748b',
                marginBottom: '12px',
              }}
            >
              Activity Calendar
            </div>
            <StreakCalendar month={currentMonth} year={currentYear} />
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
              <strong>Streak Type:</strong>{' '}
              {streakData.type.charAt(0).toUpperCase() + streakData.type.slice(1)}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Time Until Break:</strong> {streakData.timeUntilBreak} periods
            </div>
            <div>
              <strong>Last Activity:</strong>{' '}
              {streakData.lastActivity
                ? new Date(streakData.lastActivity).toLocaleDateString()
                : 'Never'}
            </div>
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Components</h3>

        <div className="code-block">
          <div className="code-label">StreakDisplay</div>
          <pre className="code-snippet">{`<StreakDisplay 
  showFreezes
  showLongest
  showWarning
/>`}</pre>
          <div className="code-preview">
            <StreakDisplay showFreezes showLongest showWarning />
          </div>
        </div>

        <div className="code-block">
          <div className="code-label">StreakCalendar</div>
          <pre className="code-snippet">{`<StreakCalendar 
  month={new Date().getMonth()}
  year={new Date().getFullYear()}
/>`}</pre>
          <div className="code-preview">
            <StreakCalendar month={currentMonth} year={currentYear} />
          </div>
        </div>

        <div className="code-block">
          <div className="code-label">useStreaks Hook</div>
          <pre className="code-snippet">{`const { streakData, recordActivity, useFreeze } = useStreaks();

// Record today's activity
recordActivity();

// Use a freeze to protect streak
useFreeze();

// Check streak status
console.log(streakData.current, streakData.isActive);`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">Configure Streaks</div>
          <pre className="code-snippet">{`// In Provider
<StreaksProvider 
  config={{
    userId: 'user-123',
    type: 'daily',
    maxFreezes: 3,
    graceHours: 2,
    milestones: [
      { streak: 7, reward: { points: 100 } },
      { streak: 30, reward: { badge: 'month-streak' } }
    ]
  }}
>
  <App />
</StreaksProvider>`}</pre>
        </div>
      </div>
    </div>
  );
}

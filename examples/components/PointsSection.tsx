import { useState, useEffect } from 'react';
import { usePoints, PointsDisplay, LifetimePointsDisplay } from 'questro/points';
import { styles } from '../styles/appStyles';

export function PointsSection() {
  const { balance, lifetime, addPoints, subtractPoints, transactions } = usePoints();
  const [lastChange, setLastChange] = useState<{ amount: number; time: number } | null>(null);

  useEffect(() => {
    if (transactions.length > 0) {
      const last = transactions[transactions.length - 1];
      setLastChange({ amount: last.amount, time: Date.now() });
      const timer = setTimeout(() => setLastChange(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [transactions]);

  const handleAction = (action: string, points: number) => {
    if (action === 'add') {
      addPoints(points, { action: `demo-${action}`, description: `Added ${points} points` });
    } else {
      subtractPoints(points, { action: `demo-${action}`, description: `Spent ${points} points` });
    }
  };

  return (
    <div style={styles.moduleSection}>
      <div style={styles.moduleDemo}>
        <div style={styles.demoCard}>
          <div style={styles.demoHeader}>
            <h3 style={styles.demoTitle}>Try Points System</h3>
            <div style={styles.demoBadge}>Live Demo</div>
          </div>

          {/* Explicação */}
          <div
            style={{
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>💡</span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af' }}>
                How Points Work
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#1e40af', lineHeight: '1.6' }}>
              <strong>Current Balance:</strong> Available points to spend
              <br />
              <strong>Lifetime Points:</strong> Total earned (never decreases)
              <br />
              <strong>Transactions:</strong> Complete history of all point changes
            </div>
          </div>

          <div style={styles.demoStats}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Current Balance</div>
              <div style={{ ...styles.statValue, position: 'relative' }}>
                {balance}
                {lastChange && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '10px',
                      color: lastChange.amount > 0 ? '#10b981' : '#ef4444',
                      fontSize: '18px',
                      fontWeight: 700,
                      animation: 'fadeOut 2s forwards',
                    }}
                  >
                    {lastChange.amount > 0 ? '+' : ''}
                    {lastChange.amount}
                  </div>
                )}
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Lifetime Points</div>
              <div style={styles.statValue}>{lifetime}</div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div
              style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}
            >
              Quick Actions
            </div>
            <div style={styles.demoActions}>
              <button onClick={() => handleAction('add', 10)} style={styles.actionButton}>
                🎯 Task Complete +10
              </button>
              <button onClick={() => handleAction('add', 50)} style={styles.actionButton}>
                ⭐ Achievement +50
              </button>
              <button onClick={() => handleAction('add', 100)} style={styles.actionButton}>
                🏆 Level Up +100
              </button>
              <button
                onClick={() => handleAction('subtract', 25)}
                style={styles.actionButtonDanger}
              >
                💰 Purchase -25
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <div
              style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}
            >
              Recent Transactions ({transactions.length})
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {transactions
                .slice(-5)
                .reverse()
                .map((tx, i) => (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px',
                      backgroundColor: i % 2 === 0 ? '#f8fafc' : 'transparent',
                      borderRadius: '6px',
                      marginBottom: '4px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                        {tx.reason.description || tx.reason.action}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: tx.amount > 0 ? '#10b981' : '#ef4444',
                      }}
                    >
                      {tx.amount > 0 ? '+' : ''}
                      {tx.amount}
                    </div>
                  </div>
                ))}
              {transactions.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#94a3b8',
                    fontSize: '14px',
                  }}
                >
                  No transactions yet. Try the buttons above!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.moduleCode}>
        <h3 style={styles.codeTitle}>Components</h3>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>PointsDisplay</div>
          <pre style={styles.codeSnippet}>{`<PointsDisplay />`}</pre>
          <div style={styles.codePreview}>
            <PointsDisplay style={{ fontSize: '24px', fontWeight: 700 }} />
          </div>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>LifetimePointsDisplay</div>
          <pre style={styles.codeSnippet}>{`<LifetimePointsDisplay />`}</pre>
          <div style={styles.codePreview}>
            <LifetimePointsDisplay
              style={{ fontSize: '24px', fontWeight: 700, color: '#8b5cf6' }}
            />
          </div>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>usePoints Hook</div>
          <pre
            style={styles.codeSnippet}
          >{`const { balance, addPoints, subtractPoints } = usePoints();

// Add points
addPoints(50, { action: 'task-complete' });

// Remove points  
subtractPoints(25, { action: 'purchase' });`}</pre>
        </div>
      </div>
    </div>
  );
}

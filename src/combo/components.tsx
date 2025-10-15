import type { CSSProperties, ReactNode } from 'react';

interface ComboMeterProps {
  combo: number;
  multiplier: number;
  isActive: boolean;
  timeRemaining: number;
  maxTime?: number;
  showMultiplier?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function ComboMeter({
  combo,
  multiplier,
  isActive,
  timeRemaining,
  maxTime = 5000,
  showMultiplier = true,
  style,
  className,
}: ComboMeterProps) {
  const progress = (timeRemaining / maxTime) * 100;
  const pulseAnimation = isActive && combo > 0;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '16px',
        borderRadius: '12px',
        background: isActive ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' : '#e2e8f0',
        boxShadow: isActive ? '0 4px 20px rgba(255, 107, 53, 0.4)' : 'none',
        transition: 'all 0.3s ease',
        transform: pulseAnimation ? 'scale(1.05)' : 'scale(1)',
        ...style,
      }}
    >
      {/* Combo Count */}
      <div
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: isActive ? '#fff' : '#64748b',
          lineHeight: 1,
          animation: pulseAnimation ? 'comboPulse 0.3s ease' : undefined,
        }}
      >
        {combo}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: isActive ? 'rgba(255,255,255,0.9)' : '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Combo
      </div>

      {/* Timer Bar */}
      {isActive && (
        <div
          style={{
            width: '100px',
            height: '4px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: '#fff',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      )}

      {/* Multiplier */}
      {showMultiplier && multiplier > 1 && (
        <div
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#fff',
            background: 'rgba(0,0,0,0.2)',
            padding: '4px 12px',
            borderRadius: '12px',
          }}
        >
          ×{multiplier.toFixed(1)}
        </div>
      )}
    </div>
  );
}

interface ComboDisplayProps {
  combo: number;
  maxCombo: number;
  multiplier: number;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function ComboDisplay({
  combo,
  maxCombo,
  multiplier,
  children,
  style,
  className,
}: ComboDisplayProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '16px',
        borderRadius: '8px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>{combo}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Current Combo</div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#64748b' }}>{maxCombo}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Best</div>
        </div>
      </div>

      {multiplier > 1 && (
        <div
          style={{
            padding: '8px 12px',
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            borderRadius: '6px',
            textAlign: 'center',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          🔥 {multiplier.toFixed(1)}× Multiplier Active
        </div>
      )}

      {children}
    </div>
  );
}

interface ComboPopupProps {
  combo: number;
  multiplier: number;
  show: boolean;
  style?: CSSProperties;
  className?: string;
}

export function ComboPopup({ combo, multiplier, show, style, className }: ComboPopupProps) {
  if (!show) return null;

  const getMilestoneEmoji = (c: number) => {
    if (c >= 100) return '🌟';
    if (c >= 50) return '💥';
    if (c >= 25) return '🔥';
    if (c >= 10) return '⚡';
    return '✨';
  };

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '24px 32px',
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(255, 107, 53, 0.6)',
        zIndex: 9999,
        animation: 'comboPopup 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        ...style,
      }}
    >
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>{getMilestoneEmoji(combo)}</div>
        <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>
          {combo} COMBO!
        </div>
        {multiplier > 1 && (
          <div style={{ fontSize: '20px', fontWeight: 600, opacity: 0.9 }}>
            ×{multiplier.toFixed(1)} Multiplier
          </div>
        )}
      </div>
    </div>
  );
}

// CSS Animations (inject in global styles)
export const comboStyles = `
@keyframes comboPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes comboPopup {
  0% { 
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
`;

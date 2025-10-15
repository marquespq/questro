import { useEffect, useState } from 'react';
import type { AchievementToastProps, AchievementType } from './types';

export function AchievementToast({
  achievement,
  onClose,
  style,
  className,
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{ id: number; x: number; y: number; rotation: number; color: string }>
  >([]);

  const typeColors: Record<AchievementType, { primary: string; secondary: string; glow: string }> =
    {
      badge: { primary: '#3b82f6', secondary: '#2563eb', glow: 'rgba(59, 130, 246, 0.4)' },
      level: { primary: '#f59e0b', secondary: '#d97706', glow: 'rgba(245, 158, 11, 0.4)' },
      quest: { primary: '#10b981', secondary: '#059669', glow: 'rgba(16, 185, 129, 0.4)' },
      milestone: { primary: '#8b5cf6', secondary: '#7c3aed', glow: 'rgba(139, 92, 246, 0.4)' },
      rare: { primary: '#ec4899', secondary: '#db2777', glow: 'rgba(236, 72, 153, 0.4)' },
    };

  const colors = typeColors[achievement.type];
  const showConfetti = achievement.showConfetti ?? true;

  // Entrance animation
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);

    // Generate confetti
    if (showConfetti) {
      const confettiColors: string[] = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
      const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)] || '#fff',
      }));
      setConfettiPieces(pieces);
    }

    // Auto-close
    if (achievement.duration && achievement.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, achievement.duration);
      return () => clearTimeout(timer);
    }

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={handleClose}
      />

      {/* Confetti */}
      {showConfetti && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              style={{
                position: 'absolute',
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                width: '10px',
                height: '10px',
                background: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
                animation: 'confettiFall 3s ease-out forwards',
                opacity: isVisible ? 1 : 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Toast */}
      <div
        className={className}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: isVisible
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.8)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          zIndex: 10000,
          maxWidth: '450px',
          width: '90%',
          ...style,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            borderRadius: '20px',
            padding: '32px',
            boxShadow: `0 20px 60px ${colors.glow}, 0 0 0 1px rgba(255,255,255,0.1)`,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Shine effect */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              animation: 'achievementShine 2s ease-out',
            }}
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(0,0,0,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '20px',
              zIndex: 1,
            }}
          >
            ×
          </button>

          {/* Icon */}
          {achievement.icon && (
            <div
              style={{
                fontSize: '64px',
                textAlign: 'center',
                marginBottom: '16px',
                animation: 'achievementBounce 0.6s ease-out',
              }}
            >
              {achievement.icon}
            </div>
          )}

          {/* Title */}
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '8px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              margin: 0,
            }}
          >
            {achievement.title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '16px',
              textAlign: 'center',
              opacity: 0.95,
              marginBottom: '20px',
              lineHeight: 1.5,
              margin: '8px 0 20px',
            }}
          >
            {achievement.description}
          </p>

          {/* Rewards */}
          {achievement.reward && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
              }}
            >
              {achievement.reward.points && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    +{achievement.reward.points}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Points</div>
                </div>
              )}
              {achievement.reward.xp && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    +{achievement.reward.xp}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>XP</div>
                </div>
              )}
              {achievement.reward.badge && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {achievement.reward.badge}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Badge</div>
                </div>
              )}
            </div>
          )}

          {/* Action button */}
          {achievement.action && (
            <button
              onClick={() => {
                achievement.action?.onClick();
                handleClose();
              }}
              style={{
                width: '100%',
                padding: '14px',
                background: '#fff',
                color: colors.primary,
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {achievement.action.label}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// CSS Animations (inject in global styles)
export const achievementToastStyles = `
@keyframes achievementShine {
  0% { 
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 0;
  }
  50% { 
    opacity: 1;
  }
  100% { 
    transform: translate(50%, 50%) rotate(180deg);
    opacity: 0;
  }
}

@keyframes achievementBounce {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(0.9); }
  50% { transform: scale(1.1); }
  75% { transform: scale(0.95); }
}

@keyframes confettiFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
`;

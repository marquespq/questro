import type { CSSProperties } from 'react';
import type { DailyChallenge, ChallengeDifficulty } from './types';

interface DailyChallengeCardProps {
  challenge: DailyChallenge | null;
  progress: number;
  timeUntilReset: number;
  onAction?: () => void;
  style?: CSSProperties;
  className?: string;
}

export function DailyChallengeCard({
  challenge,
  progress,
  timeUntilReset,
  onAction,
  style,
  className,
}: DailyChallengeCardProps) {
  if (!challenge) {
    return (
      <div
        className={className}
        style={{
          padding: '24px',
          borderRadius: '12px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          color: '#64748b',
          ...style,
        }}
      >
        No challenge available
      </div>
    );
  }

  const isCompleted = challenge.status === 'completed';
  const difficultyColors: Record<ChallengeDifficulty, string> = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div
      className={className}
      style={{
        padding: '24px',
        borderRadius: '12px',
        background: isCompleted
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        border: 'none',
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Difficulty Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '4px 12px',
          borderRadius: '12px',
          background: difficultyColors[challenge.difficulty],
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        {challenge.difficulty}
      </div>

      {/* Title & Description */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
          {isCompleted ? '✅ ' : '🎯 '}
          {challenge.title}
        </h3>
        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>{challenge.description}</p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          <span>Progress</span>
          <span>
            {challenge.currentValue} / {challenge.targetValue}
          </span>
        </div>
        <div
          style={{
            height: '8px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: '#fff',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Reward */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 600 }}>Reward:</div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
          <span>💰 {challenge.reward.points}</span>
          {challenge.reward.xp && <span>⭐ {challenge.reward.xp} XP</span>}
        </div>
      </div>

      {/* Timer */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '12px',
          opacity: 0.8,
        }}
      >
        {isCompleted ? 'Completed! New challenge in:' : 'Time remaining:'}{' '}
        <strong>{formatTime(timeUntilReset)}</strong>
      </div>

      {/* Action Button */}
      {!isCompleted && onAction && (
        <button
          onClick={onAction}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            background: '#fff',
            color: '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Complete Challenge
        </button>
      )}
    </div>
  );
}

interface ChallengeStreakDisplayProps {
  streak: number;
  totalCompleted: number;
  style?: CSSProperties;
  className?: string;
}

export function ChallengeStreakDisplay({
  streak,
  totalCompleted,
  style,
  className,
}: ChallengeStreakDisplayProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: '16px',
        ...style,
      }}
    >
      <div
        style={{
          flex: 1,
          padding: '16px',
          borderRadius: '8px',
          background: '#fef3c7',
          border: '1px solid #fbbf24',
        }}
      >
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706' }}>{streak} 🔥</div>
        <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Day Streak</div>
      </div>

      <div
        style={{
          flex: 1,
          padding: '16px',
          borderRadius: '8px',
          background: '#dbeafe',
          border: '1px solid #3b82f6',
        }}
      >
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>
          {totalCompleted}
        </div>
        <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: 600 }}>Total Completed</div>
      </div>
    </div>
  );
}

interface ChallengeTimerProps {
  timeUntilReset: number;
  style?: CSSProperties;
  className?: string;
}

export function ChallengeTimer({ timeUntilReset, style, className }: ChallengeTimerProps) {
  const hours = Math.floor(timeUntilReset / 3600000);
  const minutes = Math.floor((timeUntilReset % 3600000) / 60000);
  const seconds = Math.floor((timeUntilReset % 60000) / 1000);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        ...style,
      }}
    >
      <TimeUnit value={hours} label="Hours" />
      <TimerSeparator />
      <TimeUnit value={minutes} label="Minutes" />
      <TimerSeparator />
      <TimeUnit value={seconds} label="Seconds" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px',
        background: '#1e293b',
        borderRadius: '8px',
        minWidth: '60px',
      }}
    >
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function TimerSeparator() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        color: '#64748b',
        fontSize: '24px',
        fontWeight: 'bold',
      }}
    >
      :
    </div>
  );
}

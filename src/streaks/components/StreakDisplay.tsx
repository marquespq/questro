import React from 'react';
import { useStreaks } from '../StreaksProvider';

export type StreakDisplayProps = {
  /**
   * Show freeze count
   * @default true
   */
  showFreezes?: boolean;

  /**
   * Show longest streak
   * @default false
   */
  showLongest?: boolean;

  /**
   * Show warning if inactive
   * @default true
   */
  showWarning?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom render function
   */
  children?: (data: {
    current: number;
    longest: number;
    freezes: number;
    isActive: boolean;
    timeUntilBreak: number;
  }) => React.ReactNode;
};

/**
 * Display current streak with fire emoji
 *
 * @example
 * ```tsx
 * <StreakDisplay showFreezes showLongest />
 * ```
 *
 * @example Custom render
 * ```tsx
 * <StreakDisplay>
 *   {({ current, isActive }) => (
 *     <div>🔥 {current} days {!isActive && '⚠️'}</div>
 *   )}
 * </StreakDisplay>
 * ```
 */
export function StreakDisplay({
  showFreezes = true,
  showLongest = false,
  showWarning = true,
  className,
  children,
}: StreakDisplayProps) {
  const { streakData } = useStreaks();

  if (children) {
    return (
      <>
        {children({
          current: streakData.current,
          longest: streakData.longest,
          freezes: streakData.freezes,
          isActive: streakData.isActive,
          timeUntilBreak: streakData.timeUntilBreak,
        })}
      </>
    );
  }

  return (
    <div className={className} data-component="streak-display">
      <div data-streak-main>
        <span data-streak-icon>🔥</span>
        <span data-streak-number>{streakData.current}</span>
        <span data-streak-label>{streakData.type} streak</span>
      </div>

      {showLongest && streakData.longest > 0 && (
        <div data-streak-longest>Longest: {streakData.longest}</div>
      )}

      {showFreezes && streakData.freezes > 0 && (
        <div data-streak-freezes>
          ❄️ {streakData.freezes} freeze{streakData.freezes !== 1 ? 's' : ''}
        </div>
      )}

      {showWarning && !streakData.isActive && streakData.current > 0 && (
        <div data-streak-warning>
          ⚠️ Complete{' '}
          {streakData.type === 'daily' ? 'today' : 'this ' + streakData.type.replace('ly', '')} to
          keep streak!
        </div>
      )}
    </div>
  );
}

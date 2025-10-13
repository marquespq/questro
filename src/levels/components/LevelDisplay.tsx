import React from 'react';
import { useLevels } from '../LevelsProvider';

export type LevelDisplayProps = {
  /**
   * Show XP progress
   * @default true
   */
  showXP?: boolean;

  /**
   * Show progress percentage
   * @default false
   */
  showPercentage?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom render function
   */
  children?: (data: {
    level: number;
    currentXP: number;
    xpToLevelUp: number;
    progress: number;
  }) => React.ReactNode;
};

/**
 * Display current level and XP
 *
 * @example
 * ```tsx
 * <LevelDisplay showXP showPercentage />
 * ```
 *
 * @example Custom render
 * ```tsx
 * <LevelDisplay>
 *   {({ level, currentXP, xpToLevelUp }) => (
 *     <div>Level {level}: {currentXP}/{xpToLevelUp} XP</div>
 *   )}
 * </LevelDisplay>
 * ```
 */
export function LevelDisplay({
  showXP = true,
  showPercentage = false,
  className,
  children,
}: LevelDisplayProps) {
  const { levelData } = useLevels();

  if (children) {
    return (
      <>
        {children({
          level: levelData.level,
          currentXP: levelData.currentXP,
          xpToLevelUp: levelData.xpToLevelUp,
          progress: levelData.progress,
        })}
      </>
    );
  }

  return (
    <div className={className} data-component="level-display">
      <div data-level={levelData.level}>Level {levelData.level}</div>

      {showXP && (
        <div data-xp={`${levelData.currentXP}/${levelData.xpToLevelUp}`}>
          {levelData.currentXP} / {levelData.xpToLevelUp} XP
        </div>
      )}

      {showPercentage && <div data-progress={levelData.progress}>{levelData.progress}%</div>}
    </div>
  );
}

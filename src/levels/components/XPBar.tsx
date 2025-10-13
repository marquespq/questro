import React from 'react';
import { useLevels } from '../LevelsProvider';

export type XPBarProps = {
  /**
   * Bar height
   * @default '8px'
   */
  height?: string;

  /**
   * Show percentage text
   * @default true
   */
  showPercentage?: boolean;

  /**
   * Show XP numbers
   * @default false
   */
  showXP?: boolean;

  /**
   * Animated transitions
   * @default true
   */
  animated?: boolean;

  /**
   * Custom className for container
   */
  className?: string;

  /**
   * Custom className for fill bar
   */
  fillClassName?: string;

  /**
   * Custom render function
   */
  children?: (data: {
    progress: number;
    currentXP: number;
    xpToLevelUp: number;
    level: number;
  }) => React.ReactNode;
};

/**
 * XP progress bar
 * 
 * @example
 * ```tsx
 * <XPBar height="12px" showPercentage showXP />
 * ```
 * 
 * @example Custom styling
 * ```tsx
 * <XPBar 
 *   className="bg-gray-200 rounded-full overflow-hidden"
 *   fillClassName="bg-blue-500 h-full transition-all duration-500"
 * />
 * ```
 */
export function XPBar({
  height = '8px',
  showPercentage = true,
  showXP = false,
  animated = true,
  className,
  fillClassName,
  children,
}: XPBarProps) {
  const { levelData } = useLevels();

  if (children) {
    return (
      <>
        {children({
          progress: levelData.progress,
          currentXP: levelData.currentXP,
          xpToLevelUp: levelData.xpToLevelUp,
          level: levelData.level,
        })}
      </>
    );
  }

  return (
    <div data-component="xp-bar">
      {(showPercentage || showXP) && (
        <div data-xp-info>
          {showXP && (
            <span data-xp-numbers>
              {levelData.currentXP} / {levelData.xpToLevelUp} XP
            </span>
          )}
          {showPercentage && (
            <span data-xp-percentage>
              {levelData.progress}%
            </span>
          )}
        </div>
      )}

      <div
        className={className}
        data-xp-bar-container
        style={{
          height,
          width: '100%',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          className={fillClassName}
          data-xp-bar-fill
          data-progress={levelData.progress}
          style={{
            height: '100%',
            width: `${levelData.progress}%`,
            backgroundColor: '#3b82f6',
            transition: animated ? 'width 0.5s ease-out' : 'none',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
}

import type { ReactNode, CSSProperties } from 'react';

/**
 * Achievement toast type
 */
export type AchievementType =
  | 'badge' // Badge unlocked
  | 'level' // Level up
  | 'quest' // Quest completed
  | 'milestone' // Special milestone
  | 'rare'; // Rare achievement

/**
 * Achievement toast data
 */
export interface Achievement {
  /**
   * Achievement title
   */
  title: string;
  /**
   * Achievement description
   */
  description: string;
  /**
   * Achievement type
   */
  type: AchievementType;
  /**
   * Icon (emoji or React node)
   */
  icon?: string | ReactNode;
  /**
   * Reward info
   */
  reward?: {
    points?: number;
    xp?: number;
    badge?: string;
  };
  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Show confetti effect
   * @default true
   */
  showConfetti?: boolean;
  /**
   * Play sound
   * @default false
   */
  playSound?: boolean;
  /**
   * Duration in ms (0 = manual dismiss)
   * @default 5000
   */
  duration?: number;
}

/**
 * Achievement toast props
 */
export interface AchievementToastProps {
  achievement: Achievement;
  onClose?: () => void;
  style?: CSSProperties;
  className?: string;
}

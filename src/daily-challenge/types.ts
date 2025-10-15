import type { Entity, EntityId, EventEmitter } from '@questro/core';

/**
 * Challenge difficulty
 */
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Challenge status
 */
export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'expired';

/**
 * Daily challenge definition
 */
export interface DailyChallenge extends Entity {
  userId: EntityId;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  targetValue: number;
  currentValue: number;
  reward: {
    points: number;
    xp?: number;
    badge?: string;
  };
  status: ChallengeStatus;
  expiresAt: number;
  completedAt?: number;
}

/**
 * Challenge template for generation
 */
export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  targetValue: number;
  reward: {
    points: number;
    xp?: number;
    badge?: string;
  };
}

/**
 * Daily challenge state
 */
export interface DailyChallengeState {
  userId: EntityId;
  currentChallenge: DailyChallenge | null;
  completedToday: boolean;
  streak: number;
  totalCompleted: number;
  history: DailyChallenge[];
  lastResetDate: string; // YYYY-MM-DD
}

/**
 * Daily challenge configuration
 */
export interface DailyChallengeConfig {
  userId: EntityId;
  /**
   * Custom challenge templates
   */
  templates?: ChallengeTemplate[];
  /**
   * Reset hour (0-23, in local time)
   * @default 0 (midnight)
   */
  resetHour?: number;
  /**
   * Max history entries to keep
   * @default 30
   */
  maxHistory?: number;
  /**
   * Callback when challenge completed
   */
  onChallengeComplete?: (challenge: DailyChallenge) => void;
  /**
   * Callback when new day starts
   */
  onNewDay?: (challenge: DailyChallenge) => void;
}

/**
 * Daily challenge events
 */
export type DailyChallengeEvents = {
  challengeGenerated: { challenge: DailyChallenge };
  progressUpdated: { challenge: DailyChallenge; delta: number };
  challengeCompleted: { challenge: DailyChallenge };
  challengeExpired: { challenge: DailyChallenge };
  streakIncreased: { streak: number };
  streakBroken: { oldStreak: number };
  [key: string]: unknown;
};

/**
 * Daily challenge service interface
 */
export interface DailyChallengeService {
  getCurrentChallenge(): DailyChallenge | null;
  getStreak(): number;
  getTotalCompleted(): number;
  getHistory(): readonly DailyChallenge[];
  getTimeUntilReset(): number;
  addProgress(amount: number): DailyChallenge | null;
  completeChallenge(): DailyChallenge | null;
  checkReset(): boolean;
  events: EventEmitter<DailyChallengeEvents>;
  toJSON(): DailyChallengeState;
}

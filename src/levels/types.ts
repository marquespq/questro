/**
 * Formula type for calculating XP required for each level
 */
export type LevelFormula = 'linear' | 'exponential' | 'fibonacci' | 'rpg' | 'custom';

/**
 * Configuration for the levels system
 */
export type LevelConfig = {
  /**
   * User identifier
   */
  userId: string;

  /**
   * Formula to calculate XP per level
   * @default 'linear'
   */
  formula?: LevelFormula;

  /**
   * Base XP required for level 2
   * @default 100
   */
  baseXP?: number;

  /**
   * Scaling factor for exponential/rpg formulas
   * @default 1.5 for exponential, 1.1 for rpg
   */
  scalingFactor?: number;

  /**
   * Maximum level cap (optional)
   */
  maxLevel?: number;

  /**
   * Custom formula function (level: number) => xpRequired: number
   * Used when formula is 'custom'
   */
  customFormula?: (level: number) => number;

  /**
   * Event callbacks
   */
  onLevelUp?: (event: LevelUpEvent) => void;
  onXPGain?: (amount: number, totalXP: number) => void;
};

/**
 * Current level data
 */
export type LevelData = {
  /**
   * Current level
   */
  level: number;

  /**
   * XP progress within current level
   */
  currentXP: number;

  /**
   * Total XP accumulated since level 1
   */
  totalXP: number;

  /**
   * XP required to reach current level (from level 1)
   */
  xpForCurrentLevel: number;

  /**
   * XP required to reach next level (from level 1)
   */
  xpForNextLevel: number;

  /**
   * XP needed to level up (difference)
   */
  xpToLevelUp: number;

  /**
   * Progress percentage in current level (0-100)
   */
  progress: number;
};

/**
 * Level up event data
 */
export type LevelUpEvent = {
  /**
   * Previous level
   */
  previousLevel: number;

  /**
   * New level achieved
   */
  newLevel: number;

  /**
   * Total XP at time of level up
   */
  totalXP: number;

  /**
   * Timestamp of level up
   */
  timestamp: number;

  /**
   * Optional rewards data
   */
  rewards?: {
    badge?: string;
    currency?: Record<string, number>;
    items?: string[];
  };
};

/**
 * XP transaction record
 */
export type XPTransaction = {
  /**
   * Unique transaction ID
   */
  id: string;

  /**
   * XP amount (can be negative)
   */
  amount: number;

  /**
   * Total XP after transaction
   */
  balance: number;

  /**
   * Reason for XP change
   */
  reason?: string;

  /**
   * Transaction timestamp
   */
  timestamp: number;

  /**
   * Level before transaction
   */
  levelBefore: number;

  /**
   * Level after transaction
   */
  levelAfter: number;
};

/**
 * Persisted levels state
 */
export type LevelsState = {
  /**
   * User ID
   */
  userId: string;

  /**
   * Total XP accumulated
   */
  totalXP: number;

  /**
   * Current level
   */
  level: number;

  /**
   * Level up history
   */
  levelHistory: LevelUpEvent[];

  /**
   * XP transaction history
   */
  xpHistory: XPTransaction[];

  /**
   * Timestamp of last update
   */
  lastUpdated: number;
};

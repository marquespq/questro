/**
 * Streak type
 */
export type StreakType = 'daily' | 'weekly' | 'monthly';

/**
 * Streak configuration
 */
export type StreakConfig = {
  /**
   * User identifier
   */
  userId: string;

  /**
   * Type of streak
   * @default 'daily'
   */
  type?: StreakType;

  /**
   * Grace period in hours after the period ends
   * For daily: hours after midnight
   * For weekly: hours after Sunday
   * @default 3
   */
  graceHours?: number;

  /**
   * Maximum freeze uses allowed
   * @default 3
   */
  maxFreezes?: number;

  /**
   * Milestones for rewards
   */
  milestones?: StreakMilestone[];

  /**
   * Event callbacks
   */
  onStreakUpdate?: (event: StreakUpdateEvent) => void;
  onMilestoneReached?: (milestone: StreakMilestone, currentStreak: number) => void;
  onStreakBroken?: (brokenStreak: number) => void;
};

/**
 * Streak milestone for rewards
 */
export type StreakMilestone = {
  /**
   * Streak count to reach
   */
  streak: number;

  /**
   * Rewards for reaching milestone
   */
  reward: {
    badge?: string;
    points?: number;
    freeze?: number;
    currency?: Record<string, number>;
  };
};

/**
 * Single streak entry
 */
export type StreakEntry = {
  /**
   * Date in YYYY-MM-DD format
   */
  date: string;

  /**
   * Whether activity was completed
   */
  completed: boolean;

  /**
   * Timestamp of completion
   */
  timestamp: number;

  /**
   * Whether a freeze was used
   */
  freezeUsed?: boolean;
};

/**
 * Streak update event
 */
export type StreakUpdateEvent = {
  /**
   * Previous streak count
   */
  previousStreak: number;

  /**
   * New streak count
   */
  newStreak: number;

  /**
   * Timestamp
   */
  timestamp: number;

  /**
   * Whether it broke (went to 0)
   */
  broken: boolean;
};

/**
 * Streak data
 */
export type StreakData = {
  /**
   * Streak type
   */
  type: StreakType;

  /**
   * Current streak count
   */
  current: number;

  /**
   * Longest streak ever achieved
   */
  longest: number;

  /**
   * Last activity timestamp
   */
  lastActivity: number | null;

  /**
   * When current streak started
   */
  startDate: number | null;

  /**
   * Available freeze uses
   */
  freezes: number;

  /**
   * Whether streak is currently active (activity today/this week/month)
   */
  isActive: boolean;

  /**
   * Days/weeks/months until streak breaks
   */
  timeUntilBreak: number;
};

/**
 * Persisted streaks state
 */
export type StreaksState = {
  /**
   * User ID
   */
  userId: string;

  /**
   * Streak type
   */
  type: StreakType;

  /**
   * Current streak
   */
  current: number;

  /**
   * Longest streak
   */
  longest: number;

  /**
   * Last activity timestamp
   */
  lastActivity: number | null;

  /**
   * Streak start timestamp
   */
  startDate: number | null;

  /**
   * Available freezes
   */
  freezes: number;

  /**
   * Activity history
   */
  history: StreakEntry[];

  /**
   * Reached milestones
   */
  milestonesReached: number[];

  /**
   * Last update timestamp
   */
  lastUpdated: number;
};

/**
 * Calendar day data for display
 */
export type CalendarDay = {
  /**
   * Date in YYYY-MM-DD
   */
  date: string;

  /**
   * Whether activity was completed
   */
  completed: boolean;

  /**
   * Whether it's today
   */
  isToday: boolean;

  /**
   * Whether it's in the future
   */
  isFuture: boolean;

  /**
   * Whether freeze was used
   */
  freezeUsed?: boolean;
};

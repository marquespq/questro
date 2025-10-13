import type {
  StreakConfig,
  StreakData,
  StreaksState,
  StreakEntry,
  StreakUpdateEvent,
  StreakMilestone,
} from './types';
import {
  isStreakActive,
  hasActivityToday,
  formatDate,
  getCurrentPeriodKey,
} from './utils/streakCalculations';

export class StreaksService {
  private state: StreaksState;
  private config: Required<Omit<StreakConfig, 'milestones' | 'onStreakUpdate' | 'onMilestoneReached' | 'onStreakBroken'>> & {
    milestones?: StreakMilestone[];
    onStreakUpdate?: StreakConfig['onStreakUpdate'];
    onMilestoneReached?: StreakConfig['onMilestoneReached'];
    onStreakBroken?: StreakConfig['onStreakBroken'];
  };
  private listeners: Set<() => void> = new Set();

  constructor(config: StreakConfig, initialState?: StreaksState) {
    this.config = {
      userId: config.userId,
      type: config.type || 'daily',
      graceHours: config.graceHours ?? 3,
      maxFreezes: config.maxFreezes ?? 3,
      milestones: config.milestones,
      onStreakUpdate: config.onStreakUpdate,
      onMilestoneReached: config.onMilestoneReached,
      onStreakBroken: config.onStreakBroken,
    };

    this.state = initialState || this.createInitialState();
    
    // Check if streak is broken on initialization
    this.checkStreakStatus();
  }

  private createInitialState(): StreaksState {
    return {
      userId: this.config.userId,
      type: this.config.type,
      current: 0,
      longest: 0,
      lastActivity: null,
      startDate: null,
      freezes: this.config.maxFreezes,
      history: [],
      milestonesReached: [],
      lastUpdated: Date.now(),
    };
  }

  /**
   * Get current streak data
   */
  getStreakData(): StreakData {
    const isActive = this.state.lastActivity
      ? isStreakActive(this.state.lastActivity, this.config.type, this.config.graceHours)
      : false;

    return {
      type: this.config.type,
      current: this.state.current,
      longest: this.state.longest,
      lastActivity: this.state.lastActivity,
      startDate: this.state.startDate,
      freezes: this.state.freezes,
      isActive,
      timeUntilBreak: this.calculateTimeUntilBreak(),
    };
  }

  /**
   * Record activity for current period
   */
  recordActivity(): void {
    const now = Date.now();

    // Check if already recorded for this period
    if (hasActivityToday(this.state.history, this.config.type)) {
      return; // Already recorded, do nothing
    }

    // Check if streak is broken
    const wasActive = this.state.lastActivity
      ? isStreakActive(this.state.lastActivity, this.config.type, this.config.graceHours)
      : false;

    const previousStreak = this.state.current;

    if (!wasActive && previousStreak > 0) {
      // Streak was broken
      this.handleStreakBroken(previousStreak);
    }

    // Add new entry
    const entry: StreakEntry = {
      date: getCurrentPeriodKey(this.config.type),
      completed: true,
      timestamp: now,
    };

    this.state.history.push(entry);
    this.state.lastActivity = now;

    // Update streak count
    if (!wasActive) {
      // Starting new streak
      this.state.current = 1;
      this.state.startDate = now;
    } else {
      // Continuing streak
      this.state.current++;
    }

    // Update longest
    if (this.state.current > this.state.longest) {
      this.state.longest = this.state.current;
    }

    this.state.lastUpdated = now;

    // Check milestones
    this.checkMilestones();

    // Trigger callback
    if (this.config.onStreakUpdate) {
      const event: StreakUpdateEvent = {
        previousStreak,
        newStreak: this.state.current,
        timestamp: now,
        broken: !wasActive && previousStreak > 0,
      };
      this.config.onStreakUpdate(event);
    }

    this.notifyListeners();
  }

  /**
   * Use a freeze to protect streak
   */
  useFreeze(): boolean {
    if (this.state.freezes <= 0) {
      return false;
    }

    // Check if streak is currently broken
    const isActive = this.state.lastActivity
      ? isStreakActive(this.state.lastActivity, this.config.type, this.config.graceHours)
      : false;

    if (isActive) {
      return false; // No need to use freeze
    }

    // Use freeze
    this.state.freezes--;

    // Add freeze entry to history
    const entry: StreakEntry = {
      date: getCurrentPeriodKey(this.config.type),
      completed: false,
      timestamp: Date.now(),
      freezeUsed: true,
    };

    this.state.history.push(entry);
    this.state.lastActivity = Date.now();
    this.state.lastUpdated = Date.now();

    this.notifyListeners();
    return true;
  }

  /**
   * Reset streak to 0
   */
  reset(): void {
    const previousStreak = this.state.current;
    this.state = this.createInitialState();
    
    if (previousStreak > 0 && this.config.onStreakBroken) {
      this.config.onStreakBroken(previousStreak);
    }

    this.notifyListeners();
  }

  /**
   * Get activity history
   */
  getHistory(): StreakEntry[] {
    return [...this.state.history];
  }

  /**
   * Get calendar data for a specific month
   */
  getCalendarData(month: number, year: number): Array<{
    date: string;
    completed: boolean;
    isToday: boolean;
    isFuture: boolean;
    freezeUsed?: boolean;
  }> {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const result = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      const entry = this.state.history.find(h => h.date === dateStr);

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const isFuture = date.getTime() > today.getTime();

      result.push({
        date: dateStr,
        completed: entry?.completed ?? false,
        isToday,
        isFuture,
        freezeUsed: entry?.freezeUsed,
      });
    }

    return result;
  }

  /**
   * Get state for persistence
   */
  getState(): StreaksState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Check streak status and update if broken
   */
  private checkStreakStatus(): void {
    if (!this.state.lastActivity || this.state.current === 0) {
      return;
    }

    const isActive = isStreakActive(
      this.state.lastActivity,
      this.config.type,
      this.config.graceHours
    );

    if (!isActive) {
      this.handleStreakBroken(this.state.current);
    }
  }

  /**
   * Handle streak broken
   */
  private handleStreakBroken(brokenStreak: number): void {
    this.state.current = 0;
    this.state.startDate = null;

    if (this.config.onStreakBroken) {
      this.config.onStreakBroken(brokenStreak);
    }
  }

  /**
   * Check and trigger milestones
   */
  private checkMilestones(): void {
    if (!this.config.milestones) return;

    for (const milestone of this.config.milestones) {
      // Check if milestone is reached and not already triggered
      if (
        this.state.current === milestone.streak &&
        !this.state.milestonesReached.includes(milestone.streak)
      ) {
        this.state.milestonesReached.push(milestone.streak);

        // Add freeze rewards
        if (milestone.reward.freeze) {
          this.state.freezes = Math.min(
            this.state.freezes + milestone.reward.freeze,
            this.config.maxFreezes
          );
        }

        // Trigger callback
        if (this.config.onMilestoneReached) {
          this.config.onMilestoneReached(milestone, this.state.current);
        }
      }
    }
  }

  /**
   * Calculate time until streak breaks
   */
  private calculateTimeUntilBreak(): number {
    if (!this.state.lastActivity || this.state.current === 0) {
      return 0;
    }

    const now = Date.now();
    const hoursSinceActivity = (now - this.state.lastActivity) / (1000 * 60 * 60);

    switch (this.config.type) {
      case 'daily':
        return Math.max(0, 24 + this.config.graceHours - hoursSinceActivity);
      case 'weekly':
        return Math.max(0, 168 + this.config.graceHours - hoursSinceActivity);
      case 'monthly': {
        const lastDate = new Date(this.state.lastActivity);
        const nextMonth = new Date(lastDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(Math.ceil(this.config.graceHours / 24));
        return Math.max(0, (nextMonth.getTime() - now) / (1000 * 60 * 60));
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

import { createEventEmitter, now } from '@questro/core';
import type {
  LeaderboardEntry,
  LeaderboardState,
  LeaderboardConfig,
  LeaderboardService,
  LeaderboardEvents,
  LeaderboardPeriod,
  LeaderboardMetric,
} from './types';
import type { EntityId } from '@questro/core';

export class LeaderboardServiceImpl implements LeaderboardService {
  private state: LeaderboardState;
  private config: { userId?: EntityId; maxEntries: number };
  public readonly events = createEventEmitter<LeaderboardEvents>();

  constructor(initialEntries: LeaderboardEntry[] = [], config: LeaderboardConfig = {}) {
    this.config = {
      userId: config.userId,
      maxEntries: config.maxEntries ?? 100,
    };

    const sortedEntries = this.sortAndRankEntries(initialEntries);

    this.state = {
      entries: sortedEntries,
      currentUserEntry: config.userId
        ? sortedEntries.find((e) => e.userId === config.userId)
        : undefined,
      period: config.period ?? 'all-time',
      metric: config.metric ?? 'points',
      lastUpdated: now(),
    };
  }

  on = this.events.on;
  emit = this.events.emit;

  private sortAndRankEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
    const sorted = [...entries].sort((a, b) => b.score - a.score);
    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  private notifyStateChange(): void {
    this.state.lastUpdated = now();
    this.emit('leaderboard-updated', this.state);
  }

  getState(): LeaderboardState {
    return {
      ...this.state,
      entries: [...this.state.entries],
    };
  }

  getTopEntries(limit: number = 10): LeaderboardEntry[] {
    return this.state.entries.slice(0, limit);
  }

  getUserEntry(userId: EntityId): LeaderboardEntry | undefined {
    return this.state.entries.find((e) => e.userId === userId);
  }

  getCurrentUserEntry(): LeaderboardEntry | undefined {
    return this.state.currentUserEntry;
  }

  updateScore(userId: EntityId, score: number, username?: string): void {
    const existingIndex = this.state.entries.findIndex((e) => e.userId === userId);

    if (existingIndex !== -1) {
      const existingEntry = this.state.entries[existingIndex]!;
      const oldRank = existingEntry.rank;
      existingEntry.score = score;
      existingEntry.updatedAt = now();
      if (username) {
        existingEntry.username = username;
      }

      this.state.entries = this.sortAndRankEntries(this.state.entries);

      const newEntry = this.state.entries.find((e) => e.userId === userId);
      if (newEntry && newEntry.rank !== oldRank) {
        this.emit('rank-changed', newEntry);
      }

      if (this.config.userId === userId) {
        this.state.currentUserEntry = newEntry;
      }
    } else {
      this.addEntry({
        userId,
        username: username ?? 'Unknown',
        score,
      });
    }

    this.notifyStateChange();
  }

  addEntry(entry: Omit<LeaderboardEntry, 'rank' | 'updatedAt'>): void {
    const newEntry: LeaderboardEntry = {
      ...entry,
      rank: 0,
      updatedAt: now(),
    };

    this.state.entries.push(newEntry);
    this.state.entries = this.sortAndRankEntries(this.state.entries);

    if (this.state.entries.length > this.config.maxEntries) {
      this.state.entries = this.state.entries.slice(0, this.config.maxEntries);
    }

    if (this.config.userId === entry.userId) {
      this.state.currentUserEntry = this.state.entries.find((e) => e.userId === entry.userId);
    }

    this.notifyStateChange();
  }

  removeEntry(userId: EntityId): void {
    this.state.entries = this.state.entries.filter((e) => e.userId !== userId);
    this.state.entries = this.sortAndRankEntries(this.state.entries);

    if (this.config.userId === userId) {
      this.state.currentUserEntry = undefined;
    }

    this.notifyStateChange();
  }

  setPeriod(period: LeaderboardPeriod): void {
    this.state.period = period;
    this.notifyStateChange();
  }

  setMetric(metric: LeaderboardMetric): void {
    this.state.metric = metric;
    this.notifyStateChange();
  }

  reset(): void {
    this.state = {
      entries: [],
      currentUserEntry: undefined,
      period: this.state.period,
      metric: this.state.metric,
      lastUpdated: now(),
    };
    this.notifyStateChange();
  }
}

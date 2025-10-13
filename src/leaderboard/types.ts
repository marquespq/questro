import type { EntityId, Timestamp, EventEmitter } from '@questro/core';

export interface LeaderboardEntry {
  userId: EntityId;
  username: string;
  score: number;
  rank: number;
  avatar?: string;
  metadata?: Record<string, unknown>;
  updatedAt: Timestamp;
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';

export type LeaderboardMetric = 'points' | 'badges' | 'quests-completed' | 'custom';

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  currentUserEntry?: LeaderboardEntry;
  period: LeaderboardPeriod;
  metric: LeaderboardMetric;
  lastUpdated: Timestamp;
}

export interface LeaderboardConfig {
  userId?: EntityId;
  metric?: LeaderboardMetric;
  period?: LeaderboardPeriod;
  maxEntries?: number;
}

export type LeaderboardEvents = {
  'rank-changed': LeaderboardEntry;
  'leaderboard-updated': LeaderboardState;
};

export interface LeaderboardService extends EventEmitter<LeaderboardEvents> {
  getState(): LeaderboardState;
  getTopEntries(limit?: number): LeaderboardEntry[];
  getUserEntry(userId: EntityId): LeaderboardEntry | undefined;
  getCurrentUserEntry(): LeaderboardEntry | undefined;
  updateScore(userId: EntityId, score: number, username?: string): void;
  addEntry(entry: Omit<LeaderboardEntry, 'rank' | 'updatedAt'>): void;
  removeEntry(userId: EntityId): void;
  setPeriod(period: LeaderboardPeriod): void;
  setMetric(metric: LeaderboardMetric): void;
  reset(): void;
}

import type { Entity, EntityId, Timestamp } from '@questro/core';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type BadgeCategory = string;
export interface BadgeCondition {
  type: string;
  value: number;
  metadata?: Record<string, unknown>;
}
export interface Badge extends Entity {
  name: string;
  description: string;
  icon?: string;
  image?: string;
  rarity: BadgeRarity;
  category?: BadgeCategory;
  conditions: BadgeCondition[];
  points?: number; // Points awarded when unlocked
  hidden?: boolean; // Hide until unlocked
}
export interface UnlockedBadge extends Entity {
  userId: EntityId;
  badgeId: EntityId;
  unlockedAt: Timestamp;
  progress?: number; // 0-100 for multi-step badges
}
export interface BadgeProgress {
  badgeId: EntityId;
  current: number;
  target: number;
  percentage: number;
  completed: boolean;
}
export interface BadgesConfig {
  userId: EntityId;
  badges: Badge[];
  onBadgeUnlocked?: (badge: Badge) => void;
}
export interface BadgesState {
  userId: EntityId;
  unlockedBadges: UnlockedBadge[];
  progress: Record<EntityId, BadgeProgress>;
}
export type BadgesEvents = {
  badgeUnlocked: { badge: Badge; unlockedBadge: UnlockedBadge };
  progressUpdated: { badgeId: EntityId; progress: BadgeProgress };
  [key: string]: unknown;
};
export interface BadgesService {
  getAllBadges(): readonly Badge[];
  getUnlockedBadges(): readonly UnlockedBadge[];
  getLockedBadges(): readonly Badge[];
  getBadgeById(id: EntityId): Badge | undefined;
  isBadgeUnlocked(badgeId: EntityId): boolean;
  getProgress(badgeId: EntityId): BadgeProgress | undefined;
  unlockBadge(badgeId: EntityId): UnlockedBadge | null;
  updateProgress(badgeId: EntityId, value: number): BadgeProgress;
  checkAndUnlockBadges(): UnlockedBadge[];
  reset(): void;
  events: EventEmitter<BadgesEvents>;
}
// Re-import EventEmitter type
import type { EventEmitter } from '@questro/core';


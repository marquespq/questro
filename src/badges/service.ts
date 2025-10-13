import { createEventEmitter, generateId, now, percentage } from '@questro/core';
import type {
  BadgesService,
  BadgesConfig,
  BadgesState,
  Badge,
  UnlockedBadge,
  BadgeProgress,
  BadgesEvents,
} from './types';
import type { EntityId } from '@questro/core';
export class BadgesServiceImpl implements BadgesService {
  private state: BadgesState;
  private config: BadgesConfig;
  private badges: Map<EntityId, Badge>;
  public readonly events = createEventEmitter<BadgesEvents>();
  constructor(config: BadgesConfig) {
    this.config = config;
    this.badges = new Map(config.badges.map((badge) => [badge.id, badge]));
    this.state = {
      userId: config.userId,
      unlockedBadges: [],
      progress: {},
    };
    // Initialize progress for all badges
    this.initializeProgress();
  }
  private initializeProgress(): void {
    this.config.badges.forEach((badge) => {
      if (!this.state.progress[badge.id]) {
        this.state.progress[badge.id] = {
          badgeId: badge.id,
          current: 0,
          target: this.calculateTarget(badge),
          percentage: 0,
          completed: false,
        };
      }
    });
  }
  private calculateTarget(badge: Badge): number {
    // Sum all condition values as the total target
    return badge.conditions.reduce((sum, condition) => sum + condition.value, 0);
  }
  getAllBadges(): readonly Badge[] {
    return Array.from(this.badges.values());
  }
  getUnlockedBadges(): readonly UnlockedBadge[] {
    return [...this.state.unlockedBadges];
  }
  getLockedBadges(): readonly Badge[] {
    const unlockedIds = new Set(this.state.unlockedBadges.map((ub) => ub.badgeId));
    return Array.from(this.badges.values()).filter((badge) => !unlockedIds.has(badge.id));
  }
  getBadgeById(id: EntityId): Badge | undefined {
    return this.badges.get(id);
  }
  isBadgeUnlocked(badgeId: EntityId): boolean {
    return this.state.unlockedBadges.some((ub) => ub.badgeId === badgeId);
  }
  getProgress(badgeId: EntityId): BadgeProgress | undefined {
    return this.state.progress[badgeId];
  }
  unlockBadge(badgeId: EntityId): UnlockedBadge | null {
    // Check if already unlocked
    if (this.isBadgeUnlocked(badgeId)) {
      return null;
    }
    const badge = this.badges.get(badgeId);
    if (!badge) {
      return null;
    }
    const unlockedBadge: UnlockedBadge = {
      id: generateId(),
      userId: this.state.userId,
      badgeId,
      unlockedAt: now(),
      createdAt: now(),
      updatedAt: now(),
    };
    this.state.unlockedBadges.push(unlockedBadge);
    // Update progress to completed
    const progress = this.state.progress[badgeId];
    if (progress) {
      progress.completed = true;
      progress.percentage = 100;
    }
    // Emit event
    this.events.emit('badgeUnlocked', { badge, unlockedBadge });
    // Call callback if provided
    this.config.onBadgeUnlocked?.(badge);
    return unlockedBadge;
  }
  updateProgress(badgeId: EntityId, value: number): BadgeProgress {
    let progress = this.state.progress[badgeId];
    if (!progress) {
      const badge = this.badges.get(badgeId);
      if (!badge) {
        throw new Error(`Badge with id ${badgeId} not found`);
      }
      progress = {
        badgeId,
        current: 0,
        target: this.calculateTarget(badge),
        percentage: 0,
        completed: false,
      };
      this.state.progress[badgeId] = progress;
    }
    // Update current value
    progress.current = Math.min(value, progress.target);
    progress.percentage = percentage(progress.current, progress.target);
    progress.completed = progress.current >= progress.target;
    // Emit event
    this.events.emit('progressUpdated', { badgeId, progress });
    // Auto-unlock if completed
    if (progress.completed && !this.isBadgeUnlocked(badgeId)) {
      this.unlockBadge(badgeId);
    }
    return progress;
  }
  checkAndUnlockBadges(): UnlockedBadge[] {
    const newlyUnlocked: UnlockedBadge[] = [];
    Array.from(this.badges.values()).forEach((badge) => {
      if (!this.isBadgeUnlocked(badge.id)) {
        const progress = this.state.progress[badge.id];
        if (progress?.completed) {
          const unlocked = this.unlockBadge(badge.id);
          if (unlocked) {
            newlyUnlocked.push(unlocked);
          }
        }
      }
    });
    return newlyUnlocked;
  }
  reset(): void {
    this.state.unlockedBadges = [];
    this.state.progress = {};
    this.initializeProgress();
  }
  // Serialization for persistence
  toJSON(): BadgesState {
    return {
      userId: this.state.userId,
      unlockedBadges: [...this.state.unlockedBadges],
      progress: { ...this.state.progress },
    };
  }
  static fromJSON(config: BadgesConfig, state: BadgesState): BadgesServiceImpl {
    const service = new BadgesServiceImpl(config);
    service.state = {
      userId: state.userId,
      unlockedBadges: [...state.unlockedBadges],
      progress: { ...state.progress },
    };
    return service;
  }
}


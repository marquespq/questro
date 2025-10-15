import { createEventEmitter, generateId, now } from '@questro/core';
import type {
  DailyChallengeService,
  DailyChallengeConfig,
  DailyChallengeState,
  DailyChallenge,
  ChallengeTemplate,
  DailyChallengeEvents,
} from './types';

// Default challenge templates
const DEFAULT_TEMPLATES: ChallengeTemplate[] = [
  {
    id: 'earn-points-easy',
    title: 'Point Collector',
    description: 'Earn 100 points',
    difficulty: 'easy',
    targetValue: 100,
    reward: { points: 50, xp: 25 },
  },
  {
    id: 'earn-points-medium',
    title: 'Point Master',
    description: 'Earn 500 points',
    difficulty: 'medium',
    targetValue: 500,
    reward: { points: 150, xp: 75 },
  },
  {
    id: 'earn-points-hard',
    title: 'Point Legend',
    description: 'Earn 1000 points',
    difficulty: 'hard',
    targetValue: 1000,
    reward: { points: 300, xp: 150 },
  },
  {
    id: 'complete-actions-easy',
    title: 'Action Starter',
    description: 'Complete 10 actions',
    difficulty: 'easy',
    targetValue: 10,
    reward: { points: 40, xp: 20 },
  },
  {
    id: 'complete-actions-medium',
    title: 'Action Hero',
    description: 'Complete 50 actions',
    difficulty: 'medium',
    targetValue: 50,
    reward: { points: 120, xp: 60 },
  },
];

export class DailyChallengeServiceImpl implements DailyChallengeService {
  private state: DailyChallengeState;
  private config: Required<DailyChallengeConfig>;
  public readonly events = createEventEmitter<DailyChallengeEvents>();

  constructor(config: DailyChallengeConfig) {
    this.config = {
      userId: config.userId,
      templates: config.templates ?? DEFAULT_TEMPLATES,
      resetHour: config.resetHour ?? 0,
      maxHistory: config.maxHistory ?? 30,
      onChallengeComplete: config.onChallengeComplete ?? (() => {}),
      onNewDay: config.onNewDay ?? (() => {}),
    };

    this.state = {
      userId: config.userId,
      currentChallenge: null,
      completedToday: false,
      streak: 0,
      totalCompleted: 0,
      history: [],
      lastResetDate: this.getCurrentDate(),
    };

    // Generate initial challenge
    this.checkReset();
  }

  getCurrentChallenge(): DailyChallenge | null {
    return this.state.currentChallenge;
  }

  getStreak(): number {
    return this.state.streak;
  }

  getTotalCompleted(): number {
    return this.state.totalCompleted;
  }

  getHistory(): readonly DailyChallenge[] {
    return [...this.state.history];
  }

  getTimeUntilReset(): number {
    const nowDate = new Date();
    const resetDate = new Date(nowDate);
    resetDate.setHours(this.config.resetHour, 0, 0, 0);

    // If reset time already passed today, set to tomorrow
    if (nowDate >= resetDate) {
      resetDate.setDate(resetDate.getDate() + 1);
    }

    return resetDate.getTime() - nowDate.getTime();
  }

  addProgress(amount: number): DailyChallenge | null {
    if (!this.state.currentChallenge || this.state.completedToday) {
      return null;
    }

    const challenge = this.state.currentChallenge;

    if (challenge.status !== 'active') {
      return null;
    }

    challenge.currentValue = Math.min(challenge.currentValue + amount, challenge.targetValue);
    challenge.updatedAt = now();

    this.events.emit('progressUpdated', { challenge, delta: amount });

    // Auto-complete if target reached
    if (challenge.currentValue >= challenge.targetValue) {
      return this.completeChallenge();
    }

    return challenge;
  }

  completeChallenge(): DailyChallenge | null {
    if (!this.state.currentChallenge || this.state.completedToday) {
      return null;
    }

    const challenge = this.state.currentChallenge;

    if (challenge.status !== 'active') {
      return null;
    }

    challenge.status = 'completed';
    challenge.completedAt = now();
    challenge.updatedAt = now();

    this.state.completedToday = true;
    this.state.totalCompleted += 1;
    this.state.streak += 1;

    // Add to history
    this.state.history.unshift(challenge);
    if (this.state.history.length > this.config.maxHistory) {
      this.state.history = this.state.history.slice(0, this.config.maxHistory);
    }

    this.events.emit('challengeCompleted', { challenge });
    this.events.emit('streakIncreased', { streak: this.state.streak });
    this.config.onChallengeComplete(challenge);

    return challenge;
  }

  checkReset(): boolean {
    const currentDate = this.getCurrentDate();

    if (currentDate === this.state.lastResetDate) {
      return false;
    }

    // Check if it's a consecutive day
    const yesterday = this.getYesterdayDate();
    const isConsecutive = this.state.lastResetDate === yesterday;

    // Break streak if not consecutive and didn't complete yesterday
    if (!isConsecutive && !this.state.completedToday && this.state.streak > 0) {
      const oldStreak = this.state.streak;
      this.state.streak = 0;
      this.events.emit('streakBroken', { oldStreak });
    }

    // Expire old challenge if exists
    if (this.state.currentChallenge && this.state.currentChallenge.status === 'active') {
      this.state.currentChallenge.status = 'expired';
      this.events.emit('challengeExpired', { challenge: this.state.currentChallenge });
    }

    // Generate new challenge
    const newChallenge = this.generateChallenge();
    this.state.currentChallenge = newChallenge;
    this.state.completedToday = false;
    this.state.lastResetDate = currentDate;

    this.events.emit('challengeGenerated', { challenge: newChallenge });
    this.config.onNewDay(newChallenge);

    return true;
  }

  private generateChallenge(): DailyChallenge {
    // Select random template (weighted by difficulty)
    const templates = this.config.templates;
    const template =
      templates[Math.floor(Math.random() * templates.length)] ?? DEFAULT_TEMPLATES[0];

    const resetTime = this.getNextResetTime();

    if (!template) {
      throw new Error('No challenge templates available');
    }

    return {
      id: generateId(),
      userId: this.state.userId,
      title: template.title,
      description: template.description,
      difficulty: template.difficulty,
      targetValue: template.targetValue,
      currentValue: 0,
      reward: template.reward,
      status: 'active',
      expiresAt: resetTime,
      createdAt: now(),
      updatedAt: now(),
    };
  }

  private getCurrentDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0] ?? ''; // YYYY-MM-DD
  }

  private getYesterdayDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0] ?? '';
  }

  private getNextResetTime(): number {
    const resetDate = new Date();
    resetDate.setHours(this.config.resetHour, 0, 0, 0);
    resetDate.setDate(resetDate.getDate() + 1);
    return resetDate.getTime();
  }

  toJSON(): DailyChallengeState {
    return { ...this.state };
  }

  static fromJSON(
    config: DailyChallengeConfig,
    state: DailyChallengeState
  ): DailyChallengeServiceImpl {
    const service = new DailyChallengeServiceImpl(config);
    service.state = state;

    // Check if need to reset on load
    service.checkReset();

    return service;
  }
}

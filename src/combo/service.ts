import { createEventEmitter, generateId, now } from '@questro/core';
import type { ComboService, ComboConfig, ComboState, ComboAction, ComboEvents } from './types';

const MILESTONES = [5, 10, 25, 50, 100];

export class ComboServiceImpl implements ComboService {
  private state: ComboState;
  private config: Required<ComboConfig>;
  public readonly events = createEventEmitter<ComboEvents>();
  private timeoutId?: ReturnType<typeof setTimeout>;

  constructor(config: ComboConfig) {
    this.config = {
      userId: config.userId,
      timeWindow: config.timeWindow ?? 5000,
      multiplierIncrement: config.multiplierIncrement ?? 0.1,
      maxMultiplier: config.maxMultiplier ?? 5.0,
      minComboForMultiplier: config.minComboForMultiplier ?? 3,
      onComboBreak: config.onComboBreak ?? (() => {}),
      onComboMilestone: config.onComboMilestone ?? (() => {}),
    };

    this.state = {
      userId: config.userId,
      currentCombo: 0,
      maxCombo: 0,
      multiplier: 1.0,
      lastActionTime: 0,
      actions: [],
      isActive: false,
    };
  }

  getCurrentCombo(): number {
    return this.state.currentCombo;
  }

  getMaxCombo(): number {
    return this.state.maxCombo;
  }

  getMultiplier(): number {
    return this.state.multiplier;
  }

  isActive(): boolean {
    return this.state.isActive;
  }

  addAction(action: string): ComboAction {
    const currentTime = now();

    // Check if combo timed out
    if (this.state.lastActionTime > 0) {
      const timeSinceLastAction = currentTime - this.state.lastActionTime;
      if (timeSinceLastAction > this.config.timeWindow) {
        this.breakCombo();
      }
    }

    // Increment combo
    this.state.currentCombo += 1;
    this.state.lastActionTime = currentTime;
    this.state.isActive = true;

    // Update max combo
    if (this.state.currentCombo > this.state.maxCombo) {
      this.state.maxCombo = this.state.currentCombo;
    }

    // Calculate multiplier
    const oldMultiplier = this.state.multiplier;
    if (this.state.currentCombo >= this.config.minComboForMultiplier) {
      const bonusCombo = this.state.currentCombo - this.config.minComboForMultiplier + 1;
      this.state.multiplier = Math.min(
        1.0 + bonusCombo * this.config.multiplierIncrement,
        this.config.maxMultiplier
      );
    } else {
      this.state.multiplier = 1.0;
    }

    // Create action record
    const comboAction: ComboAction = {
      id: generateId(),
      userId: this.state.userId,
      action,
      timestamp: currentTime,
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    this.state.actions.push(comboAction);

    // Keep only recent actions (last 100)
    if (this.state.actions.length > 100) {
      this.state.actions = this.state.actions.slice(-100);
    }

    // Emit events
    this.events.emit('comboIncreased', {
      combo: this.state.currentCombo,
      multiplier: this.state.multiplier,
    });

    if (oldMultiplier !== this.state.multiplier) {
      this.events.emit('multiplierChanged', {
        oldMultiplier,
        newMultiplier: this.state.multiplier,
      });
    }

    // Check milestones
    const milestone = MILESTONES.find((m) => m === this.state.currentCombo);
    if (milestone) {
      this.events.emit('comboMilestone', {
        combo: this.state.currentCombo,
        multiplier: this.state.multiplier,
        milestone,
      });
      this.config.onComboMilestone(this.state.currentCombo, this.state.multiplier);
    }

    // Setup auto-timeout
    this.setupTimeout();

    return comboAction;
  }

  checkTimeout(): boolean {
    if (!this.state.isActive || this.state.lastActionTime === 0) {
      return false;
    }

    const timeSinceLastAction = now() - this.state.lastActionTime;
    if (timeSinceLastAction > this.config.timeWindow) {
      this.breakCombo();
      return true;
    }

    return false;
  }

  reset(): void {
    this.breakCombo();
    this.state.maxCombo = 0;
    this.state.actions = [];
  }

  private breakCombo(): void {
    if (this.state.currentCombo === 0) return;

    const oldCombo = this.state.currentCombo;
    const oldMultiplier = this.state.multiplier;

    this.state.currentCombo = 0;
    this.state.multiplier = 1.0;
    this.state.isActive = false;
    this.state.lastActionTime = 0;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.events.emit('comboBroken', {
      combo: oldCombo,
      multiplier: oldMultiplier,
    });

    this.config.onComboBreak(oldCombo, oldMultiplier);
  }

  private setupTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.checkTimeout();
    }, this.config.timeWindow + 100);
  }

  toJSON(): ComboState {
    return { ...this.state };
  }

  static fromJSON(config: ComboConfig, state: ComboState): ComboServiceImpl {
    const service = new ComboServiceImpl(config);
    service.state = state;

    // Restart timeout if combo is active
    if (state.isActive && state.lastActionTime > 0) {
      service.setupTimeout();
    }

    return service;
  }
}

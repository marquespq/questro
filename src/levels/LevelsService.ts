import type { LevelConfig, LevelData, LevelsState, LevelUpEvent, XPTransaction } from './types';
import {
  calculateXPForLevel,
  calculateLevelFromXP,
  calculateLevelProgress,
} from './utils/formulas';

export class LevelsService {
  private state: LevelsState;
  private config: Required<
    Omit<LevelConfig, 'customFormula' | 'onLevelUp' | 'onXPGain' | 'maxLevel'>
  > & {
    customFormula?: LevelConfig['customFormula'];
    onLevelUp?: LevelConfig['onLevelUp'];
    onXPGain?: LevelConfig['onXPGain'];
    maxLevel?: number;
  };
  private listeners: Set<() => void> = new Set();

  constructor(config: LevelConfig, initialState?: LevelsState) {
    this.config = {
      userId: config.userId,
      formula: config.formula || 'linear',
      baseXP: config.baseXP || 100,
      scalingFactor: config.scalingFactor || (config.formula === 'rpg' ? 1.1 : 1.5),
      customFormula: config.customFormula,
      onLevelUp: config.onLevelUp,
      onXPGain: config.onXPGain,
      maxLevel: config.maxLevel,
    };

    this.state = initialState || this.createInitialState();
  }

  private createInitialState(): LevelsState {
    return {
      userId: this.config.userId,
      totalXP: 0,
      level: 1,
      levelHistory: [],
      xpHistory: [],
      lastUpdated: Date.now(),
    };
  }

  /**
   * Get current level data
   */
  getLevelData(): LevelData {
    const { totalXP, level } = this.state;
    const { formula, baseXP, scalingFactor, customFormula, maxLevel } = this.config;

    const xpForCurrentLevel = calculateXPForLevel(
      level,
      formula,
      baseXP,
      scalingFactor,
      customFormula
    );

    const xpForNextLevel =
      maxLevel && level >= maxLevel
        ? xpForCurrentLevel
        : calculateXPForLevel(level + 1, formula, baseXP, scalingFactor, customFormula);

    const { currentXP, xpToLevelUp, progress } = calculateLevelProgress(
      totalXP,
      level,
      formula,
      baseXP,
      scalingFactor,
      customFormula
    );

    return {
      level,
      currentXP,
      totalXP,
      xpForCurrentLevel,
      xpForNextLevel,
      xpToLevelUp,
      progress: maxLevel && level >= maxLevel ? 100 : progress,
    };
  }

  /**
   * Add XP
   */
  addXP(amount: number, reason?: string): XPTransaction {
    if (amount <= 0) {
      throw new Error('XP amount must be positive');
    }

    const levelBefore = this.state.level;

    this.state.totalXP += amount;
    this.state.lastUpdated = Date.now();

    // Recalculate level
    const newLevel = calculateLevelFromXP(
      this.state.totalXP,
      this.config.formula,
      this.config.baseXP,
      this.config.scalingFactor,
      this.config.customFormula,
      this.config.maxLevel
    );

    // Create transaction
    const transaction: XPTransaction = {
      id: `xp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount,
      balance: this.state.totalXP,
      reason,
      timestamp: Date.now(),
      levelBefore,
      levelAfter: newLevel,
    };

    this.state.xpHistory.push(transaction);

    // Check for level up
    if (newLevel > levelBefore) {
      this.state.level = newLevel;
      this.handleLevelUp(levelBefore, newLevel);
    }

    // Trigger callback
    if (this.config.onXPGain) {
      this.config.onXPGain(amount, this.state.totalXP);
    }

    this.notifyListeners();
    return transaction;
  }

  /**
   * Remove XP (can't go below 0)
   */
  removeXP(amount: number, reason?: string): XPTransaction {
    if (amount <= 0) {
      throw new Error('XP amount must be positive');
    }

    const levelBefore = this.state.level;

    this.state.totalXP = Math.max(0, this.state.totalXP - amount);
    this.state.lastUpdated = Date.now();

    // Recalculate level
    const newLevel = calculateLevelFromXP(
      this.state.totalXP,
      this.config.formula,
      this.config.baseXP,
      this.config.scalingFactor,
      this.config.customFormula,
      this.config.maxLevel
    );

    this.state.level = newLevel;

    // Create transaction
    const transaction: XPTransaction = {
      id: `xp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: -amount,
      balance: this.state.totalXP,
      reason,
      timestamp: Date.now(),
      levelBefore,
      levelAfter: newLevel,
    };

    this.state.xpHistory.push(transaction);
    this.notifyListeners();

    return transaction;
  }

  /**
   * Set level directly (updates totalXP accordingly)
   */
  setLevel(level: number): void {
    if (level < 1) {
      throw new Error('Level must be at least 1');
    }

    if (this.config.maxLevel && level > this.config.maxLevel) {
      throw new Error(`Level cannot exceed max level of ${this.config.maxLevel}`);
    }

    const levelBefore = this.state.level;
    this.state.level = level;

    // Set XP to minimum for this level
    this.state.totalXP = calculateXPForLevel(
      level,
      this.config.formula,
      this.config.baseXP,
      this.config.scalingFactor,
      this.config.customFormula
    );

    this.state.lastUpdated = Date.now();

    if (level > levelBefore) {
      this.handleLevelUp(levelBefore, level);
    }

    this.notifyListeners();
  }

  /**
   * Reset to level 1
   */
  reset(): void {
    this.state = this.createInitialState();
    this.notifyListeners();
  }

  /**
   * Get XP required for a specific level
   */
  getXPForLevel(level: number): number {
    return calculateXPForLevel(
      level,
      this.config.formula,
      this.config.baseXP,
      this.config.scalingFactor,
      this.config.customFormula
    );
  }

  /**
   * Get level from XP amount
   */
  getLevelFromXP(xp: number): number {
    return calculateLevelFromXP(
      xp,
      this.config.formula,
      this.config.baseXP,
      this.config.scalingFactor,
      this.config.customFormula,
      this.config.maxLevel
    );
  }

  /**
   * Get state for persistence
   */
  getState(): LevelsState {
    return { ...this.state };
  }

  /**
   * Get XP history
   */
  getXPHistory(): XPTransaction[] {
    return [...this.state.xpHistory];
  }

  /**
   * Get level up history
   */
  getLevelHistory(): LevelUpEvent[] {
    return [...this.state.levelHistory];
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private handleLevelUp(previousLevel: number, newLevel: number): void {
    const event: LevelUpEvent = {
      previousLevel,
      newLevel,
      totalXP: this.state.totalXP,
      timestamp: Date.now(),
    };

    this.state.levelHistory.push(event);

    if (this.config.onLevelUp) {
      this.config.onLevelUp(event);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

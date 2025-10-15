import type { Entity, EntityId, EventEmitter } from '@questro/core';

/**
 * Combo action entry
 */
export interface ComboAction extends Entity {
  userId: EntityId;
  action: string;
  timestamp: number;
}

/**
 * Combo state
 */
export interface ComboState {
  userId: EntityId;
  currentCombo: number;
  maxCombo: number;
  multiplier: number;
  lastActionTime: number;
  actions: ComboAction[];
  isActive: boolean;
}

/**
 * Combo configuration
 */
export interface ComboConfig {
  userId: EntityId;
  /**
   * Time window in ms to keep combo active
   * @default 5000 (5 seconds)
   */
  timeWindow?: number;
  /**
   * Base multiplier per combo
   * @default 0.1 (10% per combo)
   */
  multiplierIncrement?: number;
  /**
   * Max multiplier cap
   * @default 5.0 (500%)
   */
  maxMultiplier?: number;
  /**
   * Min combo count to start multiplier
   * @default 3
   */
  minComboForMultiplier?: number;
  /**
   * Callback when combo is broken
   */
  onComboBreak?: (combo: number, multiplier: number) => void;
  /**
   * Callback when combo milestone reached
   */
  onComboMilestone?: (combo: number, multiplier: number) => void;
}

/**
 * Combo events
 */
export type ComboEvents = {
  comboIncreased: { combo: number; multiplier: number };
  comboBroken: { combo: number; multiplier: number };
  comboMilestone: { combo: number; multiplier: number; milestone: number };
  multiplierChanged: { oldMultiplier: number; newMultiplier: number };
  [key: string]: unknown;
};

/**
 * Combo service interface
 */
export interface ComboService {
  getCurrentCombo(): number;
  getMaxCombo(): number;
  getMultiplier(): number;
  isActive(): boolean;
  addAction(action: string): ComboAction;
  reset(): void;
  checkTimeout(): boolean;
  events: EventEmitter<ComboEvents>;
  toJSON(): ComboState;
}

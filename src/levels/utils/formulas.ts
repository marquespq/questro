import type { LevelFormula } from '../types';

/**
 * XP formulas for different progression curves
 */
export const XP_FORMULAS: Record<
  Exclude<LevelFormula, 'custom'>,
  (level: number, baseXP: number, scalingFactor: number) => number
> = {
  /**
   * Linear progression: 100, 200, 300, 400...
   * Simple and predictable
   */
  linear: (level: number, baseXP: number) => {
    return baseXP * level;
  },

  /**
   * Exponential progression: 100, 150, 225, 337...
   * Gets harder quickly
   */
  exponential: (level: number, baseXP: number, scalingFactor: number) => {
    return Math.floor(baseXP * Math.pow(scalingFactor, level - 1));
  },

  /**
   * Fibonacci-like progression: 100, 150, 250, 400, 650...
   * Natural feeling progression
   */
  fibonacci: (level: number, baseXP: number) => {
    if (level <= 2) return baseXP;

    let prev = baseXP;
    let curr = baseXP;

    for (let i = 3; i <= level; i++) {
      const next = prev + curr;
      prev = curr;
      curr = next;
    }

    return curr;
  },

  /**
   * RPG-style progression: 100, 110, 121, 133...
   * Common in games, balanced growth
   */
  rpg: (level: number, baseXP: number, scalingFactor: number) => {
    return Math.floor(baseXP * Math.pow(scalingFactor, level - 1));
  },
};

/**
 * Calculate XP required to reach a specific level from level 1
 *
 * @param level - Target level
 * @param formula - Formula type
 * @param baseXP - Base XP for level 2
 * @param scalingFactor - Scaling factor for exponential/rpg
 * @param customFormula - Custom formula function
 * @returns Total XP required from level 1
 */
export function calculateXPForLevel(
  level: number,
  formula: LevelFormula,
  baseXP: number = 100,
  scalingFactor: number = 1.5,
  customFormula?: (level: number) => number
): number {
  // Level 1 = 0 XP
  if (level <= 1) return 0;

  // Use custom formula if provided
  if (formula === 'custom' && customFormula) {
    let total = 0;
    for (let i = 2; i <= level; i++) {
      total += customFormula(i);
    }
    return total;
  }

  // Use built-in formula
  const formulaFn = XP_FORMULAS[formula as Exclude<LevelFormula, 'custom'>];
  if (!formulaFn) {
    throw new Error(`Unknown formula: ${formula}`);
  }

  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += formulaFn(i, baseXP, scalingFactor);
  }

  return total;
}

/**
 * Calculate current level from total XP
 *
 * @param totalXP - Total XP accumulated
 * @param formula - Formula type
 * @param baseXP - Base XP for level 2
 * @param scalingFactor - Scaling factor
 * @param customFormula - Custom formula function
 * @param maxLevel - Maximum level cap
 * @returns Current level
 */
export function calculateLevelFromXP(
  totalXP: number,
  formula: LevelFormula,
  baseXP: number = 100,
  scalingFactor: number = 1.5,
  customFormula?: (level: number) => number,
  maxLevel?: number
): number {
  if (totalXP <= 0) return 1;

  let level = 1;
  let xpForNextLevel = calculateXPForLevel(
    level + 1,
    formula,
    baseXP,
    scalingFactor,
    customFormula
  );

  while (totalXP >= xpForNextLevel) {
    level++;

    // Check max level
    if (maxLevel && level >= maxLevel) {
      return maxLevel;
    }

    xpForNextLevel = calculateXPForLevel(level + 1, formula, baseXP, scalingFactor, customFormula);
  }

  return level;
}

/**
 * Calculate XP progress within current level
 *
 * @param totalXP - Total XP accumulated
 * @param currentLevel - Current level
 * @param formula - Formula type
 * @param baseXP - Base XP
 * @param scalingFactor - Scaling factor
 * @param customFormula - Custom formula
 * @returns Object with currentXP, xpToLevelUp, and progress percentage
 */
export function calculateLevelProgress(
  totalXP: number,
  currentLevel: number,
  formula: LevelFormula,
  baseXP: number = 100,
  scalingFactor: number = 1.5,
  customFormula?: (level: number) => number
): {
  currentXP: number;
  xpToLevelUp: number;
  progress: number;
} {
  const xpForCurrentLevel = calculateXPForLevel(
    currentLevel,
    formula,
    baseXP,
    scalingFactor,
    customFormula
  );

  const xpForNextLevel = calculateXPForLevel(
    currentLevel + 1,
    formula,
    baseXP,
    scalingFactor,
    customFormula
  );

  const currentXP = totalXP - xpForCurrentLevel;
  const xpToLevelUp = xpForNextLevel - xpForCurrentLevel;
  const progress = Math.min(100, Math.floor((currentXP / xpToLevelUp) * 100));

  return {
    currentXP,
    xpToLevelUp,
    progress,
  };
}

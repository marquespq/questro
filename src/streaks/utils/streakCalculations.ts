import type { StreakType, StreakEntry } from '../types';

/**
 * Check if streak is still active based on last activity
 */
export function isStreakActive(
  lastActivity: number | null,
  type: StreakType,
  graceHours: number = 3
): boolean {
  if (!lastActivity) return false;

  const now = Date.now();
  const timeDiff = now - lastActivity;
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  switch (type) {
    case 'daily': {
      // Check if last activity was yesterday or today (with grace period)
      const lastDate = new Date(lastActivity);
      const currentDate = new Date(now);

      // Reset both to midnight for comparison
      lastDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Active if today or yesterday (within grace period)
      if (daysDiff === 0) return true;
      if (daysDiff === 1) {
        // Check if still in grace period (hours since midnight)
        const hoursSinceMidnight = new Date(now).getHours() + new Date(now).getMinutes() / 60;
        return hoursSinceMidnight <= graceHours;
      }

      return false;
    }

    case 'weekly': {
      const days = hoursDiff / 24;
      return days <= 7 + graceHours / 24;
    }

    case 'monthly': {
      const lastDate = new Date(lastActivity);
      const currentDate = new Date(now);

      // Same month or last month within grace period
      if (
        lastDate.getMonth() === currentDate.getMonth() &&
        lastDate.getFullYear() === currentDate.getFullYear()
      ) {
        return true;
      }

      // Check if last month and still in grace period
      const lastMonth = new Date(currentDate);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      if (
        lastDate.getMonth() === lastMonth.getMonth() &&
        lastDate.getFullYear() === lastMonth.getFullYear()
      ) {
        const daysSinceMonthStart = currentDate.getDate();
        return daysSinceMonthStart <= Math.ceil(graceHours / 24);
      }

      return false;
    }
  }
}

/**
 * Check if activity already recorded for current period
 */
export function hasActivityToday(history: StreakEntry[], type: StreakType): boolean {
  if (history.length === 0) return false;

  const now = new Date();
  const lastEntry = history[history.length - 1];
  if (!lastEntry) return false;

  const lastDate = new Date(lastEntry.timestamp);

  switch (type) {
    case 'daily': {
      return (
        lastDate.getFullYear() === now.getFullYear() &&
        lastDate.getMonth() === now.getMonth() &&
        lastDate.getDate() === now.getDate()
      );
    }

    case 'weekly': {
      // Check if same week (Monday to Sunday)
      const getWeekNumber = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
      };

      return (
        getWeekNumber(lastDate) === getWeekNumber(now) &&
        lastDate.getFullYear() === now.getFullYear()
      );
    }

    case 'monthly': {
      return lastDate.getFullYear() === now.getFullYear() && lastDate.getMonth() === now.getMonth();
    }
  }
}

/**
 * Calculate streak from history
 */
export function calculateStreak(history: StreakEntry[], type: StreakType): number {
  if (history.length === 0) return 0;

  const sortedHistory = [...history]
    .filter((entry) => entry.completed)
    .sort((a, b) => b.timestamp - a.timestamp);

  if (sortedHistory.length === 0) return 0;

  let streak = 0;
  const now = new Date();

  for (let i = 0; i < sortedHistory.length; i++) {
    const entry = sortedHistory[i];
    if (!entry) continue;

    const entryDate = new Date(entry.timestamp);

    if (i === 0) {
      // First entry - check if recent enough
      if (!isInCurrentPeriod(entryDate, now, type)) {
        return 0; // Streak is broken
      }
      streak = 1;
      continue;
    }

    const prevEntry = sortedHistory[i - 1];
    if (!prevEntry) break;

    const prevDate = new Date(prevEntry.timestamp);

    if (isConsecutivePeriod(entryDate, prevDate, type)) {
      streak++;
    } else {
      break; // Streak is broken
    }
  }

  return streak;
}

/**
 * Check if date is in current period
 */
function isInCurrentPeriod(date: Date, now: Date, type: StreakType): boolean {
  switch (type) {
    case 'daily':
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        (date.getDate() === now.getDate() || date.getDate() === now.getDate() - 1)
      );

    case 'weekly': {
      const weeksDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 7));
      return weeksDiff <= 1;
    }

    case 'monthly':
      return (
        (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) ||
        (date.getFullYear() === now.getFullYear() - 1 &&
          date.getMonth() === 11 &&
          now.getMonth() === 0) ||
        date.getMonth() === now.getMonth() - 1
      );
  }
}

/**
 * Check if two dates are consecutive periods
 */
function isConsecutivePeriod(date1: Date, date2: Date, type: StreakType): boolean {
  switch (type) {
    case 'daily': {
      const daysDiff = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff === 1;
    }

    case 'weekly': {
      const weeksDiff = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24 * 7));
      return weeksDiff === 1;
    }

    case 'monthly': {
      const monthsDiff =
        (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
      return monthsDiff === 1;
    }
  }
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get date string for current period
 */
export function getCurrentPeriodKey(type: StreakType): string {
  const now = new Date();

  switch (type) {
    case 'daily':
      return formatDate(now);

    case 'weekly': {
      // Return Monday of current week
      const monday = new Date(now);
      const day = monday.getDay();
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
      monday.setDate(diff);
      return formatDate(monday);
    }

    case 'monthly':
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
}

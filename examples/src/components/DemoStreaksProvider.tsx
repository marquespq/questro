import { StreaksProvider } from 'questro/streaks';
import { useMemo } from 'react';
import type { StorageAdapter } from 'questro';
import type { StreaksState } from 'questro/streaks';

// Custom storage adapter that provides pre-populated demo data
class DemoStreaksStorage implements StorageAdapter<StreaksState> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  async get(key: string): Promise<StreaksState | null> {
    const stored = localStorage.getItem(`${this.key}:${key}`);

    if (stored) {
      const data = JSON.parse(stored);
      // If data exists and has valid completed entries, return it
      if (data.history?.some((h: { completed: boolean }) => h.completed)) {
        return data;
      }
    }

    // Otherwise, return demo data
    return this.createDemoData();
  }

  async set(key: string, value: StreaksState): Promise<void> {
    localStorage.setItem(`${this.key}:${key}`, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(`${this.key}:${key}`);
  }

  async clear(): Promise<void> {
    // Clear only our keys
    const keys = Object.keys(localStorage);
    keys.forEach((k) => {
      if (k.startsWith(this.key)) {
        localStorage.removeItem(k);
      }
    });
  }

  private createDemoData(): StreaksState {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const history = [];

    // Create 7-day streak ending yesterday
    for (let i = 7; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      history.push({
        date: date.toISOString().split('T')[0],
        completed: true,
        timestamp: date.getTime(),
        freezeUsed: false,
      });
    }

    // Add some old successful days (1, 2, 3 of month)
    for (let day = 1; day <= 3; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      if (date < new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        history.push({
          date: date.toISOString().split('T')[0],
          completed: true,
          timestamp: date.getTime(),
          freezeUsed: false,
        });
      }
    }

    history.sort((a, b) => a.timestamp - b.timestamp);

    return {
      userId: 'demo-user',
      type: 'daily',
      current: 7,
      longest: 7,
      freezes: 3,
      history: history,
      lastActivity: history[history.length - 1].timestamp,
      startDate: history[history.length - 7]?.timestamp || history[0].timestamp,
      lastUpdated: Date.now(),
      milestonesReached: [],
    };
  }
}

export function DemoStreaksProvider({ children }: { children: React.ReactNode }) {
  const storage = useMemo(() => new DemoStreaksStorage('questro_demo'), []);

  return (
    <StreaksProvider
      config={{
        userId: 'demo-user',
        type: 'daily',
        maxFreezes: 3,
      }}
      storage={storage}
    >
      {children}
    </StreaksProvider>
  );
}

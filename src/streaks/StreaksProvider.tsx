import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import type {
  StreakConfig,
  StreakData,
  StreaksState,
  StreakEntry,
  CalendarDay,
} from './types';
import { StreaksService } from './StreaksService';
import type { StorageAdapter } from '../core/types';
import { LocalStorageAdapter } from '../core/storage-adapters';

type StreaksContextValue = {
  // State
  streakData: StreakData;
  history: StreakEntry[];

  // Actions
  recordActivity: () => void;
  useFreeze: () => boolean;
  reset: () => void;

  // Computed
  getCalendarData: (month: number, year: number) => CalendarDay[];
};

const StreaksContext = createContext<StreaksContextValue | null>(null);

export type StreaksProviderProps = {
  children: React.ReactNode;
  config: StreakConfig;
  storage?: StorageAdapter<StreaksState>;
};

export function StreaksProvider({ children, config, storage }: StreaksProviderProps) {
  const storageAdapter = useMemo(
    () => storage || new LocalStorageAdapter<StreaksState>(),
    [storage]
  );

  const storageKey = `questro_streaks_${config.userId}_${config.type || 'daily'}`;

  const [service, setService] = useState<StreaksService | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [history, setHistory] = useState<StreakEntry[]>([]);

  // Initialize service with async storage
  useEffect(() => {
    let mounted = true;

    const initService = async () => {
      const savedState = await storageAdapter.get(storageKey);
      
      if (!mounted) return;

      const newService = new StreaksService(config, savedState || undefined);
      setService(newService);
      setStreakData(newService.getStreakData());
      setHistory(newService.getHistory());
    };

    initService();

    return () => {
      mounted = false;
    };
  }, [config, storageAdapter, storageKey]);

  // Subscribe to service changes
  useEffect(() => {
    if (!service) return;

    const unsubscribe = service.subscribe(() => {
      setStreakData(service.getStreakData());
      setHistory(service.getHistory());

      // Persist to storage (fire and forget)
      storageAdapter.set(storageKey, service.getState());
    });

    return unsubscribe;
  }, [service, storageAdapter, storageKey]);

  const recordActivity = useCallback(() => {
    service?.recordActivity();
  }, [service]);

  const useFreeze = useCallback(() => {
    return service?.useFreeze() ?? false;
  }, [service]);

  const reset = useCallback(async () => {
    if (!service) return;
    service.reset();
    await storageAdapter.remove(storageKey);
  }, [service, storageAdapter, storageKey]);

  const getCalendarData = useCallback(
    (month: number, year: number) => {
      return service?.getCalendarData(month, year) ?? [];
    },
    [service]
  );

  const value = useMemo<StreaksContextValue | null>(
    () => {
      if (!service || !streakData) return null;

      return {
        streakData,
        history,
        recordActivity,
        useFreeze,
        reset,
        getCalendarData,
      };
    },
    [service, streakData, history, recordActivity, useFreeze, reset, getCalendarData]
  );

  // Don't render until service is initialized
  if (!value) {
    return null;
  }

  return <StreaksContext.Provider value={value}>{children}</StreaksContext.Provider>;
}

export function useStreaks(): StreaksContextValue {
  const context = React.useContext(StreaksContext);
  
  if (!context) {
    throw new Error('useStreaks must be used within a StreaksProvider');
  }
  
  return context;
}

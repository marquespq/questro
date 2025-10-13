import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { LevelConfig, LevelData, LevelsState, XPTransaction, LevelUpEvent } from './types';
import { LevelsService } from './LevelsService';
import type { StorageAdapter } from '../core/types';
import { LocalStorageAdapter } from '../core/storage-adapters';

type LevelsContextValue = {
  // State
  levelData: LevelData;
  xpHistory: XPTransaction[];
  levelHistory: LevelUpEvent[];

  // Actions
  addXP: (amount: number, reason?: string) => void;
  removeXP: (amount: number, reason?: string) => void;
  setLevel: (level: number) => void;
  reset: () => void;

  // Computed
  getXPForLevel: (level: number) => number;
  getLevelFromXP: (xp: number) => number;
};

const LevelsContext = createContext<LevelsContextValue | null>(null);

export type LevelsProviderProps = {
  children: React.ReactNode;
  config: LevelConfig;
  storage?: StorageAdapter<LevelsState>;
};

export function LevelsProvider({ children, config, storage }: LevelsProviderProps) {
  const storageAdapter = useMemo(
    () => storage || new LocalStorageAdapter<LevelsState>(),
    [storage]
  );

  const storageKey = `questro_levels_${config.userId}`;

  const [service, setService] = useState<LevelsService | null>(null);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [xpHistory, setXPHistory] = useState<XPTransaction[]>([]);
  const [levelHistory, setLevelHistory] = useState<LevelUpEvent[]>([]);

  // Initialize service with async storage
  useEffect(() => {
    let mounted = true;

    const initService = async () => {
      const savedState = await storageAdapter.get(storageKey);

      if (!mounted) return;

      const newService = new LevelsService(config, savedState || undefined);
      setService(newService);
      setLevelData(newService.getLevelData());
      setXPHistory(newService.getXPHistory());
      setLevelHistory(newService.getLevelHistory());
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
      setLevelData(service.getLevelData());
      setXPHistory(service.getXPHistory());
      setLevelHistory(service.getLevelHistory());

      // Persist to storage (fire and forget)
      storageAdapter.set(storageKey, service.getState());
    });

    return unsubscribe;
  }, [service, storageAdapter, storageKey]);

  const addXP = useCallback(
    (amount: number, reason?: string) => {
      service?.addXP(amount, reason);
    },
    [service]
  );

  const removeXP = useCallback(
    (amount: number, reason?: string) => {
      service?.removeXP(amount, reason);
    },
    [service]
  );

  const setLevel = useCallback(
    (level: number) => {
      service?.setLevel(level);
    },
    [service]
  );

  const reset = useCallback(async () => {
    if (!service) return;
    service.reset();
    await storageAdapter.remove(storageKey);
  }, [service, storageAdapter, storageKey]);

  const getXPForLevel = useCallback(
    (level: number) => {
      return service?.getXPForLevel(level) ?? 0;
    },
    [service]
  );

  const getLevelFromXP = useCallback(
    (xp: number) => {
      return service?.getLevelFromXP(xp) ?? 1;
    },
    [service]
  );

  const value = useMemo<LevelsContextValue | null>(() => {
    if (!service || !levelData) return null;

    return {
      levelData,
      xpHistory,
      levelHistory,
      addXP,
      removeXP,
      setLevel,
      reset,
      getXPForLevel,
      getLevelFromXP,
    };
  }, [
    service,
    levelData,
    xpHistory,
    levelHistory,
    addXP,
    removeXP,
    setLevel,
    reset,
    getXPForLevel,
    getLevelFromXP,
  ]);

  // Don't render until service is initialized
  if (!value) {
    return null;
  }

  return <LevelsContext.Provider value={value}>{children}</LevelsContext.Provider>;
}

export function useLevels(): LevelsContextValue {
  const context = React.useContext(LevelsContext);

  if (!context) {
    throw new Error('useLevels must be used within a LevelsProvider');
  }

  return context;
}

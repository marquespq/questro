import { createContext, useContext, useMemo, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { StorageAdapter } from '@questro/core';
import { MemoryStorageAdapter } from '@questro/core';
import type { DailyChallengeService, DailyChallengeConfig, DailyChallengeState } from './types';
import { DailyChallengeServiceImpl } from './service';

interface DailyChallengeProviderProps {
  children: ReactNode;
  config: DailyChallengeConfig;
  storage?: StorageAdapter<DailyChallengeState>;
  storageKey?: string;
}

const DailyChallengeContext = createContext<DailyChallengeService | null>(null);

export function DailyChallengeProvider({
  children,
  config,
  storage = new MemoryStorageAdapter<DailyChallengeState>(),
  storageKey = `daily-challenge:${config.userId}`,
}: DailyChallengeProviderProps) {
  const [isLoading, setIsLoading] = useState(true);

  const service = useMemo(() => {
    return new DailyChallengeServiceImpl(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.userId]);

  // Load state from storage
  useEffect(() => {
    let mounted = true;

    const loadState = async () => {
      try {
        const savedState = await storage.get(storageKey);
        if (savedState && mounted) {
          Object.assign(service, DailyChallengeServiceImpl.fromJSON(config, savedState));
        }
      } catch (error) {
        console.error('Failed to load daily challenge state:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadState();

    return () => {
      mounted = false;
    };
  }, [storage, storageKey, config, service]);

  // Persist state on changes
  useEffect(() => {
    if (isLoading) return;

    const unsubscribeProgress = service.events.on('progressUpdated', async () => {
      try {
        await storage.set(storageKey, service.toJSON());
      } catch (error) {
        console.error('Failed to save daily challenge state:', error);
      }
    });

    const unsubscribeComplete = service.events.on('challengeCompleted', async () => {
      try {
        await storage.set(storageKey, service.toJSON());
      } catch (error) {
        console.error('Failed to save daily challenge state:', error);
      }
    });

    return () => {
      unsubscribeProgress();
      unsubscribeComplete();
    };
  }, [service, storage, storageKey, isLoading]);

  // Auto-check reset daily
  useEffect(() => {
    if (isLoading) return;

    const checkInterval = setInterval(() => {
      service.checkReset();
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [service, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <DailyChallengeContext.Provider value={service}>{children}</DailyChallengeContext.Provider>
  );
}

export function useDailyChallengeContext(): DailyChallengeService {
  const context = useContext(DailyChallengeContext);
  if (!context) {
    throw new Error('useDailyChallengeContext must be used within a DailyChallengeProvider');
  }
  return context;
}

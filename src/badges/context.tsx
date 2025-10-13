import { createContext, useContext, useMemo, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { StorageAdapter } from '@questro/core';
import { MemoryStorageAdapter } from '@questro/core';
import type { BadgesService, BadgesConfig, BadgesState } from './types';
import { BadgesServiceImpl } from './service';
interface BadgesProviderProps {
  children: ReactNode;
  config: BadgesConfig;
  storage?: StorageAdapter<BadgesState>;
  storageKey?: string;
}
const BadgesContext = createContext<BadgesService | null>(null);
export function BadgesProvider({
  children,
  config,
  storage = new MemoryStorageAdapter<BadgesState>(),
  storageKey = `badges:${config.userId}`,
}: BadgesProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const service = useMemo(() => {
    return new BadgesServiceImpl(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.userId, config.badges]);
  // Load state from storage
  useEffect(() => {
    let mounted = true;
    const loadState = async () => {
      try {
        const savedState = await storage.get(storageKey);
        if (savedState && mounted) {
          Object.assign(service, BadgesServiceImpl.fromJSON(config, savedState));
        }
      } catch (error) {
        console.error('Failed to load badges state:', error);
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
    const unsubscribeUnlock = service.events.on('badgeUnlocked', async () => {
      try {
        await storage.set(storageKey, service.toJSON());
      } catch (error) {
        console.error('Failed to save badges state:', error);
      }
    });
    const unsubscribeProgress = service.events.on('progressUpdated', async () => {
      try {
        await storage.set(storageKey, service.toJSON());
      } catch (error) {
        console.error('Failed to save badges state:', error);
      }
    });
    return () => {
      unsubscribeUnlock();
      unsubscribeProgress();
    };
  }, [service, storage, storageKey, isLoading]);
  if (isLoading) {
    return null;
  }
  return <BadgesContext.Provider value={service}>{children}</BadgesContext.Provider>;
}
export function useBadgesContext(): BadgesService {
  const context = useContext(BadgesContext);
  if (!context) {
    throw new Error('useBadgesContext must be used within a BadgesProvider');
  }
  return context;
}

import { createContext, useContext, useMemo, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { StorageAdapter } from '@questro/core';
import { MemoryStorageAdapter } from '@questro/core';
import type { PointsService, PointsConfig, PointsState } from './types';
import { PointsServiceImpl } from './service';
interface PointsProviderProps {
  children: ReactNode;
  config: PointsConfig;
  storage?: StorageAdapter<PointsState>;
  storageKey?: string;
}
const PointsContext = createContext<PointsService | null>(null);
export function PointsProvider({
  children,
  config,
  storage = new MemoryStorageAdapter<PointsState>(),
  storageKey = `points:${config.userId}`,
}: PointsProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  // Create service instance (memoized to prevent recreation)
  // We intentionally only depend on userId to avoid recreating the service
  // when other config properties change, as that would lose state
  const service = useMemo(() => {
    return new PointsServiceImpl(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.userId]);
  // Load state from storage on mount
  useEffect(() => {
    let mounted = true;
    const loadState = async () => {
      try {
        const savedState = await storage.get(storageKey);
        if (savedState && mounted) {
          // Restore service state
          Object.assign(service, PointsServiceImpl.fromJSON(config, savedState));
        }
      } catch (error) {
        console.error('Failed to load points state:', error);
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
    const unsubscribe = service.events.on('balanceChanged', async () => {
      try {
        await storage.set(storageKey, service.toJSON());
      } catch (error) {
        console.error('Failed to save points state:', error);
      }
    });
    return unsubscribe;
  }, [service, storage, storageKey, isLoading]);
  if (isLoading) {
    return null; // Or a loading component
  }
  return <PointsContext.Provider value={service}>{children}</PointsContext.Provider>;
}
export function usePointsContext(): PointsService {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePointsContext must be used within a PointsProvider');
  }
  return context;
}

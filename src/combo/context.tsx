import { createContext, useContext, useMemo, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { StorageAdapter } from '@questro/core';
import { MemoryStorageAdapter } from '@questro/core';
import type { ComboService, ComboConfig, ComboState } from './types';
import { ComboServiceImpl } from './service';

interface ComboProviderProps {
  children: ReactNode;
  config: ComboConfig;
  storage?: StorageAdapter<ComboState>;
  storageKey?: string;
}

const ComboContext = createContext<ComboService | null>(null);

export function ComboProvider({
  children,
  config,
  storage = new MemoryStorageAdapter<ComboState>(),
  storageKey = `combo:${config.userId}`,
}: ComboProviderProps) {
  const [isLoading, setIsLoading] = useState(true);

  const service = useMemo(() => {
    return new ComboServiceImpl(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.userId]);

  // Load state from storage
  useEffect(() => {
    let mounted = true;

    const loadState = async () => {
      try {
        const savedState = await storage.get(storageKey);
        if (savedState && mounted) {
          Object.assign(service, ComboServiceImpl.fromJSON(config, savedState));
        }
      } catch (error) {
        console.error('Failed to load combo state:', error);
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

    const unsubscribe = service.events.on('comboIncreased', async () => {
      try {
        await storage.set(storageKey, service.toJSON());
      } catch (error) {
        console.error('Failed to save combo state:', error);
      }
    });

    return unsubscribe;
  }, [service, storage, storageKey, isLoading]);

  // Auto-check timeout
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      service.checkTimeout();
    }, 1000);

    return () => clearInterval(interval);
  }, [service, isLoading]);

  if (isLoading) {
    return null;
  }

  return <ComboContext.Provider value={service}>{children}</ComboContext.Provider>;
}

export function useComboContext(): ComboService {
  const context = useContext(ComboContext);
  if (!context) {
    throw new Error('useComboContext must be used within a ComboProvider');
  }
  return context;
}

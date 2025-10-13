import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { LeaderboardServiceImpl } from './service';
import type { LeaderboardEntry, LeaderboardConfig, LeaderboardService } from './types';

interface LeaderboardContextValue {
  service: LeaderboardService;
}

const LeaderboardContext = createContext<LeaderboardContextValue | null>(null);

export interface LeaderboardProviderProps {
  children: ReactNode;
  entries?: LeaderboardEntry[];
  config?: LeaderboardConfig;
}

export function LeaderboardProvider({
  children,
  entries = [],
  config = {},
}: LeaderboardProviderProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const service = useMemo(() => new LeaderboardServiceImpl(entries, config), []);

  const value = useMemo(() => ({ service }), [service]);

  return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>;
}

export function useLeaderboardContext(): LeaderboardContextValue {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboardContext must be used within LeaderboardProvider');
  }
  return context;
}

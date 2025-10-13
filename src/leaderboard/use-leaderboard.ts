import { useEffect, useState, useCallback } from 'react';
import { useLeaderboardContext } from './context';
import type { LeaderboardEntry, LeaderboardPeriod, LeaderboardMetric } from './types';
import type { EntityId } from '@questro/core';

export interface UseLeaderboardReturn {
  entries: LeaderboardEntry[];
  topEntries: (limit?: number) => LeaderboardEntry[];
  currentUserEntry?: LeaderboardEntry;
  getUserEntry: (userId: EntityId) => LeaderboardEntry | undefined;
  updateScore: (userId: EntityId, score: number, username?: string) => void;
  period: LeaderboardPeriod;
  metric: LeaderboardMetric;
  setPeriod: (period: LeaderboardPeriod) => void;
  setMetric: (metric: LeaderboardMetric) => void;
}

export function useLeaderboard(): UseLeaderboardReturn {
  const { service } = useLeaderboardContext();
  const [entries, setEntries] = useState<LeaderboardEntry[]>(service.getState().entries);
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | undefined>(
    service.getCurrentUserEntry()
  );
  const [period, setPeriodState] = useState<LeaderboardPeriod>(service.getState().period);
  const [metric, setMetricState] = useState<LeaderboardMetric>(service.getState().metric);

  useEffect(() => {
    const unsubscribe = service.on('leaderboard-updated', (state) => {
      setEntries(state.entries);
      setCurrentUserEntry(state.currentUserEntry);
      setPeriodState(state.period);
      setMetricState(state.metric);
    });

    return () => unsubscribe();
  }, [service]);

  const topEntries = useCallback(
    (limit?: number) => {
      return service.getTopEntries(limit);
    },
    [service]
  );

  const getUserEntry = useCallback(
    (userId: EntityId) => {
      return service.getUserEntry(userId);
    },
    [service]
  );

  const updateScore = useCallback(
    (userId: EntityId, score: number, username?: string) => {
      service.updateScore(userId, score, username);
    },
    [service]
  );

  const setPeriod = useCallback(
    (newPeriod: LeaderboardPeriod) => {
      service.setPeriod(newPeriod);
    },
    [service]
  );

  const setMetric = useCallback(
    (newMetric: LeaderboardMetric) => {
      service.setMetric(newMetric);
    },
    [service]
  );

  return {
    entries,
    topEntries,
    currentUserEntry,
    getUserEntry,
    updateScore,
    period,
    metric,
    setPeriod,
    setMetric,
  };
}

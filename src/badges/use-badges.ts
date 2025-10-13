import { useState, useEffect, useCallback } from 'react';
import type { EntityId } from '@questro/core';
import type { Badge, UnlockedBadge, BadgeProgress } from './types';
import { useBadgesContext } from './context';
interface UseBadgesReturn {
  allBadges: readonly Badge[];
  unlockedBadges: readonly UnlockedBadge[];
  lockedBadges: readonly Badge[];
  unlockBadge: (badgeId: EntityId) => UnlockedBadge | null;
  updateProgress: (badgeId: EntityId, value: number) => BadgeProgress;
  isBadgeUnlocked: (badgeId: EntityId) => boolean;
  getProgress: (badgeId: EntityId) => BadgeProgress | undefined;
  checkAndUnlockBadges: () => UnlockedBadge[];
  reset: () => void;
}
export function useBadges(): UseBadgesReturn {
  const service = useBadgesContext();
  const [allBadges] = useState(service.getAllBadges());
  const [unlockedBadges, setUnlockedBadges] = useState(service.getUnlockedBadges());
  const [lockedBadges, setLockedBadges] = useState(service.getLockedBadges());
  // Update state when badges are unlocked
  useEffect(() => {
    const unsubscribe = service.events.on('badgeUnlocked', () => {
      setUnlockedBadges(service.getUnlockedBadges());
      setLockedBadges(service.getLockedBadges());
    });
    return unsubscribe;
  }, [service]);
  const unlockBadge = useCallback(
    (badgeId: EntityId) => {
      return service.unlockBadge(badgeId);
    },
    [service]
  );
  const updateProgress = useCallback(
    (badgeId: EntityId, value: number) => {
      return service.updateProgress(badgeId, value);
    },
    [service]
  );
  const isBadgeUnlocked = useCallback(
    (badgeId: EntityId) => {
      return service.isBadgeUnlocked(badgeId);
    },
    [service]
  );
  const getProgress = useCallback(
    (badgeId: EntityId) => {
      return service.getProgress(badgeId);
    },
    [service]
  );
  const checkAndUnlockBadges = useCallback(() => {
    return service.checkAndUnlockBadges();
  }, [service]);
  const reset = useCallback(() => {
    service.reset();
    setUnlockedBadges(service.getUnlockedBadges());
    setLockedBadges(service.getLockedBadges());
  }, [service]);
  return {
    allBadges,
    unlockedBadges,
    lockedBadges,
    unlockBadge,
    updateProgress,
    isBadgeUnlocked,
    getProgress,
    checkAndUnlockBadges,
    reset,
  };
}


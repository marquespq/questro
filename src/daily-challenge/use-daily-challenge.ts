import { useState, useEffect, useCallback } from 'react';
import type { DailyChallenge } from './types';
import { useDailyChallengeContext } from './context';

interface UseDailyChallengeReturn {
  challenge: DailyChallenge | null;
  streak: number;
  totalCompleted: number;
  completedToday: boolean;
  timeUntilReset: number;
  progress: number;
  addProgress: (amount: number) => DailyChallenge | null;
  complete: () => DailyChallenge | null;
}

export function useDailyChallenge(): UseDailyChallengeReturn {
  const service = useDailyChallengeContext();
  const [challenge, setChallenge] = useState(service.getCurrentChallenge());
  const [streak, setStreak] = useState(service.getStreak());
  const [totalCompleted, setTotalCompleted] = useState(service.getTotalCompleted());
  const [timeUntilReset, setTimeUntilReset] = useState(service.getTimeUntilReset());

  const completedToday = challenge?.status === 'completed';
  const progress = challenge
    ? Math.min((challenge.currentValue / challenge.targetValue) * 100, 100)
    : 0;

  // Subscribe to events
  useEffect(() => {
    const unsubscribeGenerated = service.events.on(
      'challengeGenerated',
      ({ challenge: newChallenge }) => {
        setChallenge(newChallenge);
      }
    );

    const unsubscribeProgress = service.events.on(
      'progressUpdated',
      ({ challenge: updatedChallenge }) => {
        setChallenge({ ...updatedChallenge });
      }
    );

    const unsubscribeComplete = service.events.on(
      'challengeCompleted',
      ({ challenge: completedChallenge }) => {
        setChallenge({ ...completedChallenge });
        setTotalCompleted(service.getTotalCompleted());
      }
    );

    const unsubscribeStreak = service.events.on('streakIncreased', ({ streak: newStreak }) => {
      setStreak(newStreak);
    });

    const unsubscribeBreak = service.events.on('streakBroken', () => {
      setStreak(0);
    });

    return () => {
      unsubscribeGenerated();
      unsubscribeProgress();
      unsubscribeComplete();
      unsubscribeStreak();
      unsubscribeBreak();
    };
  }, [service]);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilReset(service.getTimeUntilReset());
      service.checkReset(); // Auto-reset when time comes
    }, 1000);

    return () => clearInterval(interval);
  }, [service]);

  const addProgress = useCallback(
    (amount: number) => {
      return service.addProgress(amount);
    },
    [service]
  );

  const complete = useCallback(() => {
    return service.completeChallenge();
  }, [service]);

  return {
    challenge,
    streak,
    totalCompleted,
    completedToday,
    timeUntilReset,
    progress,
    addProgress,
    complete,
  };
}

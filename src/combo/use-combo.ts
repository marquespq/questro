import { useState, useEffect, useCallback } from 'react';
import type { ComboAction } from './types';
import { useComboContext } from './context';

interface UseComboReturn {
  combo: number;
  maxCombo: number;
  multiplier: number;
  isActive: boolean;
  timeRemaining: number;
  addAction: (action: string) => ComboAction;
  reset: () => void;
}

export function useCombo(): UseComboReturn {
  const service = useComboContext();
  const [combo, setCombo] = useState(service.getCurrentCombo());
  const [maxCombo, setMaxCombo] = useState(service.getMaxCombo());
  const [multiplier, setMultiplier] = useState(service.getMultiplier());
  const [isActive, setIsActive] = useState(service.isActive());
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Subscribe to combo changes
  useEffect(() => {
    const unsubscribeIncrease = service.events.on(
      'comboIncreased',
      ({ combo: newCombo, multiplier: newMultiplier }) => {
        setCombo(newCombo);
        setMaxCombo(service.getMaxCombo());
        setMultiplier(newMultiplier);
        setIsActive(true);
      }
    );

    const unsubscribeBreak = service.events.on('comboBroken', () => {
      setCombo(0);
      setMultiplier(1.0);
      setIsActive(false);
      setTimeRemaining(0);
    });

    return () => {
      unsubscribeIncrease();
      unsubscribeBreak();
    };
  }, [service]);

  // Track time remaining (for visual countdown)
  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      // This will trigger timeout check in service
      service.checkTimeout();

      // Update time remaining display
      const state = service.toJSON();
      if (state.lastActionTime > 0) {
        const elapsed = Date.now() - state.lastActionTime;
        const remaining = Math.max(0, 5000 - elapsed); // 5s window
        setTimeRemaining(remaining);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [service, isActive]);

  const addAction = useCallback(
    (action: string) => {
      return service.addAction(action);
    },
    [service]
  );

  const reset = useCallback(() => {
    service.reset();
  }, [service]);

  return {
    combo,
    maxCombo,
    multiplier,
    isActive,
    timeRemaining,
    addAction,
    reset,
  };
}

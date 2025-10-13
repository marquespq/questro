import { useState, useEffect, useCallback } from 'react';
import type { PointReason, PointTransaction } from './types';
import { usePointsContext } from './context';
interface UsePointsReturn {
  balance: number;
  lifetime: number;
  transactions: readonly PointTransaction[];
  addPoints: (amount: number, reason: PointReason) => PointTransaction;
  subtractPoints: (amount: number, reason: PointReason) => PointTransaction;
  setBalance: (balance: number, reason: PointReason) => PointTransaction;
  reset: () => void;
}
export function usePoints(): UsePointsReturn {
  const service = usePointsContext();
  const [balance, setBalance] = useState(service.getBalance());
  const [lifetime, setLifetime] = useState(service.getLifetimePoints());
  const [transactions, setTransactions] = useState(service.getTransactions());
  // Subscribe to balance changes
  useEffect(() => {
    const unsubscribe = service.events.on('balanceChanged', ({ newBalance }) => {
      setBalance(newBalance);
      setLifetime(service.getLifetimePoints());
      setTransactions(service.getTransactions());
    });
    return unsubscribe;
  }, [service]);
  // Memoized actions
  const addPoints = useCallback(
    (amount: number, reason: PointReason) => {
      return service.addPoints(amount, reason);
    },
    [service]
  );
  const subtractPoints = useCallback(
    (amount: number, reason: PointReason) => {
      return service.subtractPoints(amount, reason);
    },
    [service]
  );
  const setBalanceAction = useCallback(
    (newBalance: number, reason: PointReason) => {
      return service.setBalance(newBalance, reason);
    },
    [service]
  );
  const reset = useCallback(() => {
    service.reset();
  }, [service]);
  return {
    balance,
    lifetime,
    transactions,
    addPoints,
    subtractPoints,
    setBalance: setBalanceAction,
    reset,
  };
}


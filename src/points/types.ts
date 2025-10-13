import type { Entity, EntityId, EventEmitter } from '@questro/core';
export interface PointReason {
  action: string;
  description?: string;
  metadata?: Record<string, unknown>;
}
export interface PointTransaction extends Entity {
  userId: EntityId;
  amount: number;
  reason: PointReason;
  balance: number; // Balance after this transaction
}
export interface PointsState {
  userId: EntityId;
  balance: number;
  transactions: PointTransaction[];
  lifetime: number; // Total points earned (never decreases)
}
export interface PointsConfig {
  userId: EntityId;
  initialBalance?: number;
  minBalance?: number;
  maxBalance?: number;
  onBalanceChange?: (balance: number) => void;
}
export type PointsEvents = {
  pointsAdded: { amount: number; reason: PointReason; newBalance: number };
  pointsSubtracted: { amount: number; reason: PointReason; newBalance: number };
  balanceChanged: { oldBalance: number; newBalance: number };
  transactionAdded: PointTransaction;
  [key: string]: unknown;
};
export interface PointsService {
  getBalance(): number;
  getLifetimePoints(): number;
  getTransactions(): readonly PointTransaction[];
  addPoints(amount: number, reason: PointReason): PointTransaction;
  subtractPoints(amount: number, reason: PointReason): PointTransaction;
  setBalance(balance: number, reason: PointReason): PointTransaction;
  reset(): void;
  events: EventEmitter<PointsEvents>;
}


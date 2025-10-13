import { createEventEmitter, generateId, now, clamp } from '@questro/core';
import type {
  PointsService,
  PointsConfig,
  PointsState,
  PointTransaction,
  PointReason,
  PointsEvents,
} from './types';
export class PointsServiceImpl implements PointsService {
  private state: PointsState;
  private config: Required<PointsConfig>;
  public readonly events = createEventEmitter<PointsEvents>();
  constructor(config: PointsConfig) {
    this.config = {
      userId: config.userId,
      initialBalance: config.initialBalance ?? 0,
      minBalance: config.minBalance ?? 0,
      maxBalance: config.maxBalance ?? Number.MAX_SAFE_INTEGER,
      onBalanceChange: config.onBalanceChange ?? (() => {}),
    };
    this.state = {
      userId: config.userId,
      balance: this.config.initialBalance,
      transactions: [],
      lifetime: this.config.initialBalance,
    };
  }
  getBalance(): number {
    return this.state.balance;
  }
  getLifetimePoints(): number {
    return this.state.lifetime;
  }
  getTransactions(): readonly PointTransaction[] {
    return [...this.state.transactions];
  }
  addPoints(amount: number, reason: PointReason): PointTransaction {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    const oldBalance = this.state.balance;
    const newBalance = clamp(
      this.state.balance + amount,
      this.config.minBalance,
      this.config.maxBalance
    );
    const transaction = this.createTransaction(amount, reason, newBalance);
    this.state.balance = newBalance;
    this.state.lifetime += amount;
    this.state.transactions.push(transaction);
    // Emit events
    this.events.emit('pointsAdded', { amount, reason, newBalance });
    this.events.emit('transactionAdded', transaction);
    this.emitBalanceChange(oldBalance, newBalance);
    return transaction;
  }
  subtractPoints(amount: number, reason: PointReason): PointTransaction {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    const oldBalance = this.state.balance;
    const newBalance = clamp(
      this.state.balance - amount,
      this.config.minBalance,
      this.config.maxBalance
    );
    const transaction = this.createTransaction(-amount, reason, newBalance);
    this.state.balance = newBalance;
    this.state.transactions.push(transaction);
    // Emit events
    this.events.emit('pointsSubtracted', { amount, reason, newBalance });
    this.events.emit('transactionAdded', transaction);
    this.emitBalanceChange(oldBalance, newBalance);
    return transaction;
  }
  setBalance(balance: number, reason: PointReason): PointTransaction {
    const oldBalance = this.state.balance;
    const newBalance = clamp(balance, this.config.minBalance, this.config.maxBalance);
    const amount = newBalance - oldBalance;
    const transaction = this.createTransaction(amount, reason, newBalance);
    this.state.balance = newBalance;
    if (amount > 0) {
      this.state.lifetime += amount;
    }
    this.state.transactions.push(transaction);
    // Emit events
    this.events.emit('transactionAdded', transaction);
    this.emitBalanceChange(oldBalance, newBalance);
    return transaction;
  }
  reset(): void {
    const oldBalance = this.state.balance;
    this.state.balance = this.config.initialBalance;
    this.state.transactions = [];
    this.state.lifetime = this.config.initialBalance;
    this.emitBalanceChange(oldBalance, this.config.initialBalance);
  }
  private createTransaction(
    amount: number,
    reason: PointReason,
    balance: number
  ): PointTransaction {
    return {
      id: generateId(),
      userId: this.state.userId,
      amount,
      reason,
      balance,
      createdAt: now(),
      updatedAt: now(),
    };
  }
  private emitBalanceChange(oldBalance: number, newBalance: number): void {
    if (oldBalance !== newBalance) {
      this.events.emit('balanceChanged', { oldBalance, newBalance });
      this.config.onBalanceChange(newBalance);
    }
  }
  // Serialization for persistence
  toJSON(): PointsState {
    return { ...this.state };
  }
  static fromJSON(config: PointsConfig, state: PointsState): PointsServiceImpl {
    const service = new PointsServiceImpl(config);
    service.state = state;
    return service;
  }
}


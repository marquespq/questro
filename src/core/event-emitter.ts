import type { EventEmitter } from './types';
export function createEventEmitter<
  TEvents extends Record<string, unknown>,
>(): EventEmitter<TEvents> {
  const listeners = new Map<keyof TEvents, Set<(data: unknown) => void>>();
  return {
    on<K extends keyof TEvents>(event: K, handler: (data: TEvents[K]) => void): () => void {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      const eventListeners = listeners.get(event);
      eventListeners?.add(handler as (data: unknown) => void);
      // Return unsubscribe function
      return () => {
        eventListeners?.delete(handler as (data: unknown) => void);
      };
    },
    emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void {
      const eventListeners = listeners.get(event);
      if (eventListeners) {
        eventListeners.forEach((handler) => {
          handler(data);
        });
      }
    },
  };
}


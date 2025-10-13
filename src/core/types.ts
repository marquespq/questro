export type EntityId = string;
export type Timestamp = number;
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };
export interface EventEmitter<TEvents extends Record<string, unknown>> {
  on<K extends keyof TEvents>(event: K, handler: (data: TEvents[K]) => void): () => void;
  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void;
}
export interface StorageAdapter<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}
export interface Entity {
  id: EntityId;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export interface User {
  id: EntityId;
  name?: string;
  metadata?: Record<string, unknown>;
}


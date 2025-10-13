import type { StorageAdapter } from './types';

export class LocalStorageAdapter<T> implements StorageAdapter<T> {
  constructor(private readonly prefix: string = 'questro') {}

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${String(error)}`);
      return null;
    }
  }

  async set(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${String(error)}`);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing from localStorage: ${String(error)}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter((key) => key.startsWith(`${this.prefix}:`));
      prefixedKeys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error(`Error clearing localStorage: ${String(error)}`);
    }
  }
}

export class SessionStorageAdapter<T> implements StorageAdapter<T> {
  constructor(private readonly prefix: string = 'questro') {}

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<T | null> {
    try {
      const item = sessionStorage.getItem(this.getKey(key));
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading from sessionStorage: ${String(error)}`);
      return null;
    }
  }

  async set(key: string, value: T): Promise<void> {
    try {
      sessionStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to sessionStorage: ${String(error)}`);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      sessionStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing from sessionStorage: ${String(error)}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(sessionStorage);
      const prefixedKeys = keys.filter((key) => key.startsWith(`${this.prefix}:`));
      prefixedKeys.forEach((key) => sessionStorage.removeItem(key));
    } catch (error) {
      console.error(`Error clearing sessionStorage: ${String(error)}`);
    }
  }
}

export class MemoryStorageAdapter<T> implements StorageAdapter<T> {
  private storage = new Map<string, T>();

  async get(key: string): Promise<T | null> {
    return this.storage.get(key) ?? null;
  }

  async set(key: string, value: T): Promise<void> {
    this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}

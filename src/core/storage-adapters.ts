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

/**
 * AsyncStorageAdapter for React Native
 * 
 * @example
 * ```tsx
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * import { AsyncStorageAdapter } from 'questro';
 * import { PointsProvider } from 'questro/points';
 * 
 * const storage = new AsyncStorageAdapter(AsyncStorage, 'my-app');
 * 
 * function App() {
 *   return (
 *     <PointsProvider userId="user-123" storage={storage}>
 *       <YourApp />
 *     </PointsProvider>
 *   );
 * }
 * ```
 */
export class AsyncStorageAdapter<T> implements StorageAdapter<T> {
  constructor(
    private readonly asyncStorage: {
      getItem: (key: string) => Promise<string | null>;
      setItem: (key: string, value: string) => Promise<void>;
      removeItem: (key: string) => Promise<void>;
      getAllKeys?: () => Promise<readonly string[]>;
      multiRemove?: (keys: readonly string[]) => Promise<void>;
    },
    private readonly prefix: string = 'questro'
  ) {}

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<T | null> {
    try {
      const item = await this.asyncStorage.getItem(this.getKey(key));
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading from AsyncStorage: ${String(error)}`);
      return null;
    }
  }

  async set(key: string, value: T): Promise<void> {
    try {
      await this.asyncStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to AsyncStorage: ${String(error)}`);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await this.asyncStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing from AsyncStorage: ${String(error)}`);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.asyncStorage.getAllKeys && this.asyncStorage.multiRemove) {
        const keys = await this.asyncStorage.getAllKeys();
        const prefixedKeys = keys.filter((key) => key.startsWith(`${this.prefix}:`));
        if (prefixedKeys.length > 0) {
          await this.asyncStorage.multiRemove(prefixedKeys);
        }
      } else {
        console.warn('AsyncStorage.getAllKeys or multiRemove not available');
      }
    } catch (error) {
      console.error(`Error clearing AsyncStorage: ${String(error)}`);
    }
  }
}

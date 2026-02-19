// src/infrastructure/storage/session-storage.adapter.ts

export class SessionStorageAdapter {
  constructor(private prefix: string) {}

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  get(key: string): string | null {
    try {
      return sessionStorage.getItem(this.getKey(key));
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      sessionStorage.setItem(this.getKey(key), value);
    } catch (error) {
      console.error('Error writing to sessionStorage:', error);
    }
  }

  remove(key: string): void {
    try {
      sessionStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  }

  clear(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }

  // Метод для получения всех ключей
  getAllKeys(): string[] {
    const keys: string[] = [];
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keys.push(key.replace(`${this.prefix}:`, ''));
        }
      }
    } catch (error) {
      console.error('Error getting keys from sessionStorage:', error);
    }
    return keys;
  }
}
// src/infrastructure/storage/local-storage.adapter.ts

export class LocalStorageAdapter {
  constructor(private prefix: string) {}

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  get(key: string): string | null {
    try {
      return localStorage.getItem(this.getKey(key));
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      localStorage.setItem(this.getKey(key), value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Методы для работы с ролями (для совместимости с StoragePort)
  async getAll<T = any>(): Promise<T[]> {
    const items: T[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              items.push(JSON.parse(value));
            } catch {
              // Игнорируем не-JSON значения
            }
          }
        }
      }
    } catch (error) {
      console.error('Error getting all items from localStorage:', error);
    }
    return items;
  }

  async getById<T = any>(id: string): Promise<T | null> {
    try {
      const value = localStorage.getItem(this.getKey(id));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting item ${id} from localStorage:`, error);
      return null;
    }
  }

  async save<T = any>(item: T & { id: string }): Promise<void> {
    try {
      localStorage.setItem(this.getKey(item.id), JSON.stringify(item));
    } catch (error) {
      console.error(`Error saving item to localStorage:`, error);
    }
  }

  async delete(id: string): Promise<void> {
    this.remove(id);
  }
}
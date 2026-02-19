// src/infrastructure/storage/composite-storage-adapter.ts

import { StoragePort } from '../../application/ports/storage.port';
import { Role } from '../../core/domain/role/types';
import { TemplatePreview } from '../../core/domain/template/types';
import { LocalStorageAdapter } from './local-storage.adapter';
import { IndexedDBAdapter } from './indexed-db.adapter';
import { SessionStorageAdapter } from './session-storage.adapter';

export class CompositeStorageAdapter implements StoragePort {
  // Используем localStorage для настроек
  private settingsStorage = new LocalStorageAdapter('openrml-settings');
  
  // Используем IndexedDB для ролей (больше данных)
  private rolesStorage = new IndexedDBAdapter('openrml-roles-db');
  
  // Используем sessionStorage для кеша шаблонов
  private templateCache = new SessionStorageAdapter('openrml-template-cache');
  
  roles = {
    getAll: async (): Promise<Role[]> => {
      return this.rolesStorage.getAll<Role>();
    },
    
    getById: async (id: string): Promise<Role | null> => {
      return this.rolesStorage.getById<Role>(id);
    },
    
    save: async (role: Role): Promise<void> => {
      // Автоматически обновляем updatedAt
      const roleToSave = {
        ...role,
        updatedAt: new Date().toISOString()
      };
      
      await this.rolesStorage.save(roleToSave);
    },
    
    delete: async (id: string): Promise<void> => {
      await this.rolesStorage.delete(id);
    },
    
    search: async (query: string): Promise<Role[]> => {
      const roles = await this.rolesStorage.getAll<Role>();
      const normalizedQuery = query.toLowerCase();
      
      return roles.filter(role => 
        role.name.toLowerCase().includes(normalizedQuery) ||
        role.description.toLowerCase().includes(normalizedQuery) ||
        (role.expertiseAreas || []).some(area => 
          area.toLowerCase().includes(normalizedQuery)
        )
      );
    },
    
    getRecent: async (limit: number = 5): Promise<Role[]> => {
      const roles = await this.rolesStorage.getAll<Role>();
      return roles
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit);
    }
  };
  
  templates = {
    getPreviews: async (): Promise<TemplatePreview[]> => {
      // Проверяем кеш
      const cached = this.templateCache.get('previews');
      if (cached) {
        return JSON.parse(cached);
      }
      
      // Загружаем из статических данных
      try {
        const previews = await import('../../data/template-previews');
        const result = previews.templatePreviews || [];
        
        // Кешируем
        this.templateCache.set('previews', JSON.stringify(result));
        
        return result;
      } catch (error) {
        console.error('Error loading template previews:', error);
        return [];
      }
    },
    
    getTemplateById: async (id: string): Promise<Role | null> => {
      // Проверяем кеш
      const cached = this.templateCache.get(`template-${id}`);
      if (cached) {
        return JSON.parse(cached);
      }
      
      // Загружаем из статических данных
      try {
        const templates = await import('../../data/templates');
        // Предполагаем, что есть функция getTemplateById в модуле
        const template = templates.getTemplateById?.(id) || null;
        
        if (template) {
          // Кешируем
          this.templateCache.set(`template-${id}`, JSON.stringify(template));
        }
        
        return template;
      } catch (error) {
        console.error(`Error loading template ${id}:`, error);
        return null;
      }
    },
    
    cacheTemplates: async (templates: Role[]): Promise<void> => {
      templates.forEach(template => {
        this.templateCache.set(`template-${template.id}`, JSON.stringify(template));
      });
    },
    
    clearCache: async (): Promise<void> => {
      this.templateCache.clear();
    }
  };
  
  settings = {
    getLanguage: async (): Promise<string> => {
      return this.settingsStorage.get('language') || 'en';
    },
    
    setLanguage: async (lang: string): Promise<void> => {
      this.settingsStorage.set('language', lang);
    },
    
    getTheme: async (): Promise<'light' | 'dark'> => {
      return (this.settingsStorage.get('theme') as 'light' | 'dark') || 'light';
    },
    
    setTheme: async (theme: 'light' | 'dark'): Promise<void> => {
      this.settingsStorage.set('theme', theme);
    }
  };
}
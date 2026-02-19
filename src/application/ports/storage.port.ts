// src/application/ports/storage.port.ts

import { Role } from '../../core/domain/role/types';
import { TemplatePreview } from '../../core/domain/template/types';

export interface StoragePort {
  roles: {
    getAll(): Promise<Role[]>;
    getById(id: string): Promise<Role | null>;
    save(role: Role): Promise<void>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<Role[]>;
    getRecent(limit?: number): Promise<Role[]>;
  };
  
  templates: {
    getPreviews(): Promise<TemplatePreview[]>;
    getTemplateById(id: string): Promise<Role | null>;
    cacheTemplates(templates: Role[]): Promise<void>;
    clearCache(): Promise<void>;
  };
  
  settings: {
    getLanguage(): Promise<string>;
    setLanguage(lang: string): Promise<void>;
    getTheme(): Promise<'light' | 'dark'>;
    setTheme(theme: 'light' | 'dark'): Promise<void>;
  };
}
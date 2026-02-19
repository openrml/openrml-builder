import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Role } from '../../core/domain/role/types';
import { RoleRepository } from '../../infrastructure/storage/role-repository';
import { TemplateLoader } from '../../infrastructure/template/template-loader';
import { TemplatePreview } from '../../core/domain/template/types';

interface StorageContextType {
  // Состояние
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  
  // Операции с ролями
  loadRoles: () => Promise<void>;
  saveRole: (role: Role) => Promise<Role>;
  deleteRole: (id: string) => Promise<void>;
  getRoleById: (id: string) => Promise<Role | null>;
  searchRoles: (query: string) => Promise<Role[]>;
  
  // Шаблоны
  previews: TemplatePreview[];
  isLoadingTemplates: boolean;
  loadTemplates: () => Promise<void>;
  getTemplateById: (id: string) => Promise<Role | null>;
  searchTemplates: (query: string) => Promise<TemplatePreview[]>;
  getTemplatesByCategory: (categoryId: string) => Promise<TemplatePreview[]>;
  getPopularTemplates: () => Promise<TemplatePreview[]>;
  
  // Настройки
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  // Репозитории
  const [roleRepository] = useState(() => new RoleRepository());
  const [templateLoader] = useState(() => new TemplateLoader());
  
  // Состояние
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние шаблонов
  const [previews, setPreviews] = useState<TemplatePreview[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  
  // Настройки
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('openrml-language') || 'en';
  });
  
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('openrml-theme') as 'light' | 'dark') || 'light';
  });

  // Операции с ролями
  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedRoles = await roleRepository.getAll();
      setRoles(loadedRoles);
      setError(null);
    } catch (err) {
      setError('Failed to load roles');
      console.error('Error loading roles:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [roleRepository]);

  const saveRole = useCallback(async (role: Role) => {
    setIsLoading(true);
    try {
      // Добавляем/обновляем метаданные
      const roleToSave = {
        ...role,
        updatedAt: new Date().toISOString(),
        createdAt: role.createdAt || new Date().toISOString(),
      };
      
      await roleRepository.save(roleToSave);
      
      // Обновляем локальное состояние
      setRoles(prev => {
        const index = prev.findIndex(r => r.id === role.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = roleToSave;
          return updated;
        } else {
          return [...prev, roleToSave];
        }
      });
      
      setError(null);
      return roleToSave;
    } catch (err) {
      setError('Failed to save role');
      console.error('Error saving role:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [roleRepository]);

  const deleteRole = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await roleRepository.delete(id);
      
      // Обновляем локальное состояние
      setRoles(prev => prev.filter(role => role.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete role');
      console.error('Error deleting role:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [roleRepository]);

  const getRoleById = useCallback(async (id: string): Promise<Role | null> => {
    try {
      return await roleRepository.getById(id);
    } catch (err) {
      console.error('Error getting role by id:', err);
      return null;
    }
  }, [roleRepository]);

  const searchRoles = useCallback(async (query: string): Promise<Role[]> => {
    try {
      return await roleRepository.searchByName(query);
    } catch (err) {
      console.error('Error searching roles:', err);
      return [];
    }
  }, [roleRepository]);

  // Операции с шаблонами
  const loadTemplates = useCallback(async () => {
    setIsLoadingTemplates(true);
    try {
      const loadedPreviews = await templateLoader.getAllPreviews();
      setPreviews(loadedPreviews);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, [templateLoader]);

  const getTemplateById = useCallback(async (id: string): Promise<Role | null> => {
    try {
      return await templateLoader.getById(id);
    } catch (error) {
      console.error('Error loading template:', error);
      return null;
    }
  }, [templateLoader]);

  const searchTemplates = useCallback(async (query: string): Promise<TemplatePreview[]> => {
    try {
      return await templateLoader.search(query, language);
    } catch (error) {
      console.error('Error searching templates:', error);
      return [];
    }
  }, [templateLoader, language]);

  const getTemplatesByCategory = useCallback(async (categoryId: string): Promise<TemplatePreview[]> => {
    try {
      return await templateLoader.getByCategory(categoryId);
    } catch (error) {
      console.error('Error getting templates by category:', error);
      return [];
    }
  }, [templateLoader]);

  const getPopularTemplates = useCallback(async (): Promise<TemplatePreview[]> => {
    try {
      return await templateLoader.getPopular();
    } catch (error) {
      console.error('Error getting popular templates:', error);
      return [];
    }
  }, [templateLoader]);

  // Настройки
  const setLanguage = useCallback(async (lang: string) => {
    try {
      localStorage.setItem('openrml-language', lang);
      setLanguageState(lang);
    } catch (err) {
      console.error('Error setting language:', err);
    }
  }, []);

  const setTheme = useCallback(async (newTheme: 'light' | 'dark') => {
    try {
      localStorage.setItem('openrml-theme', newTheme);
      setThemeState(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    } catch (err) {
      console.error('Error setting theme:', err);
    }
  }, []);

  // Применяем тему при загрузке
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Загрузка данных при монтировании
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadRoles(), loadTemplates()]);
        setError(null);
      } catch (err) {
        setError('Failed to initialize storage');
        console.error('Storage initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, []); // Убрал зависимости - они определены внутри функций

  const value: StorageContextType = {
    // Состояние
    roles,
    isLoading,
    error,
    
    // Операции с ролями
    loadRoles,
    saveRole,
    deleteRole,
    getRoleById,
    searchRoles,
    
    // Шаблоны
    previews,
    isLoadingTemplates,
    loadTemplates,
    getTemplateById,
    searchTemplates,
    getTemplatesByCategory,
    getPopularTemplates,
    
    // Настройки
    language,
    setLanguage,
    theme,
    setTheme,
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within StorageProvider');
  }
  return context;
}
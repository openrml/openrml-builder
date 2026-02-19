import { Role } from '../../core/domain/role/types';
import { templatePreviews, getPopularTemplates, searchTemplates } from '../../data/template-previews';
import { categories } from '../../data/categories';
import { getTemplateById } from '../../data/templates';

export interface TemplatePreview {
  id: string;
  category: string;
  subcategory?: string;
  name: {
    en: string;
    ua: string;
    ru: string;
  };
  description: {
    en: string;
    ua: string;
    ru: string;
  };
  icon: string;
  tags: string[];
  isPopular?: boolean;
  color?: string;
  categoryInfo?: {
    id: string;
    name: {
      en: string;
      ua: string;
      ru: string;
    };
    icon: string;
  };
}

export class TemplateLoader {
  private cache = new Map<string, Role>();

  async getAllPreviews(): Promise<TemplatePreview[]> {
    // Добавляем информацию о категории к каждому превью
    return templatePreviews.map(preview => ({
      ...preview,
      categoryInfo: categories.find(c => c.id === preview.category)
    }));
  }

  async getById(id: string): Promise<Role | null> {
    // Проверяем кеш
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    try {
      // Загружаем шаблон из данных
      const template = await getTemplateById(id);
      if (template) {
        // Кешируем
        this.cache.set(id, template);
        return template;
      }
    } catch (error) {
      console.error(`Error loading template ${id}:`, error);
    }

    return null;
  }

  async getByCategory(categoryId: string): Promise<TemplatePreview[]> {
    const previews = await this.getAllPreviews();
    return previews.filter(t => t.category === categoryId);
  }

  async getPopular(): Promise<TemplatePreview[]> {
    return getPopularTemplates();
  }

  async search(query: string, _language: string = 'en'): Promise<TemplatePreview[]> {
    return searchTemplates(query);
  }

  async getCategories(): Promise<any[]> {
    return categories;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
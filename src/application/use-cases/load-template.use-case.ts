import { Role } from '../../core/domain/role/types';
import { TemplateLoader } from '../../infrastructure/template/template-loader';

export interface LoadTemplateInput {
  templateId: string;
}

export interface LoadTemplateOutput {
  template: Role | null;
  success: boolean;
  error?: string;
}

export class LoadTemplateUseCase {
  private templateLoader: TemplateLoader;

  constructor() {
    this.templateLoader = new TemplateLoader();
  }

  async execute(input: LoadTemplateInput): Promise<LoadTemplateOutput> {
    try {
      const template = await this.templateLoader.getById(input.templateId);
      
      if (!template) {
        return {
          template: null,
          success: false,
          error: `Template with id "${input.templateId}" not found`,
        };
      }

      // 🆕 P0: Гарантируем что шаблон содержит новые P0 поля
      const enhancedTemplate: Role = {
        ...template,
        status: template.status || 'published', // 🆕 Шаблоны по умолчанию опубликованы
        version: template.version || '0.9.0',
        category: template.category || 'productivity',
        tags: template.tags || [],
        ethicalRules: Array.isArray(template.ethicalRules) 
          ? template.ethicalRules.map(rule => 
              typeof rule === 'string' 
                ? { rule, action: 'warn' } // 🆕 Конвертируем старый формат
                : rule
            )
          : [],
        sessions: template.sessions?.map(session => ({
          ...session,
          outcomes: session.outcomes || []
        })) || []
      };

      return {
        template: enhancedTemplate,
        success: true,
      };
    } catch (error) {
      console.error('Error loading template:', error);
      return {
        template: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load template',
      };
    }
  }
}
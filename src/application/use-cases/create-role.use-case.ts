import { Role } from '../../core/domain/role/types';
import { createEmptyRole } from '../../core/services/role-factory';

export interface CreateRoleInput {
  templateId?: string;
}

export interface CreateRoleOutput {
  role: Role;
}

export class CreateRoleUseCase {
  async execute(input: CreateRoleInput = {}): Promise<CreateRoleOutput> {
    const role = createEmptyRole();
    
    // 🆕 P0: Добавляем дефолтные значения для новых полей
    const enhancedRole: Role = {
      ...role,
      status: 'draft', // 🆕 P0
      version: '0.9.0', // 🆕 P0
      category: 'productivity', // 🆕 P0 - дефолтная категория
      tags: [], // 🆕 P0
      ethicalRules: [], // 🆕 P0: теперь массив объектов вместо строк
      sessions: role.sessions.map(session => ({
        ...session,
        outcomes: [] // 🆕 P0: инициализируем
      }))
    };
    
    // Если есть templateId, можно загрузить шаблон и применить
    if (input.templateId) {
      // TODO: Реализовать загрузку шаблона
      // const template = await templateLoader.getById(input.templateId);
      // if (template) {
      //   return { ...template, id: generateId() };
      // }
    }
    
    return { role: enhancedRole };
  }
}
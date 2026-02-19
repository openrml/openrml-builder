// src/application/use-cases/save-role.use-case.ts
import { Role } from '../../core/domain/role/types';
import { RoleRepository } from '../../infrastructure/storage/role-repository';
import { validateRole } from '../../core/services/role-factory';
import { rmlIdentityService } from '../../core/services/identity.service';
import { FEATURES } from '../../config/features';

export interface SaveRoleInput {
  role: Role;
}

export interface SaveRoleOutput {
  savedRole: Role;
  success: boolean;
  errors: string[];
}

export class SaveRoleUseCase {
  private repository: RoleRepository;

  constructor() {
    this.repository = new RoleRepository();
  }

  async execute(input: SaveRoleInput): Promise<SaveRoleOutput> {
    const role = { ...input.role };

    // Генерируем RML Identity — только если фича включена
    // НИКОГДА не перезаписывает существующий identity, если роль не изменилась
    if (FEATURES.RML_IDENTITY) {
      const identity = rmlIdentityService.generateIdentity(role);
      if (identity) {
        // Сохраняем оригинальный fullId для сравнения
        const originalFullId = role.rmlIdentity?.fullId;

        role.rmlIdentity     = identity.rmlIdentity;
        role.identityMetadata = identity.metadata;

        // Если fullId не изменился — оставляем оригинальный reference
        // (сохраняем человекочитаемую ссылку, которую мог задать пользователь)
        if (identity.rmlIdentity && originalFullId === identity.rmlIdentity.fullId && input.role.rmlIdentity?.reference) {
          if (role.rmlIdentity) {
            role.rmlIdentity.reference = input.role.rmlIdentity.reference;
          }
        }
      }
    }

    // ✅ P0: Валидация обязательных полей
    const roleValidationErrors: string[] = [];

    if (!input.role.status) {
      roleValidationErrors.push('Role status is required');
    }

    if (!input.role.version) {
      roleValidationErrors.push('Version is required');
    }

    if (!input.role.category) {
      roleValidationErrors.push('Category is required');
    }

    if (!input.role.tags || !Array.isArray(input.role.tags)) {
      roleValidationErrors.push('Tags must be an array');
    }

    // Проверяем ethicalRules на новую структуру
    if (input.role.ethicalRules && Array.isArray(input.role.ethicalRules)) {
      const hasInvalidEthicalRules = input.role.ethicalRules.some(rule => {
        return typeof rule !== 'object' || !rule.rule || !rule.action;
      });

      if (hasInvalidEthicalRules) {
        roleValidationErrors.push('Ethical rules must have rule and action properties');
      }
    }

    if (roleValidationErrors.length > 0) {
      return {
        savedRole: input.role,
        success: false,
        errors: roleValidationErrors,
      };
    }

    const validation = validateRole(input.role);

    if (!validation.isValid) {
      return {
        savedRole: input.role,
        success: false,
        errors: validation.errors,
      };
    }

    try {
      const roleToSave = {
        ...role, // Используем role с уже сгенерированным identity
        updatedAt: new Date().toISOString(),
        createdAt: input.role.createdAt || new Date().toISOString(),
      };

      await this.repository.save(roleToSave);

      return {
        savedRole: roleToSave,
        success: true,
        errors: [],
      };
    } catch (error) {
      console.error('Error saving role:', error);
      return {
        savedRole: input.role,
        success: false,
        errors: ['Failed to save role to storage'],
      };
    }
  }
}
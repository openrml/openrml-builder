// src/application/use-cases/import-rml.use-case.ts
import { Role } from '../../core/domain/role/types';
import { parseRMLRole } from '../../core/rml/parser';
import { rmlIdentityService } from '../../core/services/identity.service';
import { FEATURES } from '../../config/features';

export interface ImportRMLInput {
  fileContent: string;
}

export interface ImportRMLOutput {
  role: Role;
  warnings: string[];
  errors: string[];
  isValid: boolean;
}

// ─── Типы для пошагового импорта ─────────────────────────────────────────────

export type StepKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StepImportData {
  step: StepKey;
  label: string;
  /** Только поля Role, относящиеся к этому шагу конструктора */
  fields: Partial<Role>;
  /** Предупреждения, относящиеся именно к этому шагу */
  warnings: string[];
  /** true — файл содержит непустые значения для этого шага */
  hasData: boolean;
}

export interface ImportRMLOutputV2 extends ImportRMLOutput {
  /** Данные, разбитые по шагам конструктора */
  steps: StepImportData[];
}

// ─── Вспомогательная функция: нарезать поля роли по шагам ────────────────────

function extractStepFields(role: Role): StepImportData[] {
  return [
    {
      step: 1,
      label: 'Base Info',
      fields: {
        name:           role.name,
        archetype:      role.archetype,
        roleType:       role.roleType,
        description:    role.description,
        mainGoal:       role.mainGoal,
        responseLength: role.responseLength,
        status:         role.status,
        version:        role.version,
        category:       role.category,
        tags:           role.tags,
      },
      warnings: [],
      hasData: !!(role.name || role.description || role.mainGoal),
    },
    {
      step: 2,
      label: 'Portrait',
      fields: {
        age:           role.age,
        visualStyle:   role.visualStyle,
        visualDetails: role.visualDetails,
        visualAccent:  role.visualAccent,
        environment:   role.environment,
        atmosphere:    role.atmosphere,
        imageStyle:    role.imageStyle,
        lighting:      role.lighting,
      },
      warnings: [],
      hasData: !!(role.age || role.visualDetails || role.atmosphere),
    },
    {
      step: 3,
      label: 'Behavior',
      fields: {
        greeting:       role.greeting,
        tone:           role.tone,
        emotionalRange: role.emotionalRange,
        personality:    role.personality,
        shouldDo:       role.shouldDo,
        shouldNotDo:    role.shouldNotDo,
      },
      warnings: [],
      hasData: !!(role.greeting || (role.shouldDo?.length ?? 0) > 0 || (role.shouldNotDo?.length ?? 0) > 0),
    },
    {
      step: 4,
      label: 'Expertise',
      fields: {
        expertiseAreas:  role.expertiseAreas,
        tools:           role.tools,
        outputFormats:   role.outputFormats,
        additionalRules: role.additionalRules,
      },
      warnings: [],
      hasData: (role.expertiseAreas?.length ?? 0) > 0 || (role.tools?.length ?? 0) > 0,
    },
    {
      step: 5,
      label: 'Journey',
      fields: {
        sessions:      role.sessions,
        journeyPacing: role.journeyPacing,
      },
      warnings: [],
      hasData: (role.sessions?.length ?? 0) > 0 && !!role.sessions?.[0]?.title,
    },
    {
      step: 6,
      label: 'Team',
      fields: {
        teamEnabled:    role.teamEnabled,
        orchestrator:   role.orchestrator,
        subRoles:       role.subRoles,
        taskProtocol:   role.taskProtocol,
        memoryTransfer: role.memoryTransfer,
      },
      warnings: [],
      hasData: role.teamEnabled || (role.subRoles?.length ?? 0) > 0 || !!role.orchestrator,
    },
    {
      step: 7,
      label: 'Memory',
      fields: {
        hotMemory:       role.hotMemory,
        warmMemory:      role.warmMemory,
        coldMemory:      role.coldMemory,
        memoryStrategy:  role.memoryStrategy,
        emotionalStates: role.emotionalStates,
      },
      warnings: [],
      hasData: !!(role.hotMemory || role.warmMemory || role.coldMemory),
    },
    {
      step: 8,
      label: 'Ethics & License',
      fields: {
        ethicalRules:     role.ethicalRules,
        referralProtocol: role.referralProtocol,
        disclaimer:       role.disclaimer,
        author:           role.author,
        contacts:         role.contacts,
        changelog:        role.changelog,
        license:          role.license,
      },
      warnings: [],
      hasData: (role.ethicalRules?.length ?? 0) > 0 || !!role.disclaimer || !!role.license,
    },
  ];
}

// ─── Паттерны для распределения предупреждений по шагам ──────────────────────

const STEP_WARNING_PATTERNS: Record<StepKey, RegExp[]> = {
  1: [/status/i, /version/i, /category/i, /\bname\b/i, /description/i, /\bfield/i],
  2: [/visual/i, /portrait/i, /\bage\b/i, /environment/i, /atmosphere/i, /lighting/i],
  3: [/greeting/i, /\btone\b/i, /behavior/i, /emotional.?range/i, /personality/i],
  4: [/expertise/i, /\btool/i, /output.?format/i, /additional.?rule/i],
  5: [/session/i, /journey/i, /pacing/i, /outcome/i],
  6: [/\bteam\b/i, /orchestrat/i, /sub.?role/i, /task.?protocol/i, /memory.?transfer/i],
  7: [/hot.?memory/i, /warm.?memory/i, /cold.?memory/i, /memory.?strateg/i, /emotional.?state/i],
  8: [/ethic/i, /licens/i, /referral/i, /disclaimer/i, /\bauthor\b/i, /changelog/i, /identity/i],
};

// ─── Use Case ─────────────────────────────────────────────────────────────────

export class ImportRMLUseCase {
  constructor() {}

  /**
   * Основной метод — полный импорт роли.
   * Сохранена обратная совместимость с оригиналом из архива.
   */
  execute(input: ImportRMLInput): ImportRMLOutput {
    const result = parseRMLRole(input.fileContent);

    // P0: Обратная совместимость для новых полей
    if (result.isValid && result.role) {
      // Преобразуем старые ethicalRules (string[]) в новый формат
      if (Array.isArray(result.role.ethicalRules)) {
        const firstElement = result.role.ethicalRules[0];
        if (typeof firstElement === 'string') {
          result.role.ethicalRules = (result.role.ethicalRules as unknown as string[]).map(rule => ({
            rule,
            action: 'warn' as const,
          }));
          result.warnings.push('Converted old ethicalRules format to new format with default action "warn"');
        }
      }

      if (!result.role.status) {
        result.role.status = 'draft';
        result.warnings.push('Added default status: "draft"');
      }

      if (!result.role.version) {
        result.role.version = '0.9.0';
        result.warnings.push('Added default version: "0.9.0"');
      }

      if (!result.role.category) {
        result.role.category = 'productivity';
        result.warnings.push('Added default category: "productivity"');
      }

      if (!result.role.tags || !Array.isArray(result.role.tags)) {
        result.role.tags = [];
      }

      if (result.role.sessions) {
        result.role.sessions = result.role.sessions.map(session => ({
          ...session,
          outcomes: session.outcomes || [],
        }));
      }

      // RML Identity: парсим IDENTITY и REFERENCE если есть в файле
      const identityMatch   = input.fileContent.match(/IDENTITY:\s*(.+)/);
      const referenceMatch  = input.fileContent.match(/REFERENCE:\s*(.+)/);

      if (identityMatch || referenceMatch) {
        if (!result.role.rmlIdentity) {
          result.role.rmlIdentity = {};
        }

        if (identityMatch) {
          result.role.rmlIdentity.fullId = identityMatch[1].trim();
        }

        if (referenceMatch) {
          result.role.rmlIdentity.reference = referenceMatch[1].trim();
        }

        // Валидируем целостность только если фича включена
        // (validateIdentity внутри сам проверяет FEATURES.RML_IDENTITY_VALIDATION)
        if (FEATURES.RML_IDENTITY_VALIDATION && result.role.rmlIdentity?.fullId) {
          const validation = rmlIdentityService.validateIdentity(result.role);
          if (!validation.valid) {
            result.warnings.push(
              `RML Identity mismatch: ${validation.mismatchedComponents.join(', ')}. ` +
              `The role may have been modified since creation.`
            );

            if (!result.role.identityMetadata) {
              result.role.identityMetadata = {
                schemaVersion: '1.0',
                generatedAt: new Date().toISOString(),
                canonical: false,
              };
            }
          } else {
            result.warnings.push('RML Identity verified successfully');
          }
        }
      }

      // Дополнительная бизнес-логика валидации
      if (!result.role.name || !result.role.description || !result.role.mainGoal) {
        result.errors.push('Missing required fields');
        result.isValid = false;
      }
    }

    return result;
  }

  /**
   * Пошаговый импорт: парсит файл и разбивает результат по шагам конструктора.
   * Каждый элемент `steps[]` содержит только поля своего шага и собственные предупреждения.
   * Пользователь сам выбирает, какие шаги применить — текущие данные не трогаются.
   */
  executeBySteps(input: ImportRMLInput): ImportRMLOutputV2 {
    const base = this.execute(input);

    if (!base.isValid || !base.role) {
      return { ...base, steps: [] };
    }

    const steps = extractStepFields(base.role);

    // Распределяем предупреждения по шагам на основе паттернов
    base.warnings.forEach(warning => {
      let matched = false;
      for (const [stepStr, patterns] of Object.entries(STEP_WARNING_PATTERNS)) {
        if (patterns.some(p => p.test(warning))) {
          steps[Number(stepStr) - 1].warnings.push(warning);
          matched = true;
          break;
        }
      }
      // Если ни один паттерн не подошёл — кладём в Step 1 (общие)
      if (!matched) {
        steps[0].warnings.push(warning);
      }
    });

    return { ...base, steps };
  }

  /**
   * Статический хелпер: объединяет поля только выбранных шагов в один Partial<Role>.
   * Готов для передачи в updateRole().
   */
  static mergeSelectedSteps(
    _currentRole: Role,
    steps: StepImportData[],
    selectedSteps: Set<StepKey>,
  ): Partial<Role> {
    return steps
      .filter(s => selectedSteps.has(s.step))
      .reduce<Partial<Role>>((acc, s) => ({ ...acc, ...s.fields }), {});
  }
}
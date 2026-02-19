// src/core/rml/parser.ts

import { 
  Role, 
  Archetype, 
  RoleType, 
  VisualStyle, 
  Environment, 
  ImageStyle, 
  Lighting, 
  Tone, 
  EmotionalRange, 
  MemoryStrategy,
  PersonalityTrait,
  SubRole,
  LicenseType
} from '../domain/role/types';
import { createEmptyRole } from '../services/role-factory';
import { rmlIdentityService } from '../services/identity.service';
import { LicenseService } from '../services/license.service';
import { FEATURES } from '../../config/features';

export interface ImportResult {
  role: Role;
  warnings: string[];
  errors: string[];
  isValid: boolean;
}

function generateId(): string {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Валидация значений перечислений
function validateEnum<T extends string>(
  value: string, 
  validValues: readonly T[], 
  defaultValue: T,
  fieldName: string
): { value: T; warning?: string } {
  if (!value || value.trim() === '') {
    return { 
      value: defaultValue,
      warning: `Field "${fieldName}" is empty. Using default "${defaultValue}"`
    };
  }

  const normalized = value.toLowerCase().trim() as T;
  
  if (validValues.includes(normalized)) {
    return { value: normalized };
  }

  for (const validValue of validValues) {
    if (normalized.includes(validValue) || validValue.includes(normalized)) {
      return { 
        value: validValue,
        warning: `Field "${fieldName}": "${value}" converted to "${validValue}"`
      };
    }
  }

  const ruTranslations: Record<string, string> = {
    'эмпатичный': 'empathetic',
    'профессиональный': 'professional',
    'дружелюбный': 'friendly',
    'формальный': 'formal',
    'неформальный': 'informal',
    'энтузиастичный': 'enthusiastic',
    'минимальный': 'minimal',
    'умеренный': 'moderate',
    'выразительный': 'expressive',
    'семантический': 'semantic',
    'хронологический': 'chronological',
    'эмоциональный': 'emotional',
  };

  const ruMatch = ruTranslations[normalized];
  if (ruMatch && validValues.includes(ruMatch as T)) {
    return { 
      value: ruMatch as T,
      warning: `Field "${fieldName}": "${value}" converted to "${ruMatch}"`
    };
  }

  return { 
    value: defaultValue,
    warning: `Field "${fieldName}": Invalid value "${value}". Using default "${defaultValue}"`
  };
}

// Парсинг числовых значений
function parseNumberRange(value: string): number {
  if (!value) return 4;
  
  const match = value.match(/(\d+)\/(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    return isNaN(num) ? 4 : Math.min(7, Math.max(1, num));
  }
  
  const num = parseInt(value, 10);
  return isNaN(num) ? 4 : Math.min(7, Math.max(1, num));
}

// ✅ FIX #5: Улучшенные regex с учетом пропущенных секций
const stepPatterns = [
  /📋 STEP 1:[\s\S]*?(?=🎨 STEP 2:|═════════════|$)/i,
  /🎨 STEP 2:[\s\S]*?(?=💬 STEP 3:|═════════════|$)/i,
  /💬 STEP 3:[\s\S]*?(?=🎯 STEP 4:|═════════════|$)/i,
  /🎯 STEP 4:[\s\S]*?(?=⏱️ JOURNEY PACING|🗺️ STEP 5:|═════════════|$)/i,
  // ✅ STEP 5 останавливается на любом следующем STEP или разделителе
  /🗺️ STEP 5:[\s\S]*?(?=👥 STEP 6:|🧠 STEP 7:|═════════════|$)/i,
  /👥 STEP 6:[\s\S]*?(?=🧠 STEP 7:|═════════════|$)/i,
  /🧠 STEP 7:[\s\S]*?(?=⚖️ STEP 8:|═════════════|$)/i,
  /⚖️ STEP 8:[\s\S]*?(?=📜 LICENSE DETAILS|═════════════|$)/i,
];

// ✅ FIX #5: Улучшенная функция извлечения секций
function extractSection(text: string, stepNumber: number): string {
  if (stepNumber < 1 || stepNumber > stepPatterns.length) return '';
  
  const match = text.match(stepPatterns[stepNumber - 1]);
  if (!match) return '';
  
  const content = match[0];
  const lines = content.split('\n');
  
  // Убираем заголовок и разделитель (первые 2 строки)
  const relevantLines = lines.slice(2);
  
  // ✅ Останавливаемся при встрече следующего STEP или разделителя
  const result: string[] = [];
  for (const line of relevantLines) {
    // Проверяем начало новой секции
    if (line.match(/[📋🎨💬🎯🗺️👥🧠⚖️📜⏱️] STEP \d:|LICENSE DETAILS|JOURNEY PACING/)) {
      break;
    }
    // Проверяем разделитель
    if (line.includes('═════════════════════════════════════════════════')) {
      break;
    }
    result.push(line);
  }
  
  return result.join('\n').trim();
}

function parseKeyValue(section: string, key: string): string {
  if (!section) return '';
  
  const lines = section.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith(`${key}:`)) {
      return line.substring(key.length + 1).trim();
    }
    if (line.toLowerCase().trim().startsWith(`${key.toLowerCase()}:`)) {
      return line.substring(line.indexOf(':') + 1).trim();
    }
  }
  return '';
}

function parseBulletList(section: string, startKey?: string): string[] {
  const items: string[] = [];
  if (!section) return items;
  
  const lines = section.split('\n');
  let collecting = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (startKey && trimmed.startsWith(`${startKey}:`)) {
      collecting = true;
      continue;
    }
    
    if (!startKey || collecting) {
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        items.push(trimmed.substring(1).trim());
      } else if (trimmed && !trimmed.includes(':') && !trimmed.startsWith('Session')) {
        if (items.length > 0) {
          items[items.length - 1] += ' ' + trimmed;
        }
      } else if (trimmed.includes(':') || trimmed.startsWith('Session')) {
        if (startKey) break;
      }
    }
  }
  
  return items;
}

function parseCheckedList(section: string, symbol: '✓' | '✗'): string[] {
  const items: string[] = [];
  if (!section) return items;
  
  const lines = section.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith(symbol)) {
      items.push(trimmed.substring(1).trim());
    }
  }
  
  return items;
}

function parsePersonalityTraits(section: string): PersonalityTrait {
  const defaultTraits: PersonalityTrait = {
    creativity: 5,
    formality: 5,
    empathy: 5,
    assertiveness: 5,
    patience: 5,
  };

  if (!section) return defaultTraits;

  const lines = section.split('\n');
  for (const line of lines) {
    const match = line.match(/(\w+):\s*(\d+)\/(\d+)/i);
    if (match) {
      const [, trait, value] = match;
      const traitKey = trait.toLowerCase() as keyof PersonalityTrait;
      if (traitKey in defaultTraits) {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
          defaultTraits[traitKey] = Math.min(10, Math.max(0, numValue));
        }
      }
    }
  }
  
  return defaultTraits;
}

// ✅ FIX #3: Улучшенный парсинг сессий с правильными границами
function parseSessions(section: string): Array<{ id: string; title: string; tasks: string[] }> {
  const sessions: Array<{ id: string; title: string; tasks: string[] }> = [];
  if (!section) return sessions;
  
  const lines = section.split('\n');
  let currentSession: { title: string; tasks: string[] } | null = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Начало новой сессии
    const sessionMatch = trimmed.match(/Session\s+\d+:\s+(.+)/);
    if (sessionMatch) {
      // Сохраняем предыдущую сессию
      if (currentSession) {
        sessions.push({
          id: generateId(),
          title: currentSession.title,
          tasks: currentSession.tasks
        });
      }
      
      currentSession = {
        title: sessionMatch[1].trim(),
        tasks: []
      };
      continue;
    }
    
    // Добавляем задачу к текущей сессии
    if (currentSession && trimmed.startsWith('✓')) {
      currentSession.tasks.push(trimmed.substring(1).trim());
    }
    
    // ✅ Останавливаемся на границах
    if (trimmed.includes('JOURNEY PACING') || 
        trimmed.includes('STEP 6:') ||
        trimmed.includes('═══════════')) {
      break;
    }
  }
  
  // Сохраняем последнюю сессию
  if (currentSession) {
    sessions.push({
      id: generateId(),
      title: currentSession.title,
      tasks: currentSession.tasks
    });
  }
  
  return sessions;
}

// ✅ FIX #1 & #6: Улучшенный парсинг Team Collaboration
function parseTeamCollaboration(section: string): { 
  teamEnabled: boolean; 
  orchestrator: string; 
  subRoles: SubRole[]; 
  taskProtocol: string;
} {
  const defaultResult = {
    teamEnabled: false,
    orchestrator: '',
    subRoles: [],
    taskProtocol: ''
  };
  
  if (!section) return defaultResult;

  const lines = section.split('\n');
  
  // ✅ Проверяем явное "Team Enabled: No"
  const teamEnabledLine = lines.find(l => l.trim().startsWith('Team Enabled:'));
  if (teamEnabledLine && teamEnabledLine.toLowerCase().includes('no')) {
    return defaultResult;
  }
  
  let orchestrator = '';
  const subRoles: SubRole[] = [];
  let taskProtocol = '';
  let inSubRoles = false;
  let inTaskProtocol = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('Orchestrator:')) {
      orchestrator = trimmed.substring('Orchestrator:'.length).trim();
      // Убираем "N/A" значения
      if (orchestrator.toLowerCase() === 'n/a') {
        orchestrator = '';
      }
    }
    
    else if (trimmed.includes('Sub-roles:')) {
      inSubRoles = true;
      inTaskProtocol = false;
      // Проверяем "Sub-roles: None"
      if (trimmed.toLowerCase().includes('none')) {
        inSubRoles = false;
      }
      continue;
    }
    
    else if (trimmed.includes('Task Protocol:')) {
      inSubRoles = false;
      inTaskProtocol = true;
      // Захватываем текст после двоеточия
      const protocolText = trimmed.substring(trimmed.indexOf(':') + 1).trim();
      if (protocolText) {
        taskProtocol = protocolText;
      }
      continue;
    }
    
    else if (inSubRoles && trimmed.startsWith('•')) {
      const subRoleText = trimmed.substring(1).trim();
      const dashIndex = subRoleText.indexOf('—');
      
      if (dashIndex !== -1) {
        const name = subRoleText.substring(0, dashIndex).trim();
        const description = subRoleText.substring(dashIndex + 1).trim();
        
        subRoles.push({
          id: generateId(),
          name,
          description
        });
      } else {
        subRoles.push({
          id: generateId(),
          name: subRoleText,
          description: ''
        });
      }
    }
    
    else if (inTaskProtocol && trimmed && !trimmed.startsWith('Task Protocol:')) {
      // Продолжение Task Protocol на следующих строках
      if (trimmed.startsWith('•')) {
        taskProtocol += '\n' + trimmed.substring(1).trim();
      } else {
        taskProtocol += ' ' + trimmed;
      }
    }
  }

  return {
    teamEnabled: subRoles.length > 0 || (orchestrator !== '' && orchestrator.toLowerCase() !== 'n/a'),
    orchestrator,
    subRoles,
    taskProtocol: taskProtocol.trim()
  };
}

// 🆕 Функция для парсинга IDENTITY из заголовка
function parseRMLIdentity(raw: string): { fullId?: string; reference?: string } {
  const lines = raw.split('\n');
  const identity: { fullId?: string; reference?: string } = {};
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('IDENTITY:')) {
      identity.fullId = trimmed.replace('IDENTITY:', '').trim();
    }
    if (trimmed.startsWith('REFERENCE:')) {
      identity.reference = trimmed.replace('REFERENCE:', '').trim();
    }
    // Stop after header section
    if (trimmed.startsWith('═══════════════════════════════════════════════════') && identity.fullId) {
      break;
    }
  }
  
  return identity;
}

export function parseRMLRole(raw: string): ImportResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  try {
    if (!raw.includes('RML') && !raw.includes('STEP 1:')) {
      errors.push('File is not a valid RML format. Missing RML header or STEP markers.');
      return {
        role: createEmptyRole(),
        warnings,
        errors,
        isValid: false
      };
    }

    const role = createEmptyRole();
    const now = new Date().toISOString();

    // 🆕 Парсим RML Identity из заголовка
    const identity = parseRMLIdentity(raw);
    if (identity.fullId || identity.reference) {
      role.rmlIdentity = {};
      if (identity.fullId) role.rmlIdentity.fullId = identity.fullId;
      if (identity.reference) role.rmlIdentity.reference = identity.reference;
      warnings.push(`RML Identity found: ${identity.fullId?.substring(0, 30)}...`);
    }

    // === STEP 1: Base Information ===
    const step1 = extractSection(raw, 1);
    if (!step1) {
      warnings.push('Missing Step 1: Base Information');
    }
    
    role.name = parseKeyValue(step1, 'Role Name') || 'Unnamed Role';
    
    const statusResult = validateEnum<'draft' | 'published'>(
      parseKeyValue(step1, 'Status'),
      ['draft', 'published'] as const,
      'draft',
      'Status'
    );
    role.status = statusResult.value;
    if (statusResult.warning) warnings.push(statusResult.warning);
    
    role.version = parseKeyValue(step1, 'Version') || '1.0.0';
    
    const categoryResult = validateEnum<Role['category']>(
      parseKeyValue(step1, 'Category'),
      ['health', 'productivity', 'daily', 'finance', 'relationships', 'development', 'technology', 'entertainment'] as const,
      'productivity',
      'Category'
    );
    role.category = categoryResult.value;
    if (categoryResult.warning) warnings.push(categoryResult.warning);
    
    const archetypeResult = validateEnum<Archetype>(
      parseKeyValue(step1, 'Archetype'),
      ['mentor', 'creator', 'analyst', 'healer', 'scientist', 'leader', 'explorer', 'guardian'] as const,
      'mentor',
      'Archetype'
    );
    role.archetype = archetypeResult.value;
    if (archetypeResult.warning) warnings.push(archetypeResult.warning);
    
    const roleTypeResult = validateEnum<RoleType>(
      parseKeyValue(step1, 'Role Type'),
      ['professional', 'personal', 'educational', 'creative'] as const,
      'professional',
      'Role Type'
    );
    role.roleType = roleTypeResult.value;
    if (roleTypeResult.warning) warnings.push(roleTypeResult.warning);
    
    role.description = parseKeyValue(step1, 'Description') || '';
    role.mainGoal = parseKeyValue(step1, 'Main Goal') || '';
    role.responseLength = parseNumberRange(parseKeyValue(step1, 'Response Length'));
    
    const tagsLine = parseKeyValue(step1, 'Tags');
    role.tags = tagsLine ? tagsLine.split(',').map(t => t.trim()).filter(t => t) : [];

    // === STEP 2: Visual Portrait ===
    const step2 = extractSection(raw, 2);
    
    role.age = parseKeyValue(step2, 'Age') || '30-40';
    
    const visualStyleResult = validateEnum<VisualStyle>(
      parseKeyValue(step2, 'Visual Style'),
      ['professional', 'casual', 'creative', 'academic'] as const,
      'professional',
      'Visual Style'
    );
    role.visualStyle = visualStyleResult.value;
    if (visualStyleResult.warning) warnings.push(visualStyleResult.warning);
    
    role.visualDetails = parseKeyValue(step2, 'Key Details') || '';
    role.visualAccent = parseKeyValue(step2, 'Visual Accent') || '';
    
    const environmentResult = validateEnum<Environment>(
      parseKeyValue(step2, 'Environment'),
      ['office', 'hospital', 'business', 'library', 'studio', 'home', 'digital'] as const,
      'office',
      'Environment'
    );
    role.environment = environmentResult.value;
    if (environmentResult.warning) warnings.push(environmentResult.warning);
    
    role.atmosphere = parseKeyValue(step2, 'Atmosphere') || '';
    
    const imageStyleResult = validateEnum<ImageStyle>(
      parseKeyValue(step2, 'Image Style'),
      ['portrait', 'professional', 'illustration', 'digital-art'] as const,
      'professional',
      'Image Style'
    );
    role.imageStyle = imageStyleResult.value;
    if (imageStyleResult.warning) warnings.push(imageStyleResult.warning);
    
    const lightingResult = validateEnum<Lighting>(
      parseKeyValue(step2, 'Lighting'),
      ['natural', 'studio', 'soft', 'dramatic'] as const,
      'natural',
      'Lighting'
    );
    role.lighting = lightingResult.value;
    if (lightingResult.warning) warnings.push(lightingResult.warning);

    // === STEP 3: Behavior & Tone ===
    const step3 = extractSection(raw, 3);
    
    role.greeting = parseKeyValue(step3, 'Greeting') || '';
    
    const toneResult = validateEnum<Tone>(
      parseKeyValue(step3, 'Base Tone') || parseKeyValue(step3, 'Tone'),
      ['professional', 'friendly', 'formal', 'informal', 'empathetic', 'enthusiastic'] as const,
      'professional',
      'Tone'
    );
    role.tone = toneResult.value;
    if (toneResult.warning) warnings.push(toneResult.warning);
    
    const emotionalRangeResult = validateEnum<EmotionalRange>(
      parseKeyValue(step3, 'Emotional Range'),
      ['minimal', 'moderate', 'expressive'] as const,
      'moderate',
      'Emotional Range'
    );
    role.emotionalRange = emotionalRangeResult.value;
    if (emotionalRangeResult.warning) warnings.push(emotionalRangeResult.warning);
    
    role.personality = parsePersonalityTraits(step3);
    role.shouldDo = parseCheckedList(step3, '✓');
    role.shouldNotDo = parseCheckedList(step3, '✗');

    // === STEP 4: Expertise & Rules ===
    const step4 = extractSection(raw, 4);
    
    const explicitExpertise = parseBulletList(step4, 'Expertise Areas');
    if (explicitExpertise.length > 0) {
      role.expertiseAreas = explicitExpertise;
    } else {
      const bulletItems = parseBulletList(step4);
      role.expertiseAreas = bulletItems.slice(0, Math.min(10, bulletItems.length));
    }
    
    const explicitTools = parseBulletList(step4, 'Tools & Methods');
    if (explicitTools.length > 0) {
      role.tools = explicitTools;
    }
    
    const explicitOutput = parseBulletList(step4, 'Output Formats');
    if (explicitOutput.length > 0) {
      role.outputFormats = explicitOutput;
    }
    
    role.additionalRules = parseKeyValue(step4, 'Additional Rules') || '';

    // === STEP 5: Journey Sessions ===
    const step5 = extractSection(raw, 5);
    const parsedSessions = parseSessions(step5);
    
    // ✅ FIX #3: Улучшенный парсинг outcomes с правильными границами
    role.sessions = parsedSessions.map(session => {
      const lines = step5.split('\n');
      let estimatedDuration: number | undefined;
      let outcomes: string[] = [];
      let inThisSession = false;
      let collectingOutcomes = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Начало нашей сессии
        if (line.includes(session.title)) {
          inThisSession = true;
          collectingOutcomes = false;
          continue;
        }
        
        // Начало следующей сессии - останавливаемся
        if (inThisSession && line.match(/Session\s+\d+:/)) {
          break;
        }
        
        // Граница секции - останавливаемся
        if (line.includes('JOURNEY PACING') || 
            line.includes('STEP 6:') || 
            line.includes('═══════════')) {
          break;
        }
        
        if (inThisSession) {
          // Парсим Duration
          if (line.startsWith('Duration:')) {
            const durationMatch = line.match(/Duration:\s*(\d+)\s*min/);
            if (durationMatch) {
              estimatedDuration = parseInt(durationMatch[1], 10);
            }
          }
          
          // Начало Expected Outcomes
          if (line.includes('Expected Outcomes:')) {
            collectingOutcomes = true;
            continue;
          }
          
          // Собираем outcomes
          if (collectingOutcomes) {
            if (line.startsWith('•')) {
              outcomes.push(line.substring(1).trim());
            } else if (line.match(/Session\s+\d+:/) || 
                       line.startsWith('Duration:') ||
                       line.startsWith('✓')) {
              // Новая секция - останавливаем сбор outcomes
              collectingOutcomes = false;
            }
          }
        }
      }
      
      return {
        ...session,
        estimatedDuration,
        outcomes: outcomes.length > 0 ? outcomes : []
      };
    });
    
    // Journey Pacing
    const journeyPacingMatch = raw.match(/⏱️ JOURNEY PACING[\s\S]*?(?=👥 STEP 6:|🧠 STEP 7:|═════════════|$)/i);
    if (journeyPacingMatch) {
      const pacingSection = journeyPacingMatch[0];
      const recommendedInterval = parseKeyValue(pacingSection, 'Recommended Interval');
      const maxSessionsMatch = pacingSection.match(/Max Sessions\/Week:\s*(\d+)/i);
      
      if (recommendedInterval || maxSessionsMatch) {
        role.journeyPacing = {
          recommendedInterval: recommendedInterval || undefined,
          maxSessionsPerWeek: maxSessionsMatch ? parseInt(maxSessionsMatch[1], 10) : undefined
        };
      }
    }

    // === STEP 6: Team Collaboration ===
    const step6 = extractSection(raw, 6);
    const teamData = parseTeamCollaboration(step6);
    role.teamEnabled = teamData.teamEnabled;
    role.orchestrator = teamData.orchestrator;
    role.subRoles = teamData.subRoles;
    role.taskProtocol = teamData.taskProtocol;
    
    const memoryTransferLine = parseKeyValue(step6, 'Memory Transfer');
    if (memoryTransferLine) {
      const match = memoryTransferLine.match(/(hot|warm|full)\s+memory/i);
      if (match) {
        role.memoryTransfer = {
          enabled: true,
          scope: match[1].toLowerCase() as 'hot' | 'warm' | 'full'
        };
      }
    }

    // === STEP 7: Memory System ===
    const step7 = extractSection(raw, 7);
    
    role.hotMemory = parseKeyValue(step7, 'Hot Memory') || '';
    role.warmMemory = parseKeyValue(step7, 'Warm Memory') || '';
    role.coldMemory = parseKeyValue(step7, 'Cold Memory') || '';
    
    const memoryStrategyResult = validateEnum<MemoryStrategy>(
      parseKeyValue(step7, 'Memory Strategy'),
      ['semantic', 'chronological', 'importance', 'emotional'] as const,
      'semantic',
      'Memory Strategy'
    );
    role.memoryStrategy = memoryStrategyResult.value;
    if (memoryStrategyResult.warning) warnings.push(memoryStrategyResult.warning);
    
    role.emotionalStates = parseBulletList(step7, 'Emotional States Tracked');

    // === STEP 8: Ethics & Versions ===
    const step8Raw = extractSection(raw, 8);
    
    // ✅ FIX #2: Отделяем ethical rules от license
    const step8Parts = step8Raw.split(/📜 LICENSE DETAILS|License Type:/i);
    const ethicsSection = step8Parts[0];
    const licenseSection = step8Parts.length > 1 ? step8Parts[1] : '';
    
    // Парсим ethical rules (только из ethics секции)
    const ethicalRules: Array<{ rule: string; action: 'warn' | 'stop' | 'refer' }> = [];
    const linesStep8 = ethicsSection.split('\n');
    
    for (const line of linesStep8) {
      const trimmed = line.trim();
      if (trimmed.startsWith('✓ [')) {
        const match = trimmed.match(/✓\s*\[(\w+)\]\s*(.+)/);
        if (match) {
          const [, action, rule] = match;
          const normalizedAction = action.toLowerCase() as 'warn' | 'stop' | 'refer';
          if (['warn', 'stop', 'refer'].includes(normalizedAction)) {
            ethicalRules.push({
              rule: rule.trim(),
              action: normalizedAction
            });
          }
        }
      } else if (trimmed.startsWith('✓') && !trimmed.includes('[')) {
        // ✅ Проверяем, что это не лицензионный терм
        const isLicenseTerm = trimmed.toLowerCase().includes('can be') ||
                              trimmed.toLowerCase().includes('must attribute') ||
                              trimmed.toLowerCase().includes('cannot be');
        
        if (!isLicenseTerm) {
          ethicalRules.push({
            rule: trimmed.substring(1).trim(),
            action: 'warn'
          });
        }
      }
    }
    
    role.ethicalRules = ethicalRules.length > 0 ? ethicalRules : [];
    
    // Referral Protocol
    let inReferralProtocol = false;
    let referralTriggers: string[] = [];
    let referralMessage = '';
    
    for (const line of linesStep8) {
      const trimmed = line.trim();
      
      if (trimmed.includes('REFERRAL PROTOCOL')) {
        inReferralProtocol = true;
        continue;
      }
      
      if (inReferralProtocol) {
        if (trimmed.includes('Triggers:')) {
          const idx = linesStep8.indexOf(line);
          for (let i = idx + 1; i < linesStep8.length; i++) {
            const triggerLine = linesStep8[i].trim();
            if (triggerLine.startsWith('•')) {
              referralTriggers.push(triggerLine.substring(1).trim());
            } else if (triggerLine.startsWith('Message:') || !triggerLine) {
              break;
            }
          }
        }
        
        if (trimmed.startsWith('Message:')) {
          referralMessage = trimmed.substring('Message:'.length).trim();
          inReferralProtocol = false;
        }
      }
    }
    
    if (referralTriggers.length > 0 || referralMessage) {
      role.referralProtocol = {
        triggers: referralTriggers,
        message: referralMessage
      };
    }
    
    role.disclaimer = parseKeyValue(step8Raw, 'Disclaimer') || '';
    
    // ✅ FIX #2: Парсим лицензию из отдельной секции
    if (licenseSection) {
      const licenseService = new LicenseService();
      
      // Ищем тип лицензии
      const licenseTypeMatch = licenseSection.match(/^[\s\S]*?([A-Z\-]+(?:\-\d+\.\d+)?)/);
      if (licenseTypeMatch) {
        const licenseType = licenseTypeMatch[1].trim() as LicenseType;
        
        // Проверяем, что это валидный тип
        const validTypes: LicenseType[] = ['CC-BY-4.0', 'CC-BY-SA-4.0', 'CC-BY-NC-4.0', 'CC-BY-NC-SA-4.0', 'CUSTOM'];
        if (validTypes.includes(licenseType)) {
          role.license = licenseService.createLicenseInfo(licenseType, role.author);
          warnings.push(`License found: ${licenseType}`);
        }
      }
    }
    
    // Author & Contacts
    role.author = parseKeyValue(step8Raw, 'Author') || 'anonymous';
    role.contacts = parseKeyValue(step8Raw, 'Contacts') || '';
    
    // Changelog
    const changelog: string[] = [];
    for (const line of linesStep8) {
      const trimmed = line.trim();
      if ((trimmed.startsWith('v') || trimmed.startsWith('V')) && 
          (trimmed.includes('—') || trimmed.includes('-') || trimmed.includes(':'))) {
        changelog.push(trimmed);
      }
    }
    role.changelog = changelog;

    role.createdAt = now;
    role.updatedAt = now;

    // Валидация RML Identity если есть — управляется FEATURES.RML_IDENTITY_VALIDATION
    if (FEATURES.RML_IDENTITY_VALIDATION && role.rmlIdentity?.fullId) {
      const validation = rmlIdentityService.validateIdentity(role);
      if (!validation.valid) {
        warnings.push(
          `RML Identity mismatch in: ${validation.mismatchedComponents.join(', ')}. ` +
          `The role may have been modified since creation.`
        );
        if (!role.identityMetadata) {
          role.identityMetadata = {
            schemaVersion: '1.0',
            generatedAt: new Date().toISOString(),
            canonical: false
          };
        }
      } else {
        warnings.push('✓ RML Identity verified successfully');
      }
    }

    return {
      role,
      warnings,
      errors,
      isValid: errors.length === 0
    };

  } catch (error) {
    console.error('Error parsing RML file:', error);
    return {
      role: createEmptyRole(),
      warnings: [],
      errors: [`Failed to parse RML file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      isValid: false
    };
  }
}

export function validateRMLFile(file: File): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (file.size > 5 * 1024 * 1024) {
    errors.push('File size exceeds 5MB limit');
  }
  
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.txt') && !fileName.endsWith('.rml.txt')) {
    errors.push('File must have .txt or .rml.txt extension');
  }
  
  if (fileName.includes(' ')) {
    warnings.push('File name contains spaces. Consider using underscores instead.');
  }
  
  return {
    isValid: errors.length === 0,
    errors: [...errors, ...warnings]
  };
}
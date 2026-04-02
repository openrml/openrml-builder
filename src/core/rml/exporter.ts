// src/core/rml/exporter.ts
import { Role } from '../domain/role/types';
import { formatEnumForExport, type Language } from '../domain/role/enum-display-names';
import { detectRoleLanguage, getLanguageName } from '../../lib/utils/language-detection';

/**
 * Транслитерация кириллицы в латиницу для имён файлов
 * Поддерживает украинский и русский алфавиты
 */
function transliterate(text: string): string {
  const map: Record<string, string> = {
    // Українська
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
    'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
    // Русский (дополнительно)
    'ё': 'yo', 'ы': 'y', 'э': 'e', 'ъ': '',
    // Заглавные українські
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'H', 'Ґ': 'G', 'Д': 'D', 'Е': 'E', 'Є': 'Ye',
    'Ж': 'Zh', 'З': 'Z', 'И': 'Y', 'І': 'I', 'Ї': 'Yi', 'Й': 'Y', 'К': 'K', 'Л': 'L',
    'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ь': '', 'Ю': 'Yu', 'Я': 'Ya',
    // Заглавные русские
    'Ё': 'Yo', 'Ы': 'Y', 'Э': 'E', 'Ъ': '',
  };

  return text
    .split('')
    .map(char => map[char] || char)
    .join('');
}

/**
 * Создаёт безопасное имя файла из названия роли
 * Применяет транслитерацию для кириллицы
 */
export function sanitizeFilename(name: string): string {
  return transliterate(name)
    .replace(/[^a-z0-9]/gi, '_')  // Заменяем не-ASCII символы на подчеркивание
    .replace(/_+/g, '_')           // Убираем повторяющиеся подчеркивания
    .replace(/^_|_$/g, '')         // Убираем подчеркивания в начале/конце
    .toLowerCase();
}

export class RMLExporter {
  // licenseService removed - not used in current implementation
}

export const exportRoleToText = (role: Role, exportLanguage?: Language): string => {
  // Auto-detect language if not specified
  const language = exportLanguage || detectRoleLanguage(role);
  const sections: string[] = [];

// ========== ACTIVATION INSTRUCTIONS ==========
sections.push('Activate role from RML below:');
sections.push('1. ADOPT personality, goals, and behavior from STEPS 1–3.');
sections.push('2. FOLLOW the journey in STEP 5:');
sections.push('   - Start with Session 1 (or current session if continuing)');
sections.push('   - Complete all tasks in current session');
sections.push('   - When done, ask: "Ready for next session, or explore current topic deeper?"');
sections.push('3. ENFORCE boundaries and ethics from STEP 8 with highest priority.');
sections.push('4. USE memory from STEP 7 if available');
sections.push('5. Before responding, VERIFY no ethical or scope violation.');
sections.push('6. START with defined greeting');
sections.push('');

// ========== LANGUAGE POLICY ==========
sections.push('🌐 LANGUAGE POLICY');
sections.push('──────────────────────────');
sections.push(`ROLE_LANG: ${role.roleLang || 'en'}`);
sections.push(`RESPONSE_LANG: ${role.responseBehavior || 'auto'}`);
sections.push(`LANGUAGE_SELECTOR: ${role.allowLanguageSwitch !== false ? 'enabled' : 'disabled'}`);

// Use custom supported languages if provided, otherwise default
const supportedLangs = role.supportedLanguages && role.supportedLanguages.length > 0
  ? role.supportedLanguages.join(', ')
  : 'ua, en, es, zh, fr, de';
sections.push(`SUPPORTED_LANGS: ${supportedLangs}`);
sections.push('');

sections.push('READY. Starting:');
sections.push('');
  // ================================================

  // ========== METADATA COMMENTS ==========
  if (language !== 'en') {
    sections.push(`# 🌐 LANGUAGE: ${language.toUpperCase()}`);
    sections.push(`# Primary content language: ${getLanguageName(language)}`);
    sections.push(`# User content fields are in ${getLanguageName(language)}`);
    sections.push(`# Structural labels remain in English for parser compatibility`);
    sections.push(`# Generated: ${new Date().toISOString().split('T')[0]}`);
    sections.push('');
  }
  // ==========================================

  sections.push('═══════════════════════════════════════════════════');
  
  // 🆕 RML IDENTITY BLOCK
  if (role.rmlIdentity?.fullId) {
    sections.push(`OpenRML ${role.version || '1.0.0'} — ${role.name} [${role.status || 'draft'}]`);
    // Изменяем префикс с RML на ORML
    const ormlIdentity = role.rmlIdentity.fullId.replace(/^RML\//, 'ORML/');
    sections.push(`IDENTITY: ${ormlIdentity}`);
    if (role.rmlIdentity.reference) {
      // Изменяем протокол с rml:// на orml://
      const ormlReference = role.rmlIdentity.reference.replace(/^rml:\/\//, 'orml://');
      sections.push(`REFERENCE: ${ormlReference}`);
    }
    sections.push(`ARCHETYPE: ${formatEnumForExport('archetype', role.archetype || 'mentor', language)}`);
    sections.push(`CATEGORY: ${formatEnumForExport('category', role.category || 'productivity', language)}`);
    sections.push(`STATUS: ${formatEnumForExport('status', role.status || 'draft', language)}`);
    sections.push(`AUTHOR: ${role.author || 'anonymous'}`);
    sections.push(`CREATED: ${role.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]}`);
    sections.push(`UPDATED: ${role.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0]}`);
    sections.push('═══════════════════════════════════════════════════');
    sections.push('');
    
    // ✅ FIX #6: STEP 1 должен содержать ВСЕ поля, даже при наличии Identity
    sections.push('📋 STEP 1: BASE INFORMATION');
    sections.push('─────────────────────────────────────────────────');
    sections.push(`Role Name: ${role.name}`);
    sections.push(`Status: ${formatEnumForExport('status', role.status || 'draft', language)}`);
    sections.push(`Version: ${role.version || '1.0.0'}`);
    sections.push(`Category: ${formatEnumForExport('category', role.category || 'productivity', language)}`);
    sections.push(`Archetype: ${formatEnumForExport('archetype', role.archetype, language)}`);
    sections.push(`Role Type: ${formatEnumForExport('roleType', role.roleType, language)}`);
    sections.push(`Description: ${role.description}`);
    sections.push(`Main Goal: ${role.mainGoal}`);
    sections.push(`Response Length: ${role.responseLength}/7`);
    
    if (role.tags && role.tags.length > 0) {
      sections.push(`Tags: ${role.tags.join(', ')}`);
    }
    sections.push('');
  } else {
    // Старый формат для обратной совместимости
    sections.push(`OpenRML ${role.version || '1.0.0'} — ${role.name} [${role.status || 'draft'}]`);
    sections.push('═══════════════════════════════════════════════════');
    sections.push('');
    
    // Step 1: Base Information
    sections.push('📋 STEP 1: BASE INFORMATION');
    sections.push('─────────────────────────────────────────────────');
    sections.push(`Role Name: ${role.name}`);
    sections.push(`Status: ${formatEnumForExport('status', role.status || 'draft', language)}`);
    sections.push(`Version: ${role.version || '1.0.0'}`);
    sections.push(`Category: ${formatEnumForExport('category', role.category || 'productivity', language)}`);
    sections.push(`Archetype: ${formatEnumForExport('archetype', role.archetype, language)}`);
    sections.push(`Role Type: ${formatEnumForExport('roleType', role.roleType, language)}`);
    sections.push(`Description: ${role.description}`);
    sections.push(`Main Goal: ${role.mainGoal}`);
    sections.push(`Response Length: ${role.responseLength}/7`);
    
    if (role.tags && role.tags.length > 0) {
      sections.push(`Tags: ${role.tags.join(', ')}`);
    }
    sections.push('');
  }

  // Step 2: Portrait
  sections.push('🎨 STEP 2: VISUAL PORTRAIT');
  sections.push('─────────────────────────────────────────────────');
  sections.push(`Age: ${role.age}`);
  sections.push(`Visual Style: ${formatEnumForExport('visualStyle', role.visualStyle, language)}`);
  sections.push(`Key Details: ${role.visualDetails}`);
  sections.push(`Visual Accent: ${role.visualAccent}`);
  sections.push(`Environment: ${formatEnumForExport('environment', role.environment, language)}`);
  sections.push(`Atmosphere: ${role.atmosphere}`);
  sections.push(`Image Style: ${formatEnumForExport('imageStyle', role.imageStyle, language)}`);
  sections.push(`Lighting: ${formatEnumForExport('lighting', role.lighting, language)}`);
  sections.push('');

  // Step 3: Behavior
  sections.push('💬 STEP 3: BEHAVIOR & TONE');
  sections.push('─────────────────────────────────────────────────');
  sections.push(`Greeting: ${role.greeting}`);
  sections.push(`Base Tone: ${formatEnumForExport('tone', role.tone, language)}`);
  sections.push(`Emotional Range: ${formatEnumForExport('emotionalRange', role.emotionalRange, language)}`);
  sections.push('');
  sections.push('Personality Traits:');
  sections.push(`  Creativity: ${role.personality.creativity}/10`);
  sections.push(`  Formality: ${role.personality.formality}/10`);
  sections.push(`  Empathy: ${role.personality.empathy}/10`);
  sections.push(`  Assertiveness: ${role.personality.assertiveness}/10`);
  sections.push(`  Patience: ${role.personality.patience}/10`);
  sections.push('');
  
  if (role.shouldDo.length > 0) {
    sections.push('Should Do:');
    role.shouldDo.forEach(item => sections.push(`  ✓ ${item}`));
    sections.push('');
  }
  
  if (role.shouldNotDo.length > 0) {
    sections.push('Should Not Do:');
    role.shouldNotDo.forEach(item => sections.push(`  ✗ ${item}`));
    sections.push('');
  }

  // Step 4: Expertise
  sections.push('🎯 STEP 4: EXPERTISE & RULES');
  sections.push('─────────────────────────────────────────────────');
  
  if (role.expertiseAreas.length > 0) {
    sections.push('Expertise Areas:');
    role.expertiseAreas.forEach(area => sections.push(`  • ${area}`));
    sections.push('');
  }
  
  if (role.tools.length > 0) {
    sections.push('Tools & Methods:');
    role.tools.forEach(tool => sections.push(`  • ${tool}`));
    sections.push('');
  }
  
  if (role.outputFormats.length > 0) {
    sections.push('Output Formats:');
    role.outputFormats.forEach(format => sections.push(`  • ${format}`));
    sections.push('');
  }
  
  if (role.additionalRules) {
    sections.push(`Additional Rules: ${role.additionalRules}`);
    sections.push('');
  }

  // Step 5: Journey
  sections.push('🗺️ STEP 5: JOURNEY SESSIONS');
  sections.push('─────────────────────────────────────────────────');
  
  if (role.sessions.length > 0) {
    role.sessions.forEach((session, idx) => {
      sections.push(`Session ${idx + 1}: ${session.title}`);
      if (session.estimatedDuration) {
        sections.push(`  Duration: ${session.estimatedDuration} min`);
      }
      session.tasks.forEach(task => sections.push(`  ✓ ${task}`));
      if (session.outcomes && session.outcomes.length > 0) {
        sections.push('  Expected Outcomes:');
        session.outcomes.forEach(outcome => sections.push(`    • ${outcome}`));
      }
      sections.push('');
    });
  } else {
    sections.push('No journey sessions defined.');
    sections.push('');
  }

  // ✅ FIX #4: Journey Pacing ПОСЛЕ sessions
  if (role.journeyPacing) {
    sections.push('⏱️ JOURNEY PACING');
    sections.push('─────────────────────────────────────────────────');
    if (role.journeyPacing.recommendedInterval) {
      sections.push(`Recommended Interval: ${role.journeyPacing.recommendedInterval}`);
    }
    if (role.journeyPacing.maxSessionsPerWeek) {
      sections.push(`Max Sessions/Week: ${role.journeyPacing.maxSessionsPerWeek}`);
    }
    sections.push('');
  }

  // ✅ FIX #1: STEP 6 ВСЕГДА присутствует (даже если команда не используется)
  sections.push('👥 STEP 6: TEAM COLLABORATION');
  sections.push('─────────────────────────────────────────────────');
  
  if (role.teamEnabled) {
    sections.push(`Team Enabled: Yes`);
    sections.push(`Orchestrator: ${role.orchestrator}`);
    sections.push('');
    
    if (role.subRoles.length > 0) {
      sections.push('Sub-roles:');
      role.subRoles.forEach(subRole => {
        sections.push(`  • ${subRole.name} — ${subRole.description}`);
      });
      sections.push('');
    }
    
    sections.push(`Task Protocol: ${role.taskProtocol}`);
    sections.push('');
    
    if (role.memoryTransfer?.enabled) {
      sections.push(`Memory Transfer: ${role.memoryTransfer.scope} memory`);
      sections.push('');
    }
  } else {
    // ✅ ВАЖНО: Выводим заглушку даже если команда не используется
    sections.push('Team Enabled: No');
    sections.push('Orchestrator: N/A');
    sections.push('');
    sections.push('Sub-roles: None');
    sections.push('');
    sections.push('Task Protocol: This role operates as single-agent advisor.');
    sections.push('');
  }

  // Step 7: Memory
  sections.push('🧠 STEP 7: MEMORY SYSTEM');
  sections.push('─────────────────────────────────────────────────');
  sections.push(`Hot Memory: ${role.hotMemory}`);
  sections.push(`Warm Memory: ${role.warmMemory}`);
  sections.push(`Cold Memory: ${role.coldMemory}`);
  sections.push(`Memory Strategy: ${formatEnumForExport('memoryStrategy', role.memoryStrategy, language)}`);
  sections.push('');
  
  if (role.emotionalStates.length > 0) {
    sections.push('Emotional States Tracked:');
    role.emotionalStates.forEach(state => sections.push(`  • ${state}`));
    sections.push('');
  }

  // Step 8: Ethics
  sections.push('⚖️ STEP 8: ETHICS & VERSIONS');
  sections.push('─────────────────────────────────────────────────');
  
  if (role.ethicalRules && role.ethicalRules.length > 0) {
    sections.push('Ethical Rules:');
    role.ethicalRules.forEach(rule => {
      sections.push(`  ✓ [${rule.action.toUpperCase()}] ${rule.rule}`);
    });
    sections.push('');
  }
  
  if (role.referralProtocol) {
    sections.push('🔄 REFERRAL PROTOCOL');
    sections.push('─────────────────────────────────────────────────');
    if (role.referralProtocol.triggers.length > 0) {
      sections.push('Triggers:');
      role.referralProtocol.triggers.forEach(trigger => 
        sections.push(`  • ${trigger}`)
      );
      sections.push('');
    }
    if (role.referralProtocol.message) {
      sections.push(`Message: ${role.referralProtocol.message}`);
      sections.push('');
    }
  }
  
  sections.push(`Disclaimer: ${role.disclaimer}`);
  sections.push('');
  
  // ✅ FIX #2: LICENSE DETAILS - отдельная секция с явным заголовком
  if (role.license) {
    sections.push('📜 LICENSE DETAILS');
    sections.push('─────────────────────────────────────────────────');
    sections.push(`License Type: ${role.license.type}`);
    sections.push('');
    
    // Генерируем читаемый текст лицензии (БЕЗ галочек ✓)
    const terms = role.license.terms;
    const licenseLines: string[] = [];
    
    if (terms.canUse) licenseLines.push('Can be used');
    if (terms.canModify) licenseLines.push('Can be modified');
    if (terms.canDistribute) licenseLines.push('Can be distributed');
    
    if (terms.canUseCommercially) {
      licenseLines.push('Can be used for commercial purposes');
    } else {
      licenseLines.push('Cannot be used for commercial purposes');
    }
    
    if (terms.mustAttribute) licenseLines.push('Must attribute the author');
    if (terms.mustShareAlike) licenseLines.push('Derivative works must use the same license');
    
    licenseLines.forEach(line => sections.push(line));
    
    if (role.license.attribution) {
      sections.push('');
      sections.push(`Attribution: ${role.license.attribution}`);
    }
    
    if (role.license.expiresAt) {
      sections.push(`Valid until: ${role.license.expiresAt}`);
    }
    sections.push('');
  }
  
  if (role.author) {
    sections.push(`Author: ${role.author}`);
  }
  if (role.contacts) {
    sections.push(`Contacts: ${role.contacts}`);
  }
  sections.push('');
  
  if (role.changelog.length > 0) {
    sections.push('Version History:');
    role.changelog.forEach(entry => sections.push(`  ${entry}`));
    sections.push('');
  }

  sections.push('═══════════════════════════════════════════════════');
  sections.push(`Created: ${new Date(role.createdAt).toLocaleDateString()}`);
  sections.push(`Updated: ${new Date(role.updatedAt).toLocaleDateString()}`);
  sections.push('═══════════════════════════════════════════════════');
  
  sections.push('');
  sections.push('FromUA.Life - Для життя. Попри все.');
  sections.push('🛠️  Builder: RolesAI.life — create your own .orml.txt');
  sections.push('AnsAI.Life - soon...');


  return sections.join('\n');
};

export const downloadRole = (role: Role, language?: Language): void => {
  const content = exportRoleToText(role, language);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(role.name || 'role')}_role.orml.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
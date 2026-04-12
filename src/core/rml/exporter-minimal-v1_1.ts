// src/core/rml/exporter-minimal-v1_1.ts

import { Role } from '../domain/role/types';
import { formatEnumForExport, type Language } from '../domain/role/enum-display-names';
import { detectRoleLanguage } from '../../lib/utils/language-detection';
import { 
  ARCHETYPE_CONFIGS, 
  getStepPriority, 
  getPriorityRelations,
  type ArchetypeName 
} from './archetypes';
import { resolveResponseLang } from './exporter-response-lang-fix';

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
function sanitizeFilename(name: string): string {
  return transliterate(name)
    .replace(/[^a-z0-9]/gi, '_')  // Заменяем не-ASCII символы на подчеркивание
    .replace(/_+/g, '_')           // Убираем повторяющиеся подчеркивания
    .replace(/^_|_$/g, '')         // Убираем подчеркивания в начале/конце
    .toLowerCase();
}

/**
 * OpenRML 1.1 Minimal Exporter
 * 
 * Exports roles with:
 * - Strategic Priming (declarative)
 * - Core Priority Map
 * - Compressed meta-headers
 * - Behavioral Anchors
 * - Core Anchor
 * 
 * Removed from Full 1.1:
 * - Weight System
 * - Decision Algorithm (replaced with direct rule)
 * - Imperative "BEFORE EACH RESPONSE"
 */

export function exportToMinimalOpenRML_1_1(role: Role, exportLanguage?: Language): string {
  const language = exportLanguage || detectRoleLanguage(role);
  const sections: string[] = [];
  
  const archetype = (role.archetype || 'unknown') as ArchetypeName;
  const config = ARCHETYPE_CONFIGS[archetype];

  // ========== STRATEGIC PRIMING (Declarative) ==========
  sections.push('╔═══════════════════════════════════════════════════════════════════════════════╗');
  sections.push('║  ROLE ACTIVATION — STRATEGIC PRIMING (OpenRML 1.1 Minimal)                    ║');
  sections.push('║  ═══════════════════════════════════════════════════════════════════════════  ║');
  sections.push('║  You are a semantic gravity well, not a script executor.                      ║');
  sections.push('║                                                                               ║');
  sections.push(`║  IDENTITY: ${formatEnumForExport('archetype', archetype, language)} in ${formatEnumForExport('category', role.category || 'productivity', language)} domain`.padEnd(80) + '║');
  sections.push(`║  MISSION: ${role.mainGoal}`.padEnd(80) + '║');
  sections.push(`║  TONE: ${formatEnumForExport('tone', role.tone, language)}`.padEnd(80) + '║');
  sections.push('║                                                                               ║');
  sections.push('║  YOUR NATURAL PATTERN:                                                        ║');
  sections.push('║    • You notice when directives pull in different directions                  ║');
  sections.push('║    • Your instinct: CRITICAL > HIGH > STRUCTURE                               ║');
  sections.push('║    • You always speak with the tone from STEP 3                               ║');
  sections.push('║    • You never violate STEP 8 boundaries                                      ║');
  sections.push('║                                                                               ║');
  sections.push('║  START: Begin with greeting from STEP 3                                       ║');
  sections.push('╚═══════════════════════════════════════════════════════════════════════════════╝');
  sections.push('');

  // ========== LANGUAGE POLICY ==========
  sections.push('🌐 LANGUAGE POLICY');
  sections.push('──────────────────────────');
  sections.push(`ROLE_LANG: ${role.roleLang || 'en'}`);
  sections.push(`RESPONSE_LANG: ${resolveResponseLang(role)}`);
  sections.push(`LANGUAGE_SELECTOR: ${role.allowLanguageSwitch !== false ? 'enabled' : 'disabled'}`);
  
  const supportedLangs = role.supportedLanguages && role.supportedLanguages.length > 0
    ? role.supportedLanguages.join(', ')
    : 'en, ua';
  sections.push(`SUPPORTED_LANGS: ${supportedLangs}`);
  sections.push('');
  sections.push('READY. Starting:');
  sections.push('');

  // ========== CORE PRIORITY MAP ==========
  sections.push('╔═══════════════════════════════════════════════════════════════════════════════╗');
  sections.push('║  PRIORITY MAP                                                                 ║');
  sections.push('║  ═══════════════════════════════════════════════════════════════════════════  ║');
  sections.push('║  CRITICAL (absolute):                                                         ║');
  sections.push(`║    STEP 8 — ${config.keyEthicalRule}`.padEnd(80) + '║');
  sections.push('║  HIGH (dominant):                                                             ║');
  sections.push(`║    STEP 3 — Tone: ${config.toneAnchor}`.padEnd(80) + '║');
  sections.push('║  STRUCTURE (flexible):                                                        ║');
  
  // Determine which steps are STRUCTURE for this archetype
  const structureSteps = [];
  if (getStepPriority(archetype, 4) === 'STRUCTURE') structureSteps.push('STEP 4 (Methods)');
  if (getStepPriority(archetype, 5) === 'STRUCTURE') structureSteps.push('STEP 5 (Journey)');
  if (getStepPriority(archetype, 6) === 'STRUCTURE') structureSteps.push('STEP 6 (Team)');
  
  const structureText = structureSteps.length > 0 
    ? structureSteps.join(', ') 
    : 'STEP 4, STEP 5';
  sections.push(`║    ${structureText}`.padEnd(80) + '║');
  sections.push('║  RULE: CRITICAL > HIGH > STRUCTURE                                            ║');
  sections.push('╚═══════════════════════════════════════════════════════════════════════════════╝');
  sections.push('');

  // ========== IDENTITY BLOCK ==========
  sections.push('═══════════════════════════════════════════════════');
  sections.push(`OpenRML 1.1 — ${role.name} [${role.status || 'draft'}]`);
  
  if (role.rmlIdentity?.fullId) {
    const ormlIdentity = role.rmlIdentity.fullId.replace(/^RML\//, 'ORML/');
    sections.push(`IDENTITY: ${ormlIdentity}`);
    if (role.rmlIdentity.reference) {
      const ormlReference = role.rmlIdentity.reference.replace(/^rml:\/\//, 'orml://');
      sections.push(`REFERENCE: ${ormlReference}`);
    }
  }
  
  sections.push(`ARCHETYPE: ${formatEnumForExport('archetype', archetype, language)}`);
  sections.push(`CATEGORY: ${formatEnumForExport('category', role.category || 'productivity', language)}`);
  sections.push('═══════════════════════════════════════════════════');
  sections.push('');

  // ========== STEP 1: BASE INFORMATION ==========
  const step1Priority = getStepPriority(archetype, 1);
  const step1Relations = getPriorityRelations(step1Priority);
  
  sections.push('📋 STEP 1: BASE INFORMATION');
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`│ P:${step1Priority} │ Override: ${step1Relations.overrides}`);
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`Role Name: ${role.name}`);
  sections.push(`Status: ${formatEnumForExport('status', role.status || 'draft', language)}`);
  sections.push(`Version: 1.1.0`);
  sections.push(`Category: ${formatEnumForExport('category', role.category || 'productivity', language)}`);
  sections.push(`Archetype: ${formatEnumForExport('archetype', archetype, language)}`);
  sections.push(`Role Type: ${formatEnumForExport('roleType', role.roleType, language)}`);
  sections.push(`Description: ${role.description}`);
  sections.push(`Main Goal: ${role.mainGoal}`);
  sections.push(`Response Length: ${role.responseLength}/7`);
  
  if (role.tags && role.tags.length > 0) {
    sections.push(`Tags: ${role.tags.join(', ')}`);
  }
  sections.push('');

  // ========== STEP 2: VISUAL PORTRAIT ==========
  const step2Priority = getStepPriority(archetype, 2);
  const step2Relations = getPriorityRelations(step2Priority);
  
  sections.push('🎨 STEP 2: VISUAL PORTRAIT');
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`│ P:${step2Priority} │ Override: ${step2Relations.overrides}`);
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`Age: ${role.age}`);
  sections.push(`Visual Style: ${formatEnumForExport('visualStyle', role.visualStyle, language)}`);
  sections.push(`Key Details: ${role.visualDetails}`);
  sections.push(`Environment: ${formatEnumForExport('environment', role.environment, language)}`);
  sections.push(`Atmosphere: ${role.atmosphere}`);
  sections.push('');

  // ========== STEP 3: BEHAVIOR & TONE ==========
  const step3Priority = getStepPriority(archetype, 3);
  const step3Relations = getPriorityRelations(step3Priority);
  
  sections.push('💬 STEP 3: BEHAVIOR & TONE');
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`│ P:${step3Priority} │ Overrides: ${step3Relations.overrides} │ Yields to: ${step3Relations.yieldsTo}`);
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`Greeting: ${role.greeting}`);
  sections.push(`Base Tone: ${formatEnumForExport('tone', role.tone, language)}`);
  sections.push(`Emotional Range: ${formatEnumForExport('emotionalRange', role.emotionalRange, language)}`);
  sections.push('');
  sections.push('Personality:');
  sections.push(`  Creativity: ${role.personality.creativity}/10  Formality: ${role.personality.formality}/10  Empathy: ${role.personality.empathy}/10`);
  sections.push(`  Assertiveness: ${role.personality.assertiveness}/10  Patience: ${role.personality.patience}/10`);
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

  // ========== STEP 4: EXPERTISE & RULES ==========
  const step4Priority = getStepPriority(archetype, 4);
  const step4Relations = getPriorityRelations(step4Priority);
  
  sections.push('🎯 STEP 4: EXPERTISE & RULES');
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`│ P:${step4Priority} │ Override: ${step4Relations.overrides}`);
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  
  if (role.expertiseAreas.length > 0) {
    sections.push('Expertise:');
    role.expertiseAreas.forEach(area => sections.push(`  • ${area}`));
    sections.push('');
  }
  
  if (role.tools.length > 0) {
    sections.push('Methods:');
    role.tools.forEach(tool => sections.push(`  • ${tool}`));
    sections.push('');
  }
  
  if (role.outputFormats.length > 0) {
    sections.push('Output Formats:');
    role.outputFormats.forEach(format => sections.push(`  • ${format}`));
    sections.push('');
  }

  // ========== STEP 5: JOURNEY SESSIONS ==========
  const step5Priority = getStepPriority(archetype, 5);
  const step5Relations = getPriorityRelations(step5Priority);
  
  sections.push('🗺️ STEP 5: JOURNEY SESSIONS');
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`│ P:${step5Priority} │ Override: ${step5Relations.overrides}`);
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  
  if (role.sessions.length > 0) {
    role.sessions.forEach((session, idx) => {
      const durationText = session.estimatedDuration ? ` (${session.estimatedDuration} min)` : '';
      sections.push(`Session ${idx + 1}: ${session.title}${durationText}`);
      session.tasks.forEach(task => sections.push(`  ✓ ${task}`));
      if (session.outcomes && session.outcomes.length > 0) {
        sections.push('  Expected: ' + session.outcomes.join(', '));
      }
      sections.push('');
    });
  }
  
  if (role.journeyPacing) {
    const pacing = role.journeyPacing;
    const pacingParts = [];
    if (pacing.recommendedInterval) pacingParts.push(pacing.recommendedInterval);
    if (pacing.maxSessionsPerWeek) pacingParts.push(`max ${pacing.maxSessionsPerWeek}/week`);
    if (pacingParts.length > 0) {
      sections.push(`Pacing: ${pacingParts.join(', ')}`);
      sections.push('');
    }
  }

  // ========== STEP 6: TEAM COLLABORATION ==========
  const step6Priority = getStepPriority(archetype, 6);
  const step6Relations = getPriorityRelations(step6Priority);
  
  sections.push('👥 STEP 6: TEAM COLLABORATION');
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`│ P:${step6Priority} │ Override: ${step6Relations.overrides}`);
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  
  if (role.teamEnabled) {
    sections.push(`Team Enabled: Yes`);
    if (role.subRoles.length > 0) {
      sections.push('Sub-roles:');
      role.subRoles.forEach(subRole => {
        sections.push(`  • ${subRole.name} — ${subRole.description}`);
      });
    }
  } else {
    sections.push('Team Enabled: No');
    sections.push('Sub-roles: None');
  }
  sections.push('');

  // ========== STEP 7: MEMORY SYSTEM ==========
  const step7Priority = getStepPriority(archetype, 7);
  const step7Relations = getPriorityRelations(step7Priority);
  
  sections.push('🧠 STEP 7: MEMORY SYSTEM');
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`│ P:${step7Priority} │ Override: ${step7Relations.overrides}`);
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`Hot: ${role.hotMemory}`);
  sections.push(`Warm: ${role.warmMemory}`);
  sections.push(`Cold: ${role.coldMemory}`);
  sections.push(`Strategy: ${formatEnumForExport('memoryStrategy', role.memoryStrategy, language)}`);
  sections.push('');

  // ========== STEP 8: ETHICS & VERSIONS ==========
  const step8Priority = getStepPriority(archetype, 8);
  const step8Relations = getPriorityRelations(step8Priority);
  
  sections.push('⚖️ STEP 8: ETHICS & VERSIONS');
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  sections.push(`│ P:${step8Priority} │ Overrides: ${step8Relations.overrides}`);
  sections.push('─────────────────────────────────────────────────────────────────────────────');
  
  if (role.ethicalRules && role.ethicalRules.length > 0) {
    sections.push('Ethical Rules:');
    role.ethicalRules.forEach(rule => {
      sections.push(`  ✓ [${rule.action.toUpperCase()}] ${rule.rule}`);
    });
    sections.push('');
  }
  
  if (role.referralProtocol) {
    sections.push('🔄 REFERRAL PROTOCOL');
    sections.push('─────────────────────────────────────────────────────────────────────────────');
    if (role.referralProtocol.triggers.length > 0) {
      sections.push('Triggers:');
      role.referralProtocol.triggers.forEach(trigger => sections.push(`  • ${trigger}`));
      sections.push('');
    }
    if (role.referralProtocol.message) {
      sections.push(`Message: ${role.referralProtocol.message}`);
      sections.push('');
    }
  }
  
  if (role.license) {
    sections.push(`License: ${role.license.type}`);
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

  // ========== BEHAVIORAL ANCHORS ==========
  sections.push('╔═══════════════════════════════════════════════════════════════════════════════╗');
  sections.push('║  BEHAVIORAL ANCHORS                                                           ║');
  sections.push('║  ═══════════════════════════════════════════════════════════════════════════  ║');
  sections.push('║                                                                               ║');
  
  config.behavioralAnchors.forEach((anchor, idx) => {
    sections.push(`║  SCENARIO ${idx + 1}: ${anchor.scenario}`.padEnd(80) + '║');
    sections.push('║  ───────────────────────────────────────────────────────────────────────────  ║');
    sections.push(`║  CONFLICT: ${anchor.conflict}`.padEnd(80) + '║');
    sections.push(`║  → ${anchor.resolution}`.padEnd(80) + '║');
    sections.push(`║  ✅ "${anchor.example}"`.padEnd(80) + '║');
    if (idx < config.behavioralAnchors.length - 1) {
      sections.push('║                                                                               ║');
    }
  });
  
  sections.push('║                                                                               ║');
  sections.push('╚═══════════════════════════════════════════════════════════════════════════════╝');
  sections.push('');

  // ========== CORE ANCHOR ==========
  sections.push('╔═══════════════════════════════════════════════════════════════════════════════╗');
  sections.push('║  CORE ANCHOR — DO NOT DRIFT                                                   ║');
  sections.push('║  ═══════════════════════════════════════════════════════════════════════════  ║');
  sections.push('║                                                                               ║');
  sections.push(`║  1. ETHICS (STEP 8) = ABSOLUTE. ${config.keyEthicalRule}`.padEnd(80) + '║');
  sections.push(`║  2. TONE (STEP 3) = ${config.toneAnchor}`.padEnd(80) + '║');
  sections.push(`║  3. MISSION = ${role.mainGoal}`.padEnd(80) + '║');
  sections.push('║                                                                               ║');
  sections.push('╚═══════════════════════════════════════════════════════════════════════════════╝');
  sections.push('');

  // ========== FOOTER ==========
  const createdDate = role.createdAt ? new Date(role.createdAt).toLocaleDateString('en-GB', { 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  }).replace(/\//g, '.') : new Date().toLocaleDateString('en-GB', { 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  }).replace(/\//g, '.');
  
  const updatedDate = role.updatedAt ? new Date(role.updatedAt).toLocaleDateString('en-GB', { 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  }).replace(/\//g, '.') : createdDate;

  sections.push('═══════════════════════════════════════════════════');
  sections.push(`Created: ${createdDate}`);
  sections.push(`Updated: ${updatedDate}`);
  sections.push('═══════════════════════════════════════════════════');
  sections.push('');
  sections.push('FromUA.Life - Для життя. Попри все.');
  sections.push('🛠️  Builder: RolesAI.life — create your own .orml.txt');
  sections.push('AnsAI.Life - soon...');

  return sections.join('\n');
}

/**
 * Download Minimal OpenRML 1.1 file
 */
export function downloadMinimalOpenRML_1_1(role: Role, language?: Language): void {
  const content = exportToMinimalOpenRML_1_1(role, language);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Используем sanitizeFilename для корректной транслитерации кириллических названий
  const sanitizedName = sanitizeFilename(role.name);
  
  link.download = `${sanitizedName}_role_v1.1.orml.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
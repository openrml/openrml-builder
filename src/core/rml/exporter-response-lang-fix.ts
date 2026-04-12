// src/core/rml/exporter-response-lang-fix.ts
// Patch for existing exporters to handle new RESPONSE_LANG logic

import type { Role } from '../domain/role/types';

/**
 * Resolve RESPONSE_LANG value for export
 * 
 * Handles:
 * - Legacy 'strict' mode → converts to ROLE_LANG
 * - Behavior modes: 'auto', 'match', 'flexible'
 * - Language codes: 'en', 'ua', 'es', 'zh', 'fr', 'de'
 * - Bilingual: 'en, ua'
 */
export function resolveResponseLang(role: Role): string {
  const behavior = role.responseBehavior;
  
  // Default to 'auto' if not specified
  if (!behavior) {
    return 'auto';
  }
  
  // Handle legacy 'strict' mode
  if (behavior === 'strict') {
    return role.roleLang || 'en';
  }
  
  // Return as-is (auto, match, flexible, or language code(s))
  return behavior;
}

/**
 * Validate RESPONSE_LANG value
 * Returns true if value is valid, false otherwise
 */
export function validateResponseLang(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  
  // Empty is valid (defaults to auto)
  if (!trimmed) return true;
  
  // Behavior modes
  const behaviorModes = ['auto', 'match', 'flexible', 'strict'];
  if (behaviorModes.includes(trimmed)) return true;
  
  // Single language code
  const languageCodes = ['en', 'ua', 'es', 'zh', 'fr', 'de'];
  if (languageCodes.includes(trimmed)) return true;
  
  // Bilingual (comma-separated)
  const parts = trimmed.split(',').map(p => p.trim());
  if (parts.length === 2 && parts.every(p => languageCodes.includes(p))) {
    return true;
  }
  
  return false;
}

/**
 * Get human-readable description of RESPONSE_LANG behavior
 */
export function getResponseLangDescription(responseBehavior: string, roleLang?: string): string {
  const trimmed = responseBehavior.trim().toLowerCase();
  
  switch (trimmed) {
    case 'auto':
      return 'Automatically detects and responds in user\'s language';
    case 'match':
      return 'Mirrors user\'s language exactly';
    case 'flexible':
      return 'Switches language only when user explicitly requests';
    case 'strict':
      return `Always responds in primary language (${roleLang || 'en'})`;
    case 'en':
      return 'Always responds in English';
    case 'ua':
      return 'Always responds in Ukrainian (Завжди відповідає українською)';
    case 'es':
      return 'Always responds in Spanish (Siempre responde en español)';
    case 'zh':
      return 'Always responds in Chinese (总是用中文回复)';
    case 'fr':
      return 'Always responds in French (Répond toujours en français)';
    case 'de':
      return 'Always responds in German (Antwortet immer auf Deutsch)';
    default:
      // Check if bilingual
      if (trimmed.includes(',')) {
        const langs = trimmed.split(',').map(l => l.trim());
        return `Bilingual: responds in ${langs.join(' or ')}`;
      }
      return trimmed;
  }
}

/**
 * Example usage in exporters:
 */

// In exporter.ts:
/*
import { resolveResponseLang } from './exporter-response-lang-fix';

export const exportRoleToText = (role: Role, exportLanguage?: Language): string => {
  const sections: string[] = [];
  
  // ... other code ...
  
  // LANGUAGE POLICY
  sections.push('🌐 LANGUAGE POLICY');
  sections.push('──────────────────────────');
  sections.push(`ROLE_LANG: ${role.roleLang || 'en'}`);
  sections.push(`RESPONSE_LANG: ${resolveResponseLang(role)}`);  // ← Use helper
  sections.push(`LANGUAGE_SELECTOR: ${role.allowLanguageSwitch !== false ? 'enabled' : 'disabled'}`);
  
  const supportedLangs = role.supportedLanguages && role.supportedLanguages.length > 0
    ? role.supportedLanguages.join(', ')
    : 'en, ua';
  sections.push(`SUPPORTED_LANGS: ${supportedLangs}`);
  
  // ... rest of export ...
}
*/

// In exporter-minimal-v1_1.ts:
/*
import { resolveResponseLang } from './exporter-response-lang-fix';

export function exportToMinimalOpenRML_1_1(role: Role, exportLanguage?: Language): string {
  // ... other code ...
  
  sections.push('🌐 LANGUAGE POLICY');
  sections.push('──────────────────────────');
  sections.push(`ROLE_LANG: ${role.roleLang || 'en'}`);
  sections.push(`RESPONSE_LANG: ${resolveResponseLang(role)}`);  // ← Use helper
  sections.push(`LANGUAGE_SELECTOR: ${role.allowLanguageSwitch !== false ? 'enabled' : 'disabled'}`);
  
  // ... rest of export ...
}
*/

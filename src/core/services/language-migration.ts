// src/core/services/language-migration.ts

import type { Role, Language, ResponseBehavior } from '../domain/role/types';

/**
 * Migrate old roles without language settings to new format
 */
export function migrateLanguageSettings(role: Partial<Role>): Partial<Role> {
  // If role already has language settings, return as is
  if (role.supportedLanguages && role.responseBehavior) {
    return role;
  }
  
  // Set defaults based on roleLang if present
  const primaryLang = role.roleLang || 'en';
  
  return {
    ...role,
    roleLang: primaryLang,
    supportedLanguages: role.supportedLanguages || getDefaultSupportedLanguages(primaryLang),
    responseBehavior: role.responseBehavior || 'auto',
    allowLanguageSwitch: role.allowLanguageSwitch !== undefined ? role.allowLanguageSwitch : true,
  };
}

/**
 * Get default supported languages based on primary language
 */
function getDefaultSupportedLanguages(primaryLang: Language): Language[] {
  // Always include English and Ukrainian as base
  const base: Language[] = ['en', 'ua'];
  
  // Add primary if not already included
  if (!base.includes(primaryLang)) {
    base.push(primaryLang);
  }
  
  return base;
}

/**
 * Validate language settings
 */
export function validateLanguageSettings(role: Partial<Role>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check primary language
  if (role.roleLang) {
    const validLangs: Language[] = ['en', 'ua', 'es', 'zh', 'fr', 'de'];
    if (!validLangs.includes(role.roleLang)) {
      errors.push(`Invalid primary language: ${role.roleLang}`);
    }
  }
  
  // Check supported languages
  if (role.supportedLanguages) {
    if (role.supportedLanguages.length === 0) {
      errors.push('At least one supported language is required');
    }
    
    // Warn if primary not in supported
    if (role.roleLang && !role.supportedLanguages.includes(role.roleLang)) {
      warnings.push('Primary language should be included in supported languages');
    }
  }
  
  // Check response behavior
  if (role.responseBehavior) {
    const validBehaviors: ResponseBehavior[] = ['auto', 'match', 'strict', 'flexible'];
    if (!validBehaviors.includes(role.responseBehavior)) {
      errors.push(`Invalid response behavior: ${role.responseBehavior}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get human-readable language name
 */
export function getLanguageName(lang: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    ua: 'Українська',
    es: 'Español',
    zh: '中文',
    fr: 'Français',
    de: 'Deutsch',
  };
  
  return names[lang] || lang;
}

/**
 * Get language flag emoji
 */
export function getLanguageFlag(lang: Language): string {
  const flags: Record<Language, string> = {
    en: '🇬🇧',
    ua: '🇺🇦',
    es: '🇪🇸',
    zh: '🇨🇳',
    fr: '🇫🇷',
    de: '🇩🇪',
  };
  
  return flags[lang] || '🌐';
}

/**
 * Get response behavior description
 */
export function getResponseBehaviorDescription(behavior: ResponseBehavior): string {
  const descriptions: Record<ResponseBehavior, string> = {
    auto: 'Automatically detect and respond in user\'s language',
    match: 'Always respond in the same language as user\'s message',
    strict: 'Always respond in primary language',
    flexible: 'Switch language when user explicitly requests',
  };
  
  return descriptions[behavior] || behavior;
}

// src/lib/utils/language-detection.ts

import type { Language } from '../../core/domain/role/enum-display-names';
import type { Role } from '../../core/domain/role/types';

/**
 * Detect content language based on text analysis
 */
export function detectLanguageFromText(text: string): Language {
  if (!text || text.trim().length === 0) {
    return 'en';
  }

  const normalized = text.toLowerCase();
  
  // Count character types
  const totalChars = text.length;
  const cyrillicChars = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
  const ukrainianChars = (text.match(/[іІїЇєЄґҐ]/g) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  
  // Calculate ratios
  const cyrillicRatio = cyrillicChars / totalChars;
  const latinRatio = latinChars / totalChars;
  
  // If mostly cyrillic
  if (cyrillicRatio > 0.3) {
    // Ukrainian has specific characters
    if (ukrainianChars > 0) {
      return 'ua';
    }
    return 'ru';
  }
  
  // If mostly latin
  if (latinRatio > 0.5) {
    return 'en';
  }
  
  // Check for specific Ukrainian words
  const ukrainianWords = ['що', 'який', 'яка', 'яке', 'які', 'є', 'буде', 'має'];
  for (const word of ukrainianWords) {
    if (normalized.includes(word)) {
      return 'ua';
    }
  }
  
  // Check for specific Russian words
  const russianWords = ['что', 'который', 'которая', 'которое', 'которые', 'будет', 'имеет'];
  for (const word of russianWords) {
    if (normalized.includes(word)) {
      return 'ru';
    }
  }
  
  // Default to English
  return 'en';
}

/**
 * Detect primary language of a role based on its content
 */
export function detectRoleLanguage(role: Role): Language {
  // Combine key text fields
  const textSamples = [
    role.name,
    role.description,
    role.mainGoal,
    role.greeting,
    role.visualDetails,
    role.atmosphere,
    ...(role.shouldDo || []),
    ...(role.expertiseAreas || [])
  ].filter(Boolean);
  
  const combinedText = textSamples.join(' ');
  
  return detectLanguageFromText(combinedText);
}

/**
 * Get language name in native script
 */
export function getLanguageName(language: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    ua: 'Українська',
    ru: 'Русский'
  };
  return names[language];
}

/**
 * Get language flag emoji
 */
export function getLanguageFlag(language: Language): string {
  const flags: Record<Language, string> = {
    en: '🇬🇧',
    ua: '🇺🇦',
    ru: '🇷🇺'
  };
  return flags[language];
}

/**
 * Format language for display
 */
export function formatLanguageDisplay(language: Language): string {
  return `${getLanguageFlag(language)} ${language.toUpperCase()}`;
}

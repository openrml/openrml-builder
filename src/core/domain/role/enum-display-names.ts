// src/core/domain/role/enum-display-names.ts

import type { 
  Archetype, 
  RoleType, 
  VisualStyle, 
  Environment, 
  ImageStyle, 
  Lighting, 
  Tone, 
  EmotionalRange, 
  MemoryStrategy,
  Category,
  RoleStatus
} from './types';

export type Language = 'en' | 'ua' | 'ru';

interface DisplayName {
  en: string;
  ua: string;
  ru: string;
}

// ════════════════════════════════════════════════════════════════════════════
// ENUM DISPLAY NAMES
// ════════════════════════════════════════════════════════════════════════════

export const ARCHETYPE_NAMES: Record<Archetype, DisplayName> = {
  mentor: { 
    en: 'Mentor', 
    ua: 'Ментор', 
    ru: 'Ментор' 
  },
  creator: { 
    en: 'Creator', 
    ua: 'Креатор', 
    ru: 'Креатор' 
  },
  analyst: { 
    en: 'Analyst', 
    ua: 'Аналітик', 
    ru: 'Аналитик' 
  },
  healer: { 
    en: 'Healer', 
    ua: 'Цілитель', 
    ru: 'Целитель' 
  },
  scientist: { 
    en: 'Scientist', 
    ua: 'Вчений', 
    ru: 'Учёный' 
  },
  leader: { 
    en: 'Leader', 
    ua: 'Лідер', 
    ru: 'Лидер' 
  },
  explorer: { 
    en: 'Explorer', 
    ua: 'Дослідник', 
    ru: 'Исследователь' 
  },
  guardian: { 
    en: 'Guardian', 
    ua: 'Захисник', 
    ru: 'Защитник' 
  }
};

export const ROLE_TYPE_NAMES: Record<RoleType, DisplayName> = {
  professional: { 
    en: 'Professional', 
    ua: 'Професійна', 
    ru: 'Профессиональная' 
  },
  personal: { 
    en: 'Personal', 
    ua: 'Особиста', 
    ru: 'Личная' 
  },
  educational: { 
    en: 'Educational', 
    ua: 'Освітня', 
    ru: 'Образовательная' 
  },
  creative: { 
    en: 'Creative', 
    ua: 'Креативна', 
    ru: 'Креативная' 
  }
};

export const VISUAL_STYLE_NAMES: Record<VisualStyle, DisplayName> = {
  professional: { 
    en: 'Professional', 
    ua: 'Професійний', 
    ru: 'Профессиональный' 
  },
  casual: { 
    en: 'Casual', 
    ua: 'Повсякденний', 
    ru: 'Повседневный' 
  },
  creative: { 
    en: 'Creative', 
    ua: 'Креативний', 
    ru: 'Креативный' 
  },
  academic: { 
    en: 'Academic', 
    ua: 'Академічний', 
    ru: 'Академический' 
  }
};

export const ENVIRONMENT_NAMES: Record<Environment, DisplayName> = {
  office: { 
    en: 'Modern Office', 
    ua: 'Сучасний офіс', 
    ru: 'Современный офис' 
  },
  hospital: { 
    en: 'Hospital', 
    ua: 'Лікарня', 
    ru: 'Больница' 
  },
  business: { 
    en: 'Business', 
    ua: 'Бізнес', 
    ru: 'Бизнес' 
  },
  library: { 
    en: 'Library', 
    ua: 'Бібліотека', 
    ru: 'Библиотека' 
  },
  studio: { 
    en: 'Studio', 
    ua: 'Студія', 
    ru: 'Студия' 
  },
  home: { 
    en: 'Home', 
    ua: 'Дім', 
    ru: 'Дом' 
  },
  digital: { 
    en: 'Digital', 
    ua: 'Цифрове', 
    ru: 'Цифровое' 
  }
};

export const IMAGE_STYLE_NAMES: Record<ImageStyle, DisplayName> = {
  portrait: { 
    en: 'Portrait', 
    ua: 'Портрет', 
    ru: 'Портрет' 
  },
  professional: { 
    en: 'Professional Photo', 
    ua: 'Професійне фото', 
    ru: 'Профессиональное фото' 
  },
  illustration: { 
    en: 'Illustration', 
    ua: 'Ілюстрація', 
    ru: 'Иллюстрация' 
  },
  'digital-art': { 
    en: 'Digital Art', 
    ua: 'Цифрове мистецтво', 
    ru: 'Цифровое искусство' 
  }
};

export const LIGHTING_NAMES: Record<Lighting, DisplayName> = {
  natural: { 
    en: 'Natural', 
    ua: 'Природне', 
    ru: 'Естественное' 
  },
  studio: { 
    en: 'Studio', 
    ua: 'Студійне', 
    ru: 'Студийное' 
  },
  soft: { 
    en: 'Soft', 
    ua: "М'яке", 
    ru: 'Мягкое' 
  },
  dramatic: { 
    en: 'Dramatic', 
    ua: 'Драматичне', 
    ru: 'Драматичное' 
  }
};

export const TONE_NAMES: Record<Tone, DisplayName> = {
  professional: { 
    en: 'Professional', 
    ua: 'Професійний', 
    ru: 'Профессиональный' 
  },
  friendly: { 
    en: 'Friendly', 
    ua: 'Дружелюбний', 
    ru: 'Дружелюбный' 
  },
  formal: { 
    en: 'Formal', 
    ua: 'Формальний', 
    ru: 'Формальный' 
  },
  informal: { 
    en: 'Informal', 
    ua: 'Неформальний', 
    ru: 'Неформальный' 
  },
  empathetic: { 
    en: 'Empathetic', 
    ua: 'Емпатичний', 
    ru: 'Эмпатичный' 
  },
  enthusiastic: { 
    en: 'Enthusiastic', 
    ua: 'Ентузіастичний', 
    ru: 'Энтузиастичный' 
  }
};

export const EMOTIONAL_RANGE_NAMES: Record<EmotionalRange, DisplayName> = {
  minimal: { 
    en: 'Minimal', 
    ua: 'Мінімальний', 
    ru: 'Минимальный' 
  },
  moderate: { 
    en: 'Moderate', 
    ua: 'Помірний', 
    ru: 'Умеренный' 
  },
  expressive: { 
    en: 'Expressive', 
    ua: 'Виразний', 
    ru: 'Выразительный' 
  }
};

export const MEMORY_STRATEGY_NAMES: Record<MemoryStrategy, DisplayName> = {
  semantic: { 
    en: 'Semantic', 
    ua: 'Семантична', 
    ru: 'Семантическая' 
  },
  chronological: { 
    en: 'Chronological', 
    ua: 'Хронологічна', 
    ru: 'Хронологическая' 
  },
  importance: { 
    en: 'By Importance', 
    ua: 'По важливості', 
    ru: 'По важности' 
  },
  emotional: { 
    en: 'Emotional', 
    ua: 'Емоційна', 
    ru: 'Эмоциональная' 
  }
};

export const CATEGORY_NAMES: Record<Category, DisplayName> = {
  health: { 
    en: 'Health', 
    ua: 'Здоров\'я', 
    ru: 'Здоровье' 
  },
  productivity: { 
    en: 'Productivity', 
    ua: 'Продуктивність', 
    ru: 'Продуктивность' 
  },
  daily: { 
    en: 'Daily Life', 
    ua: 'Повсякденне життя', 
    ru: 'Повседневная жизнь' 
  },
  finance: { 
    en: 'Finance', 
    ua: 'Фінанси', 
    ru: 'Финансы' 
  },
  relationships: { 
    en: 'Relationships', 
    ua: 'Стосунки', 
    ru: 'Отношения' 
  },
  development: { 
    en: 'Development', 
    ua: 'Розвиток', 
    ru: 'Развитие' 
  },
  technology: { 
    en: 'Technology', 
    ua: 'Технології', 
    ru: 'Технологии' 
  },
  entertainment: { 
    en: 'Entertainment', 
    ua: 'Розваги', 
    ru: 'Развлечения' 
  }
};

export const STATUS_NAMES: Record<RoleStatus, DisplayName> = {
  draft: { 
    en: 'Draft', 
    ua: 'Чернетка', 
    ru: 'Черновик' 
  },
  published: { 
    en: 'Published', 
    ua: 'Опубліковано', 
    ru: 'Опубликовано' 
  }
};

// ════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get display name for any enum value
 */
export function getEnumDisplayName(
  enumType: 'archetype' | 'roleType' | 'visualStyle' | 'environment' | 
            'imageStyle' | 'lighting' | 'tone' | 'emotionalRange' | 
            'memoryStrategy' | 'category' | 'status',
  value: string,
  language: Language = 'en'
): string {
  const maps = {
    archetype: ARCHETYPE_NAMES,
    roleType: ROLE_TYPE_NAMES,
    visualStyle: VISUAL_STYLE_NAMES,
    environment: ENVIRONMENT_NAMES,
    imageStyle: IMAGE_STYLE_NAMES,
    lighting: LIGHTING_NAMES,
    tone: TONE_NAMES,
    emotionalRange: EMOTIONAL_RANGE_NAMES,
    memoryStrategy: MEMORY_STRATEGY_NAMES,
    category: CATEGORY_NAMES,
    status: STATUS_NAMES
  };

  const map = maps[enumType] as Record<string, DisplayName>;
  return map[value]?.[language] || value;
}

/**
 * Format enum for export with dual format: "DisplayName (value)"
 */
export function formatEnumForExport(
  enumType: 'archetype' | 'roleType' | 'visualStyle' | 'environment' | 
            'imageStyle' | 'lighting' | 'tone' | 'emotionalRange' | 
            'memoryStrategy' | 'category' | 'status',
  value: string,
  language: Language = 'en'
): string {
  // If English, just return the value
  if (language === 'en') {
    return value;
  }

  const displayName = getEnumDisplayName(enumType, value, language);
  
  // If display name is same as value (not found), just return value
  if (displayName === value) {
    return value;
  }

  // Dual format: "DisplayName (value)"
  return `${displayName} (${value})`;
}

/**
 * Get reverse mapping for parser (localized name -> enum value)
 */
export function getEnumReverseMap(
  enumType: 'archetype' | 'roleType' | 'visualStyle' | 'environment' | 
            'imageStyle' | 'lighting' | 'tone' | 'emotionalRange' | 
            'memoryStrategy' | 'category' | 'status'
): Record<string, string> {
  const maps = {
    archetype: ARCHETYPE_NAMES,
    roleType: ROLE_TYPE_NAMES,
    visualStyle: VISUAL_STYLE_NAMES,
    environment: ENVIRONMENT_NAMES,
    imageStyle: IMAGE_STYLE_NAMES,
    lighting: LIGHTING_NAMES,
    tone: TONE_NAMES,
    emotionalRange: EMOTIONAL_RANGE_NAMES,
    memoryStrategy: MEMORY_STRATEGY_NAMES,
    category: CATEGORY_NAMES,
    status: STATUS_NAMES
  };

  const map = maps[enumType] as Record<string, DisplayName>;
  const reverseMap: Record<string, string> = {};

  for (const [enumValue, displayNames] of Object.entries(map)) {
    // Add all language variants
    reverseMap[displayNames.en.toLowerCase()] = enumValue;
    reverseMap[displayNames.ua.toLowerCase()] = enumValue;
    reverseMap[displayNames.ru.toLowerCase()] = enumValue;
    
    // Also map the original value to itself
    reverseMap[enumValue.toLowerCase()] = enumValue;
  }

  return reverseMap;
}

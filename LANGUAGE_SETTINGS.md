# 🌐 Language Settings Feature

## Overview

The OpenRML Builder now supports comprehensive language configuration for AI roles, allowing creators to specify:
- Primary language for role content
- Multiple supported languages
- Response behavior modes
- Language switching permissions

## Configuration Options

### 1. Primary Language (`roleLang`)

The main language in which the role content is written.

**Supported languages:**
- 🇬🇧 English (`en`)
- 🇺🇦 Українська (`ua`)
- 🇪🇸 Español (`es`)
- 🇨🇳 中文 (`zh`)
- 🇫🇷 Français (`fr`)
- 🇩🇪 Deutsch (`de`)

**Example:**
```typescript
const role = {
  roleLang: 'ua', // Primary language is Ukrainian
  // ...
};
```

### 2. Supported Languages (`supportedLanguages`)

Array of languages the role can operate in.

**Default:** `['en', 'ua']`

**Example:**
```typescript
const role = {
  roleLang: 'ua',
  supportedLanguages: ['ua', 'en', 'pl'], // Can respond in Ukrainian, English, Polish
  // ...
};
```

### 3. Response Behavior (`responseBehavior`)

How the role responds to users in different languages.

#### `auto` (Default)
Automatically detects user's language and responds accordingly.

```
User: "Привіт" → Response in Ukrainian
User: "Hello" → Response in English
```

#### `match`
Always responds in the same language as the user's message.

```
User: "Привіт" → Response in Ukrainian (even if primary is English)
User: "Hola" → Response in Spanish (if supported)
```

#### `strict`
Always responds in primary language, regardless of user's language.

```
User: "Привіт" → Response in English (if primary is English)
User: "Hola" → Response in English (if primary is English)
```

#### `flexible`
Switches language only when user explicitly requests.

```
User: "Please continue in Ukrainian" → Switches to Ukrainian
User: "Продовжуй англійською" → Switches to English
```

### 4. Allow Language Switch (`allowLanguageSwitch`)

Whether users can request language changes during conversation.

**Default:** `true`

**Example:**
```typescript
const role = {
  allowLanguageSwitch: true, // User can ask "switch to English"
  // ...
};
```

## ORML Export Format

Language settings are exported in the ORML format as:

```
🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: ua
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: ua, en, es
```

## UI Configuration

Language settings are configured in **Step 1: Base Information** of the Constructor:

```
┌─────────────────────────────────┐
│ 🌐 Language Settings            │
├─────────────────────────────────┤
│ Primary Language:     [ua ▼]   │
│ Supported Languages:  ua, en, es│
│                                 │
│ Response Behavior:              │
│ ○ Auto-detect                   │
│ ○ Match user                    │
│ ● Primary only                  │
│ ○ Flexible                      │
│                                 │
│ ☑ Allow language switching      │
└─────────────────────────────────┘
```

## Migration from Old Format

Old roles without language settings are automatically migrated:

**Before (Old format):**
```typescript
{
  roleLang: 'en',
  // No other language settings
}
```

**After (Auto-migration):**
```typescript
{
  roleLang: 'en',
  supportedLanguages: ['en', 'ua'],
  responseBehavior: 'auto',
  allowLanguageSwitch: true,
}
```

## API Reference

### Type Definitions

```typescript
export type Language = 'en' | 'ua' | 'es' | 'zh' | 'fr' | 'de';

export type ResponseBehavior = 
  | 'auto'      // Auto-detect user language
  | 'match'     // Match user's language
  | 'strict'    // Always primary language
  | 'flexible'; // Switch on request

export interface Role {
  // Primary language
  roleLang?: Language;
  
  // Supported languages
  supportedLanguages?: Language[];
  
  // Response behavior
  responseBehavior?: ResponseBehavior;
  
  // Allow user to switch
  allowLanguageSwitch?: boolean;
}
```

### Helper Functions

```typescript
import { 
  migrateLanguageSettings,
  validateLanguageSettings,
  getLanguageName,
  getLanguageFlag,
  getResponseBehaviorDescription,
} from '@/core/services/language-migration';

// Migrate old role
const migratedRole = migrateLanguageSettings(oldRole);

// Validate settings
const { isValid, errors, warnings } = validateLanguageSettings(role);

// Get language display name
const name = getLanguageName('ua'); // "Українська"

// Get language flag
const flag = getLanguageFlag('ua'); // "🇺🇦"

// Get behavior description
const desc = getResponseBehaviorDescription('auto');
// "Automatically detect and respond in user's language"
```

## Use Cases

### Use Case 1: Multilingual Support Role
```typescript
{
  name: "Customer Support",
  roleLang: 'en',
  supportedLanguages: ['en', 'ua', 'es', 'fr'],
  responseBehavior: 'match', // Always match customer's language
  allowLanguageSwitch: true,
}
```

### Use Case 2: Strict Language Role
```typescript
{
  name: "Technical Documentation Writer",
  roleLang: 'en',
  supportedLanguages: ['en'],
  responseBehavior: 'strict', // Always English for consistency
  allowLanguageSwitch: false,
}
```

### Use Case 3: Flexible Bilingual Role
```typescript
{
  name: "Ukrainian-English Tutor",
  roleLang: 'ua',
  supportedLanguages: ['ua', 'en'],
  responseBehavior: 'flexible', // Switch when asked
  allowLanguageSwitch: true,
}
```

## Best Practices

1. **Choose appropriate response behavior:**
   - `auto` for most roles (best user experience)
   - `match` for support/service roles
   - `strict` for technical/formal roles
   - `flexible` for language learning roles

2. **Include primary in supported:**
   Always include the primary language in supported languages list.

3. **Limit supported languages:**
   Only include languages you can actually support. Quality over quantity.

4. **Consider your audience:**
   If targeting specific regions, prioritize those languages.

5. **Test behavior:**
   Test how your role responds in each supported language.

## Troubleshooting

### Issue: Language not working in export
**Solution:** Ensure the language code is valid (`en`, `ua`, `es`, `zh`, `fr`, `de`)

### Issue: Primary language not in supported list
**Solution:** Always include primary language in `supportedLanguages` array

### Issue: Old role doesn't have language settings
**Solution:** Use `migrateLanguageSettings()` helper to add defaults

## Future Enhancements

Potential additions:
- [ ] More languages (Polish, Japanese, Korean, etc.)
- [ ] Language detection confidence threshold
- [ ] Per-session language preferences
- [ ] Translation hints for specific terms
- [ ] Language fallback chains

## Credits

Language Settings feature implemented following ORML specification for multilingual AI roles.

---

**Last updated:** 2026-03-29

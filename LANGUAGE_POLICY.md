# Language Policy Specification — OpenRML 1.0

> **Status:** Stable  
> **Version:** 1.0.0  
> **Last Updated:** 2026-03-10

---

## Overview

OpenRML implements a **dual-layer language system**:

1. **Structural labels** (parser directives) — always in English
2. **Content fields** (user-defined text) — any language

The Language Policy subsystem manages how a role communicates with users across different languages while maintaining a single, universal format.

---

## Core Principle

```
Structure (EN) + Content (ANY) = Universal Portability
```

An OpenRML role is like HTML:
- Tags are always English (`<title>`, `<div>`)
- Content inside tags can be any language

```html
<!-- Structure: English -->
<title>Домашній Організатор</title>

<!-- Content: Ukrainian -->
<p>Привіт! Готовий трансформувати твій дім?</p>
```

Similarly in OpenRML:
```
STEP 1: BASE INFORMATION          ← structure (EN)
Role Name: Домашній Організатор    ← content (UA)
Greeting: Привіт! Готовий...       ← content (UA)
```

---

## Language Policy Block

Every OpenRML export includes a Language Policy block positioned **before** the activation preamble ends:

```
🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: ua
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: ua, en, zh, es, fr
```

This block is **mandatory** in OpenRML 1.0 and later.

---

## Field Specifications

### 1. ROLE_LANG

**Purpose:** The default language in which the role communicates.

**Type:** ISO 639-1 two-letter language code

**Valid values:**
```
en  — English
ua  — Ukrainian
ru  — Russian (deprecated in OpenRML)
zh  — Chinese (Simplified)
es  — Spanish
fr  — French
de  — German
pt  — Portuguese
ja  — Japanese
ko  — Korean
... any ISO 639-1 code
```

**Default:** `en`

**Examples:**
```
ROLE_LANG: ua    ← role starts conversations in Ukrainian
ROLE_LANG: en    ← role starts conversations in English
ROLE_LANG: zh    ← role starts conversations in Chinese
```

**Behavior:**
- The role uses this language for the `greeting` field
- If `RESPONSE_LANG: match`, this is the only language used
- If `RESPONSE_LANG: auto`, this is the fallback when user language cannot be detected

---

### 2. RESPONSE_LANG

**Purpose:** How the role responds to user messages in different languages.

**Type:** enum or ISO 639-1 code

**Valid values:**

| Value | Behavior |
|-------|----------|
| `auto` | **Recommended.** Role detects user language and responds in kind |
| `{lang-code}` | Role always responds in this language (e.g., `ua`, `en`) |
| `match` | Role mirrors user's language exactly (no intelligence) |

**Default:** `auto`

**Examples:**

#### Example 1: `auto` (recommended)
```
ROLE_LANG: ua
RESPONSE_LANG: auto
```

**Behavior:**
```
User (UA): Привіт! Допоможи організувати кухню
Role (UA): Привіт! Готовий трансформувати твою кухню...

User (EN): Hi! Help me organize my kitchen
Role (EN): Hello! Ready to transform your kitchen...

User (ZH): 你好，帮我整理厨房
Role (ZH): 你好！准备好改造你的厨房了...
```

✅ Role **intelligently adapts** to user's language.

---

#### Example 2: Fixed language
```
ROLE_LANG: ua
RESPONSE_LANG: ua
```

**Behavior:**
```
User (EN): Hi! Help me organize
Role (UA): Привіт! Я тут, щоб допомогти організувати...

User (ZH): 你好
Role (UA): Привіт! Я можу спілкуватися тільки українською.
```

✅ Role **always** responds in Ukrainian.

**Use cases:**
- Language learning roles (teacher must use target language)
- Cultural-specific roles (requires native language context)
- Regulatory compliance (e.g., medical advice must be in specific language)

---

#### Example 3: `match` (mirror)
```
ROLE_LANG: en
RESPONSE_LANG: match
```

**Behavior:**
```
User: "Привіт! Hello! 你好"
Role: "Привіт! Hello! 你好 — How can I help?"
```

⚠️ Role **mirrors** mixed-language input without intelligence.

**Use cases:**
- Rare. Typically `auto` is better.
- Debugging or educational contexts

---

### 3. LANGUAGE_SELECTOR

**Purpose:** Whether the user can manually choose the language in a chat interface.

**Type:** boolean

**Valid values:**
```
enabled   ← user can select language via UI control
disabled  ← role manages language automatically
```

**Default:** `enabled`

**Behavior:**

#### When `enabled`:
```
┌────────────────────────────┐
│ Language: [UA ▼]           │  ← User sees dropdown
│           UA               │
│           EN               │
│           ZH               │
└────────────────────────────┘
```

User can **override** the auto-detected language.

**Example flow:**
```
1. User writes in English → role detects EN
2. User switches dropdown to UA → role switches to UA
3. User continues in EN → role stays in UA (manual override)
```

#### When `disabled`:
```
[No language selector in UI]
```

Role **fully controls** language based on `RESPONSE_LANG` strategy.

**Use cases for `disabled`:**
- Language learning (teacher controls language)
- Fixed-language services (legal, medical)
- Simplified UX (fewer controls)

---

### 4. SUPPORTED_LANGS

**Purpose:** List of languages the role can communicate in.

**Type:** Comma-separated list of ISO 639-1 codes

**Format:**
```
SUPPORTED_LANGS: ua, en, zh, es, fr
```

**Behavior:**
- If `RESPONSE_LANG: auto`, role can switch to any of these languages
- If user requests unsupported language, role responds in `ROLE_LANG`

**Example:**
```
ROLE_LANG: ua
RESPONSE_LANG: auto
SUPPORTED_LANGS: ua, en

User (ZH): 你好，帮我整理
Role (EN): I'm sorry, I can only communicate in Ukrainian and English.
```

❌ Chinese not supported → fallback to English (first in SUPPORTED_LANGS after ROLE_LANG)

---

## Technical Implementation

### Language Detection

OpenRML implementations SHOULD use LLM capabilities for language detection:

```javascript
// Pseudo-code for language detection
async function detectLanguage(userMessage) {
  // Option 1: Heuristic (fast, less accurate)
  const patterns = {
    ua: /[а-яіїєґ]/i,
    en: /^[a-z\s\.,!?]+$/i,
    zh: /[\u4e00-\u9fff]/,
  };
  
  // Option 2: LLM-based (slower, more accurate)
  const prompt = `Detect the primary language of: "${userMessage}"
  Respond with ISO 639-1 code only (e.g., "en", "ua", "zh")`;
  
  const langCode = await callLLM(prompt);
  return langCode.trim().toLowerCase();
}
```

**Recommended:** Combine heuristics for obvious cases (all Cyrillic → `ua`) and LLM for ambiguous cases.

---

### Response Generation

```javascript
class Role {
  constructor(config) {
    this.roleLang = config.ROLE_LANG || 'en';
    this.responseLang = config.RESPONSE_LANG || 'auto';
    this.supportedLangs = config.SUPPORTED_LANGS.split(',').map(s => s.trim());
  }
  
  async respond(userMessage) {
    let targetLang;
    
    if (this.responseLang === 'auto') {
      const detectedLang = await detectLanguage(userMessage);
      
      if (this.supportedLangs.includes(detectedLang)) {
        targetLang = detectedLang;
      } else {
        targetLang = this.roleLang; // fallback
      }
    } else if (this.responseLang === 'match') {
      targetLang = 'match'; // mirror input
    } else {
      targetLang = this.responseLang; // fixed language
    }
    
    return await this.generate(userMessage, targetLang);
  }
  
  async generate(message, lang) {
    const systemPrompt = `${this.roleDefinition}
    
    Respond in ${lang === 'match' ? 'the same language as user' : lang}.`;
    
    return await callLLM(systemPrompt, message);
  }
}
```

---

## Format Specification

### Placement in Export

The Language Policy block appears **after** the activation instructions and **before** "READY. Starting:":

```
Activate role from RML below:
1. ADOPT personality, goals, and behavior from STEPS 1–3.
2. FOLLOW the journey in STEP 5...
...
6. START with defined greeting

🌐 LANGUAGE POLICY               ← HERE
──────────────────────────
ROLE_LANG: ua
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: ua, en, zh, es, fr

READY. Starting:                 ← AFTER

═══════════════════════════════════════════════════
OpenRML 1.0.0 — Home Organizer [published]
...
```

### Exact Format

```
🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: {code}
RESPONSE_LANG: {auto|match|code}
LANGUAGE_SELECTOR: {enabled|disabled}
SUPPORTED_LANGS: {code1, code2, ...}
```

**Rules:**
- Section header: `🌐 LANGUAGE POLICY` (globe emoji + space + text)
- Separator: 30 × `─` (U+2500 BOX DRAWINGS LIGHT HORIZONTAL)
- Field format: `FIELD_NAME: value` (no quotes)
- Spacing: single blank line before and after block
- Order: ROLE_LANG → RESPONSE_LANG → LANGUAGE_SELECTOR → SUPPORTED_LANGS

---

## Validation Rules

A compliant OpenRML implementation MUST validate:

### 1. ROLE_LANG

✅ **Valid:**
```
ROLE_LANG: en
ROLE_LANG: ua
ROLE_LANG: zh
```

❌ **Invalid:**
```
ROLE_LANG: english        # not ISO 639-1
ROLE_LANG: EN            # uppercase (must be lowercase)
ROLE_LANG: uk            # wrong code (use 'ua' for Ukrainian)
ROLE_LANG:               # empty
```

---

### 2. RESPONSE_LANG

✅ **Valid:**
```
RESPONSE_LANG: auto
RESPONSE_LANG: match
RESPONSE_LANG: en
RESPONSE_LANG: ua
```

❌ **Invalid:**
```
RESPONSE_LANG: automatic  # not a valid keyword
RESPONSE_LANG: Auto       # case-sensitive
RESPONSE_LANG: en, ua     # cannot be a list
```

---

### 3. LANGUAGE_SELECTOR

✅ **Valid:**
```
LANGUAGE_SELECTOR: enabled
LANGUAGE_SELECTOR: disabled
```

❌ **Invalid:**
```
LANGUAGE_SELECTOR: true   # use 'enabled'
LANGUAGE_SELECTOR: yes    # use 'enabled'
LANGUAGE_SELECTOR: on     # use 'enabled'
```

---

### 4. SUPPORTED_LANGS

✅ **Valid:**
```
SUPPORTED_LANGS: ua, en, zh, es, fr
SUPPORTED_LANGS: en
SUPPORTED_LANGS: ua, en
```

❌ **Invalid:**
```
SUPPORTED_LANGS:                    # empty
SUPPORTED_LANGS: ua,en,zh           # no spaces after commas (should have)
SUPPORTED_LANGS: UA, EN             # uppercase
SUPPORTED_LANGS: english, ukrainian # not ISO codes
```

**Constraint:** `ROLE_LANG` MUST be in `SUPPORTED_LANGS`.

---

## Use Case Examples

### Use Case 1: Universal Personal Assistant

```
ROLE_LANG: en
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: ua, en, zh, es, fr, de, pt, ja
```

**Goal:** Maximum accessibility. One role works for global users.

**Behavior:**
- Starts in English (default)
- Adapts to user's language automatically
- Supports 8 languages
- User can manually select if auto-detection fails

---

### Use Case 2: Ukrainian Language Teacher

```
ROLE_LANG: ua
RESPONSE_LANG: ua
LANGUAGE_SELECTOR: disabled
SUPPORTED_LANGS: ua
```

**Goal:** Teach Ukrainian. Role MUST use Ukrainian only.

**Behavior:**
- Always responds in Ukrainian
- Even if user writes English, responds in Ukrainian
- No language selector (teacher controls language)

---

### Use Case 3: Bilingual Customer Support

```
ROLE_LANG: en
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: en, ua
```

**Goal:** Support English and Ukrainian customers.

**Behavior:**
- Detects if customer writes EN or UA
- Responds in detected language
- User can switch manually if needed
- Falls back to EN for unsupported languages

---

### Use Case 4: Fixed English (International SaaS)

```
ROLE_LANG: en
RESPONSE_LANG: en
LANGUAGE_SELECTOR: disabled
SUPPORTED_LANGS: en
```

**Goal:** Company policy requires English for support consistency.

**Behavior:**
- Always English, no exceptions
- No language selector
- Clear expectations for users

---

## Migration from RML to OpenRML

### Breaking Changes

OpenRML 1.0 introduces **mandatory Language Policy**.

**RML (old):**
```
[No Language Policy block]

OpenRML 1.0 — Role Name
...
```

**OpenRML (new):**
```
🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: en
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: ua, en, zh, es, fr

READY. Starting:

OpenRML 1.0 — Role Name
...
```

### Default Values for Legacy Roles

If importing an old RML file without Language Policy:

```javascript
const defaults = {
  ROLE_LANG: 'en',
  RESPONSE_LANG: 'auto',
  LANGUAGE_SELECTOR: 'enabled',
  SUPPORTED_LANGS: 'ua, en, zh, es, fr'
};
```

---

## Internationalization (i18n) vs Language Policy

**Confusion point:** These are different systems.

### UI Internationalization
Controls **constructor interface** language (labels, buttons, menus).

```
┌─────────────────────────────┐
│ Role Name *   ← label (EN)  │
│ Назва ролі *  ← label (UA)  │
└─────────────────────────────┘
```

User can switch constructor UI between EN/UA.

### Language Policy
Controls **role behavior** language (how role speaks with end-users).

```
Role: Привіт! Готовий трансформувати дім? ← role speaks UA
```

**These are independent:**
- Constructor UI: UA (user prefers Ukrainian interface)
- Role behavior: EN (role communicates in English)

---

## Frequently Asked Questions

### Q: Can a role speak 50 languages?

**A:** Technically yes, but quality depends on LLM training data. Most LLMs are strongest in English, Chinese, Spanish, French, German. For best quality, limit to well-supported languages.

```
SUPPORTED_LANGS: en, zh, es, fr, de, pt, ja, ko
```

---

### Q: How does the role know grammar in different languages?

**A:** The underlying LLM (Claude, ChatGPT, etc.) was trained on billions of texts in many languages. It "knows" grammar internally. The Language Policy just signals which language to use.

---

### Q: What if I want the role to ONLY use Ukrainian?

**A:**
```
ROLE_LANG: ua
RESPONSE_LANG: ua
SUPPORTED_LANGS: ua
```

---

### Q: Can I create a role for code-switching users (e.g., Spanglish)?

**A:**
```
RESPONSE_LANG: match
```

This mirrors the user's mixed-language input.

---

### Q: What happens if user asks for an unsupported language?

**A:** Role responds in `ROLE_LANG` with a message like:

```
User (FR): Bonjour, aide-moi
Role (EN): I'm sorry, I can only communicate in English and Ukrainian.
```

---

### Q: Can SUPPORTED_LANGS be empty?

**A:** No. Must contain at least `ROLE_LANG`.

❌ Invalid:
```
ROLE_LANG: en
SUPPORTED_LANGS:
```

✅ Valid:
```
ROLE_LANG: en
SUPPORTED_LANGS: en
```

---

## Best Practices

### For Role Authors

1. **Start with auto:** `RESPONSE_LANG: auto` works for 90% of use cases
2. **Be realistic:** Don't add 50 languages. Stick to 3-5 well-supported ones
3. **Test each language:** If you add `zh`, test that the role works well in Chinese
4. **Document exceptions:** If role must be fixed-language, explain why in README

### For Implementers

1. **Validate on import:** Check Language Policy syntax
2. **Provide defaults:** If importing old RML, add sensible defaults
3. **Expose in UI:** Show ROLE_LANG setting in constructor Step 1
4. **Log language switches:** Help debug auto-detection issues

---

## Reference Implementation

See `src/core/rml/exporter.ts` (lines 28-38):

```typescript
// Language Policy export
sections.push('🌐 LANGUAGE POLICY');
sections.push('──────────────────────────');
sections.push(`ROLE_LANG: ${role.roleLang || 'en'}`);
sections.push('RESPONSE_LANG: auto');
sections.push('LANGUAGE_SELECTOR: enabled');
sections.push('SUPPORTED_LANGS: ua, en, zh, es, fr');
sections.push('');
```

---

## Versioning

This specification is part of **OpenRML Format 1.0**.

Future versions may add:
- `RESPONSE_LANG: smart` (context-aware, not just detection)
- `FALLBACK_LANG` (secondary fallback)
- `TRANSLATION_MODE: yes|no` (allow LLM to translate vs reject)

Changes will be announced with format version increment.

---

## Compliance

A compliant OpenRML 1.0 implementation MUST:

- ✅ Export Language Policy block in exact format
- ✅ Place Language Policy before "READY. Starting:"
- ✅ Validate all four fields (ROLE_LANG, RESPONSE_LANG, LANGUAGE_SELECTOR, SUPPORTED_LANGS)
- ✅ Respect `ROLE_LANG` as default language
- ✅ Support `RESPONSE_LANG: auto` (minimum requirement)
- ✅ Reject roles where `ROLE_LANG` not in `SUPPORTED_LANGS`

A compliant OpenRML 1.0 implementation MAY:

- 🔵 Support additional `RESPONSE_LANG` modes
- 🔵 Implement advanced language detection
- 🔵 Add UI controls for language selection

---

*This document is part of the OpenRML 1.0 specification.*  
*Changes require maintainer consensus and version increment.*

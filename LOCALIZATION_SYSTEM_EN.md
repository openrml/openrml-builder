# OPENRML LOCALIZATION SYSTEM

## Overview

OpenRML has a **two-level localization system**:

1. **ROLE_LANG** — the language the role speaks by default
2. **RESPONSE_LANG** — how the role responds to user language

This allows you to create **one role** that works with **multiple languages**.

---

## 🌐 LANGUAGE POLICY: Field-by-Field Breakdown

```
🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: en              ← Role's default language
RESPONSE_LANG: auto        ← Strategy for responding to user
LANGUAGE_SELECTOR: enabled ← Can user choose language
SUPPORTED_LANGS: en, ua, zh, es, fr ← Supported languages
```

---

## 1. ROLE_LANG (Role Language)

### What is it?

The language the role **speaks by default** if the user hasn't specified otherwise.

### Possible values:

```
ROLE_LANG: en   ← English
ROLE_LANG: ua   ← Ukrainian
ROLE_LANG: ru   ← Russian (not recommended in OpenRML)
ROLE_LANG: zh   ← Chinese
ROLE_LANG: es   ← Spanish
ROLE_LANG: fr   ← French
... and other ISO 639-1 codes
```

### Example:

```
ROLE_LANG: en

Role Name: Home Organizer
Greeting: Hello! Ready to transform your home?
```

**What happens:**
- Role **starts conversation in English**
- If user writes EN → continues EN
- If user writes UA → depends on `RESPONSE_LANG`

---

## 2. RESPONSE_LANG (Response Strategy)

### What is it?

How the role **responds to the language** the user uses.

### Possible values:

| Value | Behavior |
|-------|----------|
| `auto` | Role adapts to user's language (recommended) |
| `en` | Role always responds in EN (even if user writes UA) |
| `ua` | Role always responds in UA |
| `match` | Role mirrors user's language exactly (no adaptation) |

---

### `auto` Mode (recommended)

**Behavior:** Role **intelligently adapts** to the user's language.

#### Scenario 1: English Speaker

```
ROLE_LANG: en
RESPONSE_LANG: auto

User: Hi! I need help organizing my home
Role: Hello! Ready to transform your home into an organized...
```

✅ Role speaks EN because `ROLE_LANG: en` and user writes EN.

---

#### Scenario 2: Ukrainian Using English Role

```
ROLE_LANG: en
RESPONSE_LANG: auto

User: Привіт! Потрібна допомога з організацією
Role: Привіт! Я тут, щоб допомогти створити організований простір...
```

✅ Role **automatically switched to UA** because `RESPONSE_LANG: auto` and user writes UA.

---

#### Scenario 3: Mixed Conversation

```
User: Hi! Можеш допомогти?
Role: Hello! Of course, I can help you organize your home...
```

✅ Role **adapts to the primary language** in the message.

---

### `en` Mode (fixed language)

**Behavior:** Role **always** responds in English, regardless of user's language.

```
ROLE_LANG: en
RESPONSE_LANG: en

User: Привіт! Потрібна допомога
Role: Hello! I'm here to help you...
```

**When to use:**
- Role for English-speaking users (language learning, cultural context)
- Role that cannot work in other languages (specific terminology)

---

### `match` Mode (mirror)

**Behavior:** Role **exactly repeats** user's language without intelligent adaptation.

```
ROLE_LANG: en
RESPONSE_LANG: match

User: Hello! Привіт!
Role: Hello! Привіт! ← mirrored
```

**When to use:**
- Rarely. Usually `auto` is better.

---

## 3. LANGUAGE_SELECTOR (User Language Choice)

### What is it?

Whether the user can **manually choose language** in chat with the role.

### Possible values:

```
LANGUAGE_SELECTOR: enabled   ← User can choose language
LANGUAGE_SELECTOR: disabled  ← User cannot choose (role manages itself)
```

---

### Example with `enabled`:

```
LANGUAGE_SELECTOR: enabled

User: (sees language switcher in chat UI)
┌────────────────────────────┐
│ Language: [EN ▼]           │
│           EN               │
│           UA               │
│           ZH               │
└────────────────────────────┘

User selects UA →

Role: Привіт! Я тут, щоб допомогти...
```

✅ User **controls** role's language.

---

### Example with `disabled`:

```
LANGUAGE_SELECTOR: disabled

User: (does NOT see language switcher in chat UI)

Role automatically manages language based on RESPONSE_LANG
```

✅ Role **determines language itself** (usually via `auto`).

---

## 4. SUPPORTED_LANGS (Supported Languages)

### What is it?

List of languages the role **can** speak.

### Format:

```
SUPPORTED_LANGS: en, ua, zh, es, fr
                 └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘
                  EN   UA   CN   ES   FR
```

---

### How it works:

```
RESPONSE_LANG: auto
SUPPORTED_LANGS: en, ua

User writes: "你好，我需要帮助" (in Chinese)
Role: "I'm sorry, I can only communicate in English and Ukrainian."
```

❌ Role **doesn't speak Chinese** because `zh` is not in `SUPPORTED_LANGS`.

---

```
RESPONSE_LANG: auto
SUPPORTED_LANGS: en, ua, zh

User writes: "你好，我需要帮助"
Role: "你好！我在这里帮助你..." (in Chinese)
```

✅ Role **speaks Chinese** because `zh` is in `SUPPORTED_LANGS`.

---

## CONFIGURATION COMBINATIONS

### Combination 1: Universal Role (recommended)

```
ROLE_LANG: en
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: en, ua, zh, es, fr
```

**Behavior:**
- Role starts in English
- Adapts to user's language
- User can choose language manually
- Supports 5 languages

**Example:** Home Organizer in OpenRML

---

### Combination 2: English Only

```
ROLE_LANG: en
RESPONSE_LANG: en
LANGUAGE_SELECTOR: disabled
SUPPORTED_LANGS: en
```

**Behavior:**
- Role always speaks EN
- Doesn't adapt to other languages
- User cannot choose language

**Example:** English language teacher

---

### Combination 3: Bilingual Role

```
ROLE_LANG: en
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: en, ua
```

**Behavior:**
- Role starts in English
- Switches to UA if user writes UA
- User can choose EN or UA

**Example:** International career coach

---

## HOW IT WORKS UNDER THE HOOD

### Step 1: Initialization

```
Role loads with ROLE_LANG: en

Role.currentLanguage = "en"
Role.greeting = "Hello! Ready to transform your home?"
```

---

### Step 2: User sends message

```
User.message = "Привіт! Потрібна допомога з організацією"

if (RESPONSE_LANG === "auto") {
  detectedLang = detectLanguage(User.message) // "ua"
  
  if (SUPPORTED_LANGS.includes(detectedLang)) {
    Role.currentLanguage = detectedLang // "ua"
  }
}
```

---

### Step 3: Role responds

```
Role.currentLanguage = "ua"

Role.response = generateResponse(
  context: User.message,
  language: "ua",
  roleData: {...}
)

→ "Привіт! Я тут, щоб допомогти створити організований простір..."
```

---

## LANGUAGE DETECTION

OpenRML uses **built-in LLM capabilities** for language detection:

```javascript
// Pseudocode
function detectLanguage(text) {
  const patterns = {
    en: /^[a-z\s\.,!?]+$/i,
    ua: /[а-яіїєґ]/i,
    zh: /[\u4e00-\u9fff]/,
    // ... other languages
  };
  
  // LLM also analyzes context
  // Not just symbols, but sentence structure
}
```

**Example:**

```
"Hello! Як справи?" 
→ detected as EN (more EN symbols)

"Привіт! How are you?"
→ detected as UA (starts with UA)
```

---

## FALLBACK STRATEGY

What does the role do if it **cannot determine language**?

```
ROLE_LANG: en
RESPONSE_LANG: auto

User: "🤔❓"

Role fallback:
  1. Check ROLE_LANG → en
  2. Respond in ROLE_LANG language
  
→ "Hello! I didn't quite understand. Could you rephrase?"
```

---

## REAL-LIFE EXAMPLES

### Example 1: Home Organizer (universal)

```yaml
ROLE_LANG: en
RESPONSE_LANG: auto
SUPPORTED_LANGS: en, ua, zh, es, fr

# Scenario 1: American
User: "Help me organize my kitchen"
Role: "Of course! Let's start by assessing the current state..."

# Scenario 2: Ukrainian
User: "Допоможи організувати кухню"
Role: "Звісно! Почнемо з оцінки поточного стану..."

# Scenario 3: Chinese
User: "帮我整理厨房"
Role: "当然！让我们从评估当前状态开始..."
```

✅ One role → three languages automatically.

---

### Example 2: English Teacher

```yaml
ROLE_LANG: en
RESPONSE_LANG: en
SUPPORTED_LANGS: en

# All scenarios
User: "Привіт, навчи мене англійської"
Role: "Hello! I'm an English teacher. Shall we start the lesson?"

User: "你好"
Role: "Hello! I can only communicate in English."
```

✅ Role **always** EN (for language learning).

---

### Example 3: Multilingual Therapist

```yaml
ROLE_LANG: en
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: en, ua, ru, es, fr, de

# User can choose any of 6 languages
# Role supports all 6
```

✅ Maximum accessibility.

---

## CONFIGURATION IN BUILDER

### In Step 1:

```
┌─────────────────────────────────────┐
│ Role Language *                     │
│                                     │
│ ◉ English (EN)  ○ Українська (UA)  │
│                                     │
│ Primary language in which the role  │
│ will communicate                    │
└─────────────────────────────────────┘
```

This sets `ROLE_LANG`.

---

### RESPONSE_LANG and SUPPORTED_LANGS:

Currently set **automatically**:

```javascript
// Automatic values
RESPONSE_LANG: "auto"  // always
SUPPORTED_LANGS: "en, ua, zh, es, fr"  // always

// Future versions will allow customization
```

---

## FAQ

**Q: Can a role speak 10 languages?**  
A: Yes, if you add them to `SUPPORTED_LANGS`. But quality depends on LLM capabilities.

**Q: How does the role know UA/EN/ZH grammar?**  
A: The LLM is trained on billions of texts in these languages. It "knows" grammar internally.

**Q: Can I create an English-only role?**  
A: Yes:
```
ROLE_LANG: en
RESPONSE_LANG: en
SUPPORTED_LANGS: en
```

**Q: What if user writes in mixed language?**  
A: `RESPONSE_LANG: auto` will try to determine the dominant language. Usually works well.

**Q: How to add a new language?**  
A: Just add the code to `SUPPORTED_LANGS`:
```
SUPPORTED_LANGS: en, ua, pl, de, it
```

---

## CONCLUSION

OpenRML localization system is **intelligent language adaptation**:

1. **ROLE_LANG** — starting language
2. **RESPONSE_LANG** — adaptation strategy
3. **LANGUAGE_SELECTOR** — user control
4. **SUPPORTED_LANGS** — list of possible languages

Together they provide:
- ✅ Universality (one role → many languages)
- ✅ Flexibility (from monolingual to multilingual)
- ✅ UX (user doesn't think about language, role adapts)

---

**Example of ideal configuration:**

```
🌐 LANGUAGE POLICY
ROLE_LANG: en              ← your primary language
RESPONSE_LANG: auto        ← smart adaptation
LANGUAGE_SELECTOR: enabled ← user can choose
SUPPORTED_LANGS: en, ua, zh, es, fr ← wide support
```

Such a role is **accessible to everyone**, but **preserves your language** as the base.

---

*OpenRML Team • 2026*  
*RolesAI.life — create multilingual AI roles*

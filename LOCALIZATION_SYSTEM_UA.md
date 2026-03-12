# СИСТЕМА ЛОКАЛІЗАЦІЇ OPENRML

## Огляд

OpenRML має **дворівневу систему локалізації**:

1. **ROLE_LANG** — мова, якою роль спілкується за замовчуванням
2. **RESPONSE_LANG** — як роль реагує на мову користувача

Це дозволяє створити **одну роль**, яка працює з **багатьма мовами**.

---

## 🌐 LANGUAGE POLICY: Розбір по полях

```
🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: ua              ← Мова ролі за замовчуванням
RESPONSE_LANG: auto        ← Стратегія реагування на user
LANGUAGE_SELECTOR: enabled ← Чи може user вибрати мову
SUPPORTED_LANGS: ua, en, zh, es, fr ← Підтримувані мови
```

---

## 1. ROLE_LANG (Мова ролі)

### Що це?

Мова, якою роль **говорить за замовчуванням**, якщо користувач не вказав інше.

### Можливі значення:

```
ROLE_LANG: en   ← Англійська
ROLE_LANG: ua   ← Українська
ROLE_LANG: ru   ← Російська (не рекомендується в OpenRML)
ROLE_LANG: zh   ← Китайська
ROLE_LANG: es   ← Іспанська
ROLE_LANG: fr   ← Французька
... та інші ISO 639-1 коди
```

### Приклад:

```
ROLE_LANG: ua

Role Name: Домашній Організатор
Greeting: Привіт! Готові трансформувати свій дім?
```

**Що відбувається:**
- Роль **починає розмову українською**
- Якщо user пише UA → продовжує UA
- Якщо user пише EN → залежить від `RESPONSE_LANG`

---

## 2. RESPONSE_LANG (Стратегія відповідей)

### Що це?

Як роль **реагує на мову**, яку використовує користувач.

### Можливі значення:

| Значення | Поведінка |
|----------|-----------|
| `auto` | Роль підлаштовується під мову user (рекомендовано) |
| `ua` | Роль завжди відповідає UA (навіть якщо user пише EN) |
| `en` | Роль завжди відповідає EN |
| `match` | Роль дзеркально повторює мову user (без підстроювання) |

---

### Режим `auto` (рекомендовано)

**Поведінка:** Роль **розумно підлаштовується** під мову користувача.

#### Сценарій 1: Українець

```
ROLE_LANG: ua
RESPONSE_LANG: auto

User: Привіт! Потрібна допомога з організацією
Role: Привіт! Готовий трансформувати твій дім на організований...
```

✅ Роль говорить UA, бо `ROLE_LANG: ua` і user пише UA.

---

#### Сценарій 2: Англієць використовує українську роль

```
ROLE_LANG: ua
RESPONSE_LANG: auto

User: Hi! I need help organizing my home
Role: Hello! I'm here to help you create an organized space...
```

✅ Роль **автоматично перемкнулася на EN**, бо `RESPONSE_LANG: auto` і user пише EN.

---

#### Сценарій 3: Змішана розмова

```
User: Привіт! Can you help me?
Role: Привіт! Of course, I can help you organize your home...
```

✅ Роль **підлаштовується під основну мову** у повідомленні.

---

### Режим `ua` (фіксована мова)

**Поведінка:** Роль **завжди** відповідає українською, незалежно від мови user.

```
ROLE_LANG: ua
RESPONSE_LANG: ua

User: Hi! I need help
Role: Привіт! Я тут, щоб допомогти тобі...
```

**Коли використовувати:**
- Роль для українських користувачів (навчання мови, культурний контекст)
- Роль, яка не може працювати іншими мовами (специфічна термінологія)

---

### Режим `match` (дзеркало)

**Поведінка:** Роль **точно повторює** мову user без інтелектуального підлаштовування.

```
ROLE_LANG: ua
RESPONSE_LANG: match

User: Привіт! Hello!
Role: Привіт! Hello! ← дзеркально
```

**Коли використовувати:**
- Рідко. Зазвичай `auto` краще.

---

## 3. LANGUAGE_SELECTOR (Вибір мови користувачем)

### Що це?

Чи може користувач **вручну вибрати мову** в чаті з роллю.

### Можливі значення:

```
LANGUAGE_SELECTOR: enabled   ← User може вибрати мову
LANGUAGE_SELECTOR: disabled  ← User не може вибрати (роль сама керує)
```

---

### Приклад з `enabled`:

```
LANGUAGE_SELECTOR: enabled

User: (в UI чату бачить перемикач)
┌────────────────────────────┐
│ Language: [UA ▼]           │
│           UA               │
│           EN               │
│           ZH               │
└────────────────────────────┘

User вибирає EN →

Role: Hello! I'm here to help you...
```

✅ User **керує мовою** ролі.

---

### Приклад з `disabled`:

```
LANGUAGE_SELECTOR: disabled

User: (в UI чату НЕ бачить перемикача)

Role автоматично керує мовою на основі RESPONSE_LANG
```

✅ Роль **сама визначає мову** (зазвичай через `auto`).

---

## 4. SUPPORTED_LANGS (Підтримувані мови)

### Що це?

Список мов, якими роль **може** говорити.

### Формат:

```
SUPPORTED_LANGS: ua, en, zh, es, fr
                 └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘
                  UA   EN   CN   ES   FR
```

---

### Як працює:

```
RESPONSE_LANG: auto
SUPPORTED_LANGS: ua, en

User пише: "你好，我需要帮助" (китайською)
Role: "I'm sorry, I can only communicate in Ukrainian and English."
```

❌ Роль **не говорить китайською**, бо `zh` не в `SUPPORTED_LANGS`.

---

```
RESPONSE_LANG: auto
SUPPORTED_LANGS: ua, en, zh

User пише: "你好，我需要帮助"
Role: "你好！我在这里帮助你..." (китайською)
```

✅ Роль **говорить китайською**, бо `zh` в `SUPPORTED_LANGS`.

---

## КОМБІНАЦІЇ НАЛАШТУВАНЬ

### Комбінація 1: Універсальна роль (рекомендовано)

```
ROLE_LANG: ua
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: ua, en, zh, es, fr
```

**Поведінка:**
- Роль починає українською
- Підлаштовується під мову user
- User може вибрати мову вручну
- Підтримує 5 мов

**Приклад:** Home Organizer в OpenRML

---

### Комбінація 2: Тільки українська

```
ROLE_LANG: ua
RESPONSE_LANG: ua
LANGUAGE_SELECTOR: disabled
SUPPORTED_LANGS: ua
```

**Поведінка:**
- Роль завжди говорить UA
- Не підлаштовується під інші мови
- User не може вибрати мову

**Приклад:** Вчитель української мови

---

### Комбінація 3: Білінгвальна роль

```
ROLE_LANG: en
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: en, ua
```

**Поведінка:**
- Роль починає англійською
- Перемикається на UA якщо user пише UA
- User може вибрати EN або UA

**Приклад:** Міжнародний career coach

---

## ЯК ЦЕ ПРАЦЮЄ ПІД КАПОТОМ

### Крок 1: Ініціалізація

```
Role завантажується з ROLE_LANG: ua

Role.currentLanguage = "ua"
Role.greeting = "Привіт! Готові трансформувати свій дім?"
```

---

### Крок 2: User надсилає повідомлення

```
User.message = "Hi! I need help organizing"

if (RESPONSE_LANG === "auto") {
  detectedLang = detectLanguage(User.message) // "en"
  
  if (SUPPORTED_LANGS.includes(detectedLang)) {
    Role.currentLanguage = detectedLang // "en"
  }
}
```

---

### Крок 3: Role відповідає

```
Role.currentLanguage = "en"

Role.response = generateResponse(
  context: User.message,
  language: "en",
  roleData: {...}
)

→ "Hello! I'm here to help you create an organized space..."
```

---

## ДЕТЕКЦІЯ МОВИ

OpenRML використовує **вбудовані можливості LLM** для детекції мови:

```javascript
// Псевдокод
function detectLanguage(text) {
  const patterns = {
    ua: /[а-яіїєґ]/i,
    en: /^[a-z\s\.,!?]+$/i,
    zh: /[\u4e00-\u9fff]/,
    // ... інші мови
  };
  
  // LLM також аналізує контекст
  // Не тільки символи, але й структуру речень
}
```

**Приклад:**

```
"Привіт! How are you?" 
→ детектується як UA (більше UA символів)

"Hello! Як справи?"
→ детектується як EN (починається з EN)
```

---

## FALLBACK СТРАТЕГІЯ

Що робить роль, якщо **не може визначити мову**?

```
ROLE_LANG: ua
RESPONSE_LANG: auto

User: "🤔❓"

Role fallback:
  1. Перевірити ROLE_LANG → ua
  2. Відповісти мовою ROLE_LANG
  
→ "Привіт! Здається, я не зовсім зрозумів. Можеш переформулювати?"
```

---

## ПРИКЛАДИ З РЕАЛЬНОГО ЖИТТЯ

### Приклад 1: Home Organizer (універсальний)

```yaml
ROLE_LANG: ua
RESPONSE_LANG: auto
SUPPORTED_LANGS: ua, en, zh, es, fr

# Сценарій 1: Українець
User: "Допоможи організувати кухню"
Role: "Звісно! Почнемо з оцінки поточного стану..."

# Сценарій 2: Американець
User: "Help me organize my kitchen"
Role: "Of course! Let's start by assessing the current state..."

# Сценарій 3: Китаєць
User: "帮我整理厨房"
Role: "当然！让我们从评估当前状态开始..."
```

✅ Одна роль → три мови автоматично.

---

### Приклад 2: Вчитель української

```yaml
ROLE_LANG: ua
RESPONSE_LANG: ua
SUPPORTED_LANGS: ua

# Всі сценарії
User: "Hello, teach me Ukrainian"
Role: "Привіт! Я вчитель української мови. Почнемо урок?"

User: "你好"
Role: "Привіт! Я можу спілкуватися тільки українською."
```

✅ Роль **завжди** UA (для навчання мови).

---

### Приклад 3: Multilingual therapist

```yaml
ROLE_LANG: en
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: en, ua, ru, es, fr, de

# User може вибрати будь-яку з 6 мов
# Роль підтримує всі 6
```

✅ Максимальна доступність.

---

## НАЛАШТУВАННЯ В КОНСТРУКТОРІ

### У Step 1:

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

Це встановлює `ROLE_LANG`.

---

### RESPONSE_LANG та SUPPORTED_LANGS:

Поки що **автоматично** встановлюються:

```javascript
// Автоматичні значення
RESPONSE_LANG: "auto"  // завжди
SUPPORTED_LANGS: "ua, en, zh, es, fr"  // завжди

// У майбутніх версіях можна буде налаштувати
```

---

## FAQ

**Q: Чи може роль говорити 10 мовами?**  
A: Так, якщо додати їх у `SUPPORTED_LANGS`. Але якість залежить від можливостей LLM.

**Q: Як роль знає граматику UA/EN/ZH?**  
A: LLM навчена на мільярдах текстів цими мовами. Вона «знає» граматику всередині.

**Q: Чи можу я створити роль тільки для UA?**  
A: Так:
```
ROLE_LANG: ua
RESPONSE_LANG: ua
SUPPORTED_LANGS: ua
```

**Q: Що якщо user пише суржиком?**  
A: `RESPONSE_LANG: auto` спробує визначити домінуючу мову. Зазвичай працює добре.

**Q: Як додати нову мову?**  
A: Просто додайте код у `SUPPORTED_LANGS`:
```
SUPPORTED_LANGS: ua, en, pl, de, it
```

---

## ВИСНОВОК

Система локалізації OpenRML — це **інтелектуальна мовна адаптація**:

1. **ROLE_LANG** — мова старту
2. **RESPONSE_LANG** — стратегія адаптації
3. **LANGUAGE_SELECTOR** — контроль користувача
4. **SUPPORTED_LANGS** — список можливих мов

Разом вони дають:
- ✅ Універсальність (одна роль → багато мов)
- ✅ Гнучкість (від монолінгвальних до мультилінгвальних)
- ✅ UX (user не думає про мову, роль підлаштовується)

---

**Приклад ідеального налаштування:**

```
🌐 LANGUAGE POLICY
ROLE_LANG: ua              ← твоя основна мова
RESPONSE_LANG: auto        ← розумна адаптація
LANGUAGE_SELECTOR: enabled ← user може вибрати
SUPPORTED_LANGS: ua, en, zh, es, fr ← широка підтримка
```

Така роль **доступна всім**, але **зберігає твою мову** як базову.

---

*OpenRML Team • 2026*  
*RolesAI.life — create multilingual AI roles*

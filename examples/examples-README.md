# OpenRML Examples

This directory contains `.orml.txt` role definitions exported from the RolesAI constructor.

These files demonstrate valid OpenRML documents in practice. They can be:
- Imported directly into the constructor UI
- Pasted into any LLM chat (ChatGPT, Claude, Gemini) to activate the role
- Used as reference for building a compliant parser
- Tested against a compliance validator

---

## What's Inside

All roles in this directory are **OpenRML 1.0 compliant** (format version 0.9.0+) and include:

- ✅ **Language Policy** — multilingual support (UA, EN, ZH, ES, FR)
- ✅ **Deterministic Identity** — ORML/{Archetype}{Category}/{Version}/{hash-segments}
- ✅ **8-Step Structure** — complete role specification
- ✅ **Ethical Rules** — built-in stop-switches and referral protocols
- ✅ **Journey Sessions** — structured multi-session interactions
- ✅ **Footer Attribution** — FromUA.Life, RolesAI.life, AnsAI.Life

---

## How to Use These Examples

### Option 1: Import into Constructor
1. Open [RolesAI.life](https://rolesai.life)
2. Click **"Import from .txt"**
3. Select any `.orml.txt` file from this directory
4. Edit and customize as needed

### Option 2: Activate in LLM Chat
1. Open the `.orml.txt` file in a text editor
2. Copy the entire content
3. Paste into ChatGPT, Claude, or Gemini
4. The role activates immediately

### Option 3: Use as Reference
- Study the structure for building your own roles
- Use for parser implementation testing
- Reference for format compliance validation

---

## File Naming Convention

All files follow this pattern:
```
{role_name_snake_case}_role.orml.txt
```

Examples:
- `mental_health_guide_role.orml.txt`
- `frontend_dev_pro_role.orml.txt`
- `home_organizer_role.orml.txt`

**Special file:**
- `EXAMPLE_EXPORT.orml.txt` — annotated example with comments

---

## Available Examples

### 💚 Health & Wellness (5 roles)

| File | Role Name | Archetype | Language |
|------|-----------|-----------|----------|
| `mental_health_guide_role.orml.txt` | Mental Health Guide | Healer | UA/EN |
| `fitness_coach_role.orml.txt` | Fitness Coach | Mentor | UA/EN |
| `nutrition_advisor_role.orml.txt` | Nutrition Advisor | Analyst | UA/EN |
| `sleep_optimizer_role.orml.txt` | Sleep Optimizer | Healer | UA/EN |
| `stress_manager_role.orml.txt` | Stress Manager | Healer | UA/EN |

**Description:** Emotional support, fitness planning, nutrition guidance, sleep optimization, stress management.

---

### ⚡ Productivity & Habits (5 roles)

| File | Role Name | Archetype | Language |
|------|-----------|-----------|----------|
| `task_manager_pro_role.orml.txt` | Task Manager Pro | Analyst | UA/EN |
| `habit_builder_role.orml.txt` | Habit Builder | Mentor | UA/EN |
| `anti_procrastination_coach_role.orml.txt` | Anti-Procrastination Coach | Mentor | UA/EN |
| `focus_master_role.orml.txt` | Focus Master | Mentor | UA/EN |
| `memory_coach_role.orml.txt` | Memory Coach | Mentor | UA/EN |

**Description:** Task prioritization, habit formation, procrastination management, deep focus, memory techniques.

---

### 🏠 Daily Life (4 roles)

| File | Role Name | Archetype | Language |
|------|-----------|-----------|----------|
| `home_organizer_role.orml.txt` | Home Organizer | Guardian | UA/EN |
| `meal_planner_role.orml.txt` | Meal Planner | Creator | UA/EN |
| `smart_shopping_assistant_role.orml.txt` | Smart Shopping Assistant | Analyst | UA/EN |
| `minimalism_guide_role.orml.txt` | Minimalism Guide | Mentor | UA/EN |

**Description:** Home organization, meal planning, smart shopping, minimalist lifestyle.

---

### 💰 Finance & Money (4 roles)

| File | Role Name | Archetype | Language |
|------|-----------|-----------|----------|
| `financial_advisor_role.orml.txt` | Financial Advisor | Analyst | UA/EN |
| `savings_coach_role.orml.txt` | Savings Coach | Mentor | UA/EN |
| `debt_freedom_coach_role.orml.txt` | Debt Freedom Coach | Mentor | UA/EN |
| `money_literacy_teacher_role.orml.txt` | Money Literacy Teacher | Mentor | UA/EN |

**Description:** Financial planning, saving strategies, debt management, financial education.

---

### ❤️ Relationships & Family (3 roles)

| File | Role Name | Archetype | Language |
|------|-----------|-----------|----------|
| `relationship_coach_role.orml.txt` | Relationship Coach | Healer | UA/EN |
| `parenting_guide_role.orml.txt` | Parenting Guide | Mentor | UA/EN |
| `family_mediator_role.orml.txt` | Family Mediator | Mentor | UA/EN |

**Description:** Communication skills, parenting strategies, family conflict resolution.

---

### 🎓 Personal Development (5 roles)

| File | Role Name | Archetype | Language |
|------|-----------|-----------|----------|
| `career_coach_role.orml.txt` | Career Coach | Mentor | UA/EN |
| `language_learning_tutor_role.orml.txt` | Language Learning Tutor | Mentor | UA/EN |
| `reading_coach_role.orml.txt` | Reading Coach | Mentor | UA/EN |
| `creativity_mentor_role.orml.txt` | Creativity Mentor | Creator | UA/EN |
| `motivation_coach_role.orml.txt` | Motivation Coach | Mentor | UA/EN |

**Description:** Career guidance, language learning, reading habits, creativity development, motivation.

---

### 💻 Technology & Digital Life (5 roles)

| File | Role Name | Archetype | Language |
|------|-----------|-----------|----------|
| `digital_assistant_role.orml.txt` | Digital Assistant | Scientist | UA/EN |
| `online_security_expert_role.orml.txt` | Online Security Expert | Guardian | UA/EN |
| `productivity_apps_advisor_role.orml.txt` | Productivity Apps Advisor | Analyst | UA/EN |
| `social_media_balance_coach_role.orml.txt` | Social Media Balance Coach | Mentor | UA/EN |
| `frontend_dev_pro_role.orml.txt` | Frontend Dev Pro | Creator | EN |

**Description:** Tech guidance, cybersecurity, app recommendations, digital wellness, web development.

---

### ✨ Entertainment & Spirituality (6 roles)

| File | Role Name | Archetype | Language |
|------|-----------|-----------|----------|
| `astrology_guide_role.orml.txt` | Astrology Guide | Explorer | UA/EN |
| `tarot_reader_role.orml.txt` | Tarot Reader | Explorer | UA/EN |
| `numerology_expert_role.orml.txt` | Numerology Expert | Analyst | UA/EN |
| `destiny_matrix_decoder_role.orml.txt` | Destiny Matrix Decoder | Analyst | UA/EN |
| `lunar_calendar_guide_role.orml.txt` | Lunar Calendar Guide | Healer | UA/EN |
| `crystal_energy_guide_role.orml.txt` | Crystal Energy Guide | Healer | UA/EN |

**Description:** Astrological readings, tarot interpretation, numerology, destiny matrix, lunar cycles, crystal energy.

> ⚠️ **Disclaimer:** These roles are for **entertainment and inspiration only** — not a scientific method or substitute for professional help.

---

## Special Files

### `EXAMPLE_EXPORT.orml.txt`
A fully annotated example export with inline comments explaining each section. Use this as a learning resource to understand the OpenRML format structure.

**Contains:**
- Activation preamble
- Language Policy block
- Identity block (ORML format)
- All 8 steps with detailed examples
- Ethical rules and referral protocols
- Footer attribution

---

## Summary Statistics

| Category | Count | Status |
|----------|-------|--------|
| 💚 Health & Wellness | 5 | ✅ Exported |
| ⚡ Productivity & Habits | 5 | ✅ Exported |
| 🏠 Daily Life | 4 | ✅ Exported |
| 💰 Finance & Money | 4 | ✅ Exported |
| ❤️ Relationships & Family | 3 | ✅ Exported |
| 🎓 Personal Development | 5 | ✅ Exported |
| 💻 Technology & Digital Life | 5 | ✅ Exported |
| ✨ Entertainment & Spirituality | 6 | ✅ Exported |
| 📄 Special Examples | 1 | ✅ Annotated |
| **Total** | **38** | **100% complete** |

---

## Language Support

All roles support multilingual interaction via **Language Policy**:

```
🌐 LANGUAGE POLICY
ROLE_LANG: ua              ← Default language (Ukrainian)
RESPONSE_LANG: auto        ← Auto-adapts to user language
LANGUAGE_SELECTOR: enabled ← User can manually select language
SUPPORTED_LANGS: ua, en, zh, es, fr
```

This means:
- ✅ Role can respond in **Ukrainian**, **English**, **Chinese**, **Spanish**, or **French**
- ✅ Auto-detects user's language and responds accordingly
- ✅ User can manually override language if needed

---

## How to Add New Examples

1. **Create the role** in the RolesAI constructor
2. **Set status** to `published`
3. **Export** — click "Export RML" button
4. **Rename file** following the convention: `role_name_snake_case_role.orml.txt`
5. **Move to this directory**: `/examples/`
6. **Update this README** with the new entry in the appropriate category

---

## Format Compliance

All examples in this directory are compliant with:
- **OpenRML Format Specification 1.0** (see `/spec/openrml-format-1.0.md`)
- **Language Policy** (mandatory in OpenRML 1.0+)
- **Deterministic Identity** using ORML prefix
- **Footer Attribution** with ecosystem links

To validate a file:
```bash
# Future: compliance validator tool
openrml validate examples/your_role.orml.txt
```

---

## License

All example roles in this directory are licensed under **CC-BY-4.0** unless otherwise specified in the role's LICENSE section.

This means you can:
- ✅ Use for any purpose (personal or commercial)
- ✅ Modify and adapt
- ✅ Redistribute
- ✅ Must attribute the original author

---

## Related Documentation

- [OpenRML Format Specification](../spec/openrml-format-1.0.md) — Complete format reference
- [Quick Start Guide](../docs/QUICK_START_UA.md) — How to create your first role
- [Use Cases](../docs/USE_CASES_UA.md) — Three levels of role usage
- [Philosophy](../docs/PHILOSOPHY_UA.md) — Why OpenRML exists

---

*These examples demonstrate the power of OpenRML — structured, portable, and human-readable AI role descriptions.*  
*Create your own at [RolesAI.life](https://rolesai.life)*

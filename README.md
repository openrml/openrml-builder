# OpenRML — Open Role Markup Language

> **Reference Implementation** · v0.9.0

**English** · [Українська](./README.uk.md)

---

## Vision

AI assistants have become ubiquitous. But the way we describe roles for them remains entirely informal — scattered prompts, copy-pasted instructions, undocumented conventions. No standard. No shared vocabulary. No way to validate, transfer, or evolve role descriptions across tools, teams, and time.

**OpenRML was created to fix this.**

Open Role Markup Language is a structured, human-readable specification for describing an AI assistant's personality, behavior, domain expertise, and interaction patterns. It treats role descriptions as first-class artifacts — versioned, validated, exported, and interoperable.

In 3–5 years, we envision a world where:
- Any AI platform accepts an `.orml.txt` role description without translation
- Role authors publish, share, and fork roles like code
- Compliance tools verify that AI behavior matches its declared role
- Organizations maintain audited registries of roles for their entire AI stack

This repository is the **reference implementation** of that future.

---

## What Is This Repository

```
This repository is the reference implementation of OpenRML 1.0.
```

This is not a template. Not a boilerplate. This is the canonical demonstration of how OpenRML roles are created, validated, exported, and used.

Everything here — the domain model, export format, identity system, constructor UI — exists to prove: the specification is complete, consistent, and implementable.

Future implementations (CLI tools, VS Code extensions, API validators, native mobile apps) will be measured against what is defined here.

---

## Architecture

OpenRML is built on strict separation of concerns:

```
src/
├── core/
│   ├── domain/role/          # Canonical Role type and enums
│   ├── rml/                  # Parser and exporter — spec boundary
│   └── services/             # Identity hashing, license logic
│
├── application/
│   └── use-cases/            # Business operations: create, save, export, import
│
├── infrastructure/
│   ├── storage/              # Adapters: IndexedDB, localStorage, session
│   └── template/             # Template loading and preview
│
├── data/
│   ├── templates/            # Curated role templates by category
│   └── template-previews.ts  # Discovery layer
│
└── presentation/
    ├── components/           # Constructor UI, steps, live preview
    └── contexts/             # React state boundaries
```

**Key architectural principles:**

- **The `core/` layer has no UI dependencies.** It can be extracted and used in any runtime.
- **The `rml/` exporter is the spec boundary.** The text format it produces IS the OpenRML standard.
- **Identity is deterministic.** Same role content always produces the same OpenRML Identity hash.
- **Storage is pluggable.** The composite adapter chooses the best available storage strategy.

Detailed diagrams and architectural decision records — in [`architecture/`](./architecture/).

---

## Privacy & Data

Your roles never leave your device. No account required, no server receives your data, no telemetry collected. The only storage is your browser's IndexedDB — a local database that transmits nothing anywhere.

This is a conscious architectural decision, not a limitation. Roles created in RolesAI often contain personal material: goals, struggles, mental health context, family dynamics, career anxieties. Such data belongs to the person who created it — and only them.

**What and where is stored:**

| Data | Storage | Leaves device? |
|------|---------|----------------|
| Your roles | IndexedDB (browser) | Never |
| UI settings (language, theme) | localStorage (browser) | Never |
| Template cache | sessionStorage (cleared on tab close) | Never |
| Exported `.orml.txt` files | Your filesystem | Only if you share them |

**Export is your backup.** No cloud sync, no account recovery, no "restore from server." If you clear browser data, roles are gone. Export regularly — each `.orml.txt` file is a complete, self-contained backup of a role.

**PWA doesn't change this model.** Installing RolesAI as an app on your phone home screen doesn't create an account or enable server interaction. The installed app uses the same local browser storage as the web version.

Full breakdown — in [`docs/privacy.md`](./docs/privacy.md).

---

## JSON Schema Validation

OpenRML includes a formal **JSON Schema** for the Role type, enabling validation, type safety, and interoperability.

### Features

- ✅ **Complete validation** for all 8 steps of OpenRML specification
- ✅ **TypeScript type guards** for compile-time safety
- ✅ **CLI tool** for validating JSON role files
- ✅ **35+ automated tests** with 95%+ code coverage
- ✅ **Detailed error messages** for debugging

### Usage

**In TypeScript code:**

```typescript
import { isValidRole, getRoleValidationErrors } from '@/core/domain/role/role.schema';

// Type guard validation
if (isValidRole(roleData)) {
  // TypeScript knows roleData is a valid Role
  console.log(roleData.name);
} else {
  const errors = getRoleValidationErrors(roleData);
  console.error('Validation errors:', errors);
}
```

**CLI validation:**

```bash
# Validate a single JSON file
npm run validate-schema examples/json/productivity-coach.json

# Validate all JSON files in a directory
npm run validate-schema -- --all examples/json/
```

**In use-cases:**

```typescript
import { validateRoleUseCase } from '@/application/use-cases/validate-role.use-case';

const result = validateRoleUseCase(importedData);
if (result.isValid) {
  await saveRole(result.role);
} else {
  showErrors(result.errors);
}
```

### Documentation

- **Schema specification**: [`src/core/domain/role/role.schema.json`](./src/core/domain/role/role.schema.json)
- **Detailed guide**: [`src/core/domain/role/SCHEMA_README.md`](./src/core/domain/role/SCHEMA_README.md)
- **Tests**: [`src/core/domain/role/role.schema.test.ts`](./src/core/domain/role/role.schema.test.ts)

### Testing

```bash
npm test  # Run all validation tests
```

---

## OpenRML Format

A role exported via OpenRML looks like this:

```
Activate role from RML below:
1. ADOPT personality, goals, and behavior from STEPS 1–3.
2. FOLLOW the journey in STEP 5...
...

🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: ua
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: ua, en, zh, es, fr

READY. Starting:

═══════════════════════════════════════════════════
OpenRML 0.9.0 — Home Organizer [published]
IDENTITY: ORML/GD/0.9.0/6255/2b78/4514/bcc8/18e7/e3c9/f567/1cef
REFERENCE: orml://openrml-team/home-organizer/0.9.0
ARCHETYPE: guardian
CATEGORY: daily
═══════════════════════════════════════════════════

📋 STEP 1: BASE INFORMATION
Role Name: Home Organizer
...

🎨 STEP 2: VISUAL PORTRAIT
...

💬 STEP 3: BEHAVIOR & TONE
...

🎯 STEP 4: EXPERTISE & RULES
...

🗺️ STEP 5: JOURNEY SESSIONS
...

👥 STEP 6: TEAM COLLABORATION
...

🧠 STEP 7: MEMORY SYSTEM
...

⚖️ STEP 8: ETHICS & VERSIONS
...

═══════════════════════════════════════════════════
Created: 10.03.2026
Updated: 10.03.2026
═══════════════════════════════════════════════════

FromUA.Life - For life. Despite everything.
🛠️  Builder: RolesAI.life — create your own .orml.txt
AnsAI.Life - soon...
```

The format is intentionally human-readable and simultaneously parseable by language models. Full specification — in [`spec/openrml-format-1.0.md`](./spec/openrml-format-1.0.md).

---

## Language System

**New in OpenRML 1.0:** Every role includes a Language Policy that defines how the role communicates across languages.

```
🌐 LANGUAGE POLICY
ROLE_LANG: ua              ← role's default language
RESPONSE_LANG: auto        ← role adapts to user
LANGUAGE_SELECTOR: enabled ← user can select language
SUPPORTED_LANGS: ua, en, zh, es, fr
```

**What this means:**
- A role can be created in Ukrainian but respond in English if the user writes in English
- One role works with users worldwide
- Structural labels (STEP 1, STEP 2) are always English for universality
- Content (role name, greeting, description) — any language

More details:
- [LANGUAGE_POLICY.md](./docs/LANGUAGE_POLICY.md) — technical specification

---

## Three Levels of Role Usage

An OpenRML role is not just a prompt. It's a **minimal cognitive unit** that can exist in three forms:

### Level 1: Standalone
Paste the `.orml.txt` into ChatGPT, Claude, or Gemini — role activates instantly.

**Example:**
```
User: [pastes home_organizer_role.orml.txt]
Claude: Hello! Ready to transform your home?
```

### Level 2: In an Agent
The role becomes the "soul" of an agent with tools, memory, and ability to act.

**Example:**
```python
agent = Agent(
  role=loadRole('home-organizer.orml.txt'),
  tools=[CalendarTool(), EmailTool()],
  memory=LongTermMemory()
)
```

### Level 3: In a Role System
Multiple roles that dynamically switch depending on context.

**Example:**
```
User: "Help me organize my kitchen"
→ activates Home Organizer

User: "What should I cook for dinner?"
→ switches to Meal Planner
```

More details: [USE_CASES_UA.md](./docs/USE_CASES_UA.md) (Ukrainian version available)

---

## Roadmap

### 0.9.0 — OpenRML Rebranding ✅
- RML → OpenRML rename
- Language Policy system
- Filename transliteration
- Russian localization removal
- New documentation (UA)

### 0.10.0 — Validation & Testing
- [x] Formal JSON Schema for Role type
- [ ] Export format versioning (`OpenRML-Format: 1.0`)
- [x] Validation layer with structured error messages
- [ ] Round-trip fidelity test suite

### 1.0.0 — Stable Specification
- [ ] Spec compliance test suite
- [ ] Reference parser in a second language (Python or Go)
- [ ] Public role registry API design
- [ ] Formal deprecation policy

### Post-1.0
- Multiple independent implementations
- External contributor ecosystem
- Spec compliance badge system
- Ecosystem integrations (OpenAI, Claude, Gemini adapters)

---

## Quick Start

```bash
npm install
npm run dev       # Dev server on localhost:3000
npm run build     # Production build
npm run preview   # Preview production build
```

**Requirements:** Node.js 18+, npm 9+

---

## Project Structure

```
/src              — Source code of the reference implementation
/spec             — OpenRML format specification documents
/docs             — Guides, concepts, integration notes
/architecture     — ADRs and system diagrams
/examples         — Example .orml.txt role descriptions
/data/templates   — Curated role templates
```

---

## Documentation

### For Developers (English):
- [openrml-format-1.0.md](./spec/openrml-format-1.0.md) — Complete format specification
- [LANGUAGE_POLICY.md](./docs/LANGUAGE_POLICY.md) — Language Policy technical spec
- [FOUNDATION.md](./FOUNDATION.md) — Principles, invariants, and boundaries
- [concepts.md](./docs/concepts.md) — Core concepts
- [PHILOSOPHY_EN.md](./docs/PHILOSOPHY_EN.md) — OpenRML philosophy
- [ADR-001](./architecture/ADR-001-layered-architecture.md) — Layered architecture
- [ADR-002](./architecture/ADR-002-deterministic-identity.md) — Deterministic identity
- [ADR-003](./architecture/ADR-003-storage-strategy.md) — Storage strategy

### For Users (Ukrainian):
- [PHILOSOPHY_UA.md](./docs/PHILOSOPHY_UA.md) — Філософія OpenRML
- [WHY_ENGLISH_UI_UA.md](./docs/WHY_ENGLISH_UI_UA.md) — Чому UI англійською
- [LOCALIZATION_SYSTEM_UA.md](./docs/LOCALIZATION_SYSTEM_UA.md) — Система локалізації
- [QUICK_START_UA.md](./docs/QUICK_START_UA.md) — Швидкий старт
- [USE_CASES_UA.md](./docs/USE_CASES_UA.md) — Випадки використання

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). All contributions must align with principles defined in [FOUNDATION.md](./FOUNDATION.md).

---

## License

MIT — see [LICENSE](./LICENSE)

---

## Contact & Community

- **Website:** [RolesAI.life](https://rolesai.life)
- **GitHub:** [github.com/openrml/openrml-builder](https://github.com/openrml/openrml-builder)
- **Support:** support@openrml.org

---

## Ecosystem Projects

- **FromUA.Life** — For life. Despite everything.
- **RolesAI.life** — OpenRML role constructor
- **AnsAI.Life** — (coming soon...)

---

*OpenRML is an open specification. This implementation is maintained as the canonical reference.*

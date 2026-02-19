# RML — Role Markup Language

> **Reference Implementation** · v0.1.0

**[English](./README.md) · [Русский](./README.ru.md) · [Українська](./README.uk.md)**

---

## Vision

AI assistants are becoming ubiquitous. Yet the way roles are defined for them remains entirely informal — scattered prompts, copy-pasted instructions, undocumented conventions. There is no standard. No shared vocabulary. No way to validate, exchange, or evolve a role definition across tools, teams, or time.

**RML exists to fix this.**

Role Markup Language is a structured, human-readable specification for defining AI assistant personalities, behaviors, expertise domains, and interaction patterns. It treats role definitions as first-class artifacts — versioned, validated, exportable, and interoperable.

In 3–5 years, we envision a world where:
- Any AI platform can ingest an `.rml` role definition without translation
- Role authors can publish, share, and fork roles like code
- Compliance tooling verifies that an AI's behavior matches its declared role
- Organizations maintain auditable role registries across their AI stack

This repository is the **reference implementation** of that future.

---

## What This Repo Is

```
This repository is the reference implementation of RML 1.0.
```

It is not a boilerplate. It is not a template. It is the canonical demonstration of how RML roles are constructed, validated, exported, and consumed.

Everything here — the domain model, the export format, the identity system, the constructor UI — exists to prove that the specification is complete, coherent, and buildable.

Future implementations (CLI tools, VS Code extensions, API validators, native mobile apps) will be measured against what is defined here.

---

## Architecture Overview

RML is built around a strict separation of concerns:

```
src/
├── core/
│   ├── domain/role/          # The canonical Role type and enums
│   ├── rml/                  # Parser and exporter — the spec boundary
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
- **The `rml/` exporter is the spec boundary.** The text format it produces IS the RML standard.
- **Identity is deterministic.** The same role content always produces the same RML Identity hash.
- **Storage is pluggable.** The composite adapter selects the best available storage strategy.

See [`architecture/`](./architecture/) for detailed diagrams and decision records.

---

## Privacy & Data

Your roles never leave your device. No account required, no server receives your data, no telemetry is collected. The only storage is your browser's own IndexedDB — a local database that never transmits anything anywhere.

This is a conscious architectural decision, not a limitation. Roles created with RolesAI often contain personal material: goals, struggles, mental health context, family dynamics, career anxieties. That kind of data belongs to the person who created it — full stop.

**What is stored and where:**

| Data | Storage | Leaves device? |
|------|---------|----------------|
| Your roles | IndexedDB (browser) | Never |
| UI preferences (language, theme) | localStorage (browser) | Never |
| Template cache | sessionStorage (cleared on tab close) | Never |
| Exported `.rml.txt` files | Your filesystem | Only if you share them |

**Your export is your backup.** There is no cloud sync, no account recovery, no "restore from server". If you clear your browser data, your roles are gone. Export regularly — each `.rml.txt` file is a complete, self-contained backup of that role.

**PWA does not change this model.** Installing RolesAI as a home screen app does not create an account or enable any server communication. The installed app uses the same local browser storage as the web version.

See [`docs/privacy.md`](./docs/privacy.md) for the full breakdown.

---

## The RML Format

A role exported via RML looks like this:

```
RML 1.0.0 — Frontend Dev Pro [published]
IDENTITY: RML/CT/1.0.0/3d0b/4327/5287/baf3/4186/e3c9/ba9c/aba2
REFERENCE: rml://anonymous/frontend-dev-pro/1.0.0
ARCHETYPE: creator
CATEGORY: technology

📋 STEP 1: BASE INFORMATION
Role Name: Frontend Dev Pro
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
```

The format is intentionally human-readable and LLM-parseable simultaneously. See [`spec/`](./spec/) for the full specification.

---

## Roadmap

### 0.1.0 — Initial Reference Implementation ✅
- Core domain model (`Role`, `Session`, `EthicalRule`, `RMLIdentity`)
- 8-step constructor UI
- Text export with deterministic identity hashing
- Import/parse round-trip
- Template library (8 categories, 40+ templates)
- Pluggable storage adapters

### 0.2.0 — Spec Hardening
- [ ] Formal JSON Schema for the Role type
- [ ] Export format versioning (`RML-Format: 1.0`)
- [ ] Validation layer with structured error reporting
- [ ] Round-trip fidelity tests (export → import → export = identical)

### 0.3.0 — Extension System
- [ ] Plugin interface for custom step types
- [ ] Hook system for pre/post export transforms
- [ ] Custom field namespacing (`x-myorg-field`)

### 1.0.0 — Stable Spec Alignment
- [ ] Spec compliance test suite
- [ ] Reference parser in a second language (Python or Go)
- [ ] Public role registry API design
- [ ] Formal deprecation policy

### Beyond 1.0
- Multiple independent implementations
- External contributor ecosystem
- Spec compliance badge system
- Ecosystem integrations (OpenAI, Claude, Gemini adapters)

---

## Getting Started

```bash
npm install
npm run dev       # Development server at localhost:3000
npm run build     # Production build
npm run preview   # Preview production build
```

**Requirements:** Node.js 18+, npm 9+

---

## Project Layout

```
/src              — Reference implementation source
/spec             — RML format specification documents
/docs             — Guides, concepts, integration notes
/architecture     — ADRs and system diagrams
/examples         — Example .rml role definitions
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). All contributions must align with the principles defined in [FOUNDATION.md](./FOUNDATION.md).

---

## License

MIT — see [LICENSE](./LICENSE)

---

*RML is an open specification. This implementation is maintained as the canonical reference.*

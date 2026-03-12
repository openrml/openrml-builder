# FOUNDATION.md

> Principles, invariants, and boundaries of the OpenRML system.  
> This document defines what OpenRML is — and what it must never become.

---

## What OpenRML Is

OpenRML (Open Role Markup Language) is a **specification** for describing AI assistant roles in a structured, portable, and verifiable format.

The specification has three properties that must always hold:

1. **Human-readable.** A person who has never seen OpenRML must be able to understand a role definition without tooling.
2. **LLM-parseable.** A language model must be able to consume an OpenRML document as a system prompt and correctly adopt the described role.
3. **Deterministic.** The same role content must always produce the same OpenRML Identity. Identity is a function of content, not of time or environment.

---

## Data Locality as Architectural Invariant

The reference implementation stores all user data locally in the browser. No data is transmitted to any server. No analytics are collected on role content. No account is required.

**This is not a limitation — it is a design principle.**

A role constructor must not be a surveillance tool. Roles created with OpenRML often contain sensitive personal context: mental health struggles, relationship difficulties, career anxieties, financial stress. The architecture must reflect the sensitivity of what it stores.

This principle has concrete consequences:

- **No server-side role storage.** The backend, if any future implementation adds one, must treat role content as opaque — never reading, indexing, or processing it.
- **No analytics on role content.** Usage metrics (page views, feature adoption) are acceptable. Analysis of what users write in their roles is not.
- **No account requirement for core functionality.** Creating, editing, and exporting roles must remain possible without identity verification.
- **Export as the trust model.** The `.orml.txt` file is not a convenience feature — it is the primary ownership mechanism. The user's copy of their role is always the authoritative one.

Any implementation that violates data locality — storing roles server-side without explicit user consent, transmitting role content to third parties, requiring accounts for basic use — is not a compliant OpenRML implementation. It is a different product.

---

## The Invariant Parts

These are the non-negotiable foundations of OpenRML. They cannot be changed without a major version increment and a formal deprecation period.

### 1. The 8-Step Structure

Every OpenRML role consists of exactly 8 steps:

| Step | Name | Purpose |
|------|------|---------|
| 1 | Base Information | Identity, category, archetype, goal, **role language** |
| 2 | Visual Portrait | Persona appearance and environment |
| 3 | Behavior & Tone | Personality, greeting, should/should not |
| 4 | Expertise & Rules | Domain knowledge, tools, output formats |
| 5 | Journey Sessions | Structured interaction sessions |
| 6 | Team Collaboration | Multi-agent coordination |
| 7 | Memory System | Memory strategy and emotional tracking |
| 8 | Ethics & Versions | Rules, referral protocol, disclaimer |

The 8-step structure is **the core of OpenRML**. It is not a UI convention — it is the specification itself. Any implementation that omits a step is non-compliant.

### 2. Language Policy Block

**New in OpenRML 1.0.** Every role must include a Language Policy block that defines:

- `ROLE_LANG` — the role's default communication language (ISO 639-1 code)
- `RESPONSE_LANG` — how the role adapts to user language (`auto`, `match`, or fixed language)
- `LANGUAGE_SELECTOR` — whether users can manually select language (`enabled` or `disabled`)
- `SUPPORTED_LANGS` — comma-separated list of languages the role can speak

**Placement:** After activation preamble, before identity block.

**Format:**
```
🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: ua
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: ua, en, zh, es, fr
```

The Language Policy is **mandatory** in OpenRML 1.0+. Roles without it are considered legacy format.

See [LANGUAGE_POLICY.md](./docs/LANGUAGE_POLICY.md) for complete specification.

### 3. OpenRML Identity

Every published role must have a deterministic identity:

```
ORML/{ArchetypeCode}{CategoryCode}/{Version}/{BaseHash}/{VisualHash}/{ToneHash}/{ExpertiseHash}/{JourneyHash}/{TeamHash}/{MemoryHash}/{EthicsHash}
```

- Each hash is a 4-character djb2 hash of the corresponding step content
- The full ID changes if and only if the content of any step changes
- Identity hashes are computed over normalized content (sorted arrays, trimmed strings)

**Identity must never include timestamps, random values, or environment-dependent data.**

**Breaking change from RML:** Identity prefix changed from `RML/` to `ORML/` in OpenRML 1.0.

### 4. The Export Format

The OpenRML text export format is the ground truth of the specification. The format:

- Begins with activation instructions (the preamble)
- Includes the Language Policy block
- Includes the identity block if published
- Renders all 8 steps in order
- Includes the footer block with attribution
- Is human-readable plain text
- Uses consistent Unicode section markers (═, ─, 📋, 🎨, 💬, 🎯, 🗺️, 👥, 🧠, ⚖️, 🌐)
- Uses `.orml.txt` file extension

A compliant parser must be able to recover a `Role` object from this format without loss of semantically significant information.

**Breaking changes from RML:**
- File extension: `.rml.txt` → `.orml.txt`
- Identity prefix: `RML/` → `ORML/`
- Reference URI: `rml://` → `orml://`
- Header: `RML {version}` → `OpenRML {version}`
- Language Policy block: newly mandatory
- Footer block: newly mandatory

### 5. The Footer Block

Every OpenRML export must include a footer with attribution:

```
FromUA.Life - Для життя. Попри все.
🛠️  Builder: RolesAI.life — create your own .orml.txt
AnsAI.Life - soon...
```

The footer is **not optional**. It provides attribution and links to the ecosystem.

---

## The Extensible Parts

These are designed for extension without breaking compatibility:

- **Templates** — new role templates can be added freely
- **Storage adapters** — any storage backend can be plugged in via the adapter interface
- **Categories and archetypes** — new values can be registered
- **Step content** — fields within each step can be extended with `x-` prefixed custom fields (planned for future versions)
- **Export renderers** — alternative output formats (JSON, YAML, Markdown) can be added alongside the canonical text format
- **Supported languages** — SUPPORTED_LANGS can include any ISO 639-1 language code

---

## What Constitutes a Violation

The following are considered **violations of the OpenRML standard**:

| Violation | Why |
|-----------|-----|
| Omitting a step from export | Breaks round-trip fidelity |
| Omitting Language Policy block | Mandatory in OpenRML 1.0+ |
| Omitting footer block | Mandatory in OpenRML 1.0+ |
| Non-deterministic identity generation | Invalidates the hash system |
| Using `RML/` prefix instead of `ORML/` | Breaking change in 1.0 |
| Using `rml://` URI instead of `orml://` | Breaking change in 1.0 |
| Storing sensitive data (tokens, keys) in role fields | Security — roles are intended to be shared |
| Using `any` types for core domain objects | Undermines the type-safe contract |
| Breaking the import → export round-trip | Core invariant of the spec |
| Embedding UI-specific logic in `core/` | Violates layered architecture |

---

## Design Philosophy

### Separation of Specification and Implementation

The specification (what OpenRML defines) and the implementation (this repository) are distinct. The implementation must always serve the specification — not the other way around. When UI constraints conflict with spec correctness, the spec wins.

### Longevity Over Convenience

OpenRML is designed to outlive any single implementation. Decisions that make the current UI easier but complicate future implementations are to be avoided. When in doubt, choose the option that a Python CLI tool or a Go library could implement without reimagining the format.

### Explicit Over Implicit

Every field in an OpenRML document has an explicit declared meaning. There are no magic defaults that only work in the reference implementation. Default values are defined in the specification, not inferred from runtime behavior.

### Roles as Artifacts, Not Sessions

An OpenRML role is a persistent artifact with a stable identity. It is not a session configuration. It is not a prompt template. It is a fully described entity that can be stored, versioned, shared, validated, and adopted by any capable system.

### Universal Structure, Any Language Content

OpenRML uses **English for structural labels** (STEP 1, STEP 2, field names) to ensure universal parseability. But **content can be in any language** — role names, greetings, descriptions, expertise can be Ukrainian, Chinese, Spanish, or any other language.

This dual-layer approach (structure EN, content ANY) makes OpenRML:
- **Portable** — one parser works for all languages
- **Accessible** — roles can be created in any language
- **LLM-friendly** — models are trained primarily on English structure but support multilingual content

See [WHY_ENGLISH_UI.md](./docs/WHY_ENGLISH_UI_UA.md) for detailed rationale.

---

## Language Policy as Invariant

The Language Policy system is a **core invariant** of OpenRML 1.0+. Every compliant implementation must:

1. Export the Language Policy block with all four fields
2. Validate Language Policy fields on import
3. Respect `ROLE_LANG` as the default language
4. Support `RESPONSE_LANG: auto` at minimum
5. Reject roles where `ROLE_LANG` is not in `SUPPORTED_LANGS`

Language Policy enables a single role to serve users worldwide while maintaining a stable, universal format.

---

## The Long Game

OpenRML is not optimized for the next sprint. It is optimized for the next five years.

The measure of success is not "does the constructor UI work?" It is:

> *Can an independent developer, using only the spec and this repository as reference, build a fully compliant OpenRML implementation in any language?*

When the answer to that question is yes — OpenRML has become a foundation.

---

## Migration from RML to OpenRML

The project was renamed from **RML** to **OpenRML** in version 0.9.0 to emphasize its open-source, community-driven nature.

**Key changes:**
- Project name: RML → OpenRML
- File extension: `.rml.txt` → `.orml.txt`
- Identity prefix: `RML/` → `ORML/`
- Reference URI scheme: `rml://` → `orml://`
- Language Policy: newly mandatory
- Footer: newly mandatory

**Backward compatibility:**
- OpenRML parsers SHOULD support importing legacy `.rml.txt` files
- Legacy files are automatically migrated to OpenRML format on import
- Export always produces OpenRML 1.0 format

**No forward compatibility:**
- Legacy RML parsers cannot read OpenRML files (due to mandatory new sections)

---

*This document is part of the OpenRML specification. Changes require maintainer consensus and version increment.*

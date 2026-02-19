# FOUNDATION.md

> Principles, invariants, and boundaries of the RML system.  
> This document defines what RML is — and what it must never become.

---

## What RML Is

RML (Role Markup Language) is a **specification** for describing AI assistant roles in a structured, portable, and verifiable format.

The specification has three properties that must always hold:

1. **Human-readable.** A person who has never seen RML must be able to understand a role definition without tooling.
2. **LLM-parseable.** A language model must be able to consume an RML document as a system prompt and correctly adopt the described role.
3. **Deterministic.** The same role content must always produce the same RML Identity. Identity is a function of content, not of time or environment.

---

## Data Locality as Architectural Invariant

The reference implementation stores all user data locally in the browser. No data is transmitted to any server. No analytics are collected on role content. No account is required.

**This is not a limitation — it is a design principle.**

A role constructor must not be a surveillance tool. Roles created with RML often contain sensitive personal context: mental health struggles, relationship difficulties, career anxieties, financial stress. The architecture must reflect the sensitivity of what it stores.

This principle has concrete consequences:

- **No server-side role storage.** The backend, if any future implementation adds one, must treat role content as opaque — never reading, indexing, or processing it.
- **No analytics on role content.** Usage metrics (page views, feature adoption) are acceptable. Analysis of what users write in their roles is not.
- **No account requirement for core functionality.** Creating, editing, and exporting roles must remain possible without identity verification.
- **Export as the trust model.** The `.rml.txt` file is not a convenience feature — it is the primary ownership mechanism. The user's copy of their role is always the authoritative one.

Any implementation that violates data locality — storing roles server-side without explicit user consent, transmitting role content to third parties, requiring accounts for basic use — is not a compliant RML implementation. It is a different product.

---

## The Invariant Parts

These are the non-negotiable foundations of RML. They cannot be changed without a major version increment and a formal deprecation period.

### 1. The 8-Step Structure

Every RML role consists of exactly 8 steps:

| Step | Name | Purpose |
|------|------|---------|
| 1 | Base Information | Identity, category, archetype, goal |
| 2 | Visual Portrait | Persona appearance and environment |
| 3 | Behavior & Tone | Personality, greeting, should/should not |
| 4 | Expertise & Rules | Domain knowledge, tools, output formats |
| 5 | Journey Sessions | Structured interaction sessions |
| 6 | Team Collaboration | Multi-agent coordination |
| 7 | Memory System | Memory strategy and emotional tracking |
| 8 | Ethics & Versions | Rules, referral protocol, disclaimer |

The 8-step structure is **the core of RML**. It is not a UI convention — it is the specification itself. Any implementation that omits a step is non-compliant.

### 2. RML Identity

Every published role must have a deterministic identity:

```
RML/{ArchetypeCode}{CategoryCode}/{Version}/{BaseHash}/{VisualHash}/{ToneHash}/{ExpertiseHash}/{JourneyHash}/{TeamHash}/{MemoryHash}/{EthicsHash}
```

- Each hash is a 4-character djb2 hash of the corresponding step content
- The full ID changes if and only if the content of any step changes
- Identity hashes are computed over normalized content (sorted arrays, trimmed strings)

**Identity must never include timestamps, random values, or environment-dependent data.**

### 3. The Export Format

The RML text export format is the ground truth of the specification. The format:

- Begins with activation instructions (the preamble)
- Includes the identity block if published
- Renders all 8 steps in order
- Is human-readable plain text
- Uses consistent Unicode section markers (═, ─, 📋, 🎨, 💬, 🎯, 🗺️, 👥, 🧠, ⚖️)

A compliant parser must be able to recover a `Role` object from this format without loss of semantically significant information.

---

## The Extensible Parts

These are designed for extension without breaking compatibility:

- **Templates** — new role templates can be added freely
- **Storage adapters** — any storage backend can be plugged in via the adapter interface
- **Categories and archetypes** — new values can be registered
- **Step content** — fields within each step can be extended with `x-` prefixed custom fields (planned for 0.3.0)
- **Export renderers** — alternative output formats (JSON, YAML, Markdown) can be added alongside the canonical text format

---

## What Constitutes a Violation

The following are considered **violations of the RML standard**:

| Violation | Why |
|-----------|-----|
| Omitting a step from export | Breaks round-trip fidelity |
| Non-deterministic identity generation | Invalidates the hash system |
| Storing sensitive data (tokens, keys) in role fields | Security — roles are intended to be shared |
| Using `any` types for core domain objects | Undermines the type-safe contract |
| Breaking the import → export round-trip | Core invariant of the spec |
| Embedding UI-specific logic in `core/` | Violates layered architecture |

---

## Design Philosophy

### Separation of Specification and Implementation

The specification (what RML defines) and the implementation (this repository) are distinct. The implementation must always serve the specification — not the other way around. When UI constraints conflict with spec correctness, the spec wins.

### Longevity Over Convenience

RML is designed to outlive any single implementation. Decisions that make the current UI easier but complicate future implementations are to be avoided. When in doubt, choose the option that a Python CLI tool or a Go library could implement without reimagining the format.

### Explicit Over Implicit

Every field in an RML document has an explicit declared meaning. There are no magic defaults that only work in the reference implementation. Default values are defined in the specification, not inferred from runtime behavior.

### Roles as Artifacts, Not Sessions

An RML role is a persistent artifact with a stable identity. It is not a session configuration. It is not a prompt template. It is a fully described entity that can be stored, versioned, shared, validated, and adopted by any capable system.

---

## The Long Game

RML is not optimized for the next sprint. It is optimized for the next five years.

The measure of success is not "does the constructor UI work?" It is:

> *Can an independent developer, using only the spec and this repository as reference, build a fully compliant RML implementation in any language?*

When the answer to that question is yes — RML has become a foundation.

---

*This document is part of the RML specification. Changes require maintainer consensus and version increment.*

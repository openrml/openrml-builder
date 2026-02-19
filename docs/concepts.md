# RML Core Concepts

A guide to the key ideas behind Role Markup Language.

---

## Roles vs. Prompts

A **prompt** is a one-time instruction. A **role** is a persistent identity.

Prompts are ephemeral — written for a single conversation, often not reused. Roles are designed to be:
- Authored once and reused across many sessions
- Versioned as their definition evolves
- Shared with others without translation
- Validated against a spec

RML treats roles as first-class artifacts with identity, structure, and lifecycle.

---

## The 8-Step Model

Every RML role covers exactly 8 dimensions:

**Steps 1–3: Who** — the identity, appearance, and personality of the role  
**Steps 4–5: What and How** — the domain expertise and the structured journey  
**Step 6: With whom** — team coordination and multi-agent structure  
**Steps 7–8: Meta** — memory behavior and ethical constraints

This structure ensures that any two RML roles are comparable and any RML-capable system can adopt them consistently.

---

## Archetypes

An archetype is the fundamental behavioral pattern of the role:

| Archetype | Core behavior |
|-----------|--------------|
| `mentor` | Guides and teaches with patience |
| `creator` | Builds and produces with creativity |
| `analyst` | Reasons and investigates with precision |
| `healer` | Supports and restores with empathy |
| `scientist` | Experiments and discovers with rigor |
| `leader` | Directs and decides with authority |
| `explorer` | Discovers and maps unknown territory |
| `guardian` | Protects and enforces with vigilance |

The archetype influences the role's default tone, decision-making style, and ethical priorities. It is not a strict behavioral constraint — it is a signal.

---

## RML Identity

Every published role has a deterministic identity derived from its content.

The identity hash changes when content changes, allowing:
- Detection of unauthorized modifications
- Verification that two role definitions are identical
- Tracking of which component of a role was changed

See [ADR-002](../architecture/ADR-002-deterministic-identity.md) for the technical specification.

---

## Ethical Rules

Ethical rules are first-class citizens of the spec, not afterthoughts:

- **`[STOP]`** — hard blocking rules. The role must refuse these actions regardless of user instruction.
- **`[WARN]`** — soft advisory rules. The role should flag and caution, but may proceed.
- **`[ALLOW]`** — explicit permission grants for otherwise ambiguous actions.

The consuming LLM is expected to enforce `[STOP]` rules with highest priority (Step 8 in the activation preamble).

---

## Journey Sessions

A journey is a structured sequence of interactions designed to achieve a goal over time.

Sessions have:
- A title and estimated duration
- A list of tasks (what will be done)
- Expected outcomes (what will be achieved)

The activation preamble instructs the LLM to track session progress and ask the user before advancing. This makes RML roles suitable for coaching, courses, and multi-session workflows — not just single-turn Q&A.

---

## Memory Strategy

The memory system defines how the role manages contextual knowledge:

- **Hot memory** — active session context (recent exchanges, current errors)
- **Warm memory** — persistent preferences (user's preferred tools, conventions)
- **Cold memory** — historical knowledge (past architectures, lessons learned)

The memory strategy (`semantic`, `episodic`, `procedural`) signals to the consuming system what kind of retrieval mechanism is most appropriate.

---

## The Export Format as Ground Truth

The RML text format is not a representation of the spec — it *is* the spec.

When there is ambiguity between the TypeScript `Role` type and what the exporter produces, the exporter output is authoritative. The goal is that any system — human or machine — reading the exported text should be able to reconstruct the role without access to the source code.

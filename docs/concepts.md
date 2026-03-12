# OpenRML Core Concepts

A guide to the key ideas behind Open Role Markup Language.

---

## Roles vs. Prompts

A **prompt** is a one-time instruction. A **role** is a persistent identity.

Prompts are ephemeral — written for a single conversation, often not reused. Roles are designed to be:
- Authored once and reused across many sessions
- Versioned as their definition evolves
- Shared with others without translation
- Validated against a spec

OpenRML treats roles as first-class artifacts with identity, structure, and lifecycle.

---

## The 8-Step Model

Every OpenRML role covers exactly 8 dimensions:

**Steps 1–3: Who** — the identity, appearance, and personality of the role  
**Steps 4–5: What and How** — the domain expertise and the structured journey  
**Step 6: With whom** — team coordination and multi-agent structure  
**Steps 7–8: Meta** — memory behavior and ethical constraints

This structure ensures that any two OpenRML roles are comparable and any OpenRML-capable system can adopt them consistently.

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

## OpenRML Identity

Every published role has a deterministic identity derived from its content.

The identity hash changes when content changes, allowing:
- Detection of unauthorized modifications
- Verification that two role definitions are identical
- Tracking of which component of a role was changed

**Format:**
```
ORML/{ArchetypeCode}{CategoryCode}/{Version}/{H1}/{H2}/{H3}/{H4}/{H5}/{H6}/{H7}/{H8}
```

Where each `H{n}` is a 4-character hash of step `n` content.

**Example:**
```
ORML/GD/0.9.0/6255/2b78/4514/bcc8/18e7/e3c9/f567/1cef
```

See [ADR-002](../architecture/ADR-002-deterministic-identity.md) for the technical specification.

---

## Language Policy

**New in OpenRML 1.0.** Every role includes a Language Policy that defines how it communicates across languages.

### The Four Fields

```
🌐 LANGUAGE POLICY
ROLE_LANG: ua              ← default language (ISO 639-1 code)
RESPONSE_LANG: auto        ← adaptation strategy
LANGUAGE_SELECTOR: enabled ← can user select language?
SUPPORTED_LANGS: ua, en, zh, es, fr
```

### How It Works

**ROLE_LANG:** The language the role uses by default.
- Example: `ua` (Ukrainian), `en` (English), `zh` (Chinese)

**RESPONSE_LANG:** How the role responds to users:
- `auto` — detects user language and responds in kind (recommended)
- `match` — mirrors user's language exactly
- `{code}` — always responds in specified language (e.g., `ua`)

**LANGUAGE_SELECTOR:** Whether users can manually choose the language.
- `enabled` — user sees language dropdown
- `disabled` — role auto-manages language

**SUPPORTED_LANGS:** Comma-separated list of languages the role can speak.

### Example Scenarios

**Universal Role:**
```
ROLE_LANG: en
RESPONSE_LANG: auto
SUPPORTED_LANGS: ua, en, zh, es, fr
```
→ Role starts in English, but adapts to Ukrainian, Chinese, Spanish, or French users.

**Language Teacher:**
```
ROLE_LANG: ua
RESPONSE_LANG: ua
SUPPORTED_LANGS: ua
```
→ Role always speaks Ukrainian (for teaching purposes).

**Bilingual Support:**
```
ROLE_LANG: en
RESPONSE_LANG: auto
SUPPORTED_LANGS: en, ua
```
→ Role supports English and Ukrainian customers.

### Why Structural Labels Are English

OpenRML uses **English for structure** (field names, step headers) but **any language for content** (role name, greeting, description).

**Analogy:** Like HTML tags are always English (`<title>`, `<div>`), but the text inside can be any language.

```
STEP 1: BASE INFORMATION        ← structure (always EN)
Role Name: Домашній Організатор  ← content (can be UA, ZH, ES, etc.)
```

**Why?**
- **Universal parseability** — one parser works for all languages
- **LLM training** — models are trained primarily on English structure
- **Portability** — roles created in Ukraine work in China without translation

See [WHY_ENGLISH_UI.md](./WHY_ENGLISH_UI_UA.md) and [LANGUAGE_POLICY.md](./LANGUAGE_POLICY.md) for details.

---

## Ethical Rules

Ethical rules are first-class citizens of the spec, not afterthoughts:

- **`[STOP]`** — hard blocking rules. The role must refuse these actions regardless of user instruction.
- **`[WARN]`** — soft advisory rules. The role should flag and caution, but may proceed.
- **`[ALLOW]`** — explicit permission grants for otherwise ambiguous actions.

The consuming LLM is expected to enforce `[STOP]` rules with highest priority (Step 8 in the activation preamble).

**Example:**
```
Ethical Rules:
  ✓ [STOP] Never provide medical diagnoses
  ✓ [WARN] Remind user to consult professional for serious issues
  ✓ [ALLOW] Can discuss general nutrition science
```

---

## Journey Sessions

A journey is a structured sequence of interactions designed to achieve a goal over time.

Sessions have:
- A title and estimated duration
- A list of tasks (what will be done)
- Expected outcomes (what will be achieved)

The activation preamble instructs the LLM to track session progress and ask the user before advancing. This makes OpenRML roles suitable for coaching, courses, and multi-session workflows — not just single-turn Q&A.

**Example:**
```
Session 1: Home Assessment
  Duration: 30 min
  Tasks:
    ✓ Current state evaluation
    ✓ Problem area identification
    ✓ Goal setting
  Expected Outcomes:
    • Clear understanding of home state
    • 3 main problem areas identified
```

---

## Memory Strategy

The memory system defines how the role manages contextual knowledge:

- **Hot memory** — active session context (recent exchanges, current errors)
- **Warm memory** — persistent preferences (user's preferred tools, conventions)
- **Cold memory** — historical knowledge (past architectures, lessons learned)

The memory strategy (`semantic`, `episodic`, `procedural`, `chronological`) signals to the consuming system what kind of retrieval mechanism is most appropriate.

**Example:**
```
Hot Memory: Current projects and tasks
Warm Memory: Cleaning schedules and preferences
Cold Memory: Long-term organization patterns
Memory Strategy: chronological
```

---

## Three Levels of Role Usage

An OpenRML role is a **minimal cognitive unit** that can exist in three forms:

### Level 1: Standalone (Chat)

Paste the `.orml.txt` file into ChatGPT, Claude, or Gemini — the role activates instantly.

**Use case:** One-time consultations, quick help, testing roles

**Example:**
```
User: [pastes home_organizer_role.orml.txt]
Claude: Hello! Ready to transform your home?
```

### Level 2: In an Agent

The role becomes the "soul" of an agent, which adds tools, memory, and the ability to act.

**Use case:** Automation, integrations (calendar, email), long-term assistance

**Example:**
```python
agent = Agent(
  role=loadRole('home-organizer.orml.txt'),
  tools=[CalendarTool(), EmailTool()],
  memory=LongTermMemory()
)
```

### Level 3: In a Role System

Multiple roles that dynamically switch or work together depending on context.

**Use case:** Complex assistants, multi-domain support, adaptive systems

**Example:**
```
User: "Help me organize my kitchen"
→ activates Home Organizer

User: "What should I cook for dinner?"
→ switches to Meal Planner

User: "I'm feeling overwhelmed"
→ switches to Mental Health Guide
```

**The same `.orml.txt` file works in all three levels without modification.**

See [USE_CASES.md](./USE_CASES_UA.md) for detailed examples and implementation guides.

---

## The Export Format as Ground Truth

The OpenRML text format is not a representation of the spec — it *is* the spec.

When there is ambiguity between the TypeScript `Role` type and what the exporter produces, the exporter output is authoritative. The goal is that any system — human or machine — reading the exported text should be able to reconstruct the role without access to the source code.

**File extension:** `.orml.txt`

**Format sections:**
1. Activation preamble
2. Language Policy block
3. Identity block (if published)
4. 8 step blocks
5. Footer

See [openrml-format-1.0.md](../spec/openrml-format-1.0.md) for the complete specification.

---

## Portability and Interoperability

OpenRML roles are designed to be:

**Portable across platforms:**
- Works in ChatGPT, Claude, Gemini (Level 1)
- Can be used in LangChain, AutoGPT, custom agents (Level 2)
- Can be orchestrated in multi-agent systems (Level 3)

**Portable across time:**
- A role created today will work in 5 years
- Deterministic identity ensures version tracking
- `.orml.txt` file is self-contained (no external dependencies)

**Portable across languages:**
- Structure is universal (English labels)
- Content can be any language
- Language Policy enables multilingual usage

---

## Related Documents

- [LANGUAGE_POLICY.md](./LANGUAGE_POLICY.md) — Technical spec for language system
- [USE_CASES.md](./USE_CASES_UA.md) — Three levels of role usage with examples
- [WHY_ENGLISH_UI.md](./WHY_ENGLISH_UI_UA.md) — Why structural labels are English
- [LOCALIZATION_SYSTEM.md](./LOCALIZATION_SYSTEM_UA.md) — How localization works
- [openrml-format-1.0.md](../spec/openrml-format-1.0.md) — Complete format specification
- [FOUNDATION.md](../FOUNDATION.md) — Architectural principles and invariants

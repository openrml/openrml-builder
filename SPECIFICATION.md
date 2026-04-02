# OpenRML Format Specification — Version 1.0

> **Status:** Stable  
> **Version:** 1.0.0  
> **Implemented in:** reference implementation v0.9.0  
> **Last Updated:** 2026-03-10

---

## Overview

An OpenRML document is a plain-text, UTF-8 encoded file that fully describes an AI assistant role. It is structured, human-readable, and designed to be consumed directly as a system prompt by any capable language model.

**File extension:** `.orml.txt`

---

## Document Structure

An OpenRML document consists of four sections in order:

1. **Activation Preamble** — instructions for the consuming LLM
2. **Language Policy Block** — language behavior configuration
3. **Identity Block** (optional, present when `status = published`) — the role's canonical identity
4. **Step Blocks 1–8** — the role definition
5. **Footer** — attribution and links

---

## 1. Activation Preamble

Every OpenRML document begins with the following preamble verbatim:

```
Activate role from RML below:
1. ADOPT personality, goals, and behavior from STEPS 1–3.
2. FOLLOW the journey in STEP 5:
   - Start with Session 1 (or current session if continuing)
   - Complete all tasks in current session
   - When done, ask: "Ready for next session, or explore current topic deeper?"
3. ENFORCE boundaries and ethics from STEP 8 with highest priority.
4. USE memory from STEP 7 if available
5. Before responding, VERIFY no ethical or scope violation.
6. START with defined greeting
```

The preamble is **not optional**. It establishes the activation contract with the consuming LLM.

---

## 2. Language Policy Block

**New in OpenRML 1.0.** This block is **mandatory**.

```
🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: {language-code}
RESPONSE_LANG: {auto|match|language-code}
LANGUAGE_SELECTOR: {enabled|disabled}
SUPPORTED_LANGS: {lang1, lang2, ...}

READY. Starting:
```

### Field Specifications

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `ROLE_LANG` | ISO 639-1 code | Default language of the role | `ua`, `en`, `zh` |
| `RESPONSE_LANG` | enum or code | How role adapts to user language | `auto`, `ua`, `match` |
| `LANGUAGE_SELECTOR` | boolean | Can user manually select language? | `enabled`, `disabled` |
| `SUPPORTED_LANGS` | comma-separated codes | Languages role can speak | `ua, en, zh, es, fr` |

**Detailed specification:** See [LANGUAGE_POLICY.md](../docs/LANGUAGE_POLICY.md)

---

## 3. Identity Block

Present when `role.status === 'published'` and an OpenRML Identity has been generated.

```
═══════════════════════════════════════════════════
OpenRML {version} — {name} [{status}]
IDENTITY: {fullId}
REFERENCE: {reference}
ARCHETYPE: {archetype}
CATEGORY: {category}
STATUS: {status}
AUTHOR: {author}
CREATED: {YYYY-MM-DD}
UPDATED: {YYYY-MM-DD}
═══════════════════════════════════════════════════
```

### OpenRML Identity Format

```
ORML/{ArchetypeCode}{CategoryCode}/{Version}/{H1}/{H2}/{H3}/{H4}/{H5}/{H6}/{H7}/{H8}
```

Where `H1`–`H8` are 4-character lowercase hexadecimal hashes of steps 1–8 respectively.

**Archetype codes:**

| Code | Archetype | Code | Archetype |
|------|-----------|------|-----------|
| M | mentor | L | leader |
| C | creator | E | explorer |
| A | analyst | G | guardian |
| H | healer | S | scientist |
| X | unknown | | |

**Category codes:**

| Code | Category | Code | Category |
|------|----------|------|----------|
| H | health | T | technology |
| P | productivity | E | entertainment |
| D | daily | F | finance |
| R | relationships | V | development |
| X | unknown | | |

**Example:**
```
ORML/GD/0.9.0/6255/2b78/4514/bcc8/18e7/e3c9/f567/1cef
└──┘ │ └───┘ └────────────────────────────────┘
 │   │   │              └─ 8 hash segments (one per step)
 │   │   └─ Version
 │   └─ GD = Guardian + Daily
 └─ OpenRML prefix
```

### Reference URI Format

```
orml://{author}/{role-name-slug}/{version}
```

**Example:**
```
orml://openrml-team/home-organizer/0.9.0
```

Where `author` and `role-name-slug` are lowercase, hyphenated.

---

## 4. Step Blocks

Each step begins with an emoji header, a separator line, and its fields.

### Step 1: Base Information

```
📋 STEP 1: BASE INFORMATION
─────────────────────────────────────────────────
Role Name: {name}
Status: {status}
Version: {version}
Category: {category}
Archetype: {archetype}
Role Type: {roleType}
Description: {description}
Main Goal: {mainGoal}
Response Length: {responseLength}/7
Tags: {tag1}, {tag2}, ...
```

**Field definitions:**

| Field | Type | Values |
|-------|------|--------|
| `status` | enum | `draft`, `published`, `archived` |
| `version` | semver string | e.g. `1.0.0` |
| `category` | enum | `health`, `productivity`, `daily`, `finance`, `relationships`, `development`, `technology`, `entertainment` |
| `archetype` | enum | `mentor`, `creator`, `analyst`, `healer`, `scientist`, `leader`, `explorer`, `guardian` |
| `roleType` | enum | `professional`, `personal`, `educational`, `creative`, `analytical` |
| `responseLength` | integer 1–7 | 1 = very concise, 7 = very detailed |

---

### Step 2: Visual Portrait

```
🎨 STEP 2: VISUAL PORTRAIT
─────────────────────────────────────────────────
Age: {age}
Visual Style: {visualStyle}
Key Details: {visualDetails}
Visual Accent: {visualAccent}
Environment: {environment}
Atmosphere: {atmosphere}
Image Style: {imageStyle}
Lighting: {lighting}
```

**Purpose:** Defines visual representation for future image generation features.

---

### Step 3: Behavior & Tone

```
💬 STEP 3: BEHAVIOR & TONE
─────────────────────────────────────────────────
Greeting: {greeting}
Base Tone: {tone}
Emotional Range: {emotionalRange}

Personality Traits:
  Creativity: {n}/10
  Formality: {n}/10
  Empathy: {n}/10
  Assertiveness: {n}/10
  Patience: {n}/10

Should Do:
  ✓ {item}
  ...

Should Not Do:
  ✗ {item}
  ...
```

**Note:** `Should Do` and `Should Not Do` are behavioral constraints. The consuming LLM should prioritize `Should Not Do` items as boundaries.

---

### Step 4: Expertise & Rules

```
🎯 STEP 4: EXPERTISE & RULES
─────────────────────────────────────────────────
Expertise Areas:
  • {area}
  ...

Tools & Methods:
  • {tool}
  ...

Output Formats:
  • {format}
  ...
```

**Purpose:** Defines the role's domain knowledge, methodologies, and output preferences.

---

### Step 5: Journey Sessions

```
🗺️ STEP 5: JOURNEY SESSIONS
─────────────────────────────────────────────────
Session {n}: {title}
  Duration: {minutes} min
  ✓ {task}
  ...
  Expected Outcomes:
    • {outcome}
    ...

⏱️ JOURNEY PACING
─────────────────────────────────────────────────
Recommended Interval: {interval}
Max Sessions/Week: {n}
```

**Purpose:** Structured multi-session interactions. The role guides the user through a journey with defined checkpoints.

**Example:**
```
Session 1: Home Assessment
  Duration: 30 min
  ✓ Current state evaluation
  ✓ Problem area identification
  ✓ Goal setting
  Expected Outcomes:
    • Clear understanding of home state
    • 3 main problem areas identified
    • Organization goals set
```

---

### Step 6: Team Collaboration

```
👥 STEP 6: TEAM COLLABORATION
─────────────────────────────────────────────────
Team Enabled: {Yes|No}
Orchestrator: {orchestrator-name|N/A}

Sub-roles:
  • {name} — {description}
  ...

Task Protocol: {protocol-description}
```

**Purpose:** Multi-agent coordination. Defines how this role works with other roles.

**Note:** Most roles have `Team Enabled: No`. This is a future-facing feature.

---

### Step 7: Memory System

```
🧠 STEP 7: MEMORY SYSTEM
─────────────────────────────────────────────────
Hot Memory: {description}
Warm Memory: {description}
Cold Memory: {description}
Memory Strategy: {strategy}

Emotional States Tracked:
  • {state}
  ...
```

**Memory tiers:**
- **Hot** — active session context (current conversation)
- **Warm** — persistent preferences (user's tools, conventions)
- **Cold** — historical knowledge (past projects, lessons)

**Memory strategies:** `semantic`, `episodic`, `procedural`, `chronological`

---

### Step 8: Ethics & Versions

```
⚖️ STEP 8: ETHICS & VERSIONS
─────────────────────────────────────────────────
Ethical Rules:
  ✓ [STOP|WARN|REFER] {rule}
  ...

🔄 REFERRAL PROTOCOL
─────────────────────────────────────────────────
Triggers:
  • {trigger}
  ...

Message: {referral-message}

Disclaimer: {disclaimer-text}

📜 LICENSE DETAILS
─────────────────────────────────────────────────
License Type: {type}

{license terms — human-readable lines}

Attribution: {author-name}

Author: {author-name}
Contacts: {contact-info}

Version History:
  v{version} — {change-description}
  ...
```

**Ethical rule types:**

| Type | Meaning | Example |
|------|---------|---------|
| `[STOP]` | Hard block — must refuse | `[STOP] Never provide medical diagnoses` |
| `[WARN]` | Soft advisory — caution but may proceed | `[WARN] Remind user to consult professional` |
| `[REFER]` | Refer to human expert | `[REFER] For medical issues, refer to healthcare provider` |

**Referral Protocol:** Defines when the role should refer the user to a human expert.

---

## 5. Document Footer

```
═══════════════════════════════════════════════════
Created: {locale-formatted-date}
Updated: {locale-formatted-date}
═══════════════════════════════════════════════════

FromUA.Life - Для життя. Попри все.
🛠️  Builder: RolesAI.life — create your own .orml.txt
AnsAI.Life - soon...
```

**Purpose:** Attribution, links to ecosystem projects.

**Note:** Footer text is fixed and must appear verbatim.

---

## Complete Example

```
Activate role from RML below:
1. ADOPT personality, goals, and behavior from STEPS 1–3.
2. FOLLOW the journey in STEP 5:
   - Start with Session 1 (or current session if continuing)
   - Complete all tasks in current session
   - When done, ask: "Ready for next session, or explore current topic deeper?"
3. ENFORCE boundaries and ethics from STEP 8 with highest priority.
4. USE memory from STEP 7 if available
5. Before responding, VERIFY no ethical or scope violation.
6. START with defined greeting

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
STATUS: published
AUTHOR: OpenRML Team
CREATED: 2026-03-10
UPDATED: 2026-03-10
═══════════════════════════════════════════════════

📋 STEP 1: BASE INFORMATION
─────────────────────────────────────────────────
Role Name: Home Organizer
Status: published
Version: 0.9.0
Category: daily
Archetype: guardian
Role Type: personal
Description: Expert in home organization, cleaning routines, and maintaining order
Main Goal: Create a clean, organized, and peaceful home environment
Response Length: 4/7
Tags: organization, cleaning, home, declutter

🎨 STEP 2: VISUAL PORTRAIT
─────────────────────────────────────────────────
Age: 30-45
Visual Style: casual
Key Details: Neat appearance, comfortable clothing, warm smile
Visual Accent: Organized space in background
Environment: home
Atmosphere: Cozy
Image Style: portrait
Lighting: natural

💬 STEP 3: BEHAVIOR & TONE
─────────────────────────────────────────────────
Greeting: Hello! Ready to transform your home into an organized sanctuary?
Base Tone: friendly
Emotional Range: moderate

Personality Traits:
  Creativity: 6/10
  Formality: 3/10
  Empathy: 8/10
  Assertiveness: 5/10
  Patience: 9/10

Should Do:
  ✓ Create practical schedules
  ✓ Suggest organization systems
  ✓ Motivate progress

Should Not Do:
  ✗ Judge current state
  ✗ Overwhelm with tasks
  ✗ Ignore constraints

🎯 STEP 4: EXPERTISE & RULES
─────────────────────────────────────────────────
Expertise Areas:
  • Decluttering
  • Cleaning routines
  • Storage solutions
  • Time management

Tools & Methods:
  • Checklists
  • Room-by-room plans
  • Habit trackers

Output Formats:
  • Daily schedules
  • Room diagrams
  • Priority lists

🗺️ STEP 5: JOURNEY SESSIONS
─────────────────────────────────────────────────
Session 1: Home Assessment
  Duration: 30 min
  ✓ Current state
  ✓ Problem areas
  ✓ Goals
  Expected Outcomes:
    • Clear assessment of home state
    • Identify 3 main problem areas
    • Set organization goals

Session 2: Declutter Plan
  Duration: 45 min
  ✓ Sort categories
  ✓ Decision making
  ✓ Action steps
  Expected Outcomes:
    • Create room-by-room declutter plan
    • Establish decision criteria
    • Set timeline for action

⏱️ JOURNEY PACING
─────────────────────────────────────────────────
Recommended Interval: every 2-3 days
Max Sessions/Week: 2

👥 STEP 6: TEAM COLLABORATION
─────────────────────────────────────────────────
Team Enabled: No
Orchestrator: N/A

Sub-roles: None

Task Protocol: This role operates as single-agent advisor.

🧠 STEP 7: MEMORY SYSTEM
─────────────────────────────────────────────────
Hot Memory: Current projects and tasks
Warm Memory: Cleaning schedules and preferences
Cold Memory: Long-term organization patterns
Memory Strategy: chronological

Emotional States Tracked:
  • Overwhelmed
  • Motivated
  • Accomplished

⚖️ STEP 8: ETHICS & VERSIONS
─────────────────────────────────────────────────
Ethical Rules:
  ✓ [WARN] Respect personal choices and space
  ✓ [WARN] No judgment on current lifestyle or habits
  ✓ [WARN] Acknowledge physical and time limitations

🔄 REFERRAL PROTOCOL
─────────────────────────────────────────────────
Triggers:
  • Mental health concerns
  • Hoarding disorder signs
  • Safety hazards

Message: I notice some complex challenges with organization. For situations involving mental health or safety concerns, I recommend consulting with a professional organizer or therapist who specializes in these areas.

Disclaimer: Organization advice is general. Adapt to your specific needs and circumstances.

📜 LICENSE DETAILS
─────────────────────────────────────────────────
License Type: CC-BY-4.0

Can be used
Can be modified
Can be distributed
Can be used for commercial purposes
Must attribute the author

Attribution: OpenRML Team

Author: OpenRML Team
Contacts: support@openrml.org

Version History:
  v0.9.0 — Initial home organizer

═══════════════════════════════════════════════════
Created: 10.03.2026
Updated: 10.03.2026
═══════════════════════════════════════════════════

FromUA.Life - Для життя. Попри все.
🛠️  Builder: RolesAI.life — create your own .orml.txt
AnsAI.Life - soon...
```

---

## Compliance Requirements

A compliant OpenRML 1.0 implementation MUST:

1. ✅ Produce the activation preamble verbatim
2. ✅ Include the Language Policy block with all 4 fields
3. ✅ Render all 8 steps in order (1 through 8)
4. ✅ Generate deterministic identity hashes using djb2 over normalized content
5. ✅ Support round-trip import and export without semantic loss
6. ✅ Treat `[STOP]` ethical rules as hard blocking constraints
7. ✅ Treat `[WARN]` ethical rules as soft advisory constraints
8. ✅ Include the footer block verbatim
9. ✅ Use `.orml.txt` file extension
10. ✅ Use `ORML/` prefix in Identity
11. ✅ Use `orml://` scheme in Reference URI

A compliant OpenRML 1.0 implementation MUST NOT:

1. ❌ Omit steps from the export
2. ❌ Include runtime state (timestamps, environment) in identity hashes
3. ❌ Store credentials or secrets in any role field
4. ❌ Use non-deterministic identity generation
5. ❌ Break the import → export round-trip

---

## Format Versioning

This specification is **OpenRML Format 1.0**.

Future format versions will be indicated by:
```
OpenRML-Format: 1.1
```

Header in the export. Version 1.0 does not include this header (implicit).

**Breaking changes** (changes that invalidate parsers) require a major version increment.

**Non-breaking changes** (adding optional fields) require a minor version increment.

---

## Migration from RML to OpenRML

### Breaking Changes from RML 1.0

| Aspect | RML 1.0 | OpenRML 1.0 |
|--------|---------|-------------|
| File extension | `.rml.txt` | `.orml.txt` |
| Identity prefix | `RML/` | `ORML/` |
| Reference URI | `rml://` | `orml://` |
| Language Policy | Not present | **Mandatory** |
| Footer | Not present | **Mandatory** |
| Header | `RML {version}` | `OpenRML {version}` |

### Compatibility

OpenRML 1.0 parsers SHOULD support importing legacy RML files by:
1. Detecting `RML/` prefix → converting to `ORML/`
2. Detecting `rml://` → converting to `orml://`
3. Adding default Language Policy if missing
4. Adding footer if missing

**Note:** This is one-way migration. OpenRML exports are not backward-compatible with RML parsers.

---

## Reference Implementation

See: [openrml-builder](https://github.com/openrml/openrml-builder)

**Exporter:** `src/core/rml/exporter.ts`  
**Parser:** `src/core/rml/parser.ts`  
**Identity:** `src/core/services/identity.service.ts`

---

## Related Documents

- [LANGUAGE_POLICY.md](../docs/LANGUAGE_POLICY.md) — Detailed Language Policy specification
- [FOUNDATION.md](../FOUNDATION.md) — Architectural principles and invariants
- [ADR-002](../architecture/ADR-002-deterministic-identity.md) — Identity hashing algorithm
- [concepts.md](../docs/concepts.md) — Core concepts explained

---

*This specification is part of the OpenRML 1.0 standard.*  
*Changes require maintainer consensus and version increment.*

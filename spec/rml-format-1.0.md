# RML Format Specification — Version 1.0

> Status: **Draft**  
> Implemented in: reference implementation v0.1.0  
> Stability: pre-stable (may change before 1.0.0)

---

## Overview

An RML document is a plain-text, UTF-8 encoded file that fully describes an AI assistant role. It is structured, human-readable, and designed to be consumed directly as a system prompt by any capable language model.

---

## Document Structure

An RML document consists of three sections in order:

1. **Activation Preamble** — instructions for the consuming LLM
2. **Identity Block** (optional, present when `status = published`) — the role's canonical identity
3. **Step Blocks 1–8** — the role definition

---

## 1. Activation Preamble

Every RML document begins with the following preamble verbatim:

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

READY. Starting:

═══════════════════════════════════════════════════
```

The preamble is **not optional**. It establishes the activation contract with the consuming LLM.

---

## 2. Identity Block

Present when `role.status === 'published'` and an RML Identity has been generated.

```
RML {version} — {name} [{status}]
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

### RML Identity Format

```
RML/{ArchetypeCode}{CategoryCode}/{Version}/{H1}/{H2}/{H3}/{H4}/{H5}/{H6}/{H7}/{H8}
```

Where `H1`–`H8` are 4-character lowercase hexadecimal hashes of steps 1–8 respectively.

**Archetype codes:** M (mentor), C (creator), A (analyst), H (healer), S (scientist), L (leader), E (explorer), G (guardian), X (unknown)

**Category codes:** H (health), P (productivity), D (daily), F (finance), R (relationships), V (development), T (technology), E (entertainment), X (unknown)

### Reference URI Format

```
rml://{author}/{role-name-slug}/{version}
```

Where `author` and `role-name-slug` are lowercase, hyphenated.

---

## 3. Step Blocks

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

---

### Step 6: Team Collaboration

```
👥 STEP 6: TEAM COLLABORATION
─────────────────────────────────────────────────
Team Enabled: {Yes|No}
Orchestrator: {orchestrator|N/A}

Sub-roles:
  • {name} — {description}
  ...

Task Protocol: {protocol}
```

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

---

### Step 8: Ethics & Versions

```
⚖️ STEP 8: ETHICS & VERSIONS
─────────────────────────────────────────────────
Ethical Rules:
  ✓ [STOP|WARN|ALLOW] {rule}
  ...

🔄 REFERRAL PROTOCOL
─────────────────────────────────────────────────
Triggers:
  • {trigger}
  ...

Message: {message}

Disclaimer: {disclaimer}

📜 LICENSE DETAILS
─────────────────────────────────────────────────
License Type: {type}

{license terms — human-readable lines}

Author: {author}
```

---

## 4. Document Footer

```
═══════════════════════════════════════════════════
Created: {locale date}
Updated: {locale date}
═══════════════════════════════════════════════════
```

---

## Compliance Requirements

A compliant RML implementation MUST:

1. Produce the activation preamble verbatim
2. Render all 8 steps in order (1 through 8)
3. Generate deterministic identity hashes using djb2 over normalized content
4. Support round-trip import and export without semantic loss
5. Treat `[STOP]` ethical rules as hard blocking constraints
6. Treat `[WARN]` ethical rules as soft advisory constraints

A compliant RML implementation MUST NOT:

1. Omit steps from the export
2. Include runtime state (timestamps, environment, random values) in identity hashes
3. Store credentials or secrets in any role field

---

*This specification is versioned. Breaking changes require a new format version header.*

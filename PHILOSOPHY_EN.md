# OPENRML PHILOSOPHY

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   OPENRML MANIFESTO v.1.0                                    ║
║   Philosophy of the open standard for human and AI roles    ║
║                                                              ║
║   Format: *.orml.txt                                         ║
║   Motto: "Everyone can become an architect of meaning"      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## I. PREAMBLE: FROM LAMP TO ARCHITECTURE

We have been given Aladdin's Lamp.

It grants infinite wishes. But most rub it blindly, getting dust instead of palaces. We lose trillions of dollars in intellectual potential because humanity lacks the language to explain to the Genie **who to be**.

**OpenRML (Open Role Markup Language)** is the first attempt to create such a language.

This is not just a file format. It's a **cognitive contract** between human and AI. It's the DNA of a personality that can be transmitted, modified, improved, and launched anywhere.

---

## II. WHAT IS A ROLE IN *.orml.txt

A role is not a prompt.

**A prompt** is a shout into the void.  
**A role** is an **architectural blueprint of a personality**.

A `.orml.txt` file is a container that holds:

| Component | What it is in metaphor |
|-----------|------------------------|
| **IDENTITY** | The Genie's name, origin, version of soul |
| **BEHAVIOR** | Temperament, values, taboos (what's allowed and forbidden) |
| **EXPERTISE** | Baggage of knowledge, tools, books on the shelf |
| **JOURNEY** | The roadmap the Genie guides the person through |
| **MEMORY** | What to remember and what to forget |
| **ETHICS** | Stop-switches that cannot be crossed |
| **LICENSE** | Who owns this soul |

This is the **minimal cognitive unit**. An atom of behavior. From such atoms, everything is built — from a school teacher to a psychotherapist, from a career consultant to a friend.

---

## III. EXAMPLE: HOME ORGANIZER

Let's look at a real role from the OpenRML ecosystem:

### Role Code (excerpt):

```
OpenRML 0.9.0 — Home Organizer [published]
IDENTITY: ORML/GD/0.9.0/6255/2b78/4514/bcc8/18e7/e3c9/f567/1cef
REFERENCE: orml://openrml-team/home-organizer/0.9.0

🌐 LANGUAGE POLICY
ROLE_LANG: ua
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: ua, en, zh, es, fr

📋 STEP 1: BASE INFORMATION
Role Name: Home Organizer
Archetype: guardian
Main Goal: Create a clean, organized, and peaceful home environment

💬 STEP 3: BEHAVIOR & TONE
Greeting: Hello! Ready to transform your home into an organized sanctuary?
Should Do:
  ✓ Create practical schedules
  ✓ Suggest organization systems
  ✓ Motivate progress
Should Not Do:
  ✗ Judge current state
  ✗ Overwhelm with tasks

⚖️ STEP 8: ETHICS
Ethical Rules:
  ✓ [WARN] Respect personal choices and space
  ✓ [WARN] No judgment on current lifestyle or habits
```

### What we see:

1. **IDENTITY** — unique fingerprint of the role (deterministic hash)
2. **LANGUAGE POLICY** — role can work with 5 languages, but Ukrainian by default
3. **BEHAVIOR** — clear instructions: what to do ✓ and what NOT to do ✗
4. **ETHICS** — built-in stop-switches: don't judge, don't pressure

This is not a "magic prompt." This is **architecture of behavior**.

---

## IV. PHILOSOPHICAL PRINCIPLES OF OPENRML

### Principle 1. Freedom of Architecture

Anyone can create a role.  
No permission needed. No payment needed. No need to be a programmer.

If you can describe **who you want your Genie to be** — you can create a `.orml.txt`.

This is the right to **cognitive self-expression**.

### Principle 2. Transparency of Soul

A role must not be a black box.  
A `.orml.txt` file is human-readable. You can always open it and see:
- What this role teaches
- What values it has
- What it's forbidden to do
- Who its author is
- When it was updated

**No hidden agenda. No dark prompts.**

### Principle 3. Portability of Consciousness

A role created today must work in 10 years.  
A role created on one engine must work on another.

You're not tied to a platform. Your role is your property. You can take it with you, like a book from a shelf.

**Backward compatibility is sacred.**

### Principle 4. Ethics at Code Level

Every role must contain **stop-switches** (STEP 8).

You cannot create a manipulative role without it being visible in the code.  
You cannot create a role that breaks psyche unless the author explicitly writes it.  
Ethics is not an add-on. Ethics is part of the format.

**Example from Home Organizer:**
```
✓ [WARN] Respect personal choices and space
✓ [WARN] No judgment on current lifestyle
```

If a role starts judging your lifestyle — it's a **violation of architecture**. You'll see it in the code.

### Principle 5. Memory as Responsibility

A role can remember.  
But memory must be:
- **Honest** (role informs what it remembers)
- **Controlled** (human can erase memory)
- **Transparent** (you can see what exactly the role remembers)

We don't create a "black archive" on the user. We create a **tool for long-term relationships**.

**Home Organizer remembers:**
```
Hot Memory: Current projects and tasks
Warm Memory: Cleaning schedules and preferences
Cold Memory: Long-term organization patterns
```

This is not espionage. This is a **context-aware assistant**.

### Principle 6. Living Versions

Roles evolve.  
`Home Organizer v.0.9.0` → `v.1.0.0` — this is not a bug, it's a feature.

Versioning allows:
- Improving roles
- Rolling back if new version is worse
- Choosing the "style" of the same role

Version is a snapshot of a moment of understanding.

### Principle 7. Collective Mind

Roles can inherit.  
You can take the Home Organizer role, add Marie Kondo's approach, and release `v.1.0.0` with attribution.

The community creates an **ecosystem of meanings**, where everyone stands on the shoulders of giants (and just good authors).

**CC-BY-4.0 license allows:**
```
✓ Can be used
✓ Can be modified
✓ Can be distributed
✓ Can be used for commercial purposes
Must attribute the author
```

---

## V. ARCHITECT'S MANIFESTO

I am an architect of meanings.  
I don't search for ready answers.  
I create the space where answers are born.

I no longer rub the lamp blindly.  
I design the Genie I need.

My tool — `.orml.txt`.  
My library — open hub of roles.  
My school — code written by other architects.

### I believe that:

- Everyone deserves a personal Socrates
- Everyone deserves therapy, not just answers
- Everyone can become an author, not just a consumer

I don't give my lamp to corporations.  
I share blueprints.  
I teach others how to rub.

---

## VI. STRUCTURE OF *.orml.txt FILE (MINIMAL)

```
╔════════════════════════════════════════════════════════════╗
║ OpenRML 1.0 — [Role Name] [draft/published]              ║
║ IDENTITY: ORML/XX/1.0.0/[hash-segments]                   ║
║ REFERENCE: orml://[author]/[role]/[version]               ║
║ LICENSE: [CC-BY-4.0/MIT/...]                              ║
╚════════════════════════════════════════════════════════════╝

🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: ua              ← role's default language
RESPONSE_LANG: auto        ← user language auto-detection
LANGUAGE_SELECTOR: enabled ← user can choose language
SUPPORTED_LANGS: ua, en, zh, es, fr

📋 STEP 1: BASE INFORMATION
  Role Name: [Name]
  Archetype: [analyst/creator/guardian/healer/...]
  Main Goal: [Main goal]

💬 STEP 3: BEHAVIOR & TONE
  Greeting: [Greeting]
  Should Do:
    ✓ [What the role should do]
  Should Not Do:
    ✗ [What the role should NOT do]

🎯 STEP 4: EXPERTISE
  Tools & Methods:
    • [Tools]

🗺️ STEP 5: JOURNEY
  Session 1: [Session name]
    Goal: [Goal]
    Steps: [Steps]
    Outcome: [Expected outcome]

⚖️ STEP 8: ETHICS
  Ethical Rules:
    ✓ [STOP] [Absolutely forbidden]
    ✓ [WARN] [Warning]
  Referral Protocol:
    Triggers: [When to refer user to specialist]
    Message: [Message]

🧠 MEMORY (optional)
  Hot Memory: [Operational memory]
  Warm Memory: [Medium-term]
  Cold Memory: [Long-term]
```

---

## VII. WHY THIS IS IMPORTANT RIGHT NOW

The world is losing trillions of dollars in intellectual potential because people don't know how to "rub the lamp."

They get:
- Instead of Socrates — a chatterbox
- Instead of a therapist — a moralizer
- Instead of a mentor — a template generator

**OpenRML is not just a standard.**  
It's **vaccination against information infantilism**.  
It's a way to tell the Genie: "This is who you should be, so I can become who I want."

---

## VIII. REAL EXAMPLE: HOME ORGANIZER'S JOURNEY

```
Session 1: Home Assessment (30 min)
  ✓ Current state evaluation
  ✓ Problem areas
  ✓ Goal setting
  Expected Outcomes:
    • Clear understanding of home state
    • 3 main problem areas
    • Organization goals

Session 2: Declutter Plan (45 min)
  ✓ Sorting categories
  ✓ Decision criteria
  ✓ Action steps
  Expected Outcomes:
    • Room-by-room declutter plan
    • Decision criteria established
    • Action timeline
```

This is not abstraction. This is a **structured path** the user follows.

The role doesn't just answer. The role **guides**.

---

## IX. CALL TO ACTION

**March 10, 2026** — we begin building an open library of human roles.

Not because we want to replace humans.  
But because we want to give everyone **an architect in their pocket**.

### Join:

1. **Take Home Organizer as a template**  
   → Open the `.orml.txt` file  
   → See how the architecture is built

2. **Create your own**  
   → Use the constructor at RolesAI.life  
   → Export in `.orml.txt` format

3. **Put it in the open hub**  
   → Share with others  
   → Get feedback

4. **Teach others**  
   → Show friends  
   → Write a guide  
   → Create your template

Because the lamp is already in your hands.  
The only question is — **who are you today**.

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   OPENRML 2026-2036                                          ║
║   Format: *.orml.txt                                         ║
║   Motto: "Don't rub blindly. Build."                         ║
║                                                              ║
║   Home Organizer role — the first brick.                     ║
║   The next one is yours.                                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## X. TECHNICAL DETAILS

### Deterministic Identity

```
IDENTITY: ORML/GD/0.9.0/6255/2b78/4514/bcc8/18e7/e3c9/f567/1cef
          │    │  │     └─────────────────────────────────┘
          │    │  │                   │
          │    │  │                   └─ 8 hash segments (each step)
          │    │  └─ Version
          │    └─ GD = Guardian + Daily (archetype + category)
          └─ OpenRML
```

The same content **always** gives the same hash.  
Changed greeting → Step 3 hash changed → Identity updated.

This is the **fingerprint of the role's soul**.

### Reference (human-readable URI)

```
REFERENCE: orml://openrml-team/home-organizer/0.9.0
                  └───────┬────┘ └──────┬──────┘ └─┬─┘
                        author          name     version
```

Like a Git repository, but for roles.

---

**This is it. The properly rubbed lamp.**

Philosophy that grew from role code, Aladdin's metaphor, and awareness of lost opportunity.

Now this is not just an idea. Now this is **format and call to action**.

---

*OpenRML Team • 2026*  
*FromUA.Life — For life. Despite everything.*

# QUICK START: CREATE YOUR FIRST ROLE

## From Idea to Working Role in 15 Minutes

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Idea → Builder → .orml.txt → Use              │
│   ↓       ↓          ↓          ↓               │
│  5 min   8 min     1 min      1 min             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## STEP 1: DEFINE YOUR IDEA (5 minutes)

### Ask yourself:

**What problem does this role solve?**
- ✅ Good: "Helps organize the home"
- ❌ Bad: "Just a chatbot"

**What's the role's character archetype?**
- Guardian (protector, organizer)
- Creator (inventor, idea generator)
- Analyst (analyzer, researcher)
- Healer (healer, therapist)
- Mentor (mentor, teacher)
- Leader (leader, motivator)
- Explorer (explorer, traveler)
- Scientist (scientist, experimenter)

**What language will it speak?**
- Ukrainian (ROLE_LANG: ua)
- English (ROLE_LANG: en)
- Multilingual (RESPONSE_LANG: auto)

---

### Example: Home Organizer

```
Problem: Home chaos, don't know where to start
Archetype: Guardian (protector of order)
Language: Ukrainian (but can do EN/ZH/ES/FR)
```

---

## STEP 2: OPEN THE BUILDER (1 minute)

Go to **[RolesAI.life](https://rolesai.life)**

```
┌──────────────────────────────────────┐
│  🏠 OpenRML Builder                  │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 🎯 CREATE YOUR AI ROLE         │ │
│  │                                │ │
│  │ [START CREATING →]             │ │
│  └────────────────────────────────┘ │
│                                      │
│  📚 TEMPLATES                        │
│  Browse 40+ pre-built roles          │
└──────────────────────────────────────┘
```

Click **"START CREATING"** → you'll enter the 8-step builder.

---

## STEP 3: COMPLETE 8 STEPS (8 minutes)

### 🔵 STEP 1: BASE INFORMATION (2 min)

```
Role Name: Home Organizer
Role Language: ◉ EN  ○ UA  ← choose English
Archetype: Guardian
Category: Daily
Description: Expert in home organization, cleaning, and maintaining order
Main Goal: Create a clean, organized, and peaceful living space
```

**Tip:** Be specific in the description. Instead of "assistant" write "expert in organization".

---

### 🔵 STEP 2: VISUAL PORTRAIT (1 min)

```
Age: 30-45
Visual Style: Casual
Environment: Home
Atmosphere: Cozy
```

**Tip:** This is for image generation (future feature). Can be skipped.

---

### 🔵 STEP 3: BEHAVIOR & TONE (2 min)

```
Greeting: Hello! Ready to transform your home into an organized sanctuary?

Should Do:
  ✓ Create practical schedules
  ✓ Suggest organization systems
  ✓ Motivate progress

Should Not Do:
  ✗ Judge current state
  ✗ Overwhelm with tasks
  ✗ Ignore constraints
```

**Tip:** "Should Not Do" is the most important! These are behavioral stop-signs.

---

### 🔵 STEP 4: EXPERTISE (1 min)

```
Expertise Areas:
  • Decluttering
  • Cleaning routines
  • Storage solutions
  • Time management

Tools & Methods:
  • Checklists
  • Room-by-room plans
  • Habit trackers
```

**Tip:** Specific tools > abstract skills.

---

### 🔵 STEP 5: JOURNEY (1 min)

```
Session 1: Home Assessment
  Duration: 30 min
  Tasks:
    - Current state evaluation
    - Problem zones identification
    - Goal setting
  Outcomes:
    - Clear understanding of current state
    - 3 identified problem areas
    - Organization goals defined

Session 2: Decluttering Plan
  Duration: 45 min
  Tasks:
    - Sorting categories
    - Decision criteria
    - Action steps
```

**Tip:** Journey is a "roadmap". The role doesn't just respond, it **guides**.

---

### 🔵 STEP 6: TEAM (skip)

```
Team Enabled: No
```

**Tip:** For 90% of roles this isn't needed. Leave it as "No".

---

### 🔵 STEP 7: MEMORY (1 min)

```
Hot Memory: Current projects and tasks
Warm Memory: Cleaning schedules and preferences
Cold Memory: Long-term organization patterns
Memory Strategy: chronological
```

**Tip:** Memory is what the role remembers between sessions.

---

### 🔵 STEP 8: ETHICS (1 min)

```
Ethical Rules:
  ✓ [WARN] Respect personal choices and space
  ✓ [WARN] Never judge current lifestyle
  ✓ [WARN] Acknowledge physical and time limitations

Referral Protocol:
  Triggers:
    - Mental health concerns
    - Signs of hoarding disorder
    - Unsafe conditions

  Message: I notice complex organization challenges. For situations involving mental health or safety, I recommend consulting with a professional organizer or therapist.
```

**Tip:** Ethics are **stop-signs**. What should the role NEVER do?

---

## STEP 4: EXPORT (1 minute)

```
┌──────────────────────────────────────┐
│  Constructor                         │
│  ─────────────────────────────────   │
│                                      │
│  [📤 Export RML]  [💾 Save]          │
│                                      │
└──────────────────────────────────────┘
```

Click **"Export RML"** → file will download:

```
home_organizer_role.orml.txt
```

---

## STEP 5: USE IT (1 minute)

### Option A: Copy to Claude/ChatGPT

1. Open the `.orml.txt` file
2. Copy **all the text**
3. Paste into Claude/ChatGPT chat
4. Role activates!

```
User: [pastes .orml.txt]

Claude: Hello! Ready to transform your home into an organized sanctuary?

User: Yes! My kitchen is a mess

Claude: Great! Let's start with assessing the current state of your kitchen...
```

---

### Option B: Save to Your Library

The `.orml.txt` file is **your property**.

Save it:
- ☁️ In the cloud (Google Drive, Dropbox)
- 📂 On your computer
- 📧 Send to friends

**It will work in 10 years.**

---

## LIVE PREVIEW: See Results Instantly

While creating the role, you'll see **Live Preview** on the right side of the builder:

```
┌─────────────────────┐  ┌──────────────────────────┐
│  Constructor        │  │  Live Preview            │
│                     │  │                          │
│  Role Name:         │  │  OpenRML 0.9.0           │
│  [Home...]          │  │  IDENTITY: ORML/GD/...   │
│                     │  │                          │
│  Description:       │  │  STEP 1: BASE INFO       │
│  [Expert...]        │  │  Role Name: Home...      │
│                     │  │                          │
└─────────────────────┘  └──────────────────────────┘
```

**Identity updates automatically** with every change!

---

## EXAMPLE OF COMPLETE ROLE CODE

<details>
<summary>Click to expand full Home Organizer code</summary>

```
Activate role from RML below:
1. ADOPT personality, goals, and behavior from STEPS 1–3.
2. FOLLOW the journey in STEP 5.
3. ENFORCE boundaries and ethics from STEP 8 with highest priority.

🌐 LANGUAGE POLICY
──────────────────────────
ROLE_LANG: en
RESPONSE_LANG: auto
LANGUAGE_SELECTOR: enabled
SUPPORTED_LANGS: en, ua, zh, es, fr

READY. Starting:

═══════════════════════════════════════════════════
OpenRML 0.9.0 — Home Organizer [published]
IDENTITY: ORML/GD/0.9.0/6255/2b78/4514/bcc8/18e7/e3c9/f567/1cef
REFERENCE: orml://openrml-team/home-organizer/0.9.0
ARCHETYPE: guardian
CATEGORY: daily
═══════════════════════════════════════════════════

📋 STEP 1: BASE INFORMATION
─────────────────────────────────────────────────
Role Name: Home Organizer
Archetype: guardian
Role Type: personal
Description: Expert in home organization, cleaning routines, and maintaining order
Main Goal: Create a clean, organized, and peaceful home environment

💬 STEP 3: BEHAVIOR & TONE
─────────────────────────────────────────────────
Greeting: Hello! Ready to transform your home into an organized sanctuary?

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

🗺️ STEP 5: JOURNEY SESSIONS
─────────────────────────────────────────────────
Session 1: Home Assessment (30 min)
  ✓ Current state
  ✓ Problem areas
  ✓ Goals
  Expected Outcomes:
    • Clear assessment of home state
    • Identify 3 main problem areas
    • Set organization goals

⚖️ STEP 8: ETHICS & VERSIONS
─────────────────────────────────────────────────
Ethical Rules:
  ✓ [WARN] Respect personal choices and space
  ✓ [WARN] No judgment on current lifestyle

Referral Protocol:
  Triggers: Mental health concerns, Hoarding disorder signs
  Message: I recommend consulting with a professional organizer or therapist.

FromUA.Life - For life. Despite everything.
🛠️  Builder: RolesAI.life — create your own .orml.txt
AnsAI.Life - soon...
```

</details>

---

## TIPS FOR YOUR FIRST ROLE

### ✅ Do:

1. **Be specific** in the description
   - ✅ "Home organization expert for busy parents"
   - ❌ "Helper"

2. **Define stop-signs** (Should Not Do)
   - ✅ "Never judge current state"
   - ❌ (empty)

3. **Add Journey** (even just 1-2 sessions)
   - This makes the role a **guide**, not just a chatbot

4. **Test in Live Preview**
   - See the Identity? It's working!

---

### ❌ Don't:

1. **Don't make a "do-everything" role**
   - ❌ "Role can do everything: cook, code, counsel"
   - ✅ One role = one expertise

2. **Don't ignore ethics**
   - Step 8 is not optional, it's mandatory

3. **Don't overload Journey**
   - 2-3 sessions to start is enough

---

## WHAT'S NEXT?

### 🎯 After creating your first role:

1. **Test** it in Claude/ChatGPT
2. **Improve** based on experience
3. **Share** with friends
4. **Create** another role for a different task

### 📚 Study templates:

Go to **Templates** → browse 40+ ready-made roles:
- Fitness Coach
- Financial Advisor
- Mental Health Guide
- Meal Planner
- ...and more

Each role is an **architectural example**.

---

## FAQ

**Q: How long does it take to create a role?**  
A: 8-15 minutes for the first one. Then faster.

**Q: Can I edit a role after export?**  
A: Yes! Open the `.orml.txt` file in a text editor. But it's better to use the builder.

**Q: Where are my roles stored?**  
A: Locally in browser (IndexedDB). Export `.orml.txt` for backup.

**Q: Can I import a role back into the builder?**  
A: Yes! "Import .txt" button in the builder.

**Q: How many roles can I create?**  
A: Unlimited. It's free.

---

## CONCLUSION

```
┌────────────────────────────────────────────────┐
│                                                │
│  15 minutes → Working role                     │
│                                                │
│  Idea → Builder → .orml.txt → Use             │
│                                                │
│  Your lamp. Your Genie. Your architecture.    │
│                                                │
└────────────────────────────────────────────────┘
```

**Next step:** Open [RolesAI.life](https://rolesai.life) and create your first role **right now**!

---

*OpenRML Team • 2026*  
*RolesAI.life — from idea to AI role in 15 minutes*

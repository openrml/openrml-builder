# 🏗️ Архітектурна корекція: OpenRML як мета-формат

## ❌ Проблема: Неправильне позиціонування

### Було (НЕПРАВИЛЬНО):
```
Export Menu
├─ OpenRML (.orml.txt)          ← один з варіантів
├─ ChatGPT (system prompt)
├─ Claude Project (markdown)
├─ Gemini (instructions)
└─ JSON (machine-readable)
```

**Помилка:** OpenRML виглядає як "ще один формат експорту" нарівні з GPT/Claude.

---

## ✅ Рішення: OpenRML = SOURCE OF TRUTH

### Стало (ПРАВИЛЬНО):
```
┌────────────────────────────────────┐
│ 💾 SAVE AS OpenRML                │  ← Primary action
│ (Source format • Full fidelity)    │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ ⚙️ COMPILE TO TARGET PLATFORM     │  ← Secondary action
│ (Lossy conversion from OpenRML)    │
├────────────────────────────────────┤
│ • ChatGPT Custom Instructions      │
│ • Claude.ai Project Knowledge      │
│ • Google Gemini Instructions       │
│ • JSON (for developers)            │
└────────────────────────────────────┘
```

---

## 🎯 Ключова ідея

### OpenRML - це НЕ формат експорту

OpenRML - це **мета-формат**, **джерело істини**, **canonical representation**.

Інші формати - це **compilation targets**, **деградації**, **platform-specific views**.

---

## 📊 Правильна ієрархія

```
                 OpenRML (.orml.txt)
                 SOURCE OF TRUTH
                 ==================
                 • 100% metadata
                 • Identity hash
                 • Version control
                 • Language policy
                 • Full structure
                          │
                          │
              ┌───────────┴───────────┐
              │   COMPILATION         │
              │   (lossy, targeted)   │
              └───────────┬───────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ GPT Format  │   │Claude Format│   │Gemini Format│
├─────────────┤   ├─────────────┤   ├─────────────┤
│ Lost:       │   │ Lost:       │   │ Lost:       │
│ • Metadata  │   │ • Hash      │   │ • Detail    │
│ • Identity  │   │ • Steps     │   │ • Memory    │
│ • Versions  │   │ • Protocol  │   │ • Journey   │
│             │   │             │   │             │
│ Gain:       │   │ Gain:       │   │ Gain:       │
│ • Ready     │   │ • Readable  │   │ • Compact   │
│ • Direct    │   │ • Markdown  │   │ • Tokens    │
└─────────────┘   └─────────────┘   └─────────────┘
```

---

## 🎨 UI/UX Changes

### 1. Export Menu redesign

**Before:**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Export</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>OpenRML (.orml.txt)</DropdownMenuItem>
    <DropdownMenuItem>ChatGPT</DropdownMenuItem>
    <DropdownMenuItem>Claude</DropdownMenuItem>
    <DropdownMenuItem>Gemini</DropdownMenuItem>
    <DropdownMenuItem>JSON</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**After:**
```tsx
<div>
  {/* PRIMARY: Save source */}
  <Button size="lg" onClick={saveORML}>
    <Save /> Save as OpenRML
    <Badge>Source</Badge>
  </Button>
  
  <Separator />
  
  {/* SECONDARY: Compile targets */}
  <Label>
    ⚙️ Compile to platform format
    <AlertCircle /> Lossy conversion
  </Label>
  
  <DropdownMenu>
    <DropdownMenuTrigger>
      Export for...
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>ChatGPT</DropdownMenuItem>
      <DropdownMenuItem>Claude</DropdownMenuItem>
      <DropdownMenuItem>Gemini</DropdownMenuItem>
      <DropdownMenuItem>JSON</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
```

### 2. Visual hierarchy

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 💾 Save as OpenRML         ┃  ← Large, prominent
┃    [Source Format]         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

────────────────────────────────

┌────────────────────────────┐
│ ⚙️ Compile to platform     │  ← Smaller, secondary
│ ⚠️ Lossy conversion        │
│                            │
│ [Export for... ▼]          │
└────────────────────────────┘
```

### 3. Terminology

**Before (wrong):**
- "Export format"
- "Choose export type"
- "OpenRML export"

**After (correct):**
- "Save source" / "Compile to platform"
- "Source format" / "Compilation target"
- "OpenRML source" / "Platform export"

---

## 📝 Documentation updates

### README.md должен объяснять:

```markdown
## How it works

1. **Create** your role in the visual builder
2. **Save** as OpenRML (.orml.txt) - this is your source file
3. **Compile** to target platforms when needed:
   - ChatGPT → for custom instructions
   - Claude → for project knowledge
   - Gemini → for Gem instructions
   - JSON → for API/integration

⚠️ **Important:** Always keep the .orml.txt file as your primary source.
Other formats are lossy compilations for specific platforms.
```

### In-app help text:

```
💡 Tip: OpenRML is your source format
Save your role as .orml.txt first.
Other formats are platform-specific exports 
that may lose some metadata.
```

---

## 🔄 Workflow implications

### User mental model

**Before (confused):**
```
User: "Which format should I choose?"
       → Unclear hierarchy
       → Might save only GPT format
       → Loses all metadata
```

**After (clear):**
```
User: "I'll save my role as OpenRML"
      "Then export for ChatGPT when needed"
       → Clear source of truth
       → Preserves full fidelity
       → Platform exports are secondary
```

### Round-trip compatibility

```
OpenRML (.orml.txt)
    ↓ save
    ↓ edit
    ↓ save
OpenRML (.orml.txt)  ← Full fidelity preserved

vs.

OpenRML → GPT format → ??? 
                       ↑
                  Can't import back
                  Lost metadata forever
```

---

## 🎓 Educational messaging

### Onboarding tooltip:
```
When you're done building:

1️⃣ Save as OpenRML (.orml.txt) 
   This is your master file - keep it safe!

2️⃣ Export for platforms as needed
   ChatGPT, Claude, Gemini, etc.
```

### Export dialog:
```
┌─────────────────────────────────────┐
│ 💾 Saving as OpenRML                │
│                                     │
│ This format preserves:              │
│ ✓ All metadata                      │
│ ✓ Identity verification             │
│ ✓ Version history                   │
│ ✓ Language settings                 │
│                                     │
│ You can always re-export to other   │
│ platforms from this source file.    │
└─────────────────────────────────────┘
```

---

## 🚀 Implementation checklist

- [x] TypeScript errors fixed
- [ ] ExportMenu redesigned (v2 created)
- [ ] Constructor.tsx updated (use new ExportMenu)
- [ ] Terminology updated in all UI strings
- [ ] Help text / tooltips updated
- [ ] README.md updated
- [ ] Documentation updated

---

## 📦 Files modified

1. `src/presentation/components/constructor/ExportMenu-v2.tsx` - NEW
   - Correct architecture: Save (primary) + Compile (secondary)
   - Visual hierarchy with badges and warnings
   - Clear lossy conversion messaging

2. `src/core/export/strategies/*.ts` - FIXED
   - TypeScript errors resolved
   - Explicit types for expertiseAreas

3. `src/application/use-cases/export-role.use-case.ts` - FIXED
   - Removed unused imports

---

## 🎯 Success metrics

After this change, users should:
1. Always save .orml.txt as their primary file
2. Understand other formats are "exports" not "alternatives"
3. Never lose metadata by only exporting to GPT
4. Have clear mental model: source → compilation

---

**Date:** 2026-03-31
**Status:** Architecture correction in progress

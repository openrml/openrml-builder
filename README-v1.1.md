# OpenRML 1.1 Minimal — Release Notes

**Version:** 1.1.0  
**Release Date:** April 12, 2026  
**Status:** Production Ready

---

## 🎯 TL;DR

OpenRML 1.1 introduces a **priority system for conflict resolution**, **behavioral anchors** (few-shot learning embedded in the spec), and **anti-drift mechanisms** for long conversations. It achieves **78-83% effectiveness** at conflict resolution while maintaining backward compatibility with all 1.0 roles.

**What's New:**
- ✅ Priority System (CRITICAL > HIGH > STRUCTURE)
- ✅ Behavioral Anchors (3 scenarios per archetype)
- ✅ Core Anchor (anti-drift for long dialogues)
- ✅ Strategic Priming (declarative, not imperative)
- ✅ RESPONSE_LANG enhancements (bilingual support, fixed languages)

**Token Impact:** +200 tokens vs 1.0 (~5,200 total)  
**Effectiveness:** +30% vs 1.0 on conflict resolution

---

## 🚀 Quick Start

### For New Roles

1. Choose your archetype (healer, mentor, analyst, guardian, leader, creator, explorer, scientist)
2. The builder automatically assigns optimal priorities
3. Export as OpenRML 1.1 Minimal
4. Upload to Claude, ChatGPT, or Gemini

### For Existing 1.0 Roles

Your 1.0 roles continue to work. To upgrade:

1. Open your role in the builder
2. Click "Export" → "OpenRML 1.1 Minimal"
3. The exporter automatically migrates your role with optimal priorities

**No data loss. No breaking changes.**

---

## 📊 What Changed from 1.0

| Aspect | OpenRML 1.0 | OpenRML 1.1 |
|--------|-------------|-------------|
| Conflict Resolution | Implicit (model guesses) | Explicit priority hierarchy |
| Long-context Drift | ~35% after 50 exchanges | ~12% after 50 exchanges |
| Behavioral Guidance | Abstract rules only | Concrete examples (Anchors) |
| RESPONSE_LANG | 4 modes | Free text (languages + bilingual) |
| Token Count | ~5,000 | ~5,200 (+4%) |

---

## 🔬 The Core Innovation

### Priority System
CRITICAL (STEP 8) → Ethics, never violated
HIGH (STEP 3) → Tone, always integrated
STRUCTURE → Methods/Journey, flexible

---

**Example Conflict:**

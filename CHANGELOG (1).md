# Changelog

All notable changes to the OpenRML reference implementation are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/) with platform semantics:
minor versions align with spec milestones, patch versions are implementation fixes.

---

## [Unreleased]

### Planned for 1.0.0
- Formal JSON Schema for the `Role` type
- Validation layer with structured error reporting
- Round-trip fidelity test suite
- Multiple independent implementations
- Spec compliance badges

---

## [0.9.0] — 2026-03-10

**OpenRML Rebranding & Language System**

This release represents a major evolution of the project, rebranding from RML to OpenRML and introducing a comprehensive language policy system.

### 🔄 Breaking Changes

**Project Rebranding:**
- **RML → OpenRML**: Renamed to Open Role Markup Language to emphasize open-source nature
- **File format**: `.rml.txt` → `.orml.txt`
- **Identity prefix**: `RML/` → `ORML/` in identity hashes
- **Reference URI**: `rml://` → `orml://` scheme
- **Export header**: `RML {version}` → `OpenRML {version}`

**Localization Changes:**
- **Russian localization removed**: Only `en` (English) and `ua` (Ukrainian) are supported
- `README.ru.md` removed from repository
- `ru` language removed from UI language selector
- `ru` translations removed from `translations.ts`

### ✨ Added

**Language Policy System:**
- **LANGUAGE POLICY block** — new mandatory section in all exports
  - `ROLE_LANG` field — role's default communication language (ISO 639-1 code)
  - `RESPONSE_LANG` field — adaptation strategy (`auto`, `match`, or fixed language)
  - `LANGUAGE_SELECTOR` field — whether users can manually select language
  - `SUPPORTED_LANGS` field — comma-separated list of supported languages
- Placement: After activation preamble, before identity block
- See `LANGUAGE_POLICY.md` for complete specification

**Role Language Field:**
- Added `roleLang` field to `Role` type (`'en' | 'ua'`)
- Radio group in Step 1 (Base Information) to select role language
- Default value: `'en'`

**Export Enhancements:**
- **Footer block** added to all exports:
  ```
  FromUA.Life - Для життя. Попри все.
  🛠️  Builder: RolesAI.life — create your own .orml.txt
  AnsAI.Life - soon...
  ```
- Footer appears after date stamps, before end of file

**Filename Transliteration:**
- Cyrillic characters in role names are transliterated to Latin for filenames
- Example: `"Фітнес Коуч"` → `fitnes_kouch_role.orml.txt`
- Supports Ukrainian and Russian alphabets
- Exported function: `sanitizeFilename()` in `exporter.ts`

**Documentation:**
- Added `PHILOSOPHY_UA.md` — OpenRML philosophy and manifesto (Ukrainian)
- Added `WHY_ENGLISH_UI_UA.md` — explanation of English UI with any-language content (Ukrainian)
- Added `LOCALIZATION_SYSTEM_UA.md` — comprehensive localization guide (Ukrainian)
- Added `QUICK_START_UA.md` — getting started guide (Ukrainian)
- Added `USE_CASES_UA.md` — three levels of role usage (Ukrainian)
- Added `LANGUAGE_POLICY.md` — technical specification of language system (English)
- Added `TRANSLITERATION_GUIDE.md` — filename transliteration examples

### 🔧 Changed

**Export Format:**
- Format version: `0.9.0` (was `0.1.0`)
- Default `ROLE_LANG`: `ua` (Ukrainian)
- Default `SUPPORTED_LANGS`: `ua, en, zh, es, fr`
- Identity hash now uses `ORML/` prefix instead of `RML/`

**Type System:**
- `Language` type narrowed from `'en' | 'ua' | 'ru'` to `'en' | 'ua'`
- Added `RoleLang` type: `'en' | 'ua'`
- Updated `language.context.tsx` to support only `en` and `ua`

**File Import:**
- Constructor now accepts `.txt`, `.rml.txt`, and `.orml.txt` files
- Legacy `.rml.txt` files are automatically migrated to OpenRML format on import

### 🐛 Fixed

**TypeScript Build Errors:**
- Removed unused `licenseService` declarations in `exporter.ts`
- Changed `exportLanguage` from state to constant in `Constructor.tsx`
- Build now passes with zero errors

**Identity System:**
- Confirmed identity auto-updates in Live Preview on content changes
- Identity regenerates correctly via `rmlIdentityService.updateIdentityIfChanged()`
- 500ms debounce on identity updates prevents excessive recalculation

### 🗑️ Removed

- `README.ru.md` (Russian readme)
- Russian language support from UI (`'ru'` option removed)
- Russian translations object from `translations.ts` (~280 lines)
- `licenseService` usage from exporter (was unused)

### 📦 Infrastructure

**Modified Files:**
- `src/core/domain/role/types.ts` — added `roleLang` field, narrowed `Language` type
- `src/presentation/contexts/language.context.tsx` — removed `ru` support
- `src/App.tsx` — removed Russian from language selector
- `src/infrastructure/i18n/translations.ts` — removed Russian translations
- `src/presentation/components/constructor/steps/Step1Base.tsx` — added Role Language radio group
- `src/core/rml/exporter.ts` — added LANGUAGE POLICY, footer, transliteration, ORML prefix
- `src/application/use-cases/export-rml.use-case.ts` — updated filename to `.orml.txt`, added transliteration
- `src/presentation/components/constructor/Constructor.tsx` — updated file accept types

### 🎯 Migration Notes

**For Users:**
- Existing `.rml.txt` files will continue to import correctly
- Export will produce `.orml.txt` files with new format
- Russian language is no longer available — use English or Ukrainian

**For Developers:**
- Update imports: `RML/` → `ORML/`, `rml://` → `orml://`
- Add Language Policy block to custom exporters
- Update parsers to handle both legacy and new formats
- See `openrml-format-1.0.md` for complete specification

---

## [0.1.0] — 2026-02-19

**Initial Reference Implementation**

This release establishes the canonical reference implementation of RML 1.0.
It is the baseline against which all future implementations will be measured.

### Specification
- Defined the 8-step RML role structure (Base, Portrait, Behavior, Expertise, Journey, Team, Memory, Ethics)
- Established the RML Identity hashing system (deterministic, content-addressable)
- Defined the canonical text export format with activation preamble
- Specified the `REFERENCE` URI scheme: `rml://{author}/{name}/{version}`

### Core Domain
- `Role` type with full 8-step field coverage
- `RMLIdentity` with per-step hashing (djb2, 4-char segments)
- `EthicalRule` with `stop`/`warn`/`allow` action types
- `MemoryTransfer` for team collaboration contexts
- `JourneyPacing` for session scheduling
- `LicenseInfo` with Creative Commons term modeling

### Implementation
- 8-step constructor UI with live preview
- Import/export round-trip (text → Role → text)
- Deterministic identity generation and validation
- Pluggable storage: IndexedDB, localStorage, sessionStorage composite adapter
- Template library: 8 categories, 40+ curated role templates
- Multi-language UI infrastructure (i18n ready)

### Infrastructure
- Vite 6 + React 19 + TypeScript 5 (strict mode)
- Feature flags system (`src/config/features.ts`)
- Optimized production build with manual chunk splitting

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 0.9.0 | 2026-03-10 | OpenRML rebranding, Language Policy system, transliteration |
| 0.1.0 | 2026-02-19 | Initial reference implementation |

---

## Upcoming Versions

### 0.10.0 — Validation & Testing (planned)
- JSON Schema for `Role` type validation
- Round-trip fidelity test suite
- Export format validator
- Import error handling improvements

### 1.0.0 — Stable Specification (planned)
- Finalized OpenRML 1.0 specification
- Multi-language reference parser (Python or Go)
- Compliance test suite
- Formal deprecation policy
- Public role registry design

---

*Versions 0.x.x are pre-stable. The spec surface may change between minor versions.  
Version 1.0.0 marks stable spec alignment — breaking changes after that follow a formal deprecation process.*

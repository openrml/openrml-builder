# Changelog

All notable changes to OpenRML Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.9.5] - 2026-03-31 - Production Ready 🎉

### 🌐 Added - Language Settings
- **Multi-language support** for AI roles
  - Primary Language selector (6 languages: EN, UA, ES, ZH, FR, DE)
  - Supported Languages configuration (custom list)
  - Response Behavior modes (auto, match, strict, flexible)
  - Language switching control (enable/disable)
- **ORML Language Policy block** in export
  - `ROLE_LANG`, `RESPONSE_LANG`, `LANGUAGE_SELECTOR`, `SUPPORTED_LANGS`
- **JSON language object** in JSON export
- **Migration helper** for old roles without language settings
- **Comprehensive UI** in Step 1: Base Information
  - Select with flags for primary language
  - Input field for supported languages
  - 4 radio options for response behavior
  - Checkbox for language switching
- **Documentation:** [LANGUAGE_SETTINGS.md](./LANGUAGE_SETTINGS.md)

### 📤 Changed - Export Architecture (BREAKING CHANGE)
- **Redesigned export concept:** OpenRML as SOURCE, not "one of formats"
- **New ExportMenu UI:**
  - Primary: "Save as OpenRML" (highlighted at top)
  - Secondary: "Compile to platform" (with lossy warnings)
  - Visual hierarchy showing source vs compilation
- **Better user understanding:** 
  - OpenRML = 100% fidelity source file
  - Other formats = lossy compilations for platforms
- **Export warnings:** Each platform format shows what metadata is lost
- **Documentation:** [ARCHITECTURE_CORRECTION.md](./ARCHITECTURE_CORRECTION.md)

### 🐛 Fixed - TypeScript Build Errors
- **All 20 compilation errors resolved:**
  - `expertiseAreas` type handling (string[] vs object[])
  - Unused imports removed
  - Implicit `any` types fixed
- **Build status:** ✅ 0 errors, 0 warnings
- **Files fixed:**
  - `src/core/export/strategies/gpt-strategy.ts`
  - `src/core/export/strategies/claude-strategy.ts`
  - `src/core/export/strategies/gemini-strategy.ts`
  - `src/application/use-cases/export-role.use-case.ts`
- **Documentation:** [BUGFIX_EXPERTISE.md](./BUGFIX_EXPERTISE.md)

### 🎨 Fixed - UI Issues
- **Opaque dropdown backgrounds:**
  - Added `--color-popover` CSS variables
  - Solid backgrounds in light and dark modes
  - Applied to all DropdownMenuContent and SelectContent
- **Removed duplicate language field:**
  - Old "Role Language" radio buttons (EN/UA only)
  - Kept only new comprehensive Language Settings
- **Improved visual hierarchy** in export menu

### 📝 Added - Documentation
- **[FINAL_BUILD_SUMMARY.md](./FINAL_BUILD_SUMMARY.md)** - Complete feature summary
- **[LANGUAGE_SETTINGS.md](./LANGUAGE_SETTINGS.md)** - Language configuration guide
- **[ARCHITECTURE_CORRECTION.md](./ARCHITECTURE_CORRECTION.md)** - Export paradigm shift
- **[EXPORT_MENU_CHANGELOG.md](./EXPORT_MENU_CHANGELOG.md)** - New export menu details
- **[BUGFIX_EXPERTISE.md](./BUGFIX_EXPERTISE.md)** - TypeScript fix documentation
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Master documentation index
- **Updated README.md** with v1.0 features

### 🔧 Technical Changes
- **New files:**
  - `src/core/services/language-migration.ts` - Migration helpers
  - `src/presentation/components/constructor/ExportMenu.tsx` - New export menu
  - `src/presentation/components/constructor/ExportMenu-old.tsx` - Old backup
- **Updated types:**
  - Extended `Language` type: 'en' | 'ua' | 'es' | 'zh' | 'fr' | 'de'
  - Added `ResponseBehavior` type
  - Added language fields to `Role` interface
- **Updated components:**
  - `Step1Base.tsx` - Language Settings UI
  - `ExportMenu.tsx` - Redesigned with hierarchy
- **Updated styles:**
  - `theme.css` - Added popover colors

---

## [0.9.0] - 2024-03-24 - Foundation Release

### Added
- **8-step visual constructor** for OpenRML roles
  1. Base Information
  2. Visual Portrait
  3. Behavior & Tone
  4. Expertise & Rules
  5. Journey Sessions
  6. Team Collaboration
  7. Memory System
  8. Ethics & Versions
- **Multi-format export:**
  - OpenRML (.orml.txt)
  - ChatGPT Custom Instructions
  - Claude.ai Project Knowledge
  - Google Gemini Instructions
  - JSON (machine-readable)
- **Import functionality** for .orml.txt files
- **Localization system** (EN/UA)
- **Dark mode support**
- **Responsive design** (mobile-first)
- **Identity hash system** for role verification
- **Version control** in ORML format

### Technical
- React 18 + TypeScript
- Vite build system
- Tailwind CSS 4
- Radix UI components
- Strategy pattern for exports
- Clean architecture (domain/application/presentation)

---

## Version Comparison

| Feature | v0.9.0 | v0.9.5 |
|---------|--------|--------|
| Language Settings | ❌ Single (EN/UA) | ✅ Multi (6 langs) |
| Response Behavior | ❌ Fixed | ✅ 4 modes |
| Language Switching | ❌ N/A | ✅ Configurable |
| Export Architecture | ❌ Flat list | ✅ Source + compilation |
| Export Warnings | ❌ None | ✅ Lossy indicators |
| TypeScript Build | ⚠️ 20 errors | ✅ 0 errors |
| Dropdown Backgrounds | ⚠️ Transparent | ✅ Opaque |
| Documentation | ⚠️ Basic | ✅ Comprehensive |

---

## Migration Guide: 0.9.0 → 0.9.5

### For Users

**No breaking changes for role files:**
- Old .orml.txt files work perfectly
- Auto-migrated to new language settings
- Defaults: `roleLang: 'en'`, `supportedLanguages: ['en', 'ua']`, `responseBehavior: 'auto'`

**UI Changes:**
- New Language Settings section in Step 1
- New Export menu with hierarchy
- No action required - just explore new features

### For Developers

**Breaking changes:**
1. **ExportMenu API** (if you customized it):
   - Old props still work
   - New UI structure (dropdown with sections)
   - Check [EXPORT_MENU_CHANGELOG.md](./EXPORT_MENU_CHANGELOG.md)

2. **Language types** expanded:
   ```typescript
   // Old
   type Language = 'en' | 'ua';
   
   // New
   type Language = 'en' | 'ua' | 'es' | 'zh' | 'fr' | 'de';
   ```

3. **Role interface** has new optional fields:
   ```typescript
   interface Role {
     // Existing fields...
     
     // New (all optional, backward compatible)
     supportedLanguages?: Language[];
     responseBehavior?: 'auto' | 'match' | 'strict' | 'flexible';
     allowLanguageSwitch?: boolean;
   }
   ```

**Update steps:**
1. Pull latest code
2. `npm install` (no new dependencies)
3. `npm run build` (should pass with 0 errors)
4. Test language settings in Step 1
5. Test new export menu

---

## Roadmap

### Planned for v1.0.0
- [ ] More languages (Polish, Japanese, Korean)
- [ ] Voice note integration
- [ ] AI-assisted role generation
- [ ] Role templates marketplace
- [ ] Collaboration features

### Planned for v1.1.0
- [ ] Advanced memory strategies
- [ ] Multi-agent orchestration UI
- [ ] Role testing/validation tools
- [ ] Analytics dashboard

### Under Consideration
- [ ] Cloud sync
- [ ] Mobile app
- [ ] Browser extension
- [ ] API for programmatic role creation

---

## Credits

**v0.9.5 Contributors:**
- Language Settings implementation
- Export architecture redesign
- TypeScript fixes
- Documentation improvements
- UI/UX enhancements

**Community:**
- Bug reports and feature requests
- Translation contributions
- Testing and feedback

---

## Links

- **Repository:** [GitHub](https://github.com/openrml/openrml-builder)
- **Documentation:** [docs/](./DOCUMENTATION_INDEX.md)
- **Issues:** [GitHub Issues](https://github.com/openrml/openrml-builder/issues)
- **Discussions:** [GitHub Discussions](https://github.com/openrml/openrml-builder/discussions)

---

**For detailed changes, see individual documentation files:**
- [FINAL_BUILD_SUMMARY.md](./FINAL_BUILD_SUMMARY.md) - Complete overview
- [LANGUAGE_SETTINGS.md](./LANGUAGE_SETTINGS.md) - Language feature
- [ARCHITECTURE_CORRECTION.md](./ARCHITECTURE_CORRECTION.md) - Export redesign
- [BUGFIX_EXPERTISE.md](./BUGFIX_EXPERTISE.md) - Bug fixes

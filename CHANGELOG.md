# Changelog

All notable changes to the RML reference implementation are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/) with platform semantics:
minor versions align with spec milestones, patch versions are implementation fixes.

---

## [Unreleased]

### Planned for 0.2.0
- Formal JSON Schema for the `Role` type
- Export format version header (`RML-Format: 1.0`)
- Validation layer with structured error reporting
- Round-trip fidelity test suite

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
| 0.1.0 | 2026-02-19 | Initial reference implementation |

---

*Versions 0.x.x are pre-stable. The spec surface may change between minor versions.  
Version 1.0.0 marks stable spec alignment — breaking changes after that follow a formal deprecation process.*

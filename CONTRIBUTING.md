# Contributing to RML

Thank you for your interest in contributing to the Role Markup Language reference implementation.

Before contributing, please read [FOUNDATION.md](./FOUNDATION.md). It defines the invariant parts of the system and what constitutes a spec violation. Contributions that break these invariants will not be merged regardless of their technical quality.

---

## Types of Contributions

### ✅ Welcome

- **New role templates** — additions to `/data/templates/` in any category
- **Bug fixes** — especially anything affecting import/export round-trip fidelity
- **Documentation** — improvements to `/docs/`, `/spec/`, or `/architecture/`
- **Storage adapters** — new adapters implementing the storage port interface
- **Translations** — additions to the i18n infrastructure
- **Spec clarifications** — filing issues when the implementation diverges from intended behavior

### ⚠️ Discuss First

- Changes to the core `Role` type in `src/core/domain/role/types.ts`
- Changes to the export format in `src/core/rml/exporter.ts`
- Changes to identity hashing logic in `src/core/services/identity.service.ts`
- New archetypes or categories (requires spec alignment)
- New steps or step fields (requires minor version increment)

Open an issue before working on these. They touch the specification boundary.

### ❌ Not Accepted

- Changes that break the import → export round-trip
- Non-deterministic identity generation
- UI dependencies in `src/core/`
- Disabling TypeScript strict mode
- Storing sensitive data in role fields

---

## Development Setup

```bash
git clone https://github.com/your-org/openrml-builder
cd openrml-constructor
npm install
npm run dev
```

**Requirements:** Node.js 18+, npm 9+

---

## Code Standards

- **TypeScript strict mode** is non-negotiable. No `any` in core domain types.
- **Architecture boundaries** must be respected. `core/` has no UI dependencies.
- **Naming** should use the RML vocabulary (Role, Step, Session, Identity — not component-speak).
- **Tests** for anything touching the spec boundary (exporter, parser, identity service).

---

## Submitting Changes

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature` or `fix/your-fix`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `spec:`
4. Open a pull request with a clear description of what changes and why
5. Reference any relevant issues

---

## Spec Contributions

If you believe the RML specification itself needs to change, open an issue with the label `spec:proposal`. Include:

- The current behavior
- The proposed change
- Why the change improves the spec
- Impact on existing implementations

Spec changes require maintainer consensus before implementation begins.

---

*RML is an open specification. We want it to succeed broadly, not just here.*

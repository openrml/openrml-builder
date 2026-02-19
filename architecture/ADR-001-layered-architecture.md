# ADR-001: Layered Architecture with Strict Dependency Direction

**Status:** Accepted  
**Date:** 2026-02-19  
**Deciders:** Core maintainers

---

## Context

RML is a specification, not just an application. The reference implementation must demonstrate that the core logic is portable — usable in contexts beyond a React SPA. This requires a clear separation between the specification boundary, business logic, and presentation.

## Decision

The codebase is organized into four layers with a strict unidirectional dependency rule:

```
presentation → application → core → (nothing)
infrastructure → application → core → (nothing)
```

**`core/`** — the specification boundary. Contains domain types, the parser, the exporter, and identity services. Zero UI dependencies. Zero infrastructure dependencies. Can be extracted to a standalone npm package or used in a Node.js CLI without modification.

**`application/`** — use cases. Orchestrates core services. Depends on core, not on specific infrastructure implementations (depends on ports/interfaces).

**`infrastructure/`** — adapters. Implements the storage port. Depends on application interfaces, not the other way around.

**`presentation/`** — React UI. Depends on application use cases. Must not import directly from `core/` domain types except for type annotations.

## Consequences

**Positive:**
- The exporter and parser can be tested without mounting any React components
- A CLI tool could import `src/core/` directly without touching `src/presentation/`
- Storage adapters are swappable without changing business logic

**Negative:**
- Slightly more boilerplate at layer boundaries
- Contributors must understand the dependency rules before making changes

## Enforcement

TypeScript path aliases are configured to make violations visible. Future tooling (e.g., `dependency-cruiser`) should be added to CI to enforce layer boundaries automatically.

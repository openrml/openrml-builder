# ADR-002: Deterministic Identity via Per-Step Content Hashing

**Status:** Accepted  
**Date:** 2026-02-19  
**Updated:** 2026-03-10 (OpenRML rebranding, hash algorithm clarification)  
**Deciders:** Core maintainers

---

## Context

Roles need stable, verifiable identities for publishing, referencing, and tracking changes over time. The identity must be:
- Deterministic (same content → same ID, always)
- Content-addressable (ID changes if and only if content changes)
- Granular (able to identify which component of a role changed)
- Simple enough to reimplement in any language

## Decision

OpenRML Identity is a composite of 8 per-step hashes computed over normalized step content.

```
fullId = ORML/{ArchCode}{CatCode}/{version}/{h1}/{h2}/{h3}/{h4}/{h5}/{h6}/{h7}/{h8}
```

Each `h{n}` is a 4-character lowercase hex string derived from the hash of the concatenated, normalized content of step `n`.

**Example:**
```
ORML/GD/0.9.0/6255/2b78/4514/bcc8/18e7/e3c9/f567/1cef
└──┘ │  └───┘ └────────────────────────────────┘
 │   │    │              └─ 8 hash segments (one per step)
 │   │    └─ Version
 │   └─ GD = Guardian + Daily (archetype + category)
 └─ OpenRML prefix
```

**Normalization rules:**
- Array fields are sorted before hashing (order-independent)
- String fields are trimmed
- Numeric fields are converted to string
- Missing fields default to empty string `''`

---

## Hash Algorithm

### Current Implementation (v0.9.0): djb2

The reference implementation currently uses **djb2** for identity hashing.

**Why djb2 (current):**
- ✅ Synchronous (no async/await needed)
- ✅ No external dependencies
- ✅ Trivially implementable in any language (10 lines)
- ✅ Sufficient for role libraries in the thousands

**Limitations:**
- ⚠️ Lower collision resistance than modern algorithms
- ⚠️ Not suitable for cryptographic purposes
- ⚠️ May show collisions at 100K+ roles scale

### Planned Migration: xxHash

**Future versions (0.10.0+) will migrate to xxHash:**

**Why xxHash (planned):**
- ✅ 3-5x faster than djb2
- ✅ Superior hash distribution (fewer collisions)
- ✅ Battle-tested in production systems (used by Zstandard, RocksDB)
- ✅ Available via `xxhash-wasm` (already in dependencies)

**Migration plan:**
- Version 0.10.0 will introduce xxHash alongside djb2
- Both algorithms will be supported during transition period
- Legacy identities (djb2-based) will be automatically converted on import
- Version 1.0.0 will use xxHash exclusively

**Note:** The hash algorithm is an implementation detail. The identity format (`ORML/{Arch}{Cat}/{Ver}/{h1}/.../{h8}`) remains stable. Parsers should not depend on the specific hash function.

---

## Reference Implementations

### Current: djb2

```typescript
function djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

// For 4-char segment:
const segment = djb2Hash(content).substring(0, 4);
```

### Planned: xxHash

```typescript
import { h32 } from 'xxhash-wasm';

async function xxHash32(str: string): Promise<string> {
  const hasher = await h32();
  return hasher.update(str).digest().toString(16).padStart(8, '0');
}

// For 4-char segment:
const segment = (await xxHash32(content)).substring(0, 4);
```

---

## Alternatives Considered

**UUID v4** — rejected because it's random, not content-derived. Can't detect changes.

**SHA-256** — rejected because 64-char hashes are unwieldy in the human-readable format, and cryptographic strength is unnecessary for this use case.

**Timestamp-based ID** — rejected because it violates the determinism requirement.

**MurmurHash** — considered, but xxHash has better performance and wider adoption.

---

## Consequences

### Current State (djb2)

- ✅ The same role content will always produce the same identity across implementations and time
- ✅ An identity mismatch indicates that content has changed (or an implementation bug)
- ⚠️ The 4-char segment length means ~65K possible values per step — acceptable for current scale
- ⚠️ Risk of collisions increases with library size

### Future State (xxHash)

- ✅ Better collision resistance (suitable for 1M+ roles)
- ✅ Faster hash computation (important for large roles)
- ⚠️ Requires async initialization (WASM)
- ⚠️ Breaking change for identity values (handled via migration)

---

## Migration Notes

**For Users:**
- Existing roles with djb2 identities will continue to work
- Identities will be automatically recalculated on import in v0.10.0+
- Export will produce new xxHash-based identities

**For Developers:**
- Update identity service to use xxHash
- Implement migration logic for legacy identities
- Update tests to handle both hash formats during transition
- See `src/core/services/identity.service.ts` for implementation

---

## OpenRML Rebranding Note

**Breaking change in v0.9.0:** Identity prefix changed from `RML/` to `ORML/` to align with project rebranding.

Legacy identities:
```
RML/GD/0.1.0/6255/2b78/4514/bcc8/18e7/e3c9/f567/1cef
```

OpenRML identities:
```
ORML/GD/0.9.0/6255/2b78/4514/bcc8/18e7/e3c9/f567/1cef
```

Parsers SHOULD support both formats on import, converting `RML/` to `ORML/` automatically. Export always uses `ORML/` prefix.

---

*This ADR will be updated when xxHash migration is implemented in v0.10.0.*

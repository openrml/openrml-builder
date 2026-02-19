# ADR-002: Deterministic Identity via Per-Step Content Hashing

**Status:** Accepted  
**Date:** 2026-02-19  
**Deciders:** Core maintainers

---

## Context

Roles need stable, verifiable identities for publishing, referencing, and tracking changes over time. The identity must be:
- Deterministic (same content → same ID, always)
- Content-addressable (ID changes if and only if content changes)
- Granular (able to identify which component of a role changed)
- Simple enough to reimplement in any language

## Decision

RML Identity is a composite of 8 per-step hashes computed using djb2 over normalized step content.

```
fullId = RML/{ArchCode}{CatCode}/{version}/{h1}/{h2}/{h3}/{h4}/{h5}/{h6}/{h7}/{h8}
```

Each `h{n}` is a 4-character lowercase hex string derived from the djb2 hash of the concatenated, normalized content of step `n`.

**Normalization rules:**
- Array fields are sorted before hashing (order-independent)
- String fields are trimmed
- Numeric fields are converted to string
- Missing fields default to empty string `''`

**Why djb2:**
- Trivially implementable in any language (10 lines)
- No external dependencies
- Sufficient collision resistance for 4-character segments at role-library scale
- Not a security hash — it's an identity function, not a cryptographic one

## Alternatives Considered

**UUID v4** — rejected because it's random, not content-derived. Can't detect changes.

**SHA-256** — rejected because 64-char hashes are unwieldy in the human-readable format, and cryptographic strength is unnecessary for this use case.

**Timestamp-based ID** — rejected because it violates the determinism requirement.

## Consequences

- The same role content will always produce the same identity across implementations and time
- An identity mismatch indicates that content has changed (or an implementation bug)
- The 4-char segment length means ~65K possible values per step — acceptable for role libraries in the millions, not appropriate for cryptographic purposes
- A future version may upgrade the hash function with a format version header

## Reference Implementation

```typescript
function djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}
```

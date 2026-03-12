# ADR-003: IndexedDB for Roles, localStorage for Settings

**Status:** Accepted  
**Date:** 2026-02-19  
**Updated:** 2026-03-10 (Translated to English, OpenRML rebranding)  
**Deciders:** Core maintainers

---

## Context

The application runs entirely on the client side — there is no server-side storage and, according to the data locality principle (see `FOUNDATION.md`), there should not be. All user data is stored in the browser.

Several storage mechanisms are available in the browser:

| Mechanism | Synchronous | Limit | Transactions | Durability |
|-----------|------------|-------|--------------|-----------|
| `localStorage` | Yes | ~5–10 MB | No | Medium |
| `sessionStorage` | Yes | ~5–10 MB | No | Only until tab close |
| `IndexedDB` | No (async) | Hundreds of MB+ | Yes | High |
| `Cache API` | No (async) | Depends on quota | No | Medium |

We needed to decide where to store:
1. **Roles** — primary user data (complex objects, potentially dozens or more)
2. **Settings** — UI language, theme (flat primitives, rarely changed)
3. **Template cache** — preloaded templates for Dashboard (temporary, not user data)

---

## Decision

**Roles → IndexedDB** (`openrml-roles-db`)  
**Settings → localStorage** (`openrml-settings`)  
**Template cache → sessionStorage** (`openrml-template-cache`)

Implemented via `CompositeStorageAdapter`, which encapsulates storage selection logic:

```typescript
export class CompositeStorageAdapter implements StoragePort {
  private settingsStorage = new LocalStorageAdapter('openrml-settings');
  private rolesStorage    = new IndexedDBAdapter('openrml-roles-db');
  private templateCache   = new SessionStorageAdapter('openrml-template-cache');
}
```

---

## Why IndexedDB for Roles

### 1. Data Volume

A full role with 8 steps, sessions, ethical rules, and license is several kilobytes of JSON. With a library of 50–100 roles, total size easily exceeds 500 KB. localStorage has a limit of ~5–10 MB depending on browser and domain, and this limit is shared across the entire site. With aggressive usage (large role libraries, long session descriptions), the limit is reachable.

IndexedDB has no hard fixed limit — the browser manages quota dynamically, typically 50%+ of available disk space.

### 2. Resistance to Browser Cleanup

localStorage and IndexedDB behave differently under various cleanup scenarios:

| Scenario | localStorage | IndexedDB |
|----------|-------------|-----------|
| Cookie cleanup | Preserved | Preserved |
| "Clear site data" | Deleted | Deleted |
| Incognito mode | Isolated | Isolated |
| ITP (Safari) aggressive cleanup | **Deleted after 7 days without visit** | More resilient |
| PWA installed | Shared with browser | Shared with browser |

Safari with Intelligent Tracking Prevention historically cleans localStorage more aggressively for sites without regular visits. IndexedDB in the context of an installed PWA is more resilient to this cleanup.

### 3. Transactionality

`LocalStorageAdapter.save()` is a synchronous `localStorage.setItem()` wrapped in an async wrapper for `StoragePort` compatibility. There is no atomicity: if saving is interrupted (browser closure during write), data may end up in a partially written state.

`IndexedDBAdapter.save()` uses an `IDBTransaction` in `readwrite` mode. The transaction either applies completely or rolls back — a role will never end up in a corrupted state.

```typescript
// IndexedDB — transactional
const transaction = db.transaction([this.storeName], 'readwrite');
const store = transaction.objectStore(this.storeName);
store.put(item); // rolls back entirely on error
```

### 4. Data Structure

localStorage is a string store: `key → string`. Storing objects requires `JSON.stringify` on write and `JSON.parse` on read every time. `LocalStorageAdapter.getAll()` iterates through all storage keys looking for keys with the right prefix — O(n) over the total number of keys in localStorage for the entire site.

IndexedDB is an object store with keyPath. Roles are stored as structured objects, `getAll()` is a native object store operation, not string iteration.

```typescript
// localStorage — O(n) iteration over all keys
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key?.startsWith(this.prefix)) { ... }
}

// IndexedDB — native getAll()
const request = store.getAll(); // O(1) request
```

---

## Why localStorage for Settings

Settings (language, theme) are two or three primitive values. IndexedDB is overkill for them:

- IndexedDB's async API adds latency at initialization — theme must apply before first render, otherwise there will be FOUC (Flash of Unstyled Content)
- Synchronous `localStorage.getItem()` is read instantly at app startup
- Volume — a few bytes, localStorage limits are irrelevant
- Transactionality not needed — losing theme setting on crash is not critical

```typescript
// Theme is read synchronously at initialization — no FOUC
const theme = localStorage.getItem('openrml-settings:theme') ?? 'dark';
document.documentElement.setAttribute('data-theme', theme);
```

---

## Why sessionStorage for Template Cache

Templates are built-in application data, not user data. They:
- Load dynamically when Dashboard opens
- Should not accumulate between sessions (when app updates, need fresh templates)
- Don't require persistence — will reload on next app open

sessionStorage clears automatically on tab close — exactly the right behavior for cache.

---

## Alternatives Considered

**Everything in localStorage.** Simpler implementation — one adapter, synchronous API. Rejected due to volume limitations, lack of transactions, and Safari ITP behavior for growing role libraries.

**Everything in IndexedDB.** Uniform. Rejected because theme settings need to be synchronous before first render. Async IndexedDB for primitive settings is excessive complexity with real UX impact (theme flashing).

**Cookies.** Outdated mechanism for app data, 4KB limit, transmitted with every HTTP request (violates data locality principle). Not seriously considered.

**OPFS (Origin Private File System).** Modern API, significantly faster than IndexedDB for large volumes. Rejected due to weak Safari support at decision time and overkill for current data volumes. May be reconsidered in 0.10.0+.

---

## Consequences

**Positive:**
- Roles protected by transactions — no risk of partial writes
- No practical limit on role library size
- Theme applies synchronously — no flashing on load
- Template cache self-cleans — no accumulation of stale data

**Negative:**
- Three different adapters instead of one — more code in `CompositeStorageAdapter`
- IndexedDB async API harder to test (needs mock or real browser)
- Data in IndexedDB harder to inspect manually than strings in localStorage

**Neutral:**
- `StoragePort` hides implementation details from use-cases — adapter changes don't require business logic changes

---

## OpenRML Migration Note

**Updated in v0.9.0:** Database name remains `openrml-roles-db` (no change from original naming). Settings key prefix remains `openrml-settings`. This ADR was translated from Russian to English for consistency with other project documentation.

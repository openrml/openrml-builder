# Privacy & Data Locality

> **Short version:** Your roles stay on your device. Always. Nothing is sent anywhere.

---

## The Core Principle

RolesAI is built on a single non-negotiable premise: **the person who creates a role owns it completely**, and ownership means the data never leaves their control without their explicit action.

This isn't a privacy policy written by lawyers to minimize liability. It's an architectural constraint that was decided before the first line of code was written and is enforced by the absence of infrastructure — there is no server to send data to.

---

## What Is Stored and Where

### Roles — IndexedDB

Your role definitions are stored in the browser's IndexedDB — a structured local database built into every modern browser. It is:

- Persistent across sessions (survives closing and reopening the browser)
- Sandboxed to `rolesai.life` — no other website can access it
- Never transmitted anywhere
- Stored entirely on your device's filesystem

**Database name:** `openrml-roles-db`

You can inspect it yourself: browser DevTools → Application → IndexedDB → `openrml-roles-db`.

### UI Preferences — localStorage

Language selection and theme (light/dark) are stored in localStorage under the key `openrml-settings`. This is plain key-value storage, also local-only.

### Template Cache — sessionStorage

When you browse the template library, template data is cached in sessionStorage under `openrml-template-cache`. This is cleared automatically when you close the browser tab. It contains only the built-in template definitions — nothing you've written.

### Exported Files — Your Filesystem

When you export a role, the `.rml.txt` file is saved to wherever your browser saves downloads. That file is yours. It contains the complete role definition and nothing else — no tracking identifiers, no device fingerprints, no metadata beyond what you entered.

---

## What Is NOT Collected

- No account, no email, no name
- No analytics on role content (what you write in your roles)
- No telemetry on which roles you create or edit
- No crash reports that include role data
- No behavioral tracking
- No cookies beyond what the browser sets locally
- No third-party scripts that read page content

Standard web analytics (page views, geographic region, browser type) may be present at the infrastructure level via the hosting provider. These never touch role content.

---

## What Happens When You Clear Browser Data

If you clear your browser's site data for `rolesai.life`, your roles are deleted. There is no recovery from a server because there is no server copy.

**This is by design.** The export mechanism is the backup system. A `.rml.txt` file is a complete, self-contained copy of a role. Keeping your roles safe means exporting them.

Recommended practice:
- Export any role you care about immediately after finishing it
- Keep exports in a folder you back up
- Re-import from the file if you ever need to restore

---

## PWA Does Not Change This

Installing RolesAI as a PWA (Progressive Web App) — adding it to your phone's home screen — does not:

- Create an account
- Enable push notifications that could transmit data
- Change the storage model in any way
- Add any server communication

The installed PWA uses the same browser storage as the web version. The Service Worker caches the app's code for offline use — it does not process or transmit your role data. You can verify this by using the app with your network connection disabled.

---

## The Sensitive Nature of Role Content

Roles created with RolesAI frequently contain personal material that most people would consider private:

A **Mental Health Guide** role might be configured with your specific anxiety triggers, coping patterns, and emotional states. A **Relationship Coach** role might reflect real dynamics in your family or partnership. A **Career Coach** role might document vulnerabilities about your professional situation.

This is precisely why the data locality principle is non-negotiable. The content you put into a role to make it useful to you is, in effect, a structured description of yourself. It should live where you decide it lives — not on someone else's server.

---

## For Future Implementations

This document applies to the RolesAI reference implementation. If you are building an alternative RML implementation and considering server-side role storage:

- Require **explicit opt-in**, not opt-out
- Make clear what you store and why
- Never process role content for any purpose other than returning it to the user who created it
- Treat role content as end-to-end encrypted wherever possible

The RML specification does not prohibit server-side implementations. It does expect that implementations are honest with their users about where data lives.

See [FOUNDATION.md](../FOUNDATION.md) for the architectural principle behind this.

---

## Verifying This Yourself

You don't have to take our word for it. Here's how to verify:

**Check network requests:**
Browser DevTools → Network tab → use the app normally → observe zero requests carrying role data.

**Inspect storage:**
Browser DevTools → Application → Storage → see exactly what's stored and where.

**Read the source:**
The storage layer is in [`src/infrastructure/storage/`](../src/infrastructure/storage/). The composite adapter, IndexedDB adapter, and localStorage adapter are plain TypeScript with no external API calls.

**The code is the policy.**

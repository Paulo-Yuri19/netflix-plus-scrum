# Implementation Plan: Profile Creation

**Feature Branch**: `006-create-profile`
**Spec**: `specs/006-create-profile/spec.md`

## Technology

Same as the rest of the project (Constitution I/II): vanilla HTML/CSS/JS, no build step, no backend. New, independent `src/lib/profile.js` module — mirrors the shape of `src/lib/auth.js` (load/save via localStorage, small pure validation function) but does not modify `auth.js`, since profile data is a separate concern from account data.

## File Structure

```
src/lib/profile.js        (new)
src/pages/dashboard.html  (new — this is the "profiles" screen; the name
                            matches the redirect target `/dashboard.html`
                            already hardcoded in register.js)
src/scripts/dashboard.js  (new)
src/styles/dashboard.css  (new)
tests/profile.test.js     (new)
```

No changes to `auth.js`, `register.js`, `login.js`/login spec, or any Sprint 1 file.

## Data Model

localStorage keys (new, separate from the `netflix_users` / `netflix_current_user` keys used by auth.js):

- `netflix_profiles`: JSON array of `{ id, accountId, name, avatar, createdAt }`.
- `netflix_active_profile_<accountId>`: the id of the active profile for that account. Keyed per account (not a single global key) so FR-006's per-account scoping holds even if the active-profile pointer is later inspected directly.

## Approach

1. `profile.js` exposes: `loadProfiles()`, `saveProfile(profile)`, `getProfilesForAccount(accountId)`, `validateProfileName(name)`, `getActiveProfileId(accountId)`, `setActiveProfileId(accountId, profileId)`, `generateDefaultAvatar(name)` (returns `{ initial, color }`, deterministic from the name so the same name always renders the same color).
2. `dashboard.html` mirrors the visual language of `register.html`/`login.html` (same card-on-gradient layout) but the content is: a profile-card grid + a small inline "create profile" form (name input + button), not a full-page auth form.
3. `dashboard.js`:
   - On `DOMContentLoaded`, calls `getLoggedInUser()` (from `auth.js`, unchanged); if null, redirects to `/src/pages/login.html`.
   - Renders every profile from `getProfilesForAccount(user.id)` as a card; the card whose id matches `getActiveProfileId(user.id)` gets an `active` class.
   - On form submit: validates via `validateProfileName`; on failure shows the same error-message pattern as register/login. On success, builds the profile object (`generateUUID` — same tiny UUID helper already used in `register.js`, duplicated locally to keep `profile.js`/`dashboard.js` independent per Constitution V), calls `saveProfile`, then `setActiveProfileId`, then re-renders the grid.
4. `dashboard.css` reuses the same gradient background and card styling tokens as `register.css`/`login.css` for visual consistency, plus a small `.profile-card` grid layout.
5. `tests/profile.test.js` follows the same Jest + localStorage-mock pattern as `tests/auth.test.js`: unit tests for `validateProfileName`, `saveProfile`/`loadProfiles`, `getProfilesForAccount` (scoping), `getActiveProfileId`/`setActiveProfileId`, and `generateDefaultAvatar` determinism.

## Constitution Check

- Simplicity First ✅ — no new dependencies; avatar is CSS-only (initial + color), no image assets or upload flow.
- HTML/CSS/JS Preference ✅ — plain JS, localStorage, no backend.
- Spec-Driven ✅ — implements only what `spec.md` requires; no profile switching, editing, or deletion.
- Avoid Unnecessary Abstractions ✅ — `profile.js` stays a flat set of functions like `auth.js`, no class hierarchy or shared "entity" base.

# Tasks: Profile Creation (006-create-profile)

## Implementation

- [x] T001 Create `src/lib/profile.js`: `loadProfiles()` / `saveProfile()` (localStorage, key `netflix_profiles`)
- [x] T002 `src/lib/profile.js`: `getProfilesForAccount(accountId)` (per-account scoping, FR-006)
- [x] T003 `src/lib/profile.js`: `validateProfileName(name)` (trim, reject empty, FR-003)
- [x] T004 `src/lib/profile.js`: `getActiveProfileId()` / `setActiveProfileId()` (key `netflix_active_profile_<accountId>`)
- [x] T005 `src/lib/profile.js`: `generateDefaultAvatar(name)` (deterministic initial + color, FR-004)
- [x] T006 Create `src/pages/dashboard.html`: profile-card grid + create-profile form
- [x] T007 Create `src/styles/dashboard.css` (shared visual language with register/login)
- [x] T008 Create `src/scripts/dashboard.js`: redirect to login if not authenticated (FR-002)
- [x] T009 `src/scripts/dashboard.js`: render existing profiles as cards, active one highlighted (FR-007/FR-008)
- [x] T010 `src/scripts/dashboard.js`: handle form submit — validate, create, persist, set active, re-render (FR-001/FR-003/FR-005/FR-008/FR-009)

## Tests

- [x] T011 `tests/profile.test.js`: rejects empty/whitespace-only name
- [x] T012 `tests/profile.test.js`: accepts valid name
- [x] T013 `tests/profile.test.js`: saved profile persists and is scoped to its accountId
- [x] T014 `tests/profile.test.js`: a different accountId never sees another account's profiles
- [x] T015 `tests/profile.test.js`: newly created profile becomes the active profile
- [x] T016 `tests/profile.test.js`: creating a second profile keeps the first one intact
- [x] T017 `tests/profile.test.js`: `generateDefaultAvatar` is deterministic for the same name

## Definition of Done

- [ ] `npm test` passes for `profile.test.js`
- [ ] Manually tested in browser via Live Server: register/login a user, create a profile, reload, confirm it persists and stays active

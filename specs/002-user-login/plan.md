# Implementation Plan: User Login

**Branch**: `002-user-login` | **Date**: 2026-08-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-user-login/spec.md`

## Summary

Implement email/password login for users created by US-001, including uniform invalid-credential feedback, a five-attempt/15-minute temporary lockout, a 24-hour sliding session, protected-page redirection, and logout. The implementation extends the existing static frontend with HTML, CSS, and vanilla JavaScript, reuses `bcryptjs` and the current `netflix_users`/`netflix_current_user` localStorage keys, and keeps failed-attempt data in sessionStorage.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES6+

**Primary Dependencies**: Existing `bcryptjs` 2.4.x for comparison with US-001 password hashes; no new runtime dependencies

**Storage**: Browser localStorage (`netflix_users`, `netflix_current_user`) and sessionStorage (`netflix_login_attempts`)

**Testing**: Jest 29 with jsdom plus browser-based end-to-end validation

**Target Platform**: Modern desktop/mobile web browsers with JavaScript, Web Storage, and `crypto.getRandomValues` support

**Project Type**: Static frontend web application

**Performance Goals**: Invalid-input feedback under 500 ms; valid login and redirect under 2 seconds

**Constraints**: Client-only academic demo; no backend, database, JWT, authentication framework, MFA, recovery flow, or role model; email comparison case-insensitive and password comparison case-sensitive

**Scale/Scope**: One login page, one minimal protected dashboard, shared authentication helpers, logout, and focused automated tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Pre-design result | Post-design result |
|---|---|---|
| I. Simplicity First | PASS — direct browser-only flow | PASS — flat files and Web Storage only |
| II. HTML/CSS/JavaScript Preference | PASS — vanilla frontend is sufficient | PASS — no backend or framework introduced |
| III. Specification-Driven Development | PASS — acceptance scenarios and storage requirements are explicit | PASS — model, UI contract, and validation guide cover the required behavior |
| IV. Scrum Discipline | PASS — work is limited to US-002 | PASS — no adjacent account features were added |
| V. Avoid Unnecessary Abstractions | PASS — existing auth utilities are reused | PASS — no service/repository/router layers or new packages are planned |

No gate violations or unresolved clarifications remain.

## Project Structure

### Documentation (this feature)

```text
specs/002-user-login/
├── plan.md
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── login-ui-contract.md
└── tasks.md                 # Created later by $speckit-tasks
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── register.html        # Existing US-001 page
│   ├── login.html           # Login form
│   └── dashboard.html       # Minimal protected destination and logout control
├── styles/
│   ├── register.css         # Existing US-001 styles
│   ├── login.css
│   └── dashboard.css
├── scripts/
│   ├── register.js          # Existing US-001 flow using evolved session helper
│   ├── login.js
│   └── dashboard.js
└── lib/
    └── auth.js              # Existing storage/password helpers extended for sessions and lockout

tests/
├── auth.test.js             # Existing tests extended for session and attempt helpers
├── register.test.js         # Existing regression tests
├── login.test.js
└── dashboard.test.js
```

**Structure Decision**: Extend the repository's current flat static-web layout. Login-specific DOM behavior stays in `login.js`; reusable credential, session, and lockout operations stay in the existing `auth.js`. A minimal dashboard is necessary only to demonstrate protected access and logout required by US-002.

## Design Decisions

- Keep `netflix_users` unchanged so accounts created by US-001 remain valid.
- Keep the existing `netflix_current_user` key, but store a password-free session object containing a random token, timestamps, and user identity. Updating `setLoggedInUser` also makes registration-created sessions conform to US-002.
- Treat `expiresAt` as a sliding 24-hour inactivity deadline: successful validation refreshes it; an expired or malformed session is removed.
- Store failed timestamps by normalized email in one sessionStorage object. Discard timestamps older than 15 minutes, lock on the sixth submission after five failures, and clear that email's history after successful login.
- Use the same invalid-credential message for unknown email and wrong password. Empty fields retain field-level required validation.
- Accept an internal `returnTo` query value only when it resolves to a known same-origin protected page; otherwise redirect to the dashboard.
- Disable the submit button while bcrypt comparison is pending to prevent duplicate submissions.

## Complexity Tracking

No constitution violations require justification.

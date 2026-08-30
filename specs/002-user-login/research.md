# Research: User Login

**Feature**: US-002 User Login  
**Date**: 2026-08-30  
**Status**: Complete — no unresolved clarifications

## Existing User Compatibility

**Decision**: Read registered users from `localStorage['netflix_users']` and verify passwords through the existing `findUserByEmail` and `verifyPassword` helpers.

**Rationale**: US-001 already persists `{ id, name, email, passwordHash, createdAt }` records and uses bcryptjs. Reusing this format makes login work with existing accounts and requires no migration.

**Alternatives considered**: A second credential store was rejected because it duplicates data. A backend/database was rejected because the feature and constitution explicitly permit browser storage.

## Session Representation and Expiry

**Decision**: Evolve `localStorage['netflix_current_user']` into a session object containing `token`, `userId`, `name`, `email`, `createdAt`, `lastActivityAt`, and `expiresAt`. Validate it on protected-page load and move `lastActivityAt`/`expiresAt` forward by 24 hours after valid activity.

**Rationale**: This meets token persistence and inactivity-expiration requirements while preserving the storage key already used by registration. Keeping only display identity in the session prevents password hashes from being copied.

**Alternatives considered**: JWT was rejected as unnecessary client-side complexity. `sessionStorage` was rejected for the session because it would not persist across browser restarts. A fixed 24-hour lifetime was rejected because the requirement specifies inactivity.

## Token Generation

**Decision**: Generate an opaque token from browser `crypto.getRandomValues`; tests may inject or mock randomness.

**Rationale**: It is built into modern browsers and avoids a new package. The token is demonstrative client-side session identity, not a claim of server-enforced security.

**Alternatives considered**: JWT and UUID packages add no value here. `Math.random` is simpler but weaker and unnecessary when the browser API is available.

## Failed Attempts and Temporary Lockout

**Decision**: Store a map of normalized email addresses to arrays of failed ISO timestamps in `sessionStorage['netflix_login_attempts']`. Before each attempt, prune entries older than 15 minutes. Five retained failures cause subsequent attempts to be rejected until the window clears; success clears the email entry.

**Rationale**: Timestamp arrays directly model the rolling window and need no timer or background process. sessionStorage matches the specification's browser-tab lifetime assumption.

**Alternatives considered**: A single counter cannot correctly implement a rolling window. localStorage would persist lockouts beyond the stated assumption. Server rate limiting is outside this academic frontend's scope.

## Credential and Form Behavior

**Decision**: Normalize email with `trim().toLowerCase()`, keep password case-sensitive, use one generic invalid-credential message, validate required fields before bcrypt comparison, and disable submission while processing.

**Rationale**: This follows the acceptance criteria, prevents email enumeration in the UI, and handles rapid repeated submits with minimal state.

**Alternatives considered**: Different messages for unknown email/wrong password violate the specification. Debounce timers add complexity; an in-flight flag and disabled button are sufficient.

## Protected Navigation

**Decision**: A small `requireValidSession` helper guards the dashboard on page load. Unauthenticated users go to `login.html?returnTo=dashboard.html`; login honors only an allowlisted same-origin target. Logout removes the session and uses `location.replace` when returning to login.

**Rationale**: This demonstrates protected content, return navigation, session validation, and resistance to the back button without introducing a router.

**Alternatives considered**: A client-side routing framework is disproportionate to two pages. Arbitrary return URLs were rejected to avoid open redirects.

## Testing Approach

**Decision**: Extend Jest/jsdom tests for pure storage/session helpers and add DOM-flow tests for login and dashboard behavior, followed by the manual scenarios in `quickstart.md`.

**Rationale**: It reuses the existing test stack and verifies both deterministic rules and browser-facing acceptance scenarios.

**Alternatives considered**: Adding Playwright/Cypress would introduce a new tool solely for a small static flow. Manual testing alone would make time-window and storage edge cases less repeatable.

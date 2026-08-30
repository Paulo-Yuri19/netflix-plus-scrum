---

description: "Dependency-ordered implementation tasks for US-002 user login"
---

# Tasks: User Login

**Input**: Design documents from `/specs/002-user-login/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/login-ui-contract.md`, `quickstart.md`

**Tests**: Automated Jest/jsdom tasks are included because the feature specification defines mandatory testing scenarios and the implementation plan requires focused automated tests.

**Organization**: Tasks are grouped by user story so each increment can be implemented and validated with explicit dependencies.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it changes a different file and has no dependency on an incomplete task
- **[Story]**: Maps the task to User Story 1, 2, or 3
- Every task names the exact file or files it changes or validates

## Phase 1: Setup (Shared Test Infrastructure)

**Purpose**: Prepare deterministic browser API mocks used by every authentication test.

- [X] T001 Configure resettable `localStorage`, `sessionStorage`, `crypto.getRandomValues`, clock, and navigation test doubles in `tests/setup.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared constants and safe browser-storage primitives before story behavior is implemented.

**Critical**: No user story work begins until this phase is complete.

- [X] T002 Define and export storage keys, 24-hour session duration, 15-minute attempt window, five-failure threshold, email normalization, and safe JSON storage helpers in `src/lib/auth.js`
- [X] T003 Add baseline unit coverage for malformed/unavailable local and session storage plus email normalization in `tests/auth.test.js`

**Checkpoint**: Shared authentication storage behavior is deterministic and testable.

---

## Phase 3: User Story 1 - Basic Email/Password Login (Priority: P1) MVP

**Goal**: Let an existing US-001 user authenticate with case-insensitive email and case-sensitive password, receive a password-free session, and reach the dashboard.

**Independent Test**: Seed `netflix_users`, submit valid credentials in `src/pages/login.html`, and verify one bcrypt comparison, a token-bearing password-free `netflix_current_user` session, no visible error, and navigation to `dashboard.html` within two seconds.

### Tests for User Story 1

> Write these tests first and confirm they fail before implementation.

- [X] T004 [P] [US1] Add unit tests for case-insensitive user lookup, case-sensitive bcrypt verification, token generation, and password-free session creation in `tests/auth.test.js`
- [X] T005 [P] [US1] Add jsdom tests for required-field validation, valid login, loading/duplicate-submit prevention, session creation, and dashboard redirect in `tests/login.test.js`

### Implementation for User Story 1

- [X] T006 [P] [US1] Build the accessible login form and required DOM contract, including bcrypt and script loading, in `src/pages/login.html`
- [X] T007 [P] [US1] Style responsive login form states, field errors, alert status, and disabled/loading submit control in `src/styles/login.css`
- [X] T008 [US1] Implement opaque token generation and password-free session creation through `setLoggedInUser` in `src/lib/auth.js`
- [X] T009 [US1] Implement login form initialization, empty-field checks, normalized user lookup, case-sensitive password comparison, loading guard, error clearing, session creation, and default dashboard navigation in `src/scripts/login.js`

**Checkpoint**: Valid registered credentials provide a complete, independently demonstrable login path.

---

## Phase 4: User Story 2 - Invalid Credentials and Temporary Lockout (Priority: P2)

**Goal**: Give retryable, non-enumerating credential feedback and block submissions after five failures remain in the rolling 15-minute window.

**Independent Test**: Submit unknown-email and wrong-password attempts and verify identical feedback with no redirect; focus either field to clear feedback; then make five failed attempts for one normalized email and verify the sixth submission is rejected with the lockout message without invoking bcrypt.

### Tests for User Story 2

> Write these tests first and confirm they fail before implementation.

- [X] T010 [P] [US2] Add unit tests for per-email timestamp recording, malformed registry recovery, rolling-window pruning, threshold checks, and successful-login clearing in `tests/auth.test.js`
- [X] T011 [P] [US2] Add jsdom tests for uniform invalid-credential feedback, retry/focus clearing, five recorded failures, sixth-attempt lockout, and post-window retry in `tests/login.test.js`

### Implementation for User Story 2

- [X] T012 [US2] Implement normalized-email attempt registry loading, pruning, recording, lock checking, and clearing against `netflix_login_attempts` in `src/lib/auth.js`
- [X] T013 [US2] Integrate generic invalid feedback, pre-comparison lock checks, failed-attempt recording, successful-attempt clearing, and exact lockout messaging in `src/scripts/login.js`

**Checkpoint**: Invalid and locked-out flows are testable without changing the successful-login outcome.

---

## Phase 5: User Story 3 - Session Persistence and Logout (Priority: P2)

**Goal**: Maintain a sliding 24-hour session on protected loads, reject missing/malformed/expired/orphaned sessions, and support immediate logout.

**Independent Test**: Log in, reload the dashboard, and verify the user remains authenticated with a refreshed expiry; then test expired and absent sessions redirect to login appropriately, and verify logout plus browser Back cannot reveal protected content.

### Tests for User Story 3

> Write these tests first and confirm they fail before implementation.

- [X] T014 [P] [US3] Add unit tests for valid-session retrieval and refresh, 24-hour inactivity expiry, malformed/orphaned session removal, and logout in `tests/auth.test.js`
- [X] T015 [P] [US3] Add jsdom tests for dashboard guarding, name rendering, sliding refresh, expired-session indicator, missing-session return target, logout, and Back-navigation recheck in `tests/dashboard.test.js`
- [X] T016 [P] [US3] Update registration regression tests to require the expanded password-free session shape created by auto-login in `tests/register.test.js`

### Implementation for User Story 3

- [X] T017 [US3] Implement session parsing, user-reference validation, sliding expiry refresh, expired-state reporting, and clearing in `src/lib/auth.js`
- [X] T018 [US3] Update registration auto-login and existing-session redirect to use the expanded session helpers and document-relative `dashboard.html` navigation in `src/scripts/register.js`
- [X] T019 [P] [US3] Build the protected dashboard DOM with hidden-until-validated content, `user-name`, and `logout-button` in `src/pages/dashboard.html`
- [X] T020 [P] [US3] Style responsive protected dashboard content and logout controls in `src/styles/dashboard.css`
- [X] T021 [US3] Implement page-load session guarding, safe name rendering, inactivity refresh, expiry-aware login redirect, and logout via location replacement in `src/scripts/dashboard.js`
- [X] T022 [US3] Add expired-session status handling and allowlisted same-origin `returnTo` navigation for `dashboard.html` in `src/scripts/login.js`

**Checkpoint**: Session persistence, protected navigation, expiry, registration compatibility, and logout all work independently from invalid-credential handling.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Validate the complete feature, protect US-001 behavior, and record evidence against the specified browser journeys and performance targets.

- [X] T023 [P] Review login and dashboard semantics, labels, keyboard focus, alert announcements, mobile layout, and visual state consistency in `src/pages/login.html`, `src/pages/dashboard.html`, `src/styles/login.css`, and `src/styles/dashboard.css`
- [X] T024 Run the complete Jest suite with coverage and resolve authentication or registration regressions in `tests/auth.test.js`, `tests/register.test.js`, `tests/login.test.js`, and `tests/dashboard.test.js`
- [X] T025 Execute all five browser scenarios, verify sub-500 ms invalid feedback and sub-two-second valid redirect, and record validation results in `specs/002-user-login/quickstart.md`
- [X] T026 Audit stored session data, storage-failure behavior, return-target allowlisting, exact user-facing messages, and scope exclusions against `specs/002-user-login/contracts/login-ui-contract.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on T001 and blocks every user story.
- **Phase 3 (US1)**: Depends on Phase 2 and delivers the MVP.
- **Phase 4 (US2)**: Depends on the US1 login form and submission flow; it can begin after Phase 3.
- **Phase 5 (US3)**: Depends on US1 session creation; after Phase 3 it can proceed alongside US2 when ownership of `src/lib/auth.js` and `src/scripts/login.js` is coordinated.
- **Phase 6 (Polish)**: Depends on all selected user-story phases.

### User Story Dependency Graph

```text
Setup -> Foundation -> US1 (P1 / MVP) -> US2 (P2)
                                     `-> US3 (P2)
US2 + US3 -> Polish
```

### Within Each User Story

- Tests are authored and observed failing before the corresponding implementation.
- Required HTML contracts precede scripts that bind to their DOM elements.
- Shared `auth.js` helpers precede login or dashboard integration that consumes them.
- Core behavior precedes the story checkpoint and cross-cutting validation.

### Parallel Opportunities

- T004 and T005 can run concurrently after the foundation.
- T006 and T007 can run concurrently after the US1 tests are defined.
- T010 and T011 can run concurrently after US1.
- T014, T015, and T016 can run concurrently after US1.
- T019 and T020 can run concurrently after the US3 tests are defined.
- US2 and US3 can be developed concurrently after US1 if edits to `src/lib/auth.js` and `src/scripts/login.js` are serialized or assigned clearly.

---

## Parallel Examples

### User Story 1

```text
Task T004: Unit-test credential and session helpers in tests/auth.test.js
Task T005: Test the login DOM journey in tests/login.test.js

Task T006: Build the DOM contract in src/pages/login.html
Task T007: Style the login states in src/styles/login.css
```

### User Story 2

```text
Task T010: Unit-test the rolling attempt registry in tests/auth.test.js
Task T011: Test invalid and locked form journeys in tests/login.test.js
```

### User Story 3

```text
Task T014: Unit-test session lifecycle helpers in tests/auth.test.js
Task T015: Test protected dashboard behavior in tests/dashboard.test.js
Task T016: Update registration session regressions in tests/register.test.js

Task T019: Build the protected DOM in src/pages/dashboard.html
Task T020: Style the protected page in src/styles/dashboard.css
```

---

## Implementation Strategy

### MVP First: User Story 1

1. Complete Setup and Foundational phases.
2. Write and observe failing US1 tests.
3. Implement T006-T009.
4. Run `npm test -- --runInBand tests/auth.test.js tests/login.test.js` and manually validate the successful-login journey.
5. Stop here for the smallest demonstrable MVP.

### Incremental Delivery

1. Deliver US1 for valid login and session establishment.
2. Add US2 for generic failures and rolling lockout, then validate it independently.
3. Add US3 for protected persistence, expiry, registration compatibility, and logout, then validate it independently.
4. Complete Phase 6 and run the full regression suite before merge.

### Parallel Team Strategy

1. Complete T001-T003 together.
2. Split US1 tests and page styling across independent files, then serialize shared implementation.
3. After US1, assign US2 and US3 concurrently while coordinating the two shared JavaScript files.
4. Rejoin for the complete automated and browser validation phase.

---

## Notes

- No backend, database, JWT, router, authentication framework, MFA, recovery flow, or new runtime dependency is introduced.
- `netflix_users` remains compatible with US-001; only `netflix_current_user` evolves to the documented session shape.
- A sixth submission is blocked when five failures remain inside the rolling 15-minute window.
- Valid protected-page activity refreshes the 24-hour inactivity deadline.
- Commit after each task or cohesive task group, and validate at every story checkpoint.

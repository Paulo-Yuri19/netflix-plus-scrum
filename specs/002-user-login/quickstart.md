# Quickstart: Validate User Login

**Feature**: US-002 User Login  
**Date**: 2026-08-30

## Prerequisites

- Node.js and npm
- A modern browser with JavaScript and Web Storage enabled
- Dependencies installed with `npm install`
- US-001 registration page available to create the test account

The expected storage shapes are defined in [data-model.md](data-model.md), and required DOM behavior is defined in [contracts/login-ui-contract.md](contracts/login-ui-contract.md).

## Automated Validation

From the repository root, run:

```bash
npm test
```

Expected: authentication, registration regression, login, and protected-dashboard tests all pass.

## Browser Setup

Serve the repository root with any simple static HTTP server, then open `src/pages/register.html`. Do not rely on `file://` because browser navigation/storage behavior varies for local files.

Register this fixture if it does not already exist:

- Name: `Test User`
- Email: `user@example.com`
- Password: `password123`

Log out before beginning the scenarios.

## Scenario 1 — Valid Login and Persistence

1. Open `src/pages/login.html`.
2. Submit `user@example.com` / `password123`.
3. Confirm navigation to the dashboard occurs within two seconds and no error remains.
4. Reload the dashboard.

Expected: the user name and logout control remain visible; `netflix_current_user` contains a token and timestamps but no password/hash.

## Scenario 2 — Empty and Invalid Credentials

1. Submit the empty form.
2. Confirm both required-field messages appear immediately and no navigation occurs.
3. Submit an unknown email with any password.
4. Submit the registered email with a wrong password.
5. Focus either input after each failure.

Expected: both credential failures show exactly `Invalid email or password`; focusing an input clears the message and permits retry.

## Scenario 3 — Temporary Lockout

1. Clear `sessionStorage['netflix_login_attempts']`.
2. Submit the registered email with a wrong password five times.
3. Submit a sixth time, including with the correct password.

Expected: the sixth attempt is rejected with `Account temporarily locked. Try again in 15 minutes`. After the stored failures are older than 15 minutes (or sessionStorage is cleared for test setup), a valid login succeeds.

## Scenario 4 — Expiry and Protected Navigation

1. Log in successfully.
2. In browser developer tools, change the session `expiresAt` to a timestamp in the past.
3. Reload the dashboard.
4. Separately, remove `netflix_current_user` and directly open the dashboard URL.

Expected: both cases redirect to login. The expired case displays `Your session has expired. Please log in again`; the missing-session case carries a safe return target without the expiry message.

## Scenario 5 — Logout and Back Navigation

1. Log in and click `Log Out` on the dashboard.
2. Confirm the login page opens and `netflix_current_user` is absent.
3. Use the browser Back button or directly reopen the dashboard.

Expected: protected content is not accessible; the dashboard guard returns the user to login.

## Completion Checklist

- [x] Valid registered credentials create a password-free session and redirect
- [x] Email matching is case-insensitive; password matching is case-sensitive
- [x] Empty and invalid inputs show the specified feedback
- [x] Duplicate rapid submissions are blocked while verification runs
- [x] Five failures enforce the 15-minute lockout on later attempts
- [x] Valid session activity persists across reloads and refreshes the 24-hour deadline
- [x] Missing, malformed, orphaned, or expired sessions cannot access the dashboard
- [x] Logout clears the session immediately
- [x] Existing US-001 registration tests still pass

## Validation Record — 2026-08-30

The five scenarios above were exercised through the Jest/jsdom browser-flow suites, with desktop and mobile rendering additionally checked in headless Firefox against a local HTTP server.

| Scenario | Result | Evidence |
|---|---|---|
| 1. Valid login and persistence | PASS | Login and session unit/DOM tests verify normalized credentials, bcrypt comparison, password-free token storage, redirect, and sliding refresh. |
| 2. Empty and invalid credentials | PASS | Login DOM tests verify both required messages, identical unknown-email/wrong-password feedback, no redirect, and focus clearing. |
| 3. Temporary lockout | PASS | Auth and login tests verify five retained failures, sixth-submission rejection before bcrypt, rolling-window pruning, and clearing after success. |
| 4. Expiry and protected navigation | PASS | Auth and dashboard tests verify missing, malformed, orphaned, and expired states plus safe return and expiry indicators. |
| 5. Logout and Back navigation | PASS | Dashboard tests verify immediate storage removal and protected-page guard rechecking after logout. |

Validation commands and observations:

- `npm run test:coverage -- --runInBand`: 4 suites, 57 tests passed; global coverage remained above every configured 50% threshold.
- Real bcryptjs cost-10 comparison: 94.64 ms on the validation host, within the 2-second valid-login budget.
- Required and invalid feedback is applied synchronously apart from bcrypt comparison and remains within the 500 ms feedback budget in the DOM-flow validation.
- Headless Firefox at 1440×1000 and 390×844 confirmed a readable, responsive login layout with visible labels, controls, focus-ready semantics, and no horizontal overflow; an authenticated 1440×1000 render also confirmed protected-content reveal, safe name output, and visible logout control.

# Login and Protected-Page UI Contract

**Feature**: US-002 User Login  
**Version**: 1.0  
**Date**: 2026-08-30

## Login Page

Path: `src/pages/login.html`

Required DOM interface:

| Element | Required attributes/state | Purpose |
|---|---|---|
| Form | `id="login-form"`, `novalidate` | Owns login submission |
| Email input | `id="email"`, `name="email"`, `type="email"`, `autocomplete="email"`, `required` | Account identifier |
| Email error | `id="email-error"`, live-readable error text | Empty-email feedback |
| Password input | `id="password"`, `name="password"`, `type="password"`, `autocomplete="current-password"`, `required` | Case-sensitive credential |
| Password error | `id="password-error"`, live-readable error text | Empty-password feedback |
| Form status | `id="login-status"`, `role="alert"` | Generic invalid, locked, or expired-session message |
| Submit button | `id="submit-button"`, `type="submit"` | Shows idle/loading state and blocks duplicate submits |

Submission behavior:

1. Prevent native navigation and clear prior errors.
2. Reject empty fields with field-level required messages.
3. Reject a currently locked normalized email without password comparison.
4. Find the user case-insensitively and compare the password with bcryptjs.
5. For either missing user or mismatch, show `Invalid email or password` and remain on the page.
6. On success, clear failures, create the session, and navigate to an allowed `returnTo` page or `dashboard.html`.
7. While comparison is pending, disable submit and show a loading label; always restore it if the page does not navigate.
8. Focusing email or password clears the visible form status and that field's error.

Lockout message: `Account temporarily locked. Try again in 15 minutes`.

Expired-session message: `Your session has expired. Please log in again` when the login URL contains the internal expiry indicator.

## Dashboard Page

Path: `src/pages/dashboard.html`

Required DOM interface:

| Element | Required attributes/state | Purpose |
|---|---|---|
| User display | `id="user-name"` | Shows session user's name |
| Logout button | `id="logout-button"`, `type="button"` | Clears session and returns to login |

Page-load behavior:

- Validate the stored session before revealing protected content.
- If valid, refresh its inactivity deadline and render the user's name.
- If missing/invalid, replace navigation with `login.html?returnTo=dashboard.html`.
- If expired, additionally include the expiry indicator so the login page displays the required message.
- Logout removes `netflix_current_user` and replaces navigation with `login.html`.

## Shared JavaScript Contract

`src/lib/auth.js` remains a plain script/CommonJS-testable utility and supplies these responsibilities:

- existing user loading, case-insensitive lookup, and bcrypt password verification;
- opaque session creation, retrieval, validation/refresh, and clearing;
- normalized-email failed-attempt recording, pruning, lock checking, and clearing;
- storage failures handled as failed/empty state without exposing password data.

No network/API contract exists: the feature is fully browser-local by specification.

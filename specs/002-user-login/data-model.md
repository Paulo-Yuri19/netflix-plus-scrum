# Data Model: User Login

**Feature**: US-002 User Login  
**Date**: 2026-08-30  
**Status**: Phase 1 Design

## User

Existing registered account created by US-001 and stored in `localStorage['netflix_users']`.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Required, unique UUID |
| `name` | string | Required; display only during login/session |
| `email` | string | Required; matched after trim/lowercase normalization |
| `passwordHash` | string | Required bcrypt hash; never copied into a session |
| `createdAt` | ISO 8601 string | Required registration timestamp |

Relationship: one user can have at most one current session in this single-browser demo.

## Session

Active authentication state stored as JSON in `localStorage['netflix_current_user']`.

| Field | Type | Rules |
|---|---|---|
| `token` | string | Required, non-empty opaque random value |
| `userId` | string | Required; references `User.id` |
| `name` | string | Required display value |
| `email` | string | Required normalized account email |
| `createdAt` | ISO 8601 string | Time authentication succeeded |
| `lastActivityAt` | ISO 8601 string | Updated after valid page-load session checks |
| `expiresAt` | ISO 8601 string | Exactly 24 hours after last activity |

Validation rules:

- A session is valid only when required fields parse correctly, `expiresAt` is later than the current time, and the referenced user still exists.
- Valid activity refreshes `lastActivityAt` and `expiresAt`.
- Invalid, expired, or orphaned sessions are removed before redirecting to login.
- Password and `passwordHash` are forbidden in the stored session.

## LoginAttempt Registry

Rolling failed-attempt data stored as JSON in `sessionStorage['netflix_login_attempts']`.

```text
normalized-email -> [failedAt, failedAt, ...]
```

| Value | Type | Rules |
|---|---|---|
| map key | string | Trimmed lowercase email submitted by the user |
| `failedAt` | ISO 8601 string | Failed credential check timestamp |

Validation rules:

- Remove timestamps at least 15 minutes old before counting.
- Allow credential checking while the retained count is below five.
- When five failures remain, reject further attempts with the lockout message.
- Clear the email entry after successful authentication.
- Malformed stored data is treated as an empty registry.

## State Transitions

```text
Logged out
  -> valid credentials -> Authenticated (session created)
  -> invalid credentials -> Logged out (failure recorded)

Authenticated
  -> valid protected-page load -> Authenticated (expiry refreshed)
  -> 24h inactivity / missing user -> Expired (session removed)
  -> logout -> Logged out (session removed)

Attempt eligible
  -> each failed check -> 1..5 failures in rolling window
  -> sixth/subsequent submission while 5 remain -> Temporarily locked
  -> window elapses or successful login -> Attempt eligible
```

## Storage Compatibility

US-001's `netflix_users` schema is unchanged. Its `setLoggedInUser(user)` helper will create the expanded Session record, so auto-login after registration and explicit login share one session format. A legacy `netflix_current_user` record without token/expiry is invalidated and requires login; no migration is needed for this demonstrative project.

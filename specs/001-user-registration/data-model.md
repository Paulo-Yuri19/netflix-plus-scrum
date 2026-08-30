# Data Model: User Registration

**Created**: 2026-08-29  
**Feature**: User Registration (spec.md)  
**Status**: Phase 1 Design

---

## Core Entities

### User Account

Represents a registered user of the Netflix+ platform.

**Entity Name**: `User`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | string (UUID) | Unique, generated on creation | Unique identifier for the user account |
| `name` | string | Required, 2-100 characters | User's full name |
| `email` | string | Required, valid email format, unique (case-insensitive) | User's email address (used for login, password recovery) |
| `passwordHash` | string | Required, bcrypt hash of plaintext password | Hashed password (never plaintext) using bcryptjs cost factor 10 |
| `createdAt` | ISO 8601 timestamp | Auto-set on creation | Account creation timestamp (for audit, analytics) |

**Example User Object**:

```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst",
  createdAt: "2026-08-29T14:32:15.123Z"
}
```

---

## Entity Relationships

```
┌─────────────────────────────────────┐
│           User Account              │
├─────────────────────────────────────┤
│ id (PK)                             │
│ name                                │
│ email (UNIQUE)                      │
│ passwordHash                        │
│ createdAt                           │
└─────────────────────────────────────┘
```

**No relationships** for User Registration feature (foundational feature). Users are independent records. Future features (US-002 Login, US-006 Create Profile) will establish relationships.

---

## Validation Rules

### Name Validation

- **Required**: Yes
- **Type**: String
- **Minimum length**: 2 characters
- **Maximum length**: 100 characters
- **Whitespace trimming**: Yes (leading/trailing whitespace removed)
- **Characters allowed**: Any Unicode character (names in all languages supported)

**Validation Logic**:

```javascript
function validateName(name) {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { valid: false, error: "This field is required." };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters long." };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Name must be at most 100 characters long." };
  }
  
  return { valid: true, value: trimmed };
}
```

### Email Validation

- **Required**: Yes
- **Type**: String
- **Format**: Valid email address (must contain @ and domain)
- **Case sensitivity**: Case-insensitive for uniqueness check (stored lowercase)
- **Uniqueness**: Must not exist in current user database
- **Whitespace trimming**: Yes

**Validation Logic**:

```javascript
function validateEmail(email) {
  const trimmed = email.trim();
  
  if (!trimmed) {
    return { valid: false, error: "This field is required." };
  }
  
  // Simple email regex: must have text@text.text
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  
  // Check uniqueness (case-insensitive)
  if (findUserByEmail(trimmed.toLowerCase())) {
    return { valid: false, error: "This email is already registered." };
  }
  
  return { valid: true, value: trimmed.toLowerCase() };
}
```

### Password Validation

- **Required**: Yes
- **Type**: String
- **Minimum length**: 6 characters
- **Maximum length**: 128 characters (bcryptjs limit)
- **Hashing**: Yes (bcryptjs, cost factor 10)
- **Never stored as plaintext**: Enforced in code

**Validation Logic**:

```javascript
async function validatePassword(password) {
  if (!password) {
    return { valid: false, error: "This field is required." };
  }
  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters long." };
  }
  if (password.length > 128) {
    return { valid: false, error: "Password must be at most 128 characters long." };
  }
  
  // Hash the password
  const hash = await bcryptjs.hash(password, 10);
  
  return { valid: true, value: hash };
}
```

---

## State Transitions

### User Account Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  [New Registration]                                          │
│         ↓                                                    │
│  [User Data Created + Stored in localStorage]               │
│         ↓                                                    │
│  [User Auto-Logged In → Stored as current_user]             │
│         ↓                                                    │
│  [User Active / Browsing Dashboard]                         │
│         ↓ (Future: US-002 Logout)                           │
│  [Current User Cleared from Session]                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**States**:

1. **Registered**: User exists in `netflix_users` array; account fully created
2. **Logged In**: User ID/data copied to `netflix_current_user` (session state)
3. **Logged Out**: `netflix_current_user` set to null (future: US-002)

---

## Storage Schema

### localStorage Structure

```javascript
// Key: 'netflix_users'
// Type: JSON stringified array
// Description: All registered user accounts
[
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst",
    createdAt: "2026-08-29T14:32:15.123Z"
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440000",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    passwordHash: "$2b$10$zyxwvutsrqponmlkjihgfedcbazyx",
    createdAt: "2026-08-29T15:22:45.456Z"
  }
]

// Key: 'netflix_current_user'
// Type: JSON stringified object or null
// Description: Currently logged-in user (for session state)
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  // Note: passwordHash excluded from session for security
}
```

---

## Constraints & Indexes

### Unique Constraints

- `email`: Globally unique across all users (case-insensitive)
- `id`: Globally unique (generated UUID)

### Indexes (Optimization)

For MVP, no indexes needed. Future optimization (if 10k+ users):
- Index on `email` for faster lookups

### Storage Limits

- localStorage quota: ~5-10MB per origin (browser-dependent)
- Estimated user size: ~200 bytes per user (name + email + hash)
- Capacity: ~25,000-50,000 users before quota concerns

---

## Edge Cases

### Empty Registration Database

**Scenario**: Newly installed app, no users yet  
**Expected**: `localStorage.getItem('netflix_users')` returns null  
**Handling**: Treat as empty array `[]`

```javascript
const users = JSON.parse(localStorage.getItem('netflix_users') || '[]');
```

### localStorage Cleared

**Scenario**: User clears browser cache/storage  
**Expected**: All users deleted; registration allowed again  
**Handling**: No special code needed; system starts fresh

### Duplicate Email (Case Variation)

**Scenario**: User registers "user@example.com"; later tries "User@Example.com"  
**Expected**: Rejected as duplicate  
**Handling**: Case-insensitive comparison before storage

```javascript
const existingEmail = findUserByEmail(email.toLowerCase());
if (existingEmail) {
  error = "This email is already registered.";
}
```

### Password Storage Verification

**Scenario**: Verify password stored as hash, not plaintext  
**Expected**: Password never appears plaintext in localStorage  
**Handling**: Code review ensures only hashed password stored; bcryptjs.hash() called before storage

---

## Performance Characteristics

### Storage Operations

| Operation | Complexity | Time (typical) |
|-----------|-----------|----------------|
| Load all users | O(1) - single localStorage read | <5ms |
| Find user by email | O(n) - linear search through array | <50ms (for 1000 users) |
| Save users | O(1) - single localStorage write + JSON.stringify | <10ms |
| Hash password | O(cost) - bcryptjs hash | 50-100ms |

**Acceptable for MVP**: All operations complete in <150ms, user perceives immediate feedback.

---

## Next Steps

1. **Contracts** (Phase 1): Define HTML form structure and JavaScript API
2. **Quickstart** (Phase 1): Validation scenarios for end-to-end testing
3. **Tasks** (Phase 2): Break down into implementation tasks

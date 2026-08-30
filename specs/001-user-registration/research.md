# Research: User Registration Feature

**Created**: 2026-08-29  
**Status**: Complete  
**Feature**: User Registration (spec.md)

---

## Overview

This document consolidates research findings for implementing the user registration feature. All technical unknowns from the specification have been resolved through investigation of best practices and patterns. Each section documents a research task, the decision made, and the rationale.

---

## Research Task 1: Client-Side Password Hashing with bcryptjs

**Objective**: Determine best practices for secure password hashing in the browser using bcryptjs library.

### Decision

Use **bcryptjs.hash()** for password hashing during registration and **bcryptjs.compare()** for password verification during login.

### Rationale

- **Pure JavaScript**: bcryptjs is a JavaScript port of bcrypt with no native bindings required; works in all modern browsers
- **Security**: Bcrypt is industry-standard password hashing algorithm; adaptive cost factor resists brute-force attacks
- **Performance**: Typical hash time 50-100ms on modern hardware; acceptable for form submission (user notices brief delay before redirect)
- **No dependencies**: Single library dependency; easy to include via CDN or npm
- **MVP fit**: Establishes secure practices from day one without backend complexity

### Implementation Pattern

```javascript
// During registration: hash password before storage
const passwordHash = await bcryptjs.hash(password, 10);
// Cost factor 10 provides good balance between security and performance

// During login: compare plaintext password with stored hash
const isValid = await bcryptjs.compare(inputPassword, storedHash);
```

### Alternatives Considered

1. **Plaintext passwords**: Rejected - violates security principle; passwords exposed if localStorage compromised
2. **Simple hashing (SHA-256)**: Rejected - insufficient against brute-force attacks; one-way hash vulnerable to rainbow tables
3. **Server-side hashing**: Rejected - requires backend; violates Principle II (HTML/CSS/JS preference)

### Risk Mitigation

- Performance: Hash typically completes within 100ms; acceptable UX for registration form
- Browser support: bcryptjs works in ES6+ browsers (all modern browsers)

---

## Research Task 2: Browser localStorage Patterns for User Data Persistence

**Objective**: Determine best practices for storing user account data persistently in browser storage.

### Decision

Store all registered users as a **JSON array** in a single localStorage key: `netflix_users`.

Store currently logged-in user in: `netflix_current_user`.

### Rationale

- **Simple key-value model**: No need for complex queries or schema migrations in MVP
- **JSON serialization**: Built-in `JSON.stringify()` and `JSON.parse()` make serialization trivial
- **Centralized storage**: Single source of truth for all users; easier to manage uniqueness constraints
- **Performance**: Array lookups fast enough for MVP (100s-1000s of users)
- **Quota**: localStorage provides ~5-10MB per origin; sufficient for thousands of user objects

### Storage Schema

```javascript
// localStorage['netflix_users'] - Array of all registered users
[
  {
    id: "uuid-1",
    name: "Alice",
    email: "alice@example.com",
    passwordHash: "bcrypt-hash-here"
  },
  {
    id: "uuid-2",
    name: "Bob",
    email: "bob@example.com",
    passwordHash: "bcrypt-hash-here"
  }
]

// localStorage['netflix_current_user'] - Currently logged-in user (or null)
{
  id: "uuid-1",
  name: "Alice",
  email: "alice@example.com"
  // Note: passwordHash excluded from current user object for security
}
```

### Implementation Pattern

```javascript
// Load all users
function loadUsers() {
  const data = localStorage.getItem('netflix_users');
  return JSON.parse(data || '[]');
}

// Save all users
function saveUsers(users) {
  localStorage.setItem('netflix_users', JSON.stringify(users));
}

// Find user by email (case-insensitive)
function findUserByEmail(email) {
  const users = loadUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Set currently logged-in user
function setCurrentUser(user) {
  localStorage.setItem('netflix_current_user', JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email
    // Exclude passwordHash
  }));
}
```

### Alternatives Considered

1. **Multiple localStorage keys**: Rejected - harder to query and maintain uniqueness
2. **IndexedDB**: Rejected - overkill for MVP; adds complexity without clear benefit
3. **Backend database**: Rejected - violates Principle II (HTML/CSS/JS preference)

### Edge Cases

- **Empty localStorage**: When no users exist, `loadUsers()` returns empty array `[]`
- **localStorage cleared**: System allows new registrations as if fresh start
- **Quota exceeded**: Unlikely for MVP; could add graceful error message if needed

### Risk Mitigation

- Data loss if localStorage cleared: Acceptable for MVP; no session persistence guaranteed in browser
- Privacy: Data stored unencrypted except for password hash; acceptable for academic project

---

## Research Task 3: Client-Side Form Validation Patterns

**Objective**: Determine best practices for validating user input in vanilla JavaScript without frameworks.

### Decision

Implement **submit-time validation** (validate on form submission event) with **inline error messages** displayed below each field.

### Rationale

- **Simpler UX for MVP**: Avoid complexity of real-time validation (debouncing, visual feedback timing)
- **Clear error grouping**: Show all validation errors at once; user sees complete picture of what needs fixing
- **Standard pattern**: Form submission validation is most common approach
- **Performance**: No continuous listeners or DOM updates during typing
- **Accessibility**: Error messages associated with fields; can use `aria-describedby`

### Validation Rules

From specification requirements:

```javascript
const validationRules = {
  name: [
    { required: true, message: "This field is required." },
    { minLength: 2, message: "Name must be at least 2 characters long." }
  ],
  email: [
    { required: true, message: "This field is required." },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address." },
    { unique: true, message: "This email is already registered." }
  ],
  password: [
    { required: true, message: "This field is required." },
    { minLength: 6, message: "Password must be at least 6 characters long." }
  ]
};
```

### Implementation Pattern

```javascript
// Clear previous errors
function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  document.querySelectorAll('input').forEach(el => el.classList.remove('invalid'));
}

// Display error message
function showError(fieldName, message) {
  const field = document.getElementById(fieldName);
  field.classList.add('invalid');
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  field.parentElement.appendChild(errorEl);
}

// Form submission handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  let hasErrors = false;

  // Validate name
  const name = form.name.value.trim();
  if (!name) {
    showError('name', 'This field is required.');
    hasErrors = true;
  } else if (name.length < 2) {
    showError('name', 'Name must be at least 2 characters long.');
    hasErrors = true;
  }

  // Validate email
  const email = form.email.value.trim();
  if (!email) {
    showError('email', 'This field is required.');
    hasErrors = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Please enter a valid email address.');
    hasErrors = true;
  } else if (findUserByEmail(email)) {
    showError('email', 'This email is already registered.');
    hasErrors = true;
  }

  // Validate password
  const password = form.password.value;
  if (!password) {
    showError('password', 'This field is required.');
    hasErrors = true;
  } else if (password.length < 6) {
    showError('password', 'Password must be at least 6 characters long.');
    hasErrors = true;
  }

  if (!hasErrors) {
    // Proceed with registration
    await registerUser(name, email, password);
  }
});
```

### Alternatives Considered

1. **Real-time validation**: Rejected - adds complexity (debouncing, keystroke listeners) without clear benefit for MVP
2. **Constraint validation API (HTML5)**: Rejected - limited customization; custom messages require fallback
3. **Validation library**: Rejected - violates Principle V (avoid unnecessary abstractions)

### Risk Mitigation

- Email uniqueness check requires reading all users from localStorage (O(n)); acceptable for MVP scale
- Error message styling needs CSS; documented in design contract

---

## Research Task 4: Password Visibility Toggle Implementation

**Objective**: Determine best practices for toggling password field visibility in HTML/JavaScript.

### Decision

Implement a simple **"Show" / "Hide" button** that toggles the password input's `type` attribute between `"password"` and `"text"`.

### Rationale

- **Simple and clear**: Text button label is more explicit than icon for MVP
- **Native HTML**: Use `<input type="password">` and `<input type="text">` (no custom component)
- **Minimal code**: Toggle logic is 3 lines of JavaScript
- **Cross-browser**: Supported in all modern browsers
- **Accessibility**: Button can have `aria-label` for screen readers; label text is visible

### Implementation Pattern

```html
<!-- HTML Structure -->
<div class="password-group">
  <input type="password" id="password" name="password" placeholder="Password">
  <button type="button" id="toggle-password">Show</button>
</div>
```

```javascript
// JavaScript: Toggle password visibility
let passwordVisible = false;

document.getElementById('toggle-password').addEventListener('click', (e) => {
  e.preventDefault();  // Prevent form submission
  const passwordField = document.getElementById('password');
  const button = e.target;

  passwordVisible = !passwordVisible;

  if (passwordVisible) {
    passwordField.type = 'text';
    button.textContent = 'Hide';
  } else {
    passwordField.type = 'password';
    button.textContent = 'Show';
  }
});
```

```css
/* CSS: Style the password group */
.password-group {
  position: relative;
  display: flex;
  align-items: center;
}

#password {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

#toggle-password {
  margin-left: 8px;
  padding: 8px 12px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

#toggle-password:hover {
  background: #e0e0e0;
}
```

### Alternatives Considered

1. **Icon-based toggle** (eye icon): Rejected - less obvious for MVP users; requires icon library or SVG
2. **Checkbox**: Rejected - checkbox semantics don't match "toggle visibility"
3. **Custom input replacement**: Rejected - violates Principle V (avoid unnecessary abstractions)

### Risk Mitigation

- Focus management: Clicking button doesn't blur the password field; user can continue typing
- State sync: Boolean flag keeps UI state in sync with actual input type

---

## Summary of Decisions

| Research Task | Decision | Implementation Detail |
|---------------|----------|----------------------|
| Password hashing | bcryptjs.hash() / bcryptjs.compare() | Cost factor 10; ~50-100ms per hash |
| User storage | JSON array in `localStorage['netflix_users']` | Lookup by email with case-insensitive comparison |
| Form validation | Submit-time validation with inline errors | Validation on form submission; error display below fields |
| Password visibility | Toggle button with "Show" / "Hide" text | Switches input type between "password" and "text" |

---

## Next Steps

All research tasks complete. Ready to proceed to Phase 1 Design (data model, contracts, quickstart).

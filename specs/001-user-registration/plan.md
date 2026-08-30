# Implementation Plan: User Registration

**Branch**: `001-user-registration` | **Date**: 2026-08-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-user-registration/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Implement a user registration form for Netflix+ platform allowing visitors to create accounts with name, email, and password. Feature includes client-side validation, password hashing using bcryptjs, browser storage persistence, and "Show Password" toggle. No backend required; all functionality implemented in HTML, CSS, and vanilla JavaScript per constitution principles.

## Technical Context

**Language/Version**: JavaScript ES6+

**Primary Dependencies**: bcryptjs (for client-side password hashing)

**Storage**: Browser localStorage for user account persistence

**Testing**: Browser-based functional testing (manual or Jest/Playwright for automation)

**Target Platform**: Web browser (modern browsers supporting ES6 and localStorage)

**Project Type**: Web frontend application (single-page form-based feature)

**Performance Goals**: N/A for MVP (form submission should be immediate; bcryptjs hashing typically <100ms for password)

**Constraints**: Passwords must be hashed before storage; email uniqueness enforced in browser storage; all validation client-side

**Scale/Scope**: Single registration form with 3 input fields (name, email, password); supports multiple user accounts in localStorage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I - Simplicity First**: ✓ PASS  
Pure HTML/CSS/JavaScript form with no unnecessary abstractions. Direct form submission and localStorage storage.

**Principle II - HTML/CSS/JavaScript Preference**: ✓ PASS  
Feature explicitly requires "HTML, CSS and JavaScript puro" (pure JavaScript). No backend or framework dependencies. bcryptjs is only external dependency for password hashing security.

**Principle III - Specification-Driven Development**: ✓ PASS  
Comprehensive specification with detailed requirements, acceptance scenarios, and technical constraints. Implementation can proceed independently using spec.

**Principle IV - Scrum Discipline**: ✓ PASS  
Feature scheduled in Sprint with defined User Stories and acceptance criteria.

**Principle V - Avoid Unnecessary Abstractions**: ✓ PASS  
Direct form implementation; no component abstraction, routing framework, or state management library required for single-page registration feature.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-registration/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification (already created)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── register.html        # Registration page (HTML form)
├── styles/
│   └── register.css         # Registration form styling
├── scripts/
│   └── register.js          # Registration form logic and validation
└── lib/
    └── auth.js              # User authentication utilities (storage, hashing)

tests/
├── register.test.js         # Registration form tests
└── auth.test.js             # Authentication utility tests
```

**Structure Decision**: Single-page web application with feature-based file organization. Registration page kept in `pages/` directory, styling in `styles/`, logic in `scripts/`, and shared utilities (auth, storage) in `lib/`. Simple, flat structure aligns with Principle I (Simplicity) and Principle V (Avoid Unnecessary Abstractions).


## Phase 0: Research & Clarifications

### Research Tasks

Based on Technical Context and spec requirements, the following research tasks will resolve implementation details:

1. **bcryptjs integration**: Best practices for client-side password hashing, library API, and performance characteristics
   - Decision point: Which bcryptjs methods to use (hash, compare)
   - Risk: Performance impact on password hashing (target <100ms acceptable)

2. **localStorage API patterns**: Best practices for storing user data, handling quota limits, serialization/deserialization
   - Decision point: JSON serialization strategy for user objects
   - Risk: localStorage quota exceeded (5-10MB typical; acceptable for MVP)

3. **Form validation patterns**: Client-side validation best practices in vanilla JavaScript, error messaging patterns
   - Decision point: Real-time vs. submit-time validation
   - Findings will inform data model validation rules

4. **Password visibility toggle**: Implementation patterns for HTML input type switching and visual feedback
   - Decision point: Icon/text for toggle button, accessibility considerations
   - Risk: Focus management on toggle action

### Research Findings

#### 1. bcryptjs Integration
- **Decision**: Use `bcryptjs.hash()` for password hashing, `bcryptjs.compare()` for verification
- **Rationale**: Pure JavaScript implementation, no native bindings required. Typical hash time: 50-100ms on modern hardware. Acceptable for form submission.
- **Pattern**: Hash on form submission before storing; compare during login verification
- **Integration**: Include via CDN or npm: `<script src="https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcryptjs.min.js"></script>`

#### 2. localStorage API Patterns
- **Decision**: Store user data as JSON array in `localStorage.getItem('netflix_users')` / `localStorage.setItem('netflix_users', JSON.stringify(users))`
- **Rationale**: Simple, no complex queries needed. Single key-value for MVP. Each user object: `{id, name, email, passwordHash}`
- **Constraint**: localStorage quota ~5-10MB; sufficient for thousands of users in MVP context
- **Edge case handling**: Empty localStorage returns `null`; parse as `JSON.parse(data || '[]')`

#### 3. Form Validation Patterns
- **Decision**: Validate on form submission (submit event), display inline error messages below each field
- **Rationale**: Simpler UX for MVP; avoid real-time validation complexity
- **Pattern**: Clear previous errors before validation; show error text with `display: block`; highlight invalid fields with CSS class
- **Error display**: Red text, consistent font-size and positioning

#### 4. Password Visibility Toggle
- **Decision**: Simple toggle button with text "Show" / "Hide" next to password field
- **Rationale**: Text label clearer than icon for MVP; toggle `input.type` between "password" and "text"
- **Pattern**: Button positioned inline, state tracked in JavaScript boolean, no separate input field
- **Accessibility**: Button has clear label and type="button" (not submit)

---

## Phase 1: Design & Contracts

### Data Model

**User Entity** (`User` object stored in browser localStorage)

```javascript
{
  id: "uuid-string",              // Unique identifier (generated on registration)
  name: "John Doe",               // Name (2+ characters)
  email: "john@example.com",      // Email (valid format, lowercase for comparison)
  passwordHash: "bcrypt-hash"     // Password hashed with bcryptjs (never store plaintext)
}
```

**Storage format**: Array of User objects serialized as JSON string in `localStorage['netflix_users']`

**Validation Rules**:
- `name`: Required, minimum 2 characters, maximum 100 characters
- `email`: Required, valid email format (contains @, has domain), unique within stored users, case-insensitive comparison
- `passwordHash`: Required, generated from 6+ character password using bcryptjs.hash()

### Contracts

**HTML Form Structure** (registration form contract)

The registration page exposes a form interface for user account creation:

```html
<form id="register-form">
  <input type="text" id="name" name="name" placeholder="Full Name" required>
  <input type="email" id="email" name="email" placeholder="Email" required>
  <div class="password-group">
    <input type="password" id="password" name="password" placeholder="Password" required>
    <button type="button" id="toggle-password">Show</button>
  </div>
  <button type="submit" id="submit-button">Create Account</button>
</form>
```

**JavaScript API** (registration module contract)

The registration module provides the following interface:

```javascript
// Initialize registration form
initializeRegistration();  // Attaches event listeners, restores user if logged in

// Form submission handler
async handleRegistrationSubmit(event);  // Validates, hashes password, stores user, redirects

// Password visibility toggle
togglePasswordVisibility();  // Switches input type between "password" and "text"

// User storage API
const users = loadUsers();                // Retrieve all registered users from localStorage
const user = findUserByEmail(email);      // Case-insensitive email lookup
const success = saveUser(user);           // Persist user to localStorage
const loggedIn = getLoggedInUser();       // Retrieve currently logged-in user
```

**Storage Contract** (localStorage keys)

- `netflix_users`: JSON array of all registered User objects
- `netflix_current_user`: JSON object of currently logged-in User (or null)

### Quickstart: Validation Guide

This guide demonstrates end-to-end registration flow and validates the feature works correctly.

**Prerequisites**:
- Browser with JavaScript enabled and localStorage available
- `register.html`, `register.css`, `register.js` loaded and bcryptjs library available

**Scenario 1: Successful Registration**

1. Open `register.html` in browser
2. Enter form data:
   - Name: "Jane Smith"
   - Email: "jane.smith@example.com"
   - Password: "SecurePass123"
3. Click "Create Account"
4. **Expected outcome**: 
   - No error messages displayed
   - User redirected to dashboard/home page
   - User remains logged in when page refreshed
   - localStorage contains user data with hashed password (not plaintext)

**Scenario 2: Validation Errors**

1. Open `register.html`
2. Try each validation failure:
   - Leave "Name" field empty → Click "Create Account" → Error: "This field is required."
   - Enter single character name → Click "Create Account" → Error: "Name must be at least 2 characters long."
   - Enter invalid email (e.g., "notanemail") → Click "Create Account" → Error: "Please enter a valid email address."
   - Enter password with 5 characters → Click "Create Account" → Error: "Password must be at least 6 characters long."
3. **Expected outcome**: Appropriate error message displayed below each field; form not submitted

**Scenario 3: Duplicate Email Prevention**

1. Register first user: "user1@example.com"
2. Attempt to register second user with same email
3. **Expected outcome**: Error message "This email is already registered."
4. Try with uppercase variation: "User1@Example.com" → Same error (case-insensitive check)

**Scenario 4: Password Visibility Toggle**

1. Open registration form
2. Password field shows masked input (bullets/dots)
3. Click "Show" button next to password field
4. Password characters become visible
5. Click "Hide" button
6. Password characters become masked again
7. **Expected outcome**: Toggle works smoothly, focus maintained on password field

**Verification Checklist**:
- [ ] User registration succeeds with valid data
- [ ] User data persists in localStorage as JSON
- [ ] User remains logged in across page refreshes
- [ ] Validation errors display for all required conditions
- [ ] Duplicate emails rejected with clear message
- [ ] Email comparison is case-insensitive
- [ ] Password appears hashed in localStorage (not plaintext)
- [ ] Password visibility toggle works correctly
- [ ] Page redirects to dashboard/home on successful registration

---

## Next Steps

1. **Phase 2**: Run `/speckit-tasks` to generate dependency-ordered task list for implementation
2. **Implementation**: Execute tasks in order to build registration feature
3. **Review**: Ensure all acceptance criteria from spec.md are met



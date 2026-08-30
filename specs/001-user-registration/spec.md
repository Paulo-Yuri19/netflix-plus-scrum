# Feature Specification: User Registration

**Feature Branch**: `001-user-registration`

**Created**: 2026-08-29

**Status**: Draft

**Input**: User description: "Implementar a US-001 — Cadastro de Usuário do Netflix+. Permitir que um visitante crie uma conta informando nome, e-mail e senha. Priorize uma implementação frontend simples com HTML, CSS e JavaScript puro."

---

## Clarifications

### Session 2026-08-29

- Q: After successful registration, should users be auto-logged in or shown a confirmation message? → A: Auto-login the user after successful registration and redirect to dashboard/home.
- Q: Should passwords be hashed/encrypted on client side or stored as plain text? → A: Use client-side hashing library (bcryptjs) for MVP to establish secure practices early.
- Q: Should registration form provide a "Show Password" toggle or always mask password? → A: Provide optional "Show Password" toggle button; password masked by default, revealed on demand.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Creates Account (Priority: P1)

A visitor to the Netflix+ platform wants to create an account so they can access the streaming service. They need to provide their personal information (name, email, password) and complete the registration process successfully.

**Why this priority**: This is the foundational feature that enables all other platform functionality. Without user registration, no one can access the service. Blocking all other features (login, profiles, content viewing, subscription management).

**Independent Test**: Can be fully tested by navigating to the registration form, entering name, email, and password, and successfully creating an account. This delivers core value: a functional way to onboard new users.

**Acceptance Scenarios**:

1. **Given** a visitor is on the registration page, **When** they enter a valid name (2+ characters), email (valid format), and password (6+ characters), and click "Create Account", **Then** the account is created successfully, the user is automatically logged in, and they are redirected to the dashboard/home page.

2. **Given** a visitor has created an account and is auto-logged in, **When** they refresh the page, **Then** their account data persists, they remain logged in, and they see the dashboard/home page.

3. **Given** a visitor tries to register with an email that already exists, **When** they click "Create Account", **Then** an error message is shown: "This email is already registered."

4. **Given** a visitor leaves a required field empty, **When** they click "Create Account", **Then** an error message is shown: "This field is required."

5. **Given** a visitor enters an invalid email format (e.g., "notanemail"), **When** they click "Create Account", **Then** an error message is shown: "Please enter a valid email address."

6. **Given** a visitor enters a password with fewer than 6 characters, **When** they click "Create Account", **Then** an error message is shown: "Password must be at least 6 characters long."

7. **Given** a visitor enters a name with only 1 character, **When** they click "Create Account", **Then** an error message is shown: "Name must be at least 2 characters long."

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a registration form with fields for name, email, and password.

- **FR-002**: System MUST validate that all three fields (name, email, password) are filled before submission.

- **FR-003**: System MUST validate email format (must contain @ and domain).

- **FR-004**: System MUST validate that name has at least 2 characters.

- **FR-005**: System MUST validate that password has at least 6 characters.

- **FR-006**: System MUST check if an email is already registered and prevent duplicate registrations.

- **FR-007**: System MUST hash passwords using bcryptjs before storing user data in browser storage. User data (name, email, hashed password) MUST persist across sessions.

- **FR-008**: System MUST display error messages when validation fails.

- **FR-009**: System MUST provide a "Show Password" toggle button next to the password field. When toggled, the password input type switches between `password` (masked) and `text` (visible); default state is masked.

### Key Entities

- **User Account**: Represents a registered user with:
  - `name`: User's full name (2+ characters)
  - `email`: User's email address (valid format, must be unique)
  - `password`: User's password (6+ characters), hashed using bcryptjs before storage

---

## Success Criteria *(mandatory)*

### Feature Completion

- **SC-001**: User can successfully register with a valid name, email, and password.

- **SC-002**: User data is persisted in browser storage and available in subsequent sessions.

- **SC-003**: Invalid inputs are rejected with appropriate error messages.

---

## Assumptions

- **Scope**: This feature implements registration only; login (US-002) and profile creation (US-006) are separate User Stories.

- **Storage**: User data is stored in browser storage (localStorage). No backend database or server is required.

- **Validation**: All validation is performed on the client side before account creation.

- **Password Hashing**: Passwords are hashed using bcryptjs (client-side) before storage to establish secure practices from the MVP phase. This prevents cleartext exposure and aligns with production-ready patterns.

- **Email Uniqueness**: Enforced by checking existing accounts in browser storage.

---

## Edge Cases

- **Empty localStorage**: If localStorage is cleared, the system allows new registrations (no pre-existing data to check).

- **Email case sensitivity**: Email "User@Example.com" and "user@example.com" should be treated as the same account (case-insensitive comparison).

---

## Dependencies & Related User Stories

- **Depends on**: None (foundational feature)
- **Required by**: 
  - US-002 (Login) — Users need registered accounts to log in
  - US-006 (Create Profile) — Users need accounts before creating profiles

---

## Acceptance Criteria Checklist for Implementation

When implementing this specification, verify:

- [ ] Registration form has name, email, and password fields
- [ ] All required fields must be filled before submission
- [ ] Validation rules are enforced: name ≥ 2 chars, email format valid, password ≥ 6 chars
- [ ] "Show Password" toggle button is present and functional; password masked by default
- [ ] Passwords are hashed using bcryptjs before storage
- [ ] Duplicate email prevention works
- [ ] Error messages display for validation failures
- [ ] User data (including hashed password) persists in browser storage across sessions
- [ ] Implementation uses only HTML, CSS, JavaScript, and bcryptjs library

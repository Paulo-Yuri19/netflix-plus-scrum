# Feature Specification: User Login

**Feature Branch**: `002-user-login`

**Created**: 2026-08-30

**Status**: Draft

**Input**: User description: "Implementar a US-002 — Login de Usuário do Netflix+. Permitir que usuários cadastrados façam login utilizando e-mail e senha. Priorize uma implementação simples com HTML, CSS e JavaScript puro, mantendo o escopo adequado a um projeto acadêmico demonstrativo e evitando tecnologias ou abstrações desnecessárias."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Email/Password Login (Priority: P1)

A registered user wants to log into their Netflix+ account using their email and password credentials. This is the core login flow and must work independently as a complete, testable feature that delivers immediate value.

**Why this priority**: This is the foundational login capability. Without it, users cannot access their accounts. It directly supports the User Registration feature (001) by enabling account access.

**Independent Test**: Can be fully tested by navigating to the login page, entering valid registered user credentials (email + password), and verifying that:
  - The form submission succeeds
  - User is authenticated and the session is established
  - User is redirected to a post-login page or dashboard
  - This delivers the core value: authenticated access for registered users

**Acceptance Scenarios**:

1. **Given** a user has registered with email "user@example.com" and password "password123", **When** they navigate to the login page and submit their credentials, **Then** they are authenticated and redirected to a dashboard or home page

2. **Given** a user is on the login page, **When** they enter valid credentials and click "Log In", **Then** a success message appears or the page transitions (no error shown)

3. **Given** a valid login has occurred, **When** the user navigates to protected pages (e.g., profile), **Then** they remain authenticated without re-entering credentials

---

### User Story 2 - Invalid Credentials Error Handling (Priority: P2)

A user attempts to log in with incorrect credentials. The system must clearly inform them that the login failed and allow them to retry.

**Why this priority**: Error handling is critical for user experience and security. Users must receive immediate feedback when credentials are wrong, and the system must prevent brute-force attacks by limiting attempts. This story is P2 because it enhances the P1 flow.

**Independent Test**: Can be fully tested by attempting login with invalid email or password combinations and verifying:
  - An error message appears (e.g., "Invalid email or password")
  - The page remains on the login form (does not redirect)
  - User can retry with different credentials
  - After multiple failed attempts (e.g., 5), the account is temporarily locked

**Acceptance Scenarios**:

1. **Given** a user enters an email that does not exist, **When** they submit the login form, **Then** an error message displays: "Invalid email or password"

2. **Given** a user enters a correct email but wrong password, **When** they submit the form, **Then** an error message displays: "Invalid email or password" (does not specify which field is wrong)

3. **Given** a user has failed 5 login attempts in 15 minutes, **When** they attempt a 6th login, **Then** the system displays "Account temporarily locked. Try again in 15 minutes" and rejects the attempt

4. **Given** an error message is displayed, **When** the user clicks on the email input field, **Then** the error message clears and they can retry

---

### User Story 3 - Session Persistence and Logout (Priority: P2)

A logged-in user expects their session to persist across page reloads within a reasonable time window. They also want to log out when finished.

**Why this priority**: P2 because session management is essential for usability but the basic login (P1) can work without this. Users must not be forced to re-login on every page load, and must have a way to end their session securely.

**Independent Test**: Can be fully tested by:
  - Logging in, then reloading the page and verifying the user remains logged in
  - Reloading after 24 hours and verifying the session expires with re-login required
  - Clicking "Log Out" and verifying return to login page with session cleared

**Acceptance Scenarios**:

1. **Given** a user is logged in, **When** they refresh the page or navigate to other pages in the app, **Then** they remain logged in without re-entering credentials

2. **Given** a user logged in 24 hours ago, **When** they return to the app, **Then** their session has expired and they are redirected to the login page with a message: "Your session has expired. Please log in again"

3. **Given** a logged-in user, **When** they click the "Log Out" button, **Then** their session is cleared and they are redirected to the login page

4. **Given** a user has logged out, **When** they press the back button, **Then** they are not able to access protected pages (redirected to login)

---

### Edge Cases

- What happens when a user tries to log in with an empty email or password field? (Form should show validation error)
- What happens if a user submits the login form multiple times rapidly? (System should debounce/throttle to prevent spam)
- What if a user manually enters a protected page URL without being logged in? (Redirect to login with a return-to URL so they can go back after logging in)
- What happens if the user's data was deleted between registration and login attempt? (Display "Invalid email or password" consistently)
- What happens on very slow networks when the login request takes several seconds? (Show a loading state; disable submit button until response received)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a login form with email and password input fields
- **FR-002**: System MUST validate that email and password fields are not empty before submission
- **FR-003**: System MUST verify submitted email and password against registered user data
- **FR-004**: System MUST reject login attempts with an error message if credentials are invalid
- **FR-005**: System MUST track failed login attempts per email address
- **FR-006**: System MUST temporarily lock an account after 5 failed login attempts within 15 minutes
- **FR-007**: System MUST create and maintain a session token upon successful login
- **FR-008**: System MUST persist the session token in browser storage (localStorage) for session continuity
- **FR-009**: System MUST validate the session token on each page load to determine if user is logged in
- **FR-010**: System MUST clear the session token and terminate the session when user clicks "Log Out"
- **FR-011**: System MUST automatically expire sessions after 24 hours of inactivity
- **FR-012**: System MUST redirect unauthenticated users to the login page when they attempt to access protected content
- **FR-013**: System MUST display a "Log Out" button on protected pages when user is logged in

### Key Entities

- **User**: Represents a registered account with email, password (hashed), and creation timestamp. Attributes: id, email, password_hash, created_at.
- **Session**: Represents an active user authentication session with token, creation time, and expiration time. Attributes: token, user_id, created_at, expires_at. Stored in browser localStorage.
- **LoginAttempt**: Tracks failed login attempts to prevent brute-force attacks. Attributes: email, attempt_timestamp, count (within 15-minute window).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can log in with valid credentials in under 2 seconds (from form submission to redirect)
- **SC-002**: 95% of login attempts with valid credentials succeed on first try
- **SC-003**: Error messages appear immediately (under 500ms) for invalid credentials
- **SC-004**: Session tokens persist across page reloads during the same browsing session
- **SC-005**: Logged-in users remain authenticated for at least 24 hours of inactivity before re-login is required
- **SC-006**: Account lockout after 5 failed attempts successfully prevents further login attempts for 15 minutes
- **SC-007**: Log Out functionality clears the session immediately; user cannot access protected pages after logout

## Assumptions

- Users have already registered accounts (feature 001-user-registration is available and functional)
- Registered user data (email, password) is stored in browser localStorage or a simple JSON file (no external database required, per project constitution)
- Session management uses browser localStorage for storing authentication tokens (no backend session storage)
- Password validation is case-sensitive
- Email addresses are stored and matched case-insensitively (e.g., "User@Example.com" = "user@example.com")
- The login form is implemented with HTML, CSS, and vanilla JavaScript per project constitution
- Session tokens are simple, unique strings (no JWT or complex cryptography required for academic project)
- The project does not use authentication libraries or frameworks (no passport.js, etc.)
- Temporary account lockouts are stored in sessionStorage and reset when the browser closes (no persistent lockout across sessions for simplicity)
- No multi-factor authentication, social login, or password recovery are required for this feature
- The login page is accessible to all users (no role-based access to the login form itself)

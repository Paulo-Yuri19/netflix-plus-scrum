# Tasks: User Registration (001-user-registration)

**Feature**: User Registration for Netflix+ platform  
**Branch**: `001-user-registration`  
**Status**: Ready for Implementation  
**Created**: 2026-08-29

**Input**: Design documents from `specs/001-user-registration/`:
- spec.md (user stories, acceptance criteria)
- plan.md (tech stack, project structure, implementation patterns)
- data-model.md (User entity, validation rules)
- research.md (completed research tasks)
- contracts/form-contract.md (HTML form structure)
- quickstart.md (validation/test scenarios)

**Organization**: Tasks are grouped by implementation phase to enable structured, testable delivery:
1. Setup: Project initialization and shared infrastructure
2. Foundational: Core features and utilities blocking user story implementation
3. User Story 1: New User Creates Account (Priority: P1) — primary feature delivery
4. Polish: Documentation and cross-cutting concerns

**Tests**: Integration tests included based on acceptance scenarios from spec.md. Test writing is part of each phase.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic file structure

**Checklist**:

- [ ] T001 Create project directory structure per plan.md in repository root
- [ ] T002 [P] Create `src/pages/register.html` stub file for registration page
- [ ] T003 [P] Create `src/styles/register.css` stub file for form styling
- [ ] T004 [P] Create `src/scripts/register.js` stub file for form logic
- [ ] T005 [P] Create `src/lib/auth.js` stub file for authentication utilities
- [ ] T006 Install bcryptjs dependency via NPM or include via CDN in `src/pages/register.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before User Story 1 implementation can proceed

**⚠️ CRITICAL**: User Story 1 work cannot begin until this phase is complete

**Checklist**:

- [ ] T007 Implement localStorage API utilities in `src/lib/auth.js`: loadUsers(), saveUser(), findUserByEmail(), getLoggedInUser(), setLoggedInUser(), clearLoggedInUser()
- [ ] T008 [P] Implement password hashing function in `src/lib/auth.js`: hashPassword(password) using bcryptjs.hash()
- [ ] T009 [P] Implement password verification function in `src/lib/auth.js`: verifyPassword(password, hash) using bcryptjs.compare()
- [ ] T010 [P] Implement form field validation functions in `src/lib/auth.js`: validateName(), validateEmail(), validatePassword() per data-model.md rules
- [ ] T011 Set up basic HTML structure in `src/pages/register.html`: DOCTYPE, head, body with form container
- [ ] T012 [P] Set up CSS base styles in `src/styles/register.css`: form layout, input styling, error message styling
- [ ] T013 Implement bcryptjs library loading in `src/pages/register.html`: via CDN or npm

**Checkpoint**: Foundation utilities and structure ready — User Story 1 implementation can now proceed

---

## Phase 3: User Story 1 - New User Creates Account (Priority: P1) 🎯 MVP

**Goal**: Enable a visitor to register a Netflix+ account by providing name, email, and password. After successful registration, the user is automatically logged in and redirected to the dashboard.

**Independent Test**: Can be fully tested by:
1. Opening `src/pages/register.html` in browser
2. Entering valid name (2+ chars), email (valid format), password (6+ chars)
3. Clicking "Create Account" → account created, user auto-logged in, redirected to dashboard
4. Refreshing page → user remains logged in (session persists)

**Acceptance Scenarios** (from spec.md):

1. ✓ Valid registration with auto-login and redirect
2. ✓ Session persistence across page refreshes
3. ✓ Duplicate email prevention
4. ✓ Required field validation
5. ✓ Email format validation
6. ✓ Password length validation
7. ✓ Name length validation

### Tests for User Story 1

**Note**: Tests are REQUIRED for this feature (based on spec.md acceptance scenarios). Write tests FIRST; ensure they FAIL before implementation.

- [ ] T014 [P] [US1] Create integration test file `tests/register.test.js` with test structure and imports
- [ ] T015 [P] [US1] Implement test: User can register with valid name, email, password in `tests/register.test.js`
- [ ] T016 [P] [US1] Implement test: User data persists in localStorage after registration in `tests/register.test.js`
- [ ] T017 [P] [US1] Implement test: User auto-logged in after registration (currentUser set) in `tests/register.test.js`
- [ ] T018 [P] [US1] Implement test: Registration form clears after successful submission in `tests/register.test.js`
- [ ] T019 [P] [US1] Implement test: Duplicate email rejection with error message in `tests/register.test.js`
- [ ] T020 [P] [US1] Implement test: Empty name field shows error "This field is required." in `tests/register.test.js`
- [ ] T021 [P] [US1] Implement test: Name with 1 character shows error "Name must be at least 2 characters long." in `tests/register.test.js`
- [ ] T022 [P] [US1] Implement test: Invalid email format shows error "Please enter a valid email address." in `tests/register.test.js`
- [ ] T023 [P] [US1] Implement test: Empty email field shows error "This field is required." in `tests/register.test.js`
- [ ] T024 [P] [US1] Implement test: Password < 6 characters shows error "Password must be at least 6 characters long." in `tests/register.test.js`
- [ ] T025 [P] [US1] Implement test: Empty password field shows error "This field is required." in `tests/register.test.js`
- [ ] T026 [P] [US1] Implement test: Password stored as bcrypt hash, not plaintext in `tests/register.test.js`
- [ ] T027 [P] [US1] Implement test: Show/Hide password toggle works correctly in `tests/register.test.js`

**⚠️ Test Checkpoint**: All tests should FAIL at this point. Implementation proceeds in next section.

### Implementation for User Story 1

#### HTML Form Structure

- [ ] T028 [US1] Build registration form HTML in `src/pages/register.html` per form-contract.md: form id="register-form", novalidate attribute
- [ ] T029 [US1] Implement name input field in `src/pages/register.html`: type="text", id="name", name="name", required, minlength="2", maxlength="100", with error container
- [ ] T030 [US1] Implement email input field in `src/pages/register.html`: type="email", id="email", name="email", required, autocomplete="email", with error container
- [ ] T031 [US1] Implement password input field in `src/pages/register.html`: type="password", id="password", name="password", required, minlength="6", with error container
- [ ] T032 [US1] Implement password visibility toggle in `src/pages/register.html`: button id="toggle-password", type="button", next to password field
- [ ] T033 [US1] Implement submit button in `src/pages/register.html`: type="submit", id="submit-button", text="Create Account"
- [ ] T034 [US1] Add CSS styling for success/error states in `src/styles/register.css`: error message visibility, error input highlighting (red border/background)

#### Form Validation Logic

- [ ] T035 [US1] Implement form submission handler in `src/scripts/register.js`: event listener on #register-form submit, prevent default form submission
- [ ] T036 [US1] Implement validation flow in `src/scripts/register.js`: call validateName(), validateEmail(), validatePassword(), display errors or proceed to registration
- [ ] T037 [US1] Implement error message display in `src/scripts/register.js`: clear previous errors, show error text in field-specific error containers, highlight invalid fields with CSS class
- [ ] T038 [US1] Implement name field validation in `src/scripts/register.js`: required, 2-100 character range, error messages per data-model.md

#### User Account Creation

- [ ] T039 [US1] Implement user account creation flow in `src/scripts/register.js`: hash password, generate UUID for user id, create User object with id, name, email, passwordHash, createdAt
- [ ] T040 [US1] Implement user registration in `src/scripts/register.js`: call saveUser() to persist account to localStorage via auth.js
- [ ] T041 [US1] Implement auto-login in `src/scripts/register.js`: call setLoggedInUser() to set current session (without passwordHash in stored session)

#### Form Interaction Features

- [ ] T042 [US1] Implement password visibility toggle in `src/scripts/register.js`: button click toggles input type between "password" and "text", button text changes between "Show" and "Hide"
- [ ] T043 [US1] Implement form reset after successful registration in `src/scripts/register.js`: clear all input fields, clear all error messages
- [ ] T044 [US1] Implement redirect to dashboard in `src/scripts/register.js`: navigate to dashboard.html after successful registration (or landing page if dashboard not available)

#### Session Initialization

- [ ] T045 [US1] Implement form initialization in `src/scripts/register.js`: check if user already logged in via getLoggedInUser(), redirect to dashboard if already authenticated
- [ ] T046 [US1] Implement session restoration in `src/scripts/register.js`: on page load, restore currentUser from localStorage and update page state

#### Email Validation Enhancement

- [ ] T047 [US1] Implement email format validation in `src/lib/auth.js`: regex pattern /^[^\s@]+@[^\s@]+\.[^\s@]+$/ to validate email structure
- [ ] T048 [US1] Implement email uniqueness check in `src/lib/auth.js`: case-insensitive comparison using email.toLowerCase() in findUserByEmail()
- [ ] T049 [US1] Implement email trimming in `src/lib/auth.js`: remove leading/trailing whitespace before validation and storage

#### Password Security

- [ ] T050 [US1] Ensure password hashing before storage in `src/scripts/register.js`: never store plaintext password, hash via hashPassword() before creating User object
- [ ] T051 [US1] Verify bcryptjs cost factor in `src/lib/auth.js`: hashPassword() uses cost factor 10 per research.md findings
- [ ] T052 [US1] Implement password maximum length validation in `src/scripts/register.js`: 128 character limit (bcryptjs constraint), error message "Password must be at most 128 characters long."

**Checkpoint**: User Story 1 fully implemented. Manual testing against quickstart.md scenarios should pass. Run automated tests:

```bash
npm test tests/register.test.js  # All tests should PASS
```

Verify in browser console (prerequisites from quickstart.md):
- User data stored in localStorage['netflix_users'] as User object
- Password stored as bcrypt hash (starts with `$2b$`), not plaintext
- CurrentUser session set in localStorage['netflix_current_user']
- Form redirects to dashboard/home page
- Page refresh preserves logged-in state

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting user experience and code quality

**Checklist**:

- [ ] T053 [P] Add form styling improvements in `src/styles/register.css`: focus states, hover states, button animation, responsive layout for mobile
- [ ] T054 [P] Add accessibility features in `src/pages/register.html`: proper label associations, ARIA attributes if needed, keyboard navigation support
- [ ] T055 [P] Add input field trimming in `src/scripts/register.js`: trim whitespace from name, email before validation
- [ ] T056 [P] Add loading state during password hashing in `src/scripts/register.js`: display "Creating account..." message while bcryptjs.hash() executes (visible for slow devices)
- [ ] T057 Add success message or toast notification in `src/scripts/register.js`: brief visual feedback "Account created successfully" before redirect
- [ ] T058 [P] Add unit tests for auth.js utilities in `tests/auth.test.js`: test validateName(), validateEmail(), validatePassword(), hashPassword(), verifyPassword(), loadUsers(), saveUser()
- [ ] T059 Add comprehensive documentation in `README.md`: feature overview, setup instructions, how to test, how to extend for login feature
- [ ] T060 [P] Run quickstart.md validation scenarios manually: verify all test scenarios pass in browser
- [ ] T061 Add error handling for localStorage quota exceeded in `src/lib/auth.js`: catch exception if localStorage.setItem() fails, display user-friendly error
- [ ] T062 [P] Test cross-browser compatibility: Chrome, Firefox, Safari, Edge (bcryptjs, localStorage, ES6 compatibility)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS all user stories
    ↓
Phase 3 (User Story 1 - New User Creates Account) ← PRIMARY FEATURE
    ↓
Phase 4 (Polish)
```

### Phase 2 Dependencies

All tasks in Phase 2 are BLOCKING for Phase 3. The following tasks have internal dependencies:

- **T007-T010**: Can run in parallel; all must complete before T011-T013
- **T011-T013**: Can run in parallel; all must complete before T014+

### Phase 3 Dependencies (User Story 1 Tests)

Tests (T014-T027) should be written FIRST and all should FAIL before implementation begins:

- **T014-T027** (Test Tasks): Can run in parallel in development; all must exist before implementation starts
- All tests must FAIL after T014-T027 and BEFORE T028

### Phase 3 Dependencies (User Story 1 Implementation)

- **HTML Structure (T028-T034)**: Can run in parallel; must complete before form logic (T035+)
- **Validation Logic (T035-T038)**: Depends on T007-T010 (auth.js utilities) and T028-T034 (HTML)
- **Account Creation (T039-T041)**: Depends on T035-T038 (validation) and T007-T010 (auth.js)
- **Interaction Features (T042-T046)**: Can run in parallel; depends on HTML structure (T028-T034) and validation (T035-T038)
- **Email Validation (T047-T049)**: Must complete by T036 (form validation calls this)
- **Password Security (T050-T052)**: Must complete by T039 (account creation calls this)

### Phase 3 Dependencies Summary

```
T007-T010 (Auth Utilities)
    ↓
T028-T034 (HTML Structure) → [can run parallel to T007-T010]
    ↓
T035-T038 (Validation) ← [BLOCKS account creation]
    ↓
T039-T041 (Account Creation)
T042-T046 (Interaction Features)
    ↓
T047-T052 (Email/Password Enhancement) ← [must finish by T036]
    ↓
[Tests T014-T027 should all PASS]
```

### Phase 4 Dependencies

- T053-T062 can run in parallel
- T060 (quickstart validation) should run last to verify full feature works

### Within Each Task

Each task is designed as a complete, atomic work item that can be completed independently in a single coding session (~30-60 minutes). Tasks reference exact file paths and implementation requirements.

---

## Parallel Execution Examples

### Example 1: Fast MVP Delivery (Single Developer)

```
T001-T005 (Setup) → 30 min
T007-T013 (Foundational) → 1 hr (T007 + T008-T010 in parallel, then T011-T013 in parallel)
T028-T034 (HTML) → 45 min (all in parallel)
T035-T038 (Validation) → 1 hr
T039-T041 (Account Creation) → 45 min
T042-T046 (Interaction) → 1 hr (all in parallel)
T047-T052 (Email/Password) → 30 min
Tests T014-T027 run → All PASS ✓
T053-T062 (Polish) → 1.5 hrs (most in parallel)

Total: ~7 hours (realistic 1 developer, 1 working day)
```

### Example 2: Optimized Parallel Development (Multiple Developers)

**Team**: 3 developers (A, B, C)

**Timeline**:

- **Parallel Path 1 (Developer A)**: T001-T005 (Setup) → T014-T027 (Write Tests)
- **Parallel Path 2 (Developer B)**: T007-T010 (Auth Utilities, Validation)
- **Parallel Path 3 (Developer C)**: T011-T013 (HTML Structure & CSS)

After Phase 2 complete:

- **Developer A**: T028-T034 (HTML Form - wait for C to finish T013)
- **Developer B**: T035-T038 (Validation Logic)
- **Developer C**: T047-T049 (Email Validation)

Then:

- **All**: T039-T041, T042-T046 (Account Creation & Interaction)

Finally:

- **All**: T050-T052 (Password Security) → Run Tests → All PASS ✓
- **All**: T053-T062 (Polish in parallel)

**Total Timeline**: ~4 hours (with 3 developers in parallel) vs. 7 hours (1 developer)

---

## Implementation Strategy

### MVP Scope

**Deliver in Sprint**: All of Phase 1 + Phase 2 + Phase 3 (User Story 1 implementation)

**MVP = Fully Functional Registration Feature**:
- ✓ User can register with name, email, password
- ✓ Form validation with error messages
- ✓ Password hashing with bcryptjs
- ✓ Auto-login after registration
- ✓ Session persistence across page refreshes
- ✓ Browser-based storage (no backend)

**Polish (Phase 4)** can be delivered in subsequent Sprint if time permits, but doesn't block MVP.

### Incremental Delivery within Phase 3

1. **T028-T034 + T035-T038**: Core form and basic validation → Basic feature working
2. **T039-T041 + T042-T046**: Account creation and interactions → Feature functionally complete
3. **T047-T052**: Email/password enhancements → Edge case handling complete
4. **T014-T027**: All tests PASS → Feature validated

### Testing Strategy

- **Test-Driven Development**: Write all tests in T014-T027 FIRST (should FAIL)
- **Implementation**: Write implementation code T028-T052
- **Validation**: Run tests again → all should PASS ✓
- **Manual Testing**: Follow quickstart.md scenarios to verify browser behavior
- **Integration Testing**: Verify session persistence, localStorage state, redirect flow end-to-end

### Risk Mitigation

- **bcryptjs Performance**: If hashing takes >200ms (rare), consider adding "Creating account..." loading indicator (T056)
- **localStorage Quota**: Unlikely to exceed 5MB quota for this feature (~1KB per user). Add error handling in T061 if needed.
- **Browser Compatibility**: Test on Chrome, Firefox, Safari, Edge (T062). bcryptjs works in all ES6+ browsers.
- **Email Validation**: Simple regex pattern in T047 may not catch all edge cases. Consider more robust pattern or external library in future User Stories.

---

## Acceptance Criteria Verification

When Phase 3 is complete, verify against spec.md acceptance criteria:

- [ ] User can register with valid name (2+ chars), email (valid format), password (6+ chars)
- [ ] User data persists in localStorage across sessions
- [ ] User auto-logged in after registration (currentUser session set)
- [ ] Duplicate email prevention works (error: "This email is already registered.")
- [ ] All validation errors display correctly (required, length, format)
- [ ] Password stored as bcrypt hash, not plaintext
- [ ] Show/Hide password toggle works
- [ ] Page refresh preserves logged-in state
- [ ] Form clears after successful registration
- [ ] User redirected to dashboard/home after registration

---

## Success Indicators

**Feature is DONE when**:

1. ✓ All Phase 1 tasks (T001-T006) complete
2. ✓ All Phase 2 tasks (T007-T013) complete
3. ✓ All Phase 3 implementation tasks (T028-T052) complete
4. ✓ All Phase 3 tests (T014-T027) PASS
5. ✓ Manual testing against quickstart.md scenarios succeeds
6. ✓ All acceptance criteria from spec.md verified
7. ✓ Code review approved (spec compliance, simplicity, no unnecessary complexity)
8. ✓ PR merged to main branch

**Polish (Phase 4) is optional** but recommended for production-ready UX.

---

## Files Modified/Created

```
src/
├── pages/
│   └── register.html        # Registration page
├── styles/
│   └── register.css         # Form styling
├── scripts/
│   └── register.js          # Form logic and validation
└── lib/
    └── auth.js              # Authentication utilities (storage, hashing, validation)

tests/
├── register.test.js         # Integration tests for registration feature
└── auth.test.js             # Unit tests for auth.js utilities (Phase 4)

specs/001-user-registration/
└── tasks.md                 # This file
```

---

## Task Checklist Format

Every task follows this format for clarity:

```
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Breakdown**:
- `- [ ]`: Markdown checkbox
- `[TaskID]`: Sequential ID (T001, T002, ..., T062)
- `[P]`: Optional parallelizable marker (tasks without this must be sequential)
- `[Story]`: Optional user story label (US1 for User Story 1, only in Phase 3)
- **Description**: Clear action with exact file paths

**Examples**:
- ✓ `- [ ] T001 Create project directory structure per plan.md in repository root`
- ✓ `- [ ] T035 [US1] Implement form submission handler in src/scripts/register.js: event listener...`
- ✓ `- [ ] T053 [P] Add form styling improvements in src/styles/register.css: focus states, hover states...`

---

**Ready for Implementation** ✓

All design documents are complete. Tasks are ordered by dependency and priority. Each task is specific enough for independent completion. Use these tasks to drive implementation via `/speckit-implement` command or manual execution.

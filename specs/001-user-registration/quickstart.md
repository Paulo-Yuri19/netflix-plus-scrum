# Quickstart: User Registration Validation Guide

**Created**: 2026-08-29  
**Feature**: User Registration (001-user-registration)  
**Purpose**: End-to-end validation scenarios that demonstrate feature works correctly

---

## Overview

This guide provides a set of practical validation scenarios for testing the user registration feature. Each scenario is independent and verifiable without requiring external services or backend infrastructure.

Use this guide to:
- Verify feature implementation meets acceptance criteria
- Test edge cases and error handling
- Validate browser storage persistence
- Confirm password hashing security practices

---

## Prerequisites

### Environment Setup

- **Browser**: Modern browser with JavaScript enabled (Chrome, Firefox, Safari, Edge)
- **Storage**: Browser must support localStorage (check: `typeof localStorage !== 'undefined'`)
- **Files**: Following files loaded and working:
  - `register.html` - Registration page
  - `register.css` - Form styling
  - `register.js` - Form logic and validation
  - `lib/auth.js` - Authentication utilities

### Initial State

Before each test scenario:
1. Clear browser localStorage to start fresh: `localStorage.clear()`
2. Close and reopen browser tab/window to reset session
3. Open `register.html` in browser
4. Form should be empty and ready for input

### Library Check

Verify bcryptjs is loaded:

```javascript
// In browser console:
typeof bcryptjs !== 'undefined'  // Should be: true
```

---

## Scenario 1: Successful Registration ✓

**Goal**: Verify user can create account with valid data and is auto-logged in.

**Steps**:

1. Open `register.html` in browser
2. Enter form data:
   - **Name**: `"Jane Smith"`
   - **Email**: `"jane.smith@example.com"`
   - **Password**: `"SecurePass123"` (at least 6 characters)
3. Click **"Create Account"** button
4. Observe form behavior:
   - No error messages displayed
   - Page redirects to dashboard/home page (e.g., `/dashboard.html`)
   - User remains logged in when page is refreshed

5. **Verification in browser console**:
   ```javascript
   // Check localStorage for user data
   const users = JSON.parse(localStorage.getItem('netflix_users'));
   console.log(users);  // Should contain Jane's user object
   
   // Check password is hashed (not plaintext)
   const jane = users.find(u => u.email === 'jane.smith@example.com');
   console.log(jane.passwordHash.startsWith('$2b$'));  // Should be: true (bcrypt hash)
   console.log(jane.passwordHash === 'SecurePass123');  // Should be: false (not plaintext)
   
   // Check current user is set
   const currentUser = JSON.parse(localStorage.getItem('netflix_current_user'));
   console.log(currentUser.email);  // Should be: "jane.smith@example.com"
   ```

**Expected Outcomes**:
- ✓ User account created in localStorage
- ✓ Password stored as bcrypt hash, not plaintext
- ✓ User auto-logged in (current_user session set)
- ✓ Page redirects to dashboard/home
- ✓ Refresh page → user still logged in

---

## Scenario 2: Session Persistence ✓

**Goal**: Verify user session persists across page refreshes.

**Prerequisites**: Scenario 1 completed (user registered and logged in)

**Steps**:

1. After successful registration, you're on dashboard/home page
2. Observe that user is logged in (e.g., name displayed in header)
3. **Refresh the page**: Press F5 or Cmd+R
4. Observe form behavior:
   - Dashboard/home page still displayed (not redirected to register)
   - User still logged in with same data
   - No need to re-login

5. **Verification in browser console**:
   ```javascript
   // Current user should persist after refresh
   const currentUser = JSON.parse(localStorage.getItem('netflix_current_user'));
   console.log(currentUser);  // Should contain logged-in user data
   ```

**Expected Outcomes**:
- ✓ User remains logged in after page refresh
- ✓ Dashboard/home page loads (registration page not shown)
- ✓ localStorage contains both users array and current_user session

---

## Scenario 3: Empty Required Fields ✗

**Goal**: Verify validation errors for empty required fields.

**Setup**: Clear localStorage, open `register.html`

**Steps** (test each field separately):

### 3a: Empty Name Field
1. Leave **Name** field empty
2. Fill **Email**: `"test@example.com"`
3. Fill **Password**: `"password123"`
4. Click **"Create Account"**
5. Observe error message below Name field: **"This field is required."**
6. Form does not submit; user remains on registration page

### 3b: Empty Email Field
1. Fill **Name**: `"John Doe"`
2. Leave **Email** field empty
3. Fill **Password**: `"password123"`
4. Click **"Create Account"**
5. Observe error message below Email field: **"This field is required."**
6. Form does not submit

### 3c: Empty Password Field
1. Fill **Name**: `"John Doe"`
2. Fill **Email**: `"john@example.com"`
3. Leave **Password** field empty
4. Click **"Create Account"**
5. Observe error message below Password field: **"This field is required."**
6. Form does not submit

**Verification**:
```javascript
// Verify no user was created
const users = JSON.parse(localStorage.getItem('netflix_users'));
console.log(users === null || users.length === 0);  // Should be: true
```

**Expected Outcomes**:
- ✓ Error message: "This field is required." for each empty field
- ✓ Error messages displayed below respective fields (red text)
- ✓ Form not submitted
- ✓ User remains on registration page
- ✓ No user created in localStorage

---

## Scenario 4: Name Validation ✗

**Goal**: Verify name field validation rules.

**Setup**: Clear localStorage, open `register.html`

### 4a: Name Too Short (1 character)
1. Enter form data:
   - **Name**: `"A"` (single character)
   - **Email**: `"alice@example.com"`
   - **Password**: `"password123"`
2. Click **"Create Account"**
3. Observe error message: **"Name must be at least 2 characters long."**
4. Form does not submit

### 4b: Name Valid (2 characters)
1. Enter form data:
   - **Name**: `"Jo"` (exactly 2 characters)
   - **Email**: `"jo@example.com"`
   - **Password**: `"password123"`
2. Click **"Create Account"**
3. Form should submit successfully (no error)

### 4c: Name with Whitespace Trimmed
1. Enter form data:
   - **Name**: `"  Bob Johnson  "` (with leading/trailing spaces)
   - **Email**: `"bob@example.com"`
   - **Password**: `"password123"`
2. Click **"Create Account"**
3. Form submits; user stored with name trimmed: `"Bob Johnson"` (no spaces)

**Expected Outcomes**:
- ✓ Single character name rejected with error
- ✓ 2+ character names accepted
- ✓ Whitespace trimmed from name before storage
- ✓ Error message clear and actionable

---

## Scenario 5: Email Validation ✗

**Goal**: Verify email field validation rules.

**Setup**: Clear localStorage, open `register.html`

### 5a: Invalid Email Format
1. Test various invalid email formats (all should fail):
   - `"notanemail"` (no @)
   - `"user@"` (no domain)
   - `"@example.com"` (no local part)
   - `"user @example.com"` (space in email)
2. Click **"Create Account"** for each
3. Observe error message: **"Please enter a valid email address."**

### 5b: Valid Email Format
1. Test valid email formats (all should pass):
   - `"user@example.com"`
   - `"john.doe+tag@sub.example.co.uk"`
   - `"a@b.c"` (minimal valid)
2. Click **"Create Account"**
3. Form submits successfully (if other fields valid)

### 5c: Email Case Insensitivity
1. Register first user with email: `"User@Example.com"`
2. Attempt to register second user with: `"user@example.com"`
3. Observe error message: **"This email is already registered."**
4. Verify case-insensitive comparison in console:
   ```javascript
   const users = JSON.parse(localStorage.getItem('netflix_users'));
   console.log(users[0].email);  // Should be lowercase: "user@example.com"
   ```

**Expected Outcomes**:
- ✓ Invalid email formats rejected with clear error
- ✓ Valid email formats accepted
- ✓ Email comparison is case-insensitive
- ✓ Duplicate emails prevented

---

## Scenario 6: Duplicate Email Prevention ✗

**Goal**: Verify system prevents duplicate email registration.

**Setup**: Register first user (Scenario 1), then attempt duplicate

**Steps**:

1. Clear localStorage and register first user:
   - **Name**: `"Alice"`
   - **Email**: `"alice@netflix.com"`
   - **Password**: `"password123"`
   - Form submits successfully; redirected to dashboard

2. Clear current user session (simulate logout):
   ```javascript
   // In console:
   localStorage.removeItem('netflix_current_user');
   ```

3. Open `register.html` again

4. Attempt to register with same email:
   - **Name**: `"Bob"`
   - **Email**: `"alice@netflix.com"` (same email)
   - **Password**: `"different123"`
   - Click **"Create Account"**

5. Observe error message: **"This email is already registered."**
6. Form does not submit; user remains on registration page

7. **Verify in console**:
   ```javascript
   const users = JSON.parse(localStorage.getItem('netflix_users'));
   console.log(users.length);  // Should be: 1 (only Alice)
   console.log(users[0].name);  // Should be: "Alice" (Bob not created)
   ```

**Expected Outcomes**:
- ✓ Duplicate email rejected with error message
- ✓ Only first user with that email exists in database
- ✓ Second registration attempt silently fails
- ✓ No exception or crash

---

## Scenario 7: Password Validation ✗

**Goal**: Verify password field validation rules.

**Setup**: Clear localStorage, open `register.html`

### 7a: Password Too Short
1. Enter form data:
   - **Name**: `"Charlie"`
   - **Email**: `"charlie@example.com"`
   - **Password**: `"pass"` (4 characters, < 6 required)
2. Click **"Create Account"**
3. Observe error message: **"Password must be at least 6 characters long."**

### 7b: Password Valid Length
1. Enter form data:
   - **Name**: `"Diana"`
   - **Email**: `"diana@example.com"`
   - **Password**: `"password"` (8 characters, ≥ 6 required)
2. Click **"Create Account"**
3. Form submits successfully (if other fields valid)

### 7c: Password Hashing Verification
1. Register user with password: `"MyPassword123"`
2. In browser console:
   ```javascript
   const users = JSON.parse(localStorage.getItem('netflix_users'));
   const user = users[0];
   
   // Verify password NOT stored plaintext
   console.log(user.passwordHash === 'MyPassword123');  // Should be: false
   
   // Verify password IS hashed with bcrypt
   console.log(user.passwordHash.startsWith('$2b$'));  // Should be: true
   
   // Verify can compare with bcryptjs.compare()
   await bcryptjs.compare('MyPassword123', user.passwordHash)
     .then(match => console.log(match));  // Should be: true
   ```

**Expected Outcomes**:
- ✓ Password < 6 characters rejected
- ✓ Password ≥ 6 characters accepted
- ✓ Password stored as bcrypt hash
- ✓ Password never stored as plaintext
- ✓ bcryptjs.compare() works with stored hash

---

## Scenario 8: Password Visibility Toggle ✓

**Goal**: Verify "Show" / "Hide" password toggle works correctly.

**Setup**: Open `register.html`

**Steps**:

1. Password field visible with **type="password"** (masked display)
   - Observe: Text is hidden as dots/bullets

2. Enter password: `"MySecret123"`
   - Observe: Characters displayed as dots, not plaintext

3. Click **"Show"** button next to password field
   - Observe: Button text changes to **"Hide"**
   - Observe: Password characters become visible: "MySecret123"
   - Observe: input type changed to **type="text"**

4. Click **"Hide"** button
   - Observe: Button text changes to **"Show"**
   - Observe: Password characters hidden again as dots
   - Observe: input type changed back to **type="password"**

5. Toggle multiple times to verify consistency

6. **Verify in console during toggle**:
   ```javascript
   const passwordField = document.getElementById('password');
   console.log(passwordField.type);  // "password" or "text" depending on toggle state
   ```

**Expected Outcomes**:
- ✓ Toggle button text updates correctly
- ✓ Password field type switches between "password" and "text"
- ✓ Password text visible when toggled to "text"
- ✓ Password text masked when toggled to "password"
- ✓ Toggle can be used multiple times without issues

---

## Scenario 9: Multiple User Accounts ✓

**Goal**: Verify system can store and manage multiple user accounts.

**Setup**: Clear localStorage, open `register.html`

**Steps**:

1. Register first user:
   - **Name**: `"User One"`
   - **Email**: `"user1@example.com"`
   - **Password**: `"password123"`
   - Submit successfully → redirected to dashboard

2. Simulate logout (clear current user):
   ```javascript
   localStorage.removeItem('netflix_current_user');
   ```

3. Navigate back to `register.html`

4. Register second user:
   - **Name**: `"User Two"`
   - **Email**: `"user2@example.com"`
   - **Password**: `"password456"`
   - Submit successfully → redirected to dashboard

5. Simulate logout again:
   ```javascript
   localStorage.removeItem('netflix_current_user');
   ```

6. Navigate back to `register.html`

7. Register third user:
   - **Name**: `"User Three"`
   - **Email**: `"user3@example.com"`
   - **Password**: `"password789"`
   - Submit successfully

8. **Verify in console**:
   ```javascript
   const users = JSON.parse(localStorage.getItem('netflix_users'));
   console.log(users.length);  // Should be: 3
   console.log(users.map(u => u.email));  
   // Should be: ["user1@example.com", "user2@example.com", "user3@example.com"]
   ```

**Expected Outcomes**:
- ✓ Multiple users stored in localStorage
- ✓ Each user has unique ID
- ✓ Each user has different email
- ✓ All user data persists
- ✓ No data loss between registrations

---

## Scenario 10: localStorage Quota Awareness ✓

**Goal**: Verify system handles large number of users gracefully.

**Note**: This is an informational scenario; quota not typically exceeded in normal MVP usage.

**Steps** (optional, for load testing):

1. Generate 100+ test users programmatically:
   ```javascript
   const users = [];
   for (let i = 0; i < 100; i++) {
     users.push({
       id: `uuid-${i}`,
       name: `User ${i}`,
       email: `user${i}@example.com`,
       passwordHash: await bcryptjs.hash('password123', 10),
       createdAt: new Date().toISOString()
     });
   }
   localStorage.setItem('netflix_users', JSON.stringify(users));
   ```

2. Attempt normal registration with new user

3. **Observe**:
   - Form still functions (if under quota)
   - No crash or error if quota not exceeded

**Expected Outcomes**:
- ✓ System handles large user lists without crashing
- ✓ Registration still works normally
- ✓ No silent data loss if quota approached

---

## Summary Checklist

**Core Functionality**:
- [ ] Scenario 1: Successful registration and auto-login
- [ ] Scenario 2: Session persistence across page refresh
- [ ] Scenario 8: Password visibility toggle

**Validation Errors**:
- [ ] Scenario 3: Empty required fields
- [ ] Scenario 4: Name validation (length, whitespace)
- [ ] Scenario 5: Email validation (format, duplicates)
- [ ] Scenario 7: Password validation (length, hashing)

**Edge Cases**:
- [ ] Scenario 6: Duplicate email prevention
- [ ] Scenario 9: Multiple user accounts
- [ ] Scenario 10: Large user list handling

**Security**:
- [ ] Password stored as bcrypt hash, not plaintext
- [ ] Email comparison is case-insensitive
- [ ] No sensitive data exposed in console/localStorage (except hash)

---

## Debugging Tips

### Check User Data in localStorage

```javascript
const users = JSON.parse(localStorage.getItem('netflix_users'));
console.table(users);  // Formatted table view
```

### Check Current User Session

```javascript
const currentUser = JSON.parse(localStorage.getItem('netflix_current_user'));
console.log(currentUser);
```

### Verify bcryptjs Loaded

```javascript
console.log(typeof bcryptjs);  // Should be: "object"
console.log(typeof bcryptjs.hash);  // Should be: "function"
console.log(typeof bcryptjs.compare);  // Should be: "function"
```

### Clear All Storage and Reset

```javascript
localStorage.clear();
location.reload();
```

### Test Password Hash

```javascript
const testHash = '$2b$10$...';  // Real hash from database
const password = 'test123';
await bcryptjs.compare(password, testHash)
  .then(match => console.log('Match:', match));
```

---

## Next Steps

1. **All scenarios passing?** → Feature ready for PR review
2. **Some failures?** → Review code against spec and data-model.md
3. **Edge cases discovered?** → Document and add to backlog for next sprint


# Registration Form Contract

**Version**: 1.0  
**Feature**: User Registration  
**Date**: 2026-08-29

---

## Overview

This document defines the HTML form structure that implements the user registration interface for Netflix+. The form contract specifies the expected DOM elements, attributes, and event flow.

---

## HTML Form Structure

### Root Form Element

```html
<form id="register-form" name="registerForm" novalidate>
  <!-- Form fields and controls -->
</form>
```

**Attributes**:
- `id="register-form"`: Unique identifier for JavaScript DOM queries
- `name="registerForm"`: Semantic form name
- `novalidate`: Disable browser native validation (custom validation implemented in JavaScript)

### Input Fields

#### Name Field

```html
<div class="form-group">
  <label for="name">Full Name</label>
  <input 
    type="text"
    id="name"
    name="name"
    placeholder="Enter your full name"
    required
    minlength="2"
    maxlength="100"
    autocomplete="name"
  >
  <div class="error-message" style="display: none;"></div>
</div>
```

**Field Specifications**:
- **Type**: `text`
- **ID**: `name` (used by JavaScript validation)
- **Name**: `name` (form field name)
- **Placeholder**: "Enter your full name" (visual cue)
- **Required**: Yes (HTML5 required attribute)
- **Min length**: 2 characters
- **Max length**: 100 characters
- **Autocomplete**: `name` (browser autocomplete hint)
- **Error container**: Empty div for validation error messages

#### Email Field

```html
<div class="form-group">
  <label for="email">Email Address</label>
  <input 
    type="email"
    id="email"
    name="email"
    placeholder="you@example.com"
    required
    autocomplete="email"
  >
  <div class="error-message" style="display: none;"></div>
</div>
```

**Field Specifications**:
- **Type**: `email` (semantic HTML5 email type)
- **ID**: `email` (used by JavaScript validation)
- **Name**: `email` (form field name)
- **Placeholder**: "you@example.com" (visual cue for valid format)
- **Required**: Yes
- **Autocomplete**: `email` (browser autocomplete hint)
- **Error container**: Empty div for validation error messages

#### Password Field

```html
<div class="form-group">
  <label for="password">Password</label>
  <div class="password-group">
    <input 
      type="password"
      id="password"
      name="password"
      placeholder="Enter a strong password"
      required
      minlength="6"
      maxlength="128"
      autocomplete="new-password"
    >
    <button 
      type="button"
      id="toggle-password"
      class="toggle-button"
      aria-label="Toggle password visibility"
    >
      Show
    </button>
  </div>
  <div class="error-message" style="display: none;"></div>
</div>
```

**Field Specifications**:
- **Type**: `password` (masked input, default state)
- **ID**: `password` (used by JavaScript validation and toggle)
- **Name**: `password` (form field name)
- **Placeholder**: "Enter a strong password"
- **Required**: Yes
- **Min length**: 6 characters
- **Max length**: 128 characters (bcryptjs limit)
- **Autocomplete**: `new-password` (browser hint for new password, prevents autofill of existing passwords)
- **Toggle button**:
  - Type: `button` (not submit)
  - ID: `toggle-password` (used for event listener)
  - Initial text: "Show"
  - ARIA label: "Toggle password visibility"
- **Error container**: Empty div for validation error messages

#### Submit Button

```html
<button 
  type="submit"
  id="submit-button"
  class="btn-primary"
  disabled
>
  Create Account
</button>
```

**Button Specifications**:
- **Type**: `submit` (submits the form)
- **ID**: `submit-button` (used for styling, optional JavaScript control)
- **Class**: `btn-primary` (styling)
- **Initial state**: May be disabled until form validation passes (optional enhancement)
- **Text**: "Create Account"

---

## Form Layout Example

```html
<div class="register-container">
  <h1>Create Your Netflix+ Account</h1>
  
  <form id="register-form" name="registerForm" novalidate>
    
    <div class="form-group">
      <label for="name">Full Name</label>
      <input type="text" id="name" name="name" placeholder="Enter your full name" required minlength="2" maxlength="100" autocomplete="name">
      <div class="error-message" style="display: none;"></div>
    </div>

    <div class="form-group">
      <label for="email">Email Address</label>
      <input type="email" id="email" name="email" placeholder="you@example.com" required autocomplete="email">
      <div class="error-message" style="display: none;"></div>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <div class="password-group">
        <input type="password" id="password" name="password" placeholder="Enter a strong password" required minlength="6" maxlength="128" autocomplete="new-password">
        <button type="button" id="toggle-password" class="toggle-button" aria-label="Toggle password visibility">Show</button>
      </div>
      <div class="error-message" style="display: none;"></div>
    </div>

    <button type="submit" id="submit-button" class="btn-primary">Create Account</button>

  </form>

  <div id="success-message" class="success-message" style="display: none;">
    Account created successfully! Redirecting...
  </div>
</div>
```

---

## Event Contract

### Form Submit Event

**Event**: `submit` on `#register-form`  
**Trigger**: User clicks submit button or presses Enter  
**Handler**: `handleRegistrationSubmit(event)`  
**Behavior**:
1. `event.preventDefault()` - Prevent default form submission
2. Clear previous error messages
3. Validate all fields
4. If valid: hash password, save user, log in user, redirect
5. If invalid: display error messages

### Password Toggle Event

**Event**: `click` on `#toggle-password`  
**Trigger**: User clicks "Show" / "Hide" button  
**Handler**: `togglePasswordVisibility(event)`  
**Behavior**:
1. `event.preventDefault()` - Prevent form submission
2. Toggle password field type: `password` ↔ `text`
3. Update button text: "Show" ↔ "Hide"
4. Maintain focus on password field

---

## CSS Classes Contract

The following CSS classes are used for styling and JavaScript state management:

| Class | Purpose | Applied To |
|-------|---------|-----------|
| `.register-container` | Main container for registration form | Outer div |
| `.form-group` | Wrapper for each form field | Field wrapper divs |
| `.password-group` | Flex container for password field and toggle button | Div wrapping password input + button |
| `.error-message` | Display area for validation errors | Hidden by default; shown when error occurs |
| `.invalid` | Indicates field has validation error | Input fields with errors (for CSS styling) |
| `.btn-primary` | Primary submit button styling | Submit button |
| `.toggle-button` | Styling for password visibility toggle | Toggle button |
| `.success-message` | Success message display (optional) | Success feedback div |

**CSS Styling Requirements** (see [register.css](../styles/register.css)):
- `.error-message`: Red text, smaller font, displayed below fields
- `.invalid`: Red border or background highlight
- `.toggle-button`: Secondary button appearance (gray background)
- `.btn-primary`: Primary button appearance (blue/green background)

---

## JavaScript API Contract

The registration module exposes the following functions:

### Core Functions

#### `initializeRegistration()`

Initialize the registration form by attaching event listeners.

```javascript
function initializeRegistration() {
  const form = document.getElementById('register-form');
  form.addEventListener('submit', handleRegistrationSubmit);
  
  const toggleButton = document.getElementById('toggle-password');
  toggleButton.addEventListener('click', togglePasswordVisibility);
  
  // Restore logged-in user if session exists
  const currentUser = getLoggedInUser();
  if (currentUser) {
    redirectToDashboard();
  }
}
```

**Called**: On page load (DOMContentLoaded)  
**Side effects**: Event listeners attached; session checked

#### `handleRegistrationSubmit(event)`

Handle form submission: validate, hash password, save user, log in, redirect.

```javascript
async function handleRegistrationSubmit(event) {
  event.preventDefault();
  
  clearErrors();

  // Validate fields
  const nameValidation = validateName(form.name.value);
  const emailValidation = validateEmail(form.email.value);
  const passwordValidation = await validatePassword(form.password.value);

  if (!nameValidation.valid || !emailValidation.valid || !passwordValidation.valid) {
    // Display errors and return
    return;
  }

  // Create user object
  const user = {
    id: generateUUID(),
    name: nameValidation.value,
    email: emailValidation.value,
    passwordHash: passwordValidation.value,
    createdAt: new Date().toISOString()
  };

  // Save user to storage
  saveUser(user);

  // Log in user (set current user)
  setCurrentUser(user);

  // Redirect to dashboard
  window.location.href = '/dashboard.html';
}
```

**Async**: Yes (password hashing is async)  
**Side effects**: User saved to localStorage; current user session set; page redirects

#### `togglePasswordVisibility(event)`

Toggle password field visibility between masked and plain text.

```javascript
function togglePasswordVisibility(event) {
  event.preventDefault();
  
  const passwordField = document.getElementById('password');
  const button = event.target;
  
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    button.textContent = 'Hide';
  } else {
    passwordField.type = 'password';
    button.textContent = 'Show';
  }
}
```

**Side effects**: Input type changed; button text updated

### Validation Functions

#### `validateName(name) → {valid: boolean, error?: string, value?: string}`

Validate name field according to requirements.

#### `validateEmail(email) → {valid: boolean, error?: string, value?: string}`

Validate email field and check uniqueness in user database.

#### `validatePassword(password) → {valid: boolean, error?: string, value?: string}`

Validate password and return bcryptjs hash (async).

### Storage Functions

#### `loadUsers() → User[]`

Load all registered users from localStorage.

#### `saveUser(user: User) → boolean`

Save user to localStorage.

#### `findUserByEmail(email: string) → User | null`

Find user by email (case-insensitive).

#### `setCurrentUser(user: User) → void`

Set currently logged-in user.

#### `getLoggedInUser() → User | null`

Get currently logged-in user (or null if not logged in).

---

## Accessibility Requirements

- All form fields have associated `<label>` elements
- Error messages linked to fields via aria-describedby (if enhanced)
- Toggle button has aria-label="Toggle password visibility"
- Password field uses autocomplete="new-password" for assistive technologies

---

## Browser Support

- Modern browsers supporting ES6 (Chrome 55+, Firefox 54+, Safari 10+, Edge 15+)
- localStorage API (all modern browsers)
- Flexbox for layout (all modern browsers)

---

## Next Steps

1. Implement HTML markup in `register.html`
2. Style with CSS in `register.css`
3. Implement JavaScript logic in `register.js`
4. Test all validation and toggle scenarios (see [quickstart.md](../quickstart.md))

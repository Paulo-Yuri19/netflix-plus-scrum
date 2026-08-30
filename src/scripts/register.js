/**
 * Registration Form Handler for Netflix+ User Registration
 * Manages form submission, validation, and user account creation
 */

/**
 * Generate a UUID v4
 * @returns {string} UUID v4 string
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Check if user is already logged in on page load
 */
function checkExistingSession() {
    const sessionResult = validateSession();
    if (sessionResult.status === 'valid') {
        // User is already logged in, redirect to dashboard
        window.location.assign('dashboard.html');
    }
}

/**
 * Display error message for a form field
 * @param {string} fieldId - Field ID (e.g., 'name', 'email', 'password')
 * @param {string} errorMessage - Error message to display
 */
function displayError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    field.classList.add('error');
    errorElement.textContent = errorMessage;
    errorElement.classList.add('show');
}

/**
 * Clear error message for a form field
 * @param {string} fieldId - Field ID to clear
 */
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    field.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

/**
 * Clear all form errors
 */
function clearAllErrors() {
    ['name', 'email', 'password'].forEach(fieldId => {
        clearError(fieldId);
    });
}

/**
 * Reset form fields
 */
function resetForm() {
    document.getElementById('register-form').reset();
    // Reset password field type to password
    document.getElementById('password').type = 'password';
    document.getElementById('toggle-password').textContent = 'Show';
}

/**
 * Handle password visibility toggle
 */
function setupPasswordToggle() {
    const toggleButton = document.getElementById('toggle-password');
    const passwordField = document.getElementById('password');
    
    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        const isPassword = passwordField.type === 'password';
        passwordField.type = isPassword ? 'text' : 'password';
        toggleButton.textContent = isPassword ? 'Hide' : 'Show';
    });
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearAllErrors();
    
    // Get form values and trim whitespace
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validate form fields
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
        displayError('name', nameValidation.error);
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        displayError('email', emailValidation.error);
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        displayError('password', passwordValidation.error);
    }
    
    // Stop if any validation failed
    if (!nameValidation.isValid || !emailValidation.isValid || !passwordValidation.isValid) {
        return;
    }
    
    // Check if email already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
        displayError('email', 'This email is already registered. Please use a different email.');
        return;
    }
    
    try {
        // Disable submit button during processing
        const submitButton = document.getElementById('submit-button');
        submitButton.disabled = true;
        submitButton.textContent = 'Creating account...';
        
        // Hash password
        const passwordHash = await hashPassword(password);
        
        // Create user object
        const user = {
            id: generateUUID(),
            name: name,
            email: email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
        };
        
        // Save user to storage
        saveUser(user);
        
        // Auto-login the user
        setLoggedInUser(user);
        
        // Show success message
        showSuccessMessage('Account created successfully! Redirecting to dashboard...');
        
        // Reset form
        resetForm();
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
            window.location.assign('dashboard.html');
        }, 1000);
        
    } catch (error) {
        console.error('Registration error:', error);
        displayError('email', 'Failed to create account. Please try again.');
        
        // Re-enable submit button
        const submitButton = document.getElementById('submit-button');
        submitButton.disabled = false;
        submitButton.textContent = 'Create Account';
    }
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccessMessage(message) {
    const form = document.getElementById('register-form');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background-color: #d4edda;
        color: #155724;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 20px;
        font-weight: 500;
        display: block;
    `;
    form.insertBefore(successDiv, form.firstChild);
}

/**
 * Initialize form event listeners
 */
function initializeForm() {
    const form = document.getElementById('register-form');
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Password toggle
    setupPasswordToggle();
    
    // Clear errors on field focus
    ['name', 'email', 'password'].forEach(fieldId => {
        document.getElementById(fieldId).addEventListener('focus', () => {
            clearError(fieldId);
        });
    });
}

/**
 * Initialize page when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
    initializeForm();
});

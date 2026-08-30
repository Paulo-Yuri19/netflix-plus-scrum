/**
 * Authentication Utilities for Netflix+ Registration
 * Handles user storage, password hashing, and session management
 */

const USERS_STORAGE_KEY = 'netflix_users';
const CURRENT_USER_STORAGE_KEY = 'netflix_current_user';

/**
 * Load all users from localStorage
 * @returns {Array} Array of user objects
 */
function loadUsers() {
    try {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error loading users:', error);
        return [];
    }
}

/**
 * Save a new user to localStorage
 * @param {Object} user - User object to save
 * @returns {Object} Saved user object
 */
function saveUser(user) {
    try {
        const users = loadUsers();
        users.push(user);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        return user;
    } catch (error) {
        console.error('Error saving user:', error);
        throw new Error('Failed to save user account. Storage may be full.');
    }
}

/**
 * Find user by email address (case-insensitive)
 * @param {string} email - Email to search for
 * @returns {Object|null} User object if found, null otherwise
 */
function findUserByEmail(email) {
    const users = loadUsers();
    const normalizedEmail = email.trim().toLowerCase();
    return users.find(user => user.email.toLowerCase() === normalizedEmail) || null;
}

/**
 * Get the currently logged-in user
 * @returns {Object|null} Current user object if logged in, null otherwise
 */
function getLoggedInUser() {
    try {
        const currentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
        return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Set the currently logged-in user
 * @param {Object} user - User object to set as current user
 */
function setLoggedInUser(user) {
    try {
        // Don't store password hash in session
        const { passwordHash, ...userSession } = user;
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userSession));
    } catch (error) {
        console.error('Error setting current user:', error);
        throw new Error('Failed to save session.');
    }
}

/**
 * Clear the currently logged-in user (logout)
 */
function clearLoggedInUser() {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

/**
 * Hash a password using bcryptjs
 * @param {string} password - Plaintext password to hash
 * @returns {Promise<string>} Promise that resolves to hashed password
 */
async function hashPassword(password) {
    try {
        const saltRounds = 10;
        return await bcryptjs.hash(password, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to process password.');
    }
}

/**
 * Verify a plaintext password against a bcrypt hash
 * @param {string} password - Plaintext password to verify
 * @param {string} hash - Bcrypt hash to compare against
 * @returns {Promise<boolean>} Promise that resolves to true if password matches, false otherwise
 */
async function verifyPassword(password, hash) {
    try {
        return await bcryptjs.compare(password, hash);
    } catch (error) {
        console.error('Error verifying password:', error);
        throw new Error('Failed to verify password.');
    }
}

/**
 * Validate name field
 * @param {string} name - Name to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
function validateName(name) {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
        return { isValid: false, error: 'This field is required.' };
    }
    
    if (trimmedName.length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters long.' };
    }
    
    if (trimmedName.length > 100) {
        return { isValid: false, error: 'Name must be at most 100 characters long.' };
    }
    
    return { isValid: true, error: null };
}

/**
 * Validate email field
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
function validateEmail(email) {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!trimmedEmail) {
        return { isValid: false, error: 'This field is required.' };
    }
    
    if (!emailRegex.test(trimmedEmail)) {
        return { isValid: false, error: 'Please enter a valid email address.' };
    }
    
    return { isValid: true, error: null };
}

/**
 * Validate password field
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
function validatePassword(password) {
    if (!password) {
        return { isValid: false, error: 'This field is required.' };
    }
    
    if (password.length < 6) {
        return { isValid: false, error: 'Password must be at least 6 characters long.' };
    }
    
    if (password.length > 128) {
        return { isValid: false, error: 'Password must be at most 128 characters long.' };
    }
    
    return { isValid: true, error: null };
}

// Export functions for Node.js/CommonJS environments (for testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadUsers,
        saveUser,
        findUserByEmail,
        getLoggedInUser,
        setLoggedInUser,
        clearLoggedInUser,
        hashPassword,
        verifyPassword,
        validateName,
        validateEmail,
        validatePassword,
    };
}

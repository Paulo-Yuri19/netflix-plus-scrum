/**
 * Profile Utilities for Netflix+ Profile Creation
 * Handles profile storage, per-account scoping, active-profile tracking,
 * and default avatar generation. Independent from auth.js (Constitution V).
 */

const PROFILES_STORAGE_KEY = 'netflix_profiles';
const ACTIVE_PROFILE_KEY_PREFIX = 'netflix_active_profile_';

// Small, fixed palette so default avatars stay simple (no images/uploads)
const AVATAR_COLORS = ['#e50914', '#0071eb', '#00a862', '#f5a623', '#8e44ad', '#16a2b8'];

/**
 * Load all profiles (across all accounts) from localStorage
 * @returns {Array} Array of profile objects
 */
function loadProfiles() {
    try {
        const profiles = localStorage.getItem(PROFILES_STORAGE_KEY);
        return profiles ? JSON.parse(profiles) : [];
    } catch (error) {
        console.error('Error loading profiles:', error);
        return [];
    }
}

/**
 * Save a new profile to localStorage
 * @param {Object} profile - Profile object to save
 * @returns {Object} Saved profile object
 */
function saveProfile(profile) {
    try {
        const profiles = loadProfiles();
        profiles.push(profile);
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
        return profile;
    } catch (error) {
        console.error('Error saving profile:', error);
        throw new Error('Failed to save profile. Storage may be full.');
    }
}

/**
 * Get all profiles belonging to a specific account
 * @param {string} accountId - The account's user id
 * @returns {Array} Profiles scoped to that account
 */
function getProfilesForAccount(accountId) {
    return loadProfiles().filter(profile => profile.accountId === accountId);
}

/**
 * Validate a profile name
 * @param {string} name - Name to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
function validateProfileName(name) {
    const trimmedName = (name || '').trim();

    if (!trimmedName) {
        return { isValid: false, error: 'This field is required.' };
    }

    return { isValid: true, error: null };
}

/**
 * Get the id of the active profile for an account
 * @param {string} accountId - The account's user id
 * @returns {string|null} Active profile id, or null if none set
 */
function getActiveProfileId(accountId) {
    try {
        return localStorage.getItem(ACTIVE_PROFILE_KEY_PREFIX + accountId) || null;
    } catch (error) {
        console.error('Error getting active profile:', error);
        return null;
    }
}

/**
 * Set the active profile id for an account
 * @param {string} accountId - The account's user id
 * @param {string} profileId - The profile id to mark as active
 */
function setActiveProfileId(accountId, profileId) {
    try {
        localStorage.setItem(ACTIVE_PROFILE_KEY_PREFIX + accountId, profileId);
    } catch (error) {
        console.error('Error setting active profile:', error);
        throw new Error('Failed to set active profile.');
    }
}

/**
 * Generate a deterministic default avatar for a profile name.
 * Same name always produces the same initial + color, no images needed.
 * @param {string} name - Profile name
 * @returns {Object} { initial: string, color: string }
 */
function generateDefaultAvatar(name) {
    const trimmedName = (name || '').trim();
    const initial = trimmedName ? trimmedName.charAt(0).toUpperCase() : '?';

    let hash = 0;
    for (let i = 0; i < trimmedName.length; i++) {
        hash = trimmedName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];

    return { initial, color };
}

// Export functions for Node.js/CommonJS environments (for testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadProfiles,
        saveProfile,
        getProfilesForAccount,
        validateProfileName,
        getActiveProfileId,
        setActiveProfileId,
        generateDefaultAvatar,
    };
}

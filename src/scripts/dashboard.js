/**
 * Dashboard (Profiles Screen) Handler for Netflix+
 * Renders the current account's profiles and handles creating a new one.
 */

/**
 * Generate a UUID v4 (same tiny helper used by register.js, kept local
 * per Constitution V — no shared "utils" module for a single function)
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
 * Redirect unauthenticated visitors to the login page (FR-002)
 * @returns {Object|null} The logged-in user, or null if redirected
 */
function requireAuthenticatedUser() {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
        window.location.href = '../pages/login.html';
        return null;
    }
    return currentUser;
}

/**
 * Build one profile card element
 * @param {Object} profile - Profile object
 * @param {boolean} isActive - Whether this profile is the active one
 * @returns {HTMLElement} The card element
 */
function buildProfileCard(profile, isActive) {
    const card = document.createElement('div');
    card.className = 'profile-card' + (isActive ? ' active' : '');

    const avatar = document.createElement('div');
    avatar.className = 'profile-avatar';
    avatar.style.backgroundColor = profile.avatar.color;
    avatar.textContent = profile.avatar.initial;

    const name = document.createElement('div');
    name.className = 'profile-name';
    name.textContent = profile.name;

    card.appendChild(avatar);
    card.appendChild(name);

    if (isActive) {
        const badge = document.createElement('div');
        badge.className = 'active-badge';
        badge.textContent = 'Active';
        card.appendChild(badge);
    }

    return card;
}

/**
 * Render every profile belonging to the account into the grid (FR-007/FR-008)
 * @param {string} accountId - The authenticated account's id
 */
function renderProfiles(accountId) {
    const grid = document.getElementById('profiles-grid');
    grid.innerHTML = '';

    const profiles = getProfilesForAccount(accountId);
    const activeProfileId = getActiveProfileId(accountId);

    if (profiles.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No profiles yet. Create your first one below.';
        grid.appendChild(emptyState);
        return;
    }

    profiles.forEach(profile => {
        grid.appendChild(buildProfileCard(profile, profile.id === activeProfileId));
    });
}

/**
 * Display error message for the profile name field
 * @param {string} errorMessage - Error message to display
 */
function displayError(errorMessage) {
    const field = document.getElementById('profile-name');
    const errorElement = document.getElementById('profile-name-error');

    field.classList.add('error');
    errorElement.textContent = errorMessage;
    errorElement.classList.add('show');
}

/**
 * Clear the profile name field error
 */
function clearError() {
    const field = document.getElementById('profile-name');
    const errorElement = document.getElementById('profile-name-error');

    field.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

/**
 * Handle create-profile form submission (FR-001/FR-003/FR-005/FR-008/FR-009)
 * @param {Object} account - The authenticated account
 */
function handleFormSubmit(e, account) {
    e.preventDefault();
    clearError();

    const nameInput = document.getElementById('profile-name');
    const name = nameInput.value.trim();

    const validation = validateProfileName(name);
    if (!validation.isValid) {
        displayError(validation.error);
        return;
    }

    const profile = {
        id: generateUUID(),
        accountId: account.id,
        name: name,
        avatar: generateDefaultAvatar(name),
        createdAt: new Date().toISOString(),
    };

    saveProfile(profile);
    setActiveProfileId(account.id, profile.id);

    document.getElementById('create-profile-form').reset();
    renderProfiles(account.id);
}

/**
 * Initialize page when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    const account = requireAuthenticatedUser();
    if (!account) {
        return;
    }

    renderProfiles(account.id);

    const form = document.getElementById('create-profile-form');
    form.addEventListener('submit', (e) => handleFormSubmit(e, account));

    document.getElementById('profile-name').addEventListener('focus', clearError);
});

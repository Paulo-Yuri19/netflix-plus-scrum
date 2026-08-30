/**
 * Shared browser-local authentication utilities for Netflix+.
 * The module stays usable as a plain browser script and through CommonJS in Jest.
 */

const USERS_STORAGE_KEY = 'netflix_users';
const CURRENT_USER_STORAGE_KEY = 'netflix_current_user';
const LOGIN_ATTEMPTS_STORAGE_KEY = 'netflix_login_attempts';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILURES = 5;

function normalizeEmail(email) {
    return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function safeReadJson(storage, key, fallback) {
    try {
        const rawValue = storage.getItem(key);
        if (rawValue === null) {
            return fallback;
        }
        return JSON.parse(rawValue);
    } catch (error) {
        return fallback;
    }
}

function safeWriteJson(storage, key, value) {
    try {
        storage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        return false;
    }
}

function loadUsers() {
    const users = safeReadJson(localStorage, USERS_STORAGE_KEY, []);
    return Array.isArray(users) ? users : [];
}

function saveUser(user) {
    const users = loadUsers();
    users.push(user);
    if (!safeWriteJson(localStorage, USERS_STORAGE_KEY, users)) {
        throw new Error('Failed to save user account. Storage may be full.');
    }
    return user;
}

function findUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    return loadUsers().find((user) => normalizeEmail(user.email) === normalizedEmail) || null;
}

function getLoggedInUser() {
    return safeReadJson(localStorage, CURRENT_USER_STORAGE_KEY, null);
}

function generateSessionToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function setLoggedInUser(user, now = new Date()) {
    const createdAt = now.toISOString();
    const userSession = {
        token: generateSessionToken(),
        userId: user.id,
        name: user.name,
        email: normalizeEmail(user.email),
        createdAt,
        lastActivityAt: createdAt,
        expiresAt: new Date(now.getTime() + SESSION_DURATION_MS).toISOString(),
    };

    if (!safeWriteJson(localStorage, CURRENT_USER_STORAGE_KEY, userSession)) {
        throw new Error('Failed to save session.');
    }
    return userSession;
}

function clearLoggedInUser() {
    try {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } catch (error) {
        return false;
    }
    return true;
}

function validateSession(now = new Date()) {
    let rawSession;
    try {
        rawSession = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    } catch (error) {
        clearLoggedInUser();
        return { status: 'invalid', session: null };
    }

    if (rawSession === null) {
        return { status: 'missing', session: null };
    }

    let session;
    try {
        session = JSON.parse(rawSession);
    } catch (error) {
        clearLoggedInUser();
        return { status: 'invalid', session: null };
    }

    const requiredStrings = ['token', 'userId', 'name', 'email', 'createdAt', 'lastActivityAt', 'expiresAt'];
    const hasRequiredFields = session
        && typeof session === 'object'
        && requiredStrings.every((field) => typeof session[field] === 'string' && session[field].length > 0)
        && session.password === undefined
        && session.passwordHash === undefined;
    const createdAt = hasRequiredFields ? Date.parse(session.createdAt) : NaN;
    const lastActivityAt = hasRequiredFields ? Date.parse(session.lastActivityAt) : NaN;
    const expiresAt = hasRequiredFields ? Date.parse(session.expiresAt) : NaN;
    const userExists = hasRequiredFields && loadUsers().some((user) => user.id === session.userId);

    if (!hasRequiredFields
        || !Number.isFinite(createdAt)
        || !Number.isFinite(lastActivityAt)
        || !Number.isFinite(expiresAt)
        || createdAt > lastActivityAt
        || lastActivityAt > now.getTime()
        || expiresAt - lastActivityAt !== SESSION_DURATION_MS
        || !userExists) {
        clearLoggedInUser();
        return { status: 'invalid', session: null };
    }

    if (expiresAt <= now.getTime()) {
        clearLoggedInUser();
        return { status: 'expired', session: null };
    }

    const refreshedSession = {
        ...session,
        lastActivityAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + SESSION_DURATION_MS).toISOString(),
    };

    if (!safeWriteJson(localStorage, CURRENT_USER_STORAGE_KEY, refreshedSession)) {
        clearLoggedInUser();
        return { status: 'invalid', session: null };
    }
    return { status: 'valid', session: refreshedSession };
}

function loadLoginAttempts() {
    const registry = safeReadJson(sessionStorage, LOGIN_ATTEMPTS_STORAGE_KEY, {});
    return registry && typeof registry === 'object' && !Array.isArray(registry) ? registry : {};
}

function getRetainedLoginFailures(email, now = new Date()) {
    const normalizedEmail = normalizeEmail(email);
    const registry = loadLoginAttempts();
    const attempts = Array.isArray(registry[normalizedEmail]) ? registry[normalizedEmail] : [];
    const nowTime = now.getTime();
    const retained = attempts.filter((timestamp) => {
        const attemptTime = Date.parse(timestamp);
        return Number.isFinite(attemptTime)
            && attemptTime <= nowTime
            && nowTime - attemptTime < LOGIN_ATTEMPT_WINDOW_MS;
    });

    if (retained.length > 0) registry[normalizedEmail] = retained;
    else delete registry[normalizedEmail];
    safeWriteJson(sessionStorage, LOGIN_ATTEMPTS_STORAGE_KEY, registry);
    return retained;
}

function getLoginFailureCount(email, now = new Date()) {
    return getRetainedLoginFailures(email, now).length;
}

function recordLoginFailure(email, now = new Date()) {
    const normalizedEmail = normalizeEmail(email);
    const registry = loadLoginAttempts();
    const retained = getRetainedLoginFailures(normalizedEmail, now);
    retained.push(now.toISOString());
    registry[normalizedEmail] = retained;

    if (!safeWriteJson(sessionStorage, LOGIN_ATTEMPTS_STORAGE_KEY, registry)) {
        return 0;
    }
    return retained.length;
}

function isLoginLocked(email, now = new Date()) {
    return getLoginFailureCount(email, now) >= MAX_LOGIN_FAILURES;
}

function clearLoginFailures(email) {
    const normalizedEmail = normalizeEmail(email);
    const registry = loadLoginAttempts();
    delete registry[normalizedEmail];
    return safeWriteJson(sessionStorage, LOGIN_ATTEMPTS_STORAGE_KEY, registry);
}

async function hashPassword(password) {
    try {
        return await getBcryptProvider().hash(password, 10);
    } catch (error) {
        throw new Error('Failed to process password.');
    }
}

async function verifyPassword(password, hash) {
    try {
        return await getBcryptProvider().compare(password, hash);
    } catch (error) {
        throw new Error('Failed to verify password.');
    }
}

function getBcryptProvider() {
    if (typeof bcryptjs !== 'undefined') return bcryptjs;
    if (typeof globalThis !== 'undefined' && globalThis.dcodeIO && globalThis.dcodeIO.bcrypt) {
        return globalThis.dcodeIO.bcrypt;
    }
    throw new Error('bcryptjs is unavailable.');
}

function validateName(name) {
    const trimmedName = name.trim();
    if (!trimmedName) return { isValid: false, error: 'This field is required.' };
    if (trimmedName.length < 2) return { isValid: false, error: 'Name must be at least 2 characters long.' };
    if (trimmedName.length > 100) return { isValid: false, error: 'Name must be at most 100 characters long.' };
    return { isValid: true, error: null };
}

function validateEmail(email) {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) return { isValid: false, error: 'This field is required.' };
    if (!emailRegex.test(trimmedEmail)) return { isValid: false, error: 'Please enter a valid email address.' };
    return { isValid: true, error: null };
}

function validatePassword(password) {
    if (!password) return { isValid: false, error: 'This field is required.' };
    if (password.length < 6) return { isValid: false, error: 'Password must be at least 6 characters long.' };
    if (password.length > 128) return { isValid: false, error: 'Password must be at most 128 characters long.' };
    return { isValid: true, error: null };
}

const authApi = {
    USERS_STORAGE_KEY,
    CURRENT_USER_STORAGE_KEY,
    LOGIN_ATTEMPTS_STORAGE_KEY,
    SESSION_DURATION_MS,
    LOGIN_ATTEMPT_WINDOW_MS,
    MAX_LOGIN_FAILURES,
    normalizeEmail,
    safeReadJson,
    safeWriteJson,
    loadUsers,
    saveUser,
    findUserByEmail,
    getLoggedInUser,
    generateSessionToken,
    setLoggedInUser,
    clearLoggedInUser,
    validateSession,
    loadLoginAttempts,
    getLoginFailureCount,
    recordLoginFailure,
    isLoginLocked,
    clearLoginFailures,
    hashPassword,
    verifyPassword,
    validateName,
    validateEmail,
    validatePassword,
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = authApi;
}

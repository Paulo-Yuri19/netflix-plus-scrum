jest.mock('bcryptjs', () => ({
    hash: jest.fn((password) => Promise.resolve(`$2b$10$mocked${password}salt`)),
    compare: jest.fn((password, hash) => Promise.resolve(hash === `$2b$10$mocked${password}salt`)),
}));

global.bcryptjs = require('bcryptjs');
const auth = require('../src/lib/auth.js');

const userFixture = (overrides = {}) => ({
    id: 'user-1',
    name: 'Test User',
    email: 'User@Example.com',
    passwordHash: '$2b$10$mockedpassword123salt',
    createdAt: '2026-08-29T12:00:00.000Z',
    ...overrides,
});

describe('authentication foundation', () => {
    test('exports the documented storage and timing constants', () => {
        expect(auth.USERS_STORAGE_KEY).toBe('netflix_users');
        expect(auth.CURRENT_USER_STORAGE_KEY).toBe('netflix_current_user');
        expect(auth.LOGIN_ATTEMPTS_STORAGE_KEY).toBe('netflix_login_attempts');
        expect(auth.SESSION_DURATION_MS).toBe(24 * 60 * 60 * 1000);
        expect(auth.LOGIN_ATTEMPT_WINDOW_MS).toBe(15 * 60 * 1000);
        expect(auth.MAX_LOGIN_FAILURES).toBe(5);
    });

    test('normalizes email by trimming and lowercasing', () => {
        expect(auth.normalizeEmail('  User@Example.COM ')).toBe('user@example.com');
        expect(auth.normalizeEmail(null)).toBe('');
    });

    test('safe JSON reads recover from missing, malformed, and unavailable storage', () => {
        expect(auth.safeReadJson(localStorage, 'missing', [])).toEqual([]);
        localStorage.setItem('bad', '{');
        expect(auth.safeReadJson(localStorage, 'bad', {})).toEqual({});
        localStorage.getItem.mockImplementationOnce(() => { throw new Error('blocked'); });
        expect(auth.safeReadJson(localStorage, 'bad', null)).toBeNull();
    });

    test('safe JSON writes report unavailable storage', () => {
        localStorage.setItem.mockImplementationOnce(() => { throw new Error('full'); });
        expect(auth.safeWriteJson(localStorage, 'key', {})).toBe(false);
    });

    test('preserves registration user storage and case-insensitive lookup', () => {
        auth.saveUser(userFixture());
        expect(auth.loadUsers()).toHaveLength(1);
        expect(auth.findUserByEmail(' user@example.COM ')).toMatchObject({ id: 'user-1' });
    });

    test('keeps existing field validators working', () => {
        expect(auth.validateName('')).toEqual({ isValid: false, error: 'This field is required.' });
        expect(auth.validateEmail('invalid')).toEqual({ isValid: false, error: 'Please enter a valid email address.' });
        expect(auth.validatePassword('12345')).toEqual({ isValid: false, error: 'Password must be at least 6 characters long.' });
    });
});

describe('US1 credential and session helpers', () => {
    test('verifies passwords case-sensitively with bcrypt', async () => {
        const user = userFixture();
        await expect(auth.verifyPassword('password123', user.passwordHash)).resolves.toBe(true);
        await expect(auth.verifyPassword('Password123', user.passwordHash)).resolves.toBe(false);
    });

    test('generates an opaque token with browser crypto', () => {
        const token = auth.generateSessionToken();
        expect(crypto.getRandomValues).toHaveBeenCalledTimes(1);
        expect(token).toMatch(/^[0-9a-f]{64}$/);
    });

    test('creates and stores a normalized password-free session', () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-08-30T12:00:00.000Z'));
        const session = auth.setLoggedInUser(userFixture({ password: 'never-store-this' }));
        const stored = JSON.parse(localStorage.getItem(auth.CURRENT_USER_STORAGE_KEY));

        expect(session).toEqual(stored);
        expect(stored).toMatchObject({
            userId: 'user-1',
            name: 'Test User',
            email: 'user@example.com',
            createdAt: '2026-08-30T12:00:00.000Z',
            lastActivityAt: '2026-08-30T12:00:00.000Z',
            expiresAt: '2026-08-31T12:00:00.000Z',
        });
        expect(stored.token).toHaveLength(64);
        expect(stored.password).toBeUndefined();
        expect(stored.passwordHash).toBeUndefined();
    });
});

describe('US2 rolling login attempts', () => {
    const start = new Date('2026-08-30T12:00:00.000Z');

    test('recovers from a malformed registry and records by normalized email', () => {
        sessionStorage.setItem(auth.LOGIN_ATTEMPTS_STORAGE_KEY, '{');
        expect(auth.recordLoginFailure(' User@Example.COM ', start)).toBe(1);
        expect(JSON.parse(sessionStorage.getItem(auth.LOGIN_ATTEMPTS_STORAGE_KEY))).toEqual({
            'user@example.com': ['2026-08-30T12:00:00.000Z'],
        });
    });

    test('prunes timestamps at least fifteen minutes old', () => {
        const email = 'user@example.com';
        auth.recordLoginFailure(email, new Date(start.getTime() - auth.LOGIN_ATTEMPT_WINDOW_MS));
        auth.recordLoginFailure(email, new Date(start.getTime() - auth.LOGIN_ATTEMPT_WINDOW_MS + 1));

        expect(auth.getLoginFailureCount(email, start)).toBe(1);
    });

    test('locks only submissions after five retained failures', () => {
        for (let index = 0; index < 5; index += 1) {
            const attemptTime = new Date(start.getTime() + index);
            expect(auth.isLoginLocked('user@example.com', attemptTime)).toBe(false);
            auth.recordLoginFailure('user@example.com', attemptTime);
        }
        expect(auth.isLoginLocked('user@example.com', new Date(start.getTime() + 5))).toBe(true);
    });

    test('clears only the successful email history', () => {
        auth.recordLoginFailure('first@example.com', start);
        auth.recordLoginFailure('second@example.com', start);
        auth.clearLoginFailures(' FIRST@example.com ');

        expect(auth.getLoginFailureCount('first@example.com', start)).toBe(0);
        expect(auth.getLoginFailureCount('second@example.com', start)).toBe(1);
    });
});

describe('US3 session lifecycle', () => {
    const loginTime = new Date('2026-08-30T12:00:00.000Z');

    beforeEach(() => {
        auth.saveUser(userFixture());
    });

    test('validates and refreshes a session by another 24 hours', () => {
        auth.setLoggedInUser(userFixture(), loginTime);
        const activityTime = new Date('2026-08-30T13:00:00.000Z');
        const result = auth.validateSession(activityTime);

        expect(result.status).toBe('valid');
        expect(result.session.lastActivityAt).toBe('2026-08-30T13:00:00.000Z');
        expect(result.session.expiresAt).toBe('2026-08-31T13:00:00.000Z');
        expect(auth.getLoggedInUser()).toEqual(result.session);
    });

    test('removes and reports a session expired by inactivity', () => {
        auth.setLoggedInUser(userFixture(), loginTime);
        const result = auth.validateSession(new Date('2026-08-31T12:00:00.000Z'));

        expect(result).toEqual({ status: 'expired', session: null });
        expect(auth.getLoggedInUser()).toBeNull();
    });

    test.each([
        ['malformed', '{'],
        ['missing required fields', JSON.stringify({ token: 'token' })],
    ])('removes an invalid %s session', (_label, storedValue) => {
        localStorage.setItem(auth.CURRENT_USER_STORAGE_KEY, storedValue);
        expect(auth.validateSession(loginTime)).toEqual({ status: 'invalid', session: null });
        expect(localStorage.getItem(auth.CURRENT_USER_STORAGE_KEY)).toBeNull();
    });

    test('removes a session whose expiry is not 24 hours after activity', () => {
        const session = auth.setLoggedInUser(userFixture(), loginTime);
        session.expiresAt = new Date(loginTime.getTime() + 1000).toISOString();
        localStorage.setItem(auth.CURRENT_USER_STORAGE_KEY, JSON.stringify(session));

        expect(auth.validateSession(loginTime)).toEqual({ status: 'invalid', session: null });
    });

    test('removes a session whose user no longer exists', () => {
        auth.setLoggedInUser(userFixture(), loginTime);
        localStorage.setItem(auth.USERS_STORAGE_KEY, '[]');

        expect(auth.validateSession(loginTime)).toEqual({ status: 'invalid', session: null });
        expect(auth.getLoggedInUser()).toBeNull();
    });

    test('logout removes the session immediately', () => {
        auth.setLoggedInUser(userFixture(), loginTime);
        expect(auth.clearLoggedInUser()).toBe(true);
        expect(auth.getLoggedInUser()).toBeNull();
    });
});

module.exports = { userFixture };

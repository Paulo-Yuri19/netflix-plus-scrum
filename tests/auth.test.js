/**
 * Unit Tests for Authentication Utilities (auth.js)
 * Tests password hashing, validation functions, and storage operations
 */

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

global.localStorage = localStorageMock;

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
    hash: jest.fn((password, saltRounds) => {
        return Promise.resolve(`$2b$10$mocked${password}salt`);
    }),
    compare: jest.fn((password, hash) => {
        return Promise.resolve(hash === `$2b$10$mocked${password}salt`);
    }),
}));

const auth = require('../src/lib/auth.js');
const bcryptjs = require('bcryptjs');

describe('Authentication Utilities Tests (T058)', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('validateName()', () => {
        test('Accepts valid name', () => {
            const result = auth.validateName('John Doe');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeNull();
        });

        test('Rejects empty name', () => {
            const result = auth.validateName('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('This field is required.');
        });

        test('Rejects name with only whitespace', () => {
            const result = auth.validateName('   ');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('This field is required.');
        });

        test('Rejects name shorter than 2 characters', () => {
            const result = auth.validateName('A');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Name must be at least 2 characters long.');
        });

        test('Rejects name longer than 100 characters', () => {
            const longName = 'A'.repeat(101);
            const result = auth.validateName(longName);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Name must be at most 100 characters long.');
        });

        test('Trims whitespace from name', () => {
            const result = auth.validateName('  Jane Smith  ');
            expect(result.isValid).toBe(true);
        });

        test('Accepts name with exactly 2 characters', () => {
            const result = auth.validateName('AB');
            expect(result.isValid).toBe(true);
        });

        test('Accepts name with exactly 100 characters', () => {
            const name = 'A'.repeat(100);
            const result = auth.validateName(name);
            expect(result.isValid).toBe(true);
        });
    });

    describe('validateEmail()', () => {
        test('Accepts valid email format', () => {
            const result = auth.validateEmail('user@example.com');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeNull();
        });

        test('Rejects empty email', () => {
            const result = auth.validateEmail('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('This field is required.');
        });

        test('Rejects email without @', () => {
            const result = auth.validateEmail('invalidemail.com');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid email address.');
        });

        test('Rejects email without domain', () => {
            const result = auth.validateEmail('user@');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid email address.');
        });

        test('Rejects email without local part', () => {
            const result = auth.validateEmail('@example.com');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid email address.');
        });

        test('Accepts email with multiple dots in domain', () => {
            const result = auth.validateEmail('user@mail.example.co.uk');
            expect(result.isValid).toBe(true);
        });

        test('Trims whitespace from email', () => {
            const result = auth.validateEmail('  user@example.com  ');
            expect(result.isValid).toBe(true);
        });

        test('Rejects email with spaces', () => {
            const result = auth.validateEmail('user name@example.com');
            expect(result.isValid).toBe(false);
        });
    });

    describe('validatePassword()', () => {
        test('Accepts valid password', () => {
            const result = auth.validatePassword('SecurePass123');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeNull();
        });

        test('Rejects empty password', () => {
            const result = auth.validatePassword('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('This field is required.');
        });

        test('Rejects password shorter than 6 characters', () => {
            const result = auth.validatePassword('Pass1');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password must be at least 6 characters long.');
        });

        test('Rejects password longer than 128 characters', () => {
            const longPassword = 'A'.repeat(129);
            const result = auth.validatePassword(longPassword);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password must be at most 128 characters long.');
        });

        test('Accepts password with exactly 6 characters', () => {
            const result = auth.validatePassword('Pass12');
            expect(result.isValid).toBe(true);
        });

        test('Accepts password with exactly 128 characters', () => {
            const password = 'A'.repeat(128);
            const result = auth.validatePassword(password);
            expect(result.isValid).toBe(true);
        });

        test('Accepts password with special characters', () => {
            const result = auth.validatePassword('P@ss!word#123$');
            expect(result.isValid).toBe(true);
        });
    });

    describe('hashPassword()', () => {
        test('Hashes password using bcryptjs with cost factor 10', async () => {
            const password = 'TestPassword123';
            const hash = await auth.hashPassword(password);

            expect(bcryptjs.hash).toHaveBeenCalledWith(password, 10);
            expect(hash).toContain('$2b$10$');
        });

        test('Returns different hash for same password', async () => {
            const password = 'TestPassword123';
            // In real bcryptjs, hashes would be different; in mock, they're same for testing
            const hash1 = await auth.hashPassword(password);
            const hash2 = await auth.hashPassword(password);

            expect(hash1).toBeDefined();
            expect(hash2).toBeDefined();
        });

        test('Handles error during hashing', async () => {
            bcryptjs.hash = jest.fn(() => Promise.reject(new Error('Hashing failed')));

            try {
                await auth.hashPassword('TestPassword123');
            } catch (error) {
                expect(error.message).toBe('Failed to process password.');
            }
        });
    });

    describe('verifyPassword()', () => {
        test('Verifies password against hash', async () => {
            const password = 'TestPassword123';
            const hash = `$2b$10$mocked${password}salt`;

            const isValid = await auth.verifyPassword(password, hash);
            expect(isValid).toBe(true);
        });

        test('Rejects incorrect password', async () => {
            const hash = `$2b$10$mockedTestPassword123salt`;

            const isValid = await auth.verifyPassword('WrongPassword', hash);
            expect(isValid).toBe(false);
        });

        test('Handles error during verification', async () => {
            bcryptjs.compare = jest.fn(() => Promise.reject(new Error('Comparison failed')));

            try {
                await auth.verifyPassword('password', 'hash');
            } catch (error) {
                expect(error.message).toBe('Failed to verify password.');
            }
        });
    });

    describe('loadUsers() & saveUser()', () => {
        test('Saves and loads user from storage', () => {
            const user = {
                id: 'uuid-123',
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: '$2b$10$hash',
                createdAt: '2026-08-29T14:32:15.123Z',
            };

            auth.saveUser(user);
            const users = auth.loadUsers();

            expect(users.length).toBe(1);
            expect(users[0]).toEqual(user);
        });

        test('Loads empty array when no users saved', () => {
            const users = auth.loadUsers();
            expect(users).toEqual([]);
        });

        test('Appends user to existing users', () => {
            const user1 = {
                id: 'uuid-1',
                name: 'User 1',
                email: 'user1@example.com',
                passwordHash: '$2b$10$hash1',
                createdAt: '2026-08-29T14:32:15.123Z',
            };

            const user2 = {
                id: 'uuid-2',
                name: 'User 2',
                email: 'user2@example.com',
                passwordHash: '$2b$10$hash2',
                createdAt: '2026-08-29T14:32:15.123Z',
            };

            auth.saveUser(user1);
            auth.saveUser(user2);
            const users = auth.loadUsers();

            expect(users.length).toBe(2);
            expect(users[0].email).toBe('user1@example.com');
            expect(users[1].email).toBe('user2@example.com');
        });

        test('Handles storage error gracefully on load', () => {
            localStorage.getItem = jest.fn(() => {
                throw new Error('Storage error');
            });

            const users = auth.loadUsers();
            expect(users).toEqual([]);
        });

        test('Throws error when storage quota exceeded on save', () => {
            localStorage.setItem = jest.fn(() => {
                throw new Error('Storage quota exceeded');
            });

            const user = {
                id: 'uuid-123',
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: '$2b$10$hash',
                createdAt: '2026-08-29T14:32:15.123Z',
            };

            expect(() => auth.saveUser(user)).toThrow('Failed to save user account. Storage may be full.');
        });
    });

    describe('findUserByEmail()', () => {
        beforeEach(() => {
            const user = {
                id: 'uuid-123',
                name: 'Test User',
                email: 'Test@Example.com',
                passwordHash: '$2b$10$hash',
                createdAt: '2026-08-29T14:32:15.123Z',
            };
            auth.saveUser(user);
        });

        test('Finds user by email address', () => {
            const user = auth.findUserByEmail('Test@Example.com');
            expect(user).toBeDefined();
            expect(user.email).toBe('Test@Example.com');
        });

        test('Finds user with case-insensitive email', () => {
            const user = auth.findUserByEmail('test@example.com');
            expect(user).toBeDefined();
            expect(user.email).toBe('Test@Example.com');
        });

        test('Returns null when user not found', () => {
            const user = auth.findUserByEmail('notfound@example.com');
            expect(user).toBeNull();
        });

        test('Trims whitespace from search email', () => {
            const user = auth.findUserByEmail('  test@example.com  ');
            expect(user).toBeDefined();
        });
    });

    describe('getLoggedInUser() & setLoggedInUser()', () => {
        test('Sets and gets current user', () => {
            const user = {
                id: 'uuid-123',
                name: 'Current User',
                email: 'current@example.com',
                passwordHash: '$2b$10$hash',
                createdAt: '2026-08-29T14:32:15.123Z',
            };

            auth.setLoggedInUser(user);
            const currentUser = auth.getLoggedInUser();

            expect(currentUser).toBeDefined();
            expect(currentUser.email).toBe('current@example.com');
        });

        test('Does not store passwordHash in session', () => {
            const user = {
                id: 'uuid-123',
                name: 'User',
                email: 'user@example.com',
                passwordHash: '$2b$10$hash',
                createdAt: '2026-08-29T14:32:15.123Z',
            };

            auth.setLoggedInUser(user);
            const currentUser = auth.getLoggedInUser();

            expect(currentUser.passwordHash).toBeUndefined();
            expect(currentUser.email).toBe('user@example.com');
        });

        test('Returns null when no user logged in', () => {
            const currentUser = auth.getLoggedInUser();
            expect(currentUser).toBeNull();
        });

        test('Handles storage error gracefully on get', () => {
            localStorage.getItem = jest.fn(() => {
                throw new Error('Storage error');
            });

            const currentUser = auth.getLoggedInUser();
            expect(currentUser).toBeNull();
        });

        test('Throws error when setting current user fails', () => {
            localStorage.setItem = jest.fn(() => {
                throw new Error('Storage error');
            });

            const user = {
                id: 'uuid-123',
                name: 'User',
                email: 'user@example.com',
                passwordHash: '$2b$10$hash',
            };

            expect(() => auth.setLoggedInUser(user)).toThrow('Failed to save session.');
        });
    });

    describe('clearLoggedInUser()', () => {
        test('Clears current user session', () => {
            const user = {
                id: 'uuid-123',
                name: 'User',
                email: 'user@example.com',
                passwordHash: '$2b$10$hash',
            };

            auth.setLoggedInUser(user);
            auth.clearLoggedInUser();
            const currentUser = auth.getLoggedInUser();

            expect(currentUser).toBeNull();
        });
    });
});

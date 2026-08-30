/**
 * Unit Tests for Profile Utilities (profile.js)
 * Tests profile validation, storage, per-account scoping, and default avatars
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

const profile = require('../src/lib/profile.js');

describe('Profile Utilities Tests', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('validateProfileName()', () => {
        // T011
        test('T011: rejects empty name', () => {
            const result = profile.validateProfileName('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('This field is required.');
        });

        // T011
        test('T011: rejects whitespace-only name', () => {
            const result = profile.validateProfileName('   ');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('This field is required.');
        });

        // T012
        test('T012: accepts a valid name', () => {
            const result = profile.validateProfileName('Kids');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeNull();
        });
    });

    describe('saveProfile() / loadProfiles() / getProfilesForAccount()', () => {
        // T013
        test('T013: saved profile persists and is scoped to its accountId', () => {
            const newProfile = {
                id: 'profile-1',
                accountId: 'account-1',
                name: 'Alex',
                avatar: { initial: 'A', color: '#e50914' },
                createdAt: '2026-08-30T10:00:00.000Z',
            };

            profile.saveProfile(newProfile);

            const allProfiles = profile.loadProfiles();
            expect(allProfiles.length).toBe(1);
            expect(allProfiles[0].name).toBe('Alex');

            const accountProfiles = profile.getProfilesForAccount('account-1');
            expect(accountProfiles.length).toBe(1);
            expect(accountProfiles[0].id).toBe('profile-1');
        });

        // T014
        test('T014: a different accountId never sees another account\'s profiles', () => {
            profile.saveProfile({
                id: 'profile-1',
                accountId: 'account-1',
                name: 'Alex',
                avatar: { initial: 'A', color: '#e50914' },
                createdAt: '2026-08-30T10:00:00.000Z',
            });

            const otherAccountProfiles = profile.getProfilesForAccount('account-2');
            expect(otherAccountProfiles.length).toBe(0);
        });

        // T016
        test('T016: creating a second profile keeps the first one intact', () => {
            profile.saveProfile({
                id: 'profile-1',
                accountId: 'account-1',
                name: 'Alex',
                avatar: { initial: 'A', color: '#e50914' },
                createdAt: '2026-08-30T10:00:00.000Z',
            });
            profile.saveProfile({
                id: 'profile-2',
                accountId: 'account-1',
                name: 'Sam',
                avatar: { initial: 'S', color: '#0071eb' },
                createdAt: '2026-08-30T10:05:00.000Z',
            });

            const accountProfiles = profile.getProfilesForAccount('account-1');
            expect(accountProfiles.length).toBe(2);
            expect(accountProfiles.map(p => p.name)).toEqual(['Alex', 'Sam']);
        });
    });

    describe('getActiveProfileId() / setActiveProfileId()', () => {
        // T015
        test('T015: newly created profile becomes the active profile', () => {
            expect(profile.getActiveProfileId('account-1')).toBeNull();

            profile.setActiveProfileId('account-1', 'profile-1');

            expect(profile.getActiveProfileId('account-1')).toBe('profile-1');
        });

        test('active profile is scoped per account', () => {
            profile.setActiveProfileId('account-1', 'profile-1');
            expect(profile.getActiveProfileId('account-2')).toBeNull();
        });
    });

    describe('generateDefaultAvatar()', () => {
        // T017
        test('T017: is deterministic for the same name', () => {
            const first = profile.generateDefaultAvatar('Alex');
            const second = profile.generateDefaultAvatar('Alex');

            expect(first).toEqual(second);
            expect(first.initial).toBe('A');
        });

        test('produces an uppercase initial from a lowercase name', () => {
            const avatar = profile.generateDefaultAvatar('sam');
            expect(avatar.initial).toBe('S');
        });
    });
});

global.bcryptjs = { hash: jest.fn(), compare: jest.fn() };
const auth = require('../src/lib/auth.js');
const dashboard = require('../src/scripts/dashboard.js');

const renderDashboard = () => {
    document.body.innerHTML = `
        <main id="protected-content" hidden>
            <span id="user-name"></span>
            <button id="logout-button" type="button">Log Out</button>
        </main>`;
};

const user = {
    id: 'user-1',
    name: 'Test User',
    email: 'user@example.com',
    passwordHash: 'hash',
    createdAt: '2026-08-29T12:00:00.000Z',
};

describe('US3 protected dashboard', () => {
    beforeEach(() => {
        renderDashboard();
        auth.saveUser(user);
    });

    test('reveals protected content, renders safely, and refreshes valid activity', () => {
        auth.setLoggedInUser(user, new Date('2026-08-30T12:00:00.000Z'));
        const navigate = jest.fn();
        dashboard.initializeDashboard({
            auth,
            document,
            navigate,
            now: () => new Date('2026-08-30T13:00:00.000Z'),
            eventTarget: window,
        });

        expect(document.getElementById('protected-content').hidden).toBe(false);
        expect(document.getElementById('user-name').textContent).toBe('Test User');
        expect(auth.getLoggedInUser().expiresAt).toBe('2026-08-31T13:00:00.000Z');
        expect(navigate).not.toHaveBeenCalled();
    });

    test('redirects a missing session with a safe return target', () => {
        const navigate = jest.fn();
        dashboard.initializeDashboard({ auth, document, navigate, now: () => new Date(), eventTarget: window });
        expect(navigate).toHaveBeenCalledWith('login.html?returnTo=dashboard.html');
        expect(document.getElementById('protected-content').hidden).toBe(true);
    });

    test('redirects an expired session with the expiry indicator', () => {
        auth.setLoggedInUser(user, new Date('2026-08-29T12:00:00.000Z'));
        const navigate = jest.fn();
        dashboard.initializeDashboard({
            auth,
            document,
            navigate,
            now: () => new Date('2026-08-31T12:00:00.000Z'),
            eventTarget: window,
        });
        expect(navigate).toHaveBeenCalledWith('login.html?returnTo=dashboard.html&expired=1');
    });

    test('logout clears storage and Back/pageshow rechecks protection', () => {
        auth.setLoggedInUser(user, new Date());
        const navigate = jest.fn();
        const controller = dashboard.initializeDashboard({ auth, document, navigate, now: () => new Date(), eventTarget: window });

        document.getElementById('logout-button').click();
        expect(auth.getLoggedInUser()).toBeNull();
        expect(navigate).toHaveBeenCalledWith('login.html');

        navigate.mockClear();
        controller.guard();
        expect(navigate).toHaveBeenCalledWith('login.html?returnTo=dashboard.html');
    });
});

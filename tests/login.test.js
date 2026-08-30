jest.mock('bcryptjs', () => ({
    compare: jest.fn((password, hash) => Promise.resolve(hash === `$2b$10$mocked${password}salt`)),
    hash: jest.fn(),
}));

global.bcryptjs = require('bcryptjs');
const bcryptjs = global.bcryptjs;
const auth = require('../src/lib/auth.js');
const login = require('../src/scripts/login.js');

const renderLogin = () => {
    document.body.innerHTML = `
        <form id="login-form" novalidate>
            <input id="email" name="email" type="email" required>
            <span id="email-error"></span>
            <input id="password" name="password" type="password" required>
            <span id="password-error"></span>
            <div id="login-status" role="alert"></div>
            <button id="submit-button" type="submit">Log In</button>
        </form>`;
};

const seedUser = () => auth.saveUser({
    id: 'user-1',
    name: 'Test User',
    email: 'user@example.com',
    passwordHash: '$2b$10$mockedpassword123salt',
    createdAt: '2026-08-29T12:00:00.000Z',
});

describe('US1 login form', () => {
    beforeEach(() => {
        renderLogin();
        bcryptjs.compare.mockImplementation((password, hash) => Promise.resolve(hash === `$2b$10$mocked${password}salt`));
    });

    test('shows required errors without comparing credentials', async () => {
        const navigate = jest.fn();
        const controller = login.initializeLogin({ auth, document, navigate, search: '' });
        await controller.handleSubmit({ preventDefault: jest.fn() });

        expect(document.getElementById('email-error').textContent).toBe('This field is required.');
        expect(document.getElementById('password-error').textContent).toBe('This field is required.');
        expect(bcryptjs.compare).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
    });

    test('logs in a registered user and navigates to the dashboard', async () => {
        seedUser();
        const navigate = jest.fn();
        const controller = login.initializeLogin({ auth, document, navigate, search: '' });
        document.getElementById('email').value = ' User@Example.COM ';
        document.getElementById('password').value = 'password123';

        await controller.handleSubmit({ preventDefault: jest.fn() });

        expect(bcryptjs.compare).toHaveBeenCalledTimes(1);
        expect(JSON.parse(localStorage.getItem('netflix_current_user'))).toMatchObject({
            userId: 'user-1',
            email: 'user@example.com',
        });
        expect(document.getElementById('login-status').textContent).toBe('');
        expect(navigate).toHaveBeenCalledWith('dashboard.html');
    });

    test('blocks duplicate submissions while password comparison is pending', async () => {
        seedUser();
        let resolveComparison;
        bcryptjs.compare.mockImplementation(() => new Promise((resolve) => { resolveComparison = resolve; }));
        const controller = login.initializeLogin({ auth, document, navigate: jest.fn(), search: '' });
        document.getElementById('email').value = 'user@example.com';
        document.getElementById('password').value = 'password123';
        const event = { preventDefault: jest.fn() };

        const first = controller.handleSubmit(event);
        const second = controller.handleSubmit(event);

        expect(document.getElementById('submit-button').disabled).toBe(true);
        expect(document.getElementById('submit-button').textContent).toBe('Logging in...');
        expect(bcryptjs.compare).toHaveBeenCalledTimes(1);
        resolveComparison(true);
        await Promise.all([first, second]);
    });
});

describe('US2 invalid credentials and lockout', () => {
    beforeEach(() => {
        renderLogin();
        bcryptjs.compare.mockImplementation((password, hash) => Promise.resolve(hash === `$2b$10$mocked${password}salt`));
    });

    const submit = async (controller, email, password) => {
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
        await controller.handleSubmit({ preventDefault: jest.fn() });
    };

    test('uses the same retryable message for unknown email and wrong password', async () => {
        const navigate = jest.fn();
        const controller = login.initializeLogin({ auth, document, navigate, search: '' });
        await submit(controller, 'missing@example.com', 'password123');
        expect(document.getElementById('login-status').textContent).toBe('Invalid email or password');
        expect(navigate).not.toHaveBeenCalled();

        seedUser();
        await submit(controller, 'user@example.com', 'wrong-password');
        expect(document.getElementById('login-status').textContent).toBe('Invalid email or password');
        expect(navigate).not.toHaveBeenCalled();

        document.getElementById('password').focus();
        expect(document.getElementById('login-status').textContent).toBe('');
    });

    test('records five failures and rejects the sixth before bcrypt comparison', async () => {
        seedUser();
        const controller = login.initializeLogin({ auth, document, navigate: jest.fn(), search: '' });

        for (let attempt = 0; attempt < 5; attempt += 1) {
            await submit(controller, ' USER@example.com ', 'wrong-password');
        }
        expect(bcryptjs.compare).toHaveBeenCalledTimes(5);

        await submit(controller, 'user@example.com', 'password123');
        expect(document.getElementById('login-status').textContent).toBe('Account temporarily locked. Try again in 15 minutes');
        expect(bcryptjs.compare).toHaveBeenCalledTimes(5);
    });

    test('clears failures after a successful retry', async () => {
        seedUser();
        const controller = login.initializeLogin({ auth, document, navigate: jest.fn(), search: '' });
        await submit(controller, 'user@example.com', 'wrong-password');
        expect(auth.getLoginFailureCount('user@example.com')).toBe(1);

        await submit(controller, 'user@example.com', 'password123');
        expect(auth.getLoginFailureCount('user@example.com')).toBe(0);
    });
});

describe('cross-cutting login navigation contract', () => {
    beforeEach(renderLogin);

    test.each([
        ['', 'dashboard.html'],
        ['?returnTo=dashboard.html', 'dashboard.html'],
        ['?returnTo=https%3A%2F%2Fevil.example', 'dashboard.html'],
        ['?returnTo=%2F%2Fevil.example', 'dashboard.html'],
        ['?returnTo=register.html', 'dashboard.html'],
    ])('allowlists the return target from %s', (search, expected) => {
        expect(login.getSafeReturnTarget(search)).toBe(expected);
    });

    test('shows the exact expired-session message from the internal indicator', () => {
        login.initializeLogin({ auth, document, navigate: jest.fn(), search: '?expired=1&returnTo=dashboard.html' });
        expect(document.getElementById('login-status').textContent).toBe('Your session has expired. Please log in again');
    });
});

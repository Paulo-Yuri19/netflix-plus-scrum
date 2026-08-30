const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
const LOCKOUT_MESSAGE = 'Account temporarily locked. Try again in 15 minutes';
const EXPIRED_SESSION_MESSAGE = 'Your session has expired. Please log in again';
const DEFAULT_LOGIN_TARGET = 'dashboard.html';
const ALLOWED_RETURN_TARGETS = new Set([DEFAULT_LOGIN_TARGET]);

function getSafeReturnTarget(search = '') {
    const requestedTarget = new URLSearchParams(search).get('returnTo');
    return ALLOWED_RETURN_TARGETS.has(requestedTarget) ? requestedTarget : DEFAULT_LOGIN_TARGET;
}

function initializeLogin(options = {}) {
    const auth = options.auth || getBrowserAuthApi();
    const pageDocument = options.document || document;
    const navigate = options.navigate || ((target) => window.location.assign(target));
    const search = options.search !== undefined ? options.search : window.location.search;
    const form = pageDocument.getElementById('login-form');

    if (!form) return null;

    const emailInput = pageDocument.getElementById('email');
    const passwordInput = pageDocument.getElementById('password');
    const emailError = pageDocument.getElementById('email-error');
    const passwordError = pageDocument.getElementById('password-error');
    const status = pageDocument.getElementById('login-status');
    const submitButton = pageDocument.getElementById('submit-button');
    let isSubmitting = false;

    const clearFieldError = (input, errorElement) => {
        input.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
    };

    const showFieldError = (input, errorElement, message) => {
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
    };

    const clearFeedback = () => {
        clearFieldError(emailInput, emailError);
        clearFieldError(passwordInput, passwordError);
        status.textContent = '';
    };

    const setLoading = (loading) => {
        submitButton.disabled = loading;
        submitButton.textContent = loading ? 'Logging in...' : 'Log In';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        clearFeedback();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        let hasRequiredError = false;

        if (!email) {
            showFieldError(emailInput, emailError, 'This field is required.');
            hasRequiredError = true;
        }
        if (!password) {
            showFieldError(passwordInput, passwordError, 'This field is required.');
            hasRequiredError = true;
        }
        if (hasRequiredError) return;

        const normalizedEmail = auth.normalizeEmail(email);
        if (auth.isLoginLocked && auth.isLoginLocked(normalizedEmail)) {
            status.textContent = LOCKOUT_MESSAGE;
            return;
        }

        isSubmitting = true;
        setLoading(true);
        let didNavigate = false;

        try {
            const user = auth.findUserByEmail(normalizedEmail);
            const isValid = Boolean(user) && await auth.verifyPassword(password, user.passwordHash);

            if (!isValid) {
                if (auth.recordLoginFailure) auth.recordLoginFailure(normalizedEmail);
                status.textContent = INVALID_CREDENTIALS_MESSAGE;
                return;
            }

            if (auth.clearLoginFailures) auth.clearLoginFailures(normalizedEmail);
            auth.setLoggedInUser(user);
            didNavigate = true;
            navigate(getSafeReturnTarget(search));
        } catch (error) {
            status.textContent = INVALID_CREDENTIALS_MESSAGE;
        } finally {
            isSubmitting = false;
            if (!didNavigate) setLoading(false);
        }
    };

    [
        [emailInput, emailError],
        [passwordInput, passwordError],
    ].forEach(([input, errorElement]) => {
        input.addEventListener('focus', () => {
            clearFieldError(input, errorElement);
            status.textContent = '';
        });
    });

    if (new URLSearchParams(search).get('expired') === '1') {
        status.textContent = EXPIRED_SESSION_MESSAGE;
    }

    form.addEventListener('submit', handleSubmit);
    return { handleSubmit, clearFeedback };
}

function getBrowserAuthApi() {
    return {
        normalizeEmail,
        findUserByEmail,
        verifyPassword,
        setLoggedInUser,
        isLoginLocked: typeof isLoginLocked === 'function' ? isLoginLocked : undefined,
        recordLoginFailure: typeof recordLoginFailure === 'function' ? recordLoginFailure : undefined,
        clearLoginFailures: typeof clearLoginFailures === 'function' ? clearLoginFailures : undefined,
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        INVALID_CREDENTIALS_MESSAGE,
        LOCKOUT_MESSAGE,
        EXPIRED_SESSION_MESSAGE,
        getSafeReturnTarget,
        initializeLogin,
    };
}

if (typeof module === 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => initializeLogin());
}

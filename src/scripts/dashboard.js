const DASHBOARD_LOGIN_PATH = 'login.html';
const DASHBOARD_RETURN_PATH = 'dashboard.html';

function initializeDashboard(options = {}) {
    const auth = options.auth || getBrowserDashboardAuthApi();
    const pageDocument = options.document || document;
    const navigate = options.navigate || ((target) => window.location.replace(target));
    const now = options.now || (() => new Date());
    const eventTarget = options.eventTarget || window;
    const protectedContent = pageDocument.getElementById('protected-content');
    const userName = pageDocument.getElementById('user-name');
    const logoutButton = pageDocument.getElementById('logout-button');

    const guard = () => {
        if (protectedContent) protectedContent.hidden = true;
        const result = auth.validateSession(now());

        if (result.status !== 'valid') {
            const expiredSuffix = result.status === 'expired' ? '&expired=1' : '';
            navigate(`${DASHBOARD_LOGIN_PATH}?returnTo=${DASHBOARD_RETURN_PATH}${expiredSuffix}`);
            return result;
        }

        userName.textContent = result.session.name;
        protectedContent.hidden = false;
        return result;
    };

    const logout = () => {
        auth.clearLoggedInUser();
        if (protectedContent) protectedContent.hidden = true;
        navigate(DASHBOARD_LOGIN_PATH);
    };

    if (logoutButton) logoutButton.addEventListener('click', logout);
    if (eventTarget) {
        eventTarget.addEventListener('pageshow', (event) => {
            if (event.persisted) guard();
        });
    }

    guard();
    return { guard, logout };
}

function getBrowserDashboardAuthApi() {
    return { validateSession, clearLoggedInUser };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeDashboard };
}

if (typeof module === 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => initializeDashboard());
}

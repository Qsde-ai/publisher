const GOOGLE_CLIENT_ID = '541269307419-rhh5srj3dm3tc3hquqofpa2mskhdeosd.apps.googleusercontent.com';
const USER_STORAGE_KEY = 'user';


function initGoogleAuth() {
    if (!window.google) {
        console.error('Google API не загружен');
        return;
    }
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        prompt_parent_id: 'google-login-container',
        redirect_uri: window.location.origin
    });
    renderLoginButton();
}

function handleCredentialResponse(response) {
    try {
        const responsePayload = parseJwt(response.credential);

        const userData = {
            id: responsePayload.sub,
            name: responsePayload.name,
            email: responsePayload.email,
            picture: responsePayload.picture,
            token: response.credential
        };
        saveUserData(userData);
        updateUIAfterLogin(userData);
    } catch (error) {
        console.error('Ошибка обработки авторизации:', error);
        showAuthError('Ошибка входа. Попробуйте ещё раз.');
    }
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}

function saveUserData(user) {
    try {
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
        console.error('Ошибка сохранения пользователя:', error);
    }
}

function updateUIAfterLogin(user) {
    const userProfile = document.getElementById('user-profile');
    const loginBtn = document.getElementById('google-login');
    if (userProfile) {
        userProfile.classList.remove('hidden');
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-avatar').src = user.picture;
    }
    if (loginBtn) {
        loginBtn.classList.add('hidden');
    }
    if (window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
}

function renderLoginButton() {
    if (window.google && document.getElementById('google-login')) {
        google.accounts.id.renderButton(
            document.getElementById('google-login'),
            {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left'
            }
        );
        google.accounts.id.prompt(notification => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            }
        });
    }
}

function logout() {
    try {
        if (window.google && google.accounts) {
            google.accounts.id.disableAutoSelect();
        }
        localStorage.removeItem(USER_STORAGE_KEY);
        sessionStorage.removeItem(USER_STORAGE_KEY);
        const userProfile = document.getElementById('user-profile');
        const loginBtn = document.getElementById('google-login');
        if (userProfile) userProfile.classList.add('hidden');
        if (loginBtn) loginBtn.classList.remove('hidden');
        window.location.reload();
    } catch (error) {
        console.error('Ошибка при выходе:', error);
    }
}

function showAuthError(message) {
    const errorContainer = document.getElementById('auth-error');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    }
}

function checkAuthOnLoad() {
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY));
    if (user) {
        updateUIAfterLogin(user);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogleAuth;
    document.head.appendChild(script);
    checkAuthOnLoad();
});

if (typeof window !== 'undefined') {
    window.authModule = {
        initGoogleAuth,
        logout,
        getUser: () => JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY))
    };
}
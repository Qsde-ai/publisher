document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const userProfile = document.getElementById('user-profile');
        if (userProfile) {
            userProfile.classList.remove('hidden');
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-avatar').src = user.picture;
        }

        const loginBtn = document.getElementById('google-login');
        if (loginBtn) loginBtn.classList.add('hidden');
    }

    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (window.google && google.accounts) {
                google.accounts.id.disableAutoSelect();
            }
            localStorage.removeItem('user');
            window.location.href = '/html/index.html';
        });
    }
});
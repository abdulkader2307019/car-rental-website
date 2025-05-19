document.addEventListener('DOMContentLoaded', () => {
    const pages = {
        login: document.getElementById('loginPage'),
        signup: document.getElementById('signupPage'),
        reset: document.getElementById('resetPage')
    };

    const leftSideText = document.getElementById('leftSideText');

    const switchPage = (page) => {
        Object.values(pages).forEach(p => p.classList.remove('active'));
        pages[page].classList.add('active');

        if (leftSideText) {
            leftSideText.innerHTML = page === 'login'
                ? 'Welcome Back <br>Your Next Ride Awaits'
                : page === 'signup'
                    ? 'Capturing Moments,<br>Creating Memories'
                    : 'Reset Your Password';
        }
    };

    const validateEmail = email =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

    const validatePassword = password => password.length >= 6;

    const showError = (input, message) => {
        const field = input.parentElement;
        removeError(input);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.appendChild(errorDiv);
    };

    const removeError = (input) => {
        const field = input.parentElement;
        const existingError = field.querySelector('.error-message');
        if (existingError) existingError.remove();
    };

    const simulateLoading = (button) => {
        button.classList.add('button-loading');
        button.disabled = true;
        setTimeout(() => {
            button.classList.remove('button-loading');
            button.disabled = false;
        }, 2000);
    };

    const handleAuthSuccess = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.href = 'dashboard.html';
    };

    const authenticateUser = (email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const userData = {
                    email,
                    name: email.split('@')[0],
                    token: 'mock-jwt-token'
                };
                resolve(userData);
            }, 1500);
        });
    };

    // Login handler
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.loginEmail;
        const password = loginForm.loginPassword;
        const submitBtn = loginForm.querySelector('.auth-btn');

        removeError(email);
        removeError(password);

        let isValid = true;
        if (!validateEmail(email.value)) {
            showError(email, 'Enter a valid email address');
            isValid = false;
        }
        if (!validatePassword(password.value)) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (isValid) {
            simulateLoading(submitBtn);
            const user = await authenticateUser(email.value, password.value);
            handleAuthSuccess(user);
        }
    });

    // Signup handler
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { firstName, lastName, signupEmail, signupPassword } = signupForm;
        const submitBtn = signupForm.querySelector('.auth-btn');

        removeError(signupEmail);
        removeError(signupPassword);

        let isValid = true;
        if (!validateEmail(signupEmail.value)) {
            showError(signupEmail, 'Enter a valid email address');
            isValid = false;
        }
        if (!validatePassword(signupPassword.value)) {
            showError(signupPassword, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (isValid) {
            simulateLoading(submitBtn);
            const user = await authenticateUser(signupEmail.value, signupPassword.value);
            user.name = `${firstName.value} ${lastName.value}`;
            handleAuthSuccess(user);
        }
    });

    // Reset password handler
    const resetForm = document.getElementById('reset-form');
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resetEmail = document.getElementById('resetEmail');
        const submitBtn = resetForm.querySelector('.auth-btn');
        removeError(resetEmail);

        if (!validateEmail(resetEmail.value)) {
            showError(resetEmail, 'Enter a valid email address');
            return;
        }

        simulateLoading(submitBtn);
        setTimeout(() => {
            alert(`Password reset link sent to ${resetEmail.value}`);
            switchPage('login');
        }, 2000);
    });

    // Social auth buttons
    document.querySelectorAll('.google').forEach(btn =>
        btn.addEventListener('click', async () => {
            simulateLoading(btn);
            const user = {
                email: 'user@google.com',
                name: 'Google User',
                token: 'mock-google-token'
            };
            handleAuthSuccess(user);
        })
    );

    document.querySelectorAll('.apple').forEach(btn =>
        btn.addEventListener('click', async () => {
            simulateLoading(btn);
            const user = {
                email: 'user@apple.com',
                name: 'Apple User',
                token: 'mock-apple-token'
            };
            handleAuthSuccess(user);
        })
    );

    // Page switch links
    document.querySelectorAll('[data-switch]').forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-switch');
            switchPage(target);
        });
    });

    // Auto-login check
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'admin.html';
    }
});

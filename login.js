
// Switch between login and signup forms
function switchForm(formType) {
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');
    
    if (formType === 'login') {
        loginPage.classList.add('active');
        signupPage.classList.remove('active');
    } else {
        signupPage.classList.add('active');
        loginPage.classList.remove('active');
    }
}

// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'admin.html';
    }

    // Signup form submission
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        // Simple validation
        if (firstName && lastName && email && password) {
            // Save user data (in a real app, this would be sent to a server)
            localStorage.setItem('adminName', `${firstName} ${lastName}`);
            localStorage.setItem('adminLoggedIn', 'true');
            
            // Redirect to admin page
            window.location.href = 'admin.html';
        } else {
            alert('Please fill all fields');
        }
    });

    // Login form submission
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simple validation (in a real app, verify credentials with server)
        if (email && password) {
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminName', email.split('@')[0]); // Use email prefix as name
            
            // Redirect to admin page
            window.location.href = 'admin.html';
        } else {
            alert('Please enter both email and password');
        }
    });

    // Social buttons (placeholder functionality)
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Social login would be implemented here in a real application');
        });
    });

    // Forgot password link
    document.querySelector('.forgot-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset functionality would be implemented here');
    });
});

function switchForm(form) {
    const signupPage = document.getElementById('signupPage');
    const loginPage = document.getElementById('loginPage');
    const leftSideText = document.getElementById('leftSideText');

    if (form === 'login') {
        signupPage.classList.remove('active');
        loginPage.classList.add('active');
        leftSideText.innerHTML = 'Welcome Back <br>Your Next Ride Awaits';
    } else {
        loginPage.classList.remove('active');
        signupPage.classList.add('active');
        leftSideText.innerHTML = 'Capturing Moments,<br>Creating Memories';
    }
}

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const showError = (input, message) => {
    const field = input.parentElement;
    const existingError = field.querySelector('.error-message');
    
    if (!existingError) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.appendChild(errorDiv);
    }
};

const removeError = (input) => {
    const field = input.parentElement;
    const existingError = field.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
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
                email: email,
                name: email.split('@')[0],
                token: 'mock-jwt-token'
            };
            resolve(userData);
        }, 1500);
    });
};

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;
    const submitButton = loginForm.querySelector('.auth-btn');

    removeError(loginForm.loginEmail);
    removeError(loginForm.loginPassword);

    if (!validateEmail(email)) {
        showError(loginForm.loginEmail, 'Please enter a valid email address');
        isValid = false;
    }

    if (!validatePassword(password)) {
        showError(loginForm.loginPassword, 'Password must be at least 6 characters');
        isValid = false;
    }

    if (isValid) {
        simulateLoading(submitButton);
        try {
            const userData = await authenticateUser(email, password);
            handleAuthSuccess(userData);
        } catch (error) {
            showError(loginForm.loginEmail, 'Authentication failed. Please try again.');
        }
    }
});

const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    const submitButton = signupForm.querySelector('.auth-btn');
    const formData = {
        firstName: signupForm.firstName.value,
        lastName: signupForm.lastName.value,
        email: signupForm.signupEmail.value,
        password: signupForm.signupPassword.value
    };

    removeError(signupForm.signupEmail);
    removeError(signupForm.signupPassword);

    if (!validateEmail(formData.email)) {
        showError(signupForm.signupEmail, 'Please enter a valid email address');
        isValid = false;
    }

    if (!validatePassword(formData.password)) {
        showError(signupForm.signupPassword, 'Password must be at least 6 characters');
        isValid = false;
    }

    if (isValid) {
        simulateLoading(submitButton);
        try {
            const userData = await authenticateUser(formData.email, formData.password);
            userData.name = `${formData.firstName} ${formData.lastName}`;
            handleAuthSuccess(userData);
        } catch (error) {
            showError(signupForm.signupEmail, 'Registration failed. Please try again.');
        }
    }
});

const handleSocialAuth = async (provider) => {
    const userData = {
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        token: `mock-${provider}-token`
    };
    
    handleAuthSuccess(userData);
};

document.querySelectorAll('.google').forEach(btn => {
    btn.addEventListener('click', async () => {
        simulateLoading(btn);
        try {
            await handleSocialAuth('google');
        } catch (error) {
            console.error('Google authentication failed:', error);
        }
    });
});

document.querySelectorAll('.apple').forEach(btn => {
    btn.addEventListener('click', async () => {
        simulateLoading(btn);
        try {
            await handleSocialAuth('apple');
        } catch (error) {
            console.error('Apple authentication failed:', error);
        }
    });
});

const forgotLink = document.querySelector('.forgot-link');
forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    const loginPage = document.getElementById('loginPage');
    const currentContent = loginPage.innerHTML;
    
    loginPage.dataset.originalContent = currentContent;
    
    loginPage.innerHTML = `
        <h2>Reset Password</h2>
        <p class="subtitle">Enter your email to receive a reset link</p>
        
        <div class="input-group">
            <div class="input-field">
                <input type="email" id="resetEmail" required placeholder=" ">
                <label for="resetEmail">Email Address</label>
            </div>
        </div>
        
        <button id="sendResetLink" class="auth-btn">Send Reset Link</button>
        
        <p class="switch-form">
            <a id="backToLogin">Back to Login</a>
        </p>
    `;
    
    document.getElementById('sendResetLink').addEventListener('click', () => {
        const resetEmail = document.getElementById('resetEmail').value;
        const submitButton = document.getElementById('sendResetLink');

        if (validateEmail(resetEmail)) {
            simulateLoading(submitButton);
            setTimeout(() => {
                loginPage.innerHTML = `
                    <h2>Email Sent</h2>
                    <p class="subtitle">Check your inbox for reset instructions</p>
                    <p style="color: #EDEDED; text-align: center; margin: 2rem 0;">
                        A password reset link has been sent to:<br>
                        <span style="color: #D4AF37; font-weight: bold;">${resetEmail}</span>
                    </p>
                    <button id="backToLoginAfterReset" class="auth-btn">Back to Login</button>
                `;
                
                document.getElementById('backToLoginAfterReset').addEventListener('click', () => {
                    loginPage.innerHTML = loginPage.dataset.originalContent;
                    attachLoginListeners(); 
                });
            }, 2000);
        } else {
            const emailField = document.getElementById('resetEmail').parentElement;
            const existingError = emailField.querySelector('.error-message');
            if (!existingError) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = 'Please enter a valid email address';
                emailField.appendChild(errorDiv);
            }
        }
    });
    
    document.getElementById('backToLogin').addEventListener('click', () => {
        loginPage.innerHTML = loginPage.dataset.originalContent;
        attachLoginListeners(); 
    });
});

function attachLoginListeners() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;
        
        const email = loginForm.loginEmail.value;
        const password = loginForm.loginPassword.value;
        const submitButton = loginForm.querySelector('.auth-btn');

        removeError(loginForm.loginEmail);
        removeError(loginForm.loginPassword);

        if (!validateEmail(email)) {
            showError(loginForm.loginEmail, 'Please enter a valid email address');
            isValid = false;
        }

        if (!validatePassword(password)) {
            showError(loginForm.loginPassword, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (isValid) {
            simulateLoading(submitButton);
            try {
                const userData = await authenticateUser(email, password);
                handleAuthSuccess(userData);
            } catch (error) {
                showError(loginForm.loginEmail, 'Authentication failed. Please try again.');
            }
        }
    });
    
    const forgotLink = document.querySelector('.forgot-link');
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        const loginPage = document.getElementById('loginPage');
        const currentContent = loginPage.innerHTML;
        loginPage.dataset.originalContent = currentContent;
    });
}


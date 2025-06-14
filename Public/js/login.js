document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const leftSideText = document.getElementById('leftSideText');

    if (localStorage.getItem('token')) {
        window.location.href = '/';
    }

    window.switchForm = (page) => {
        const pages = {
            login: document.getElementById('loginPage'),
            signup: document.getElementById('signupPage')
        };
        
        Object.values(pages).forEach(p => p.classList.remove('active'));
        pages[page].classList.add('active');
        
        if (leftSideText) {
            leftSideText.innerHTML = page === 'login'
                ? 'Welcome Back,<br>Your Next Ride Awaits'
                : 'Drive Your Dreams,<br>Rent Your Ride Today';
        }

        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    };

    const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
    const validatePassword = password => password.length >= 6;
    
    const showError = (elementId, message) => {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
        console.error('Form error:', message);
    };
    
    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    };

    const setLoading = (button, isLoading) => {
        if (isLoading) {
            button.classList.add('button-loading');
            button.disabled = true;
        } else {
            button.classList.remove('button-loading');
            button.disabled = false;
        }
    };

    const handleAuthSuccess = (userData) => {
        console.log('Auth success:', userData);
        
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', `${userData.firstName} ${userData.lastName}`);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userFirstName', userData.firstName);
        localStorage.setItem('userLastName', userData.lastName);
        localStorage.setItem('isAdmin', userData.isAdmin || false);
        
        window.location.href = '/';
    };

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const loginButton = document.getElementById('loginButton');
            
            console.log('Login attempt:', { email });
            
            let isValid = true;
            
            if (!validateEmail(email)) {
                showError('loginEmailError', 'Enter a valid email address');
                isValid = false;
            }
            
            if (!validatePassword(password)) {
                showError('loginPasswordError', 'Password must be at least 6 characters');
                isValid = false;
            }
            
            if (!isValid) return;
            
            try {
                setLoading(loginButton, true);
                
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                console.log('Login response:', data);
                
                if (!response.ok) {
                    showError('loginEmailError', data.message || 'Login failed');
                    return;
                }
                
                handleAuthSuccess(data);
            } catch (error) {
                console.error('Login error:', error);
                showError('loginEmailError', 'Network error. Please check your connection and try again.');
            } finally {
                setLoading(loginButton, false);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();
            
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const phoneNumber = document.getElementById('signupPhoneNumber').value.trim();
            const password = document.getElementById('signupPassword').value;
            const age = document.getElementById('age').value;
            const country = document.getElementById('country').value.trim();
            const signupButton = document.getElementById('signupButton');
            
            console.log('Signup attempt:', { firstName, lastName, email, phoneNumber });
            
            let isValid = true;
            
            if (!firstName) {
                showError('firstNameError', 'First name is required');
                isValid = false;
            }
            
            if (!lastName) {
                showError('lastNameError', 'Last name is required');
                isValid = false;
            }
            
            if (!validateEmail(email)) {
                showError('signupEmailError', 'Enter a valid email address');
                isValid = false;
            }
            
            if (!validatePassword(password)) {
                showError('signupPasswordError', 'Password must be at least 6 characters');
                isValid = false;
            }
            
            if (!isValid) return;
            
            try {
                setLoading(signupButton, true);
                
                const requestBody = {
                    firstName,
                    lastName,
                    email,
                    password,
                    phoneNumber,
                    age: age ? parseInt(age) : undefined,
                    country: country || 'Egypt',
                    gender: 'Other'
                };
                
                console.log('Sending signup request:', requestBody);
                
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });
                
                const data = await response.json();
                console.log('Signup response:', data);
                
                if (!response.ok) {
                    showError('signupEmailError', data.message || 'Registration failed');
                    return;
                }
                
                handleAuthSuccess(data);
            } catch (error) {
                console.error('Registration error:', error);
                showError('signupEmailError', 'Network error. Please check your connection and try again.');
            } finally {
                setLoading(signupButton, false);
            }
        });
    }

   
});
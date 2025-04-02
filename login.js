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
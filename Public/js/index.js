document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in and update UI accordingly
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userFirstName = localStorage.getItem('userFirstName');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    // Update welcome message
    const welcomeMessage = document.getElementById("wel");
    if (welcomeMessage && userFirstName) {
        welcomeMessage.textContent = `Welcome back to CarVoo!!, ${userFirstName}!`;
    }
    
    // Update navigation based on login status
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (token) {
            // User is logged in - show profile and logout, hide login
            navbar.innerHTML = `
                <a href="/carlisting">Cars</a>
                <a href="/about">About Us</a>
                <a href="/profile">Profile</a>
                ${isAdmin ? '<a href="/AdminPage/manage-bookings">Admin</a>' : ''}
                <a href="#" id="logoutBtn">Logout</a>
            `;
            
            // Add logout functionality
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Clear all stored data
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userFirstName');
                    localStorage.removeItem('userLastName');
                    localStorage.removeItem('isAdmin');
                    
                    // Redirect to home page
                    window.location.href = '/';
                });
            }
        } else {
            // User is not logged in - show login
            navbar.innerHTML = `
                <a href="/carlisting">Cars</a>
                <a href="/about">About Us</a>
                <a href="/LoginPage/login">Login</a>
            `;
        }
    }
});
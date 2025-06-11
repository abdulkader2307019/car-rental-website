document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/LoginPage/login';
        return;
    }

    // DOM Elements
    const profileImage = document.getElementById('profileImage');
    const profileName = document.getElementById('profileName');
    const profileLocation = document.getElementById('profileLocation');
    const profileCountry = document.getElementById('profileCountry');
    const profileBirthday = document.getElementById('profileBirthday');
    const profileMemberSince = document.getElementById('profileMemberSince');
    const commentsContainer = document.getElementById('commentsContainer');
    const logoutButton = document.getElementById('logoutButton');

    // Stats elements
    const carsRented = document.getElementById('carsRented');
    const milesOvercome = document.getElementById('milesOvercome');
    const hoursOnRoad = document.getElementById('hoursOnRoad');
    const citiesVisited = document.getElementById('citiesVisited');

    // Animate counter function
    function animateCounter(element, target, duration = 2000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const animate = () => {
            current += increment;
            element.textContent = Math.round(current);

            if ((increment > 0 && current < target) || (increment < 0 && current > target)) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        animate();
    }

    // Format date function
    function formatDate(dateString) {
        if (!dateString) return 'Not specified';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Load profile data
    async function loadProfileData() {
        try {
            console.log('Loading profile data...');
            
            const response = await fetch('/api/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Profile response status:', response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    console.log('Token expired, redirecting to login');
                    localStorage.clear();
                    window.location.href = '/LoginPage/login';
                    return;
                }
                throw new Error(`Failed to load profile: ${response.status}`);
            }

            const result = await response.json();
            console.log('Profile data received:', result);
            
            const data = result.data || result;
            
            // Update profile info
            if (data.profileImage && profileImage) {
                profileImage.src = data.profileImage;
            }
            
            if (profileName) {
                profileName.textContent = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User';
            }
            
            if (profileLocation) {
                profileLocation.textContent = data.location || 'Not specified';
            }
            
            if (profileCountry) {
                profileCountry.textContent = data.country || 'Not specified';
            }
            
            if (profileBirthday) {
                profileBirthday.textContent = formatDate(data.birthday);
            }
            
            if (profileMemberSince) {
                const memberSince = data.memberSince || data.createdAt;
                profileMemberSince.textContent = memberSince ? new Date(memberSince).getFullYear() : 'Not specified';
            }
            
            // Update stats with animation
            if (data.stats) {
                if (carsRented) animateCounter(carsRented, data.stats.carsRented || 0);
                if (milesOvercome) animateCounter(milesOvercome, data.stats.milesOvercome || 0);
                if (hoursOnRoad) animateCounter(hoursOnRoad, data.stats.hoursOnRoad || 0);
                if (citiesVisited) animateCounter(citiesVisited, data.stats.citiesVisited || 0);
            } else {
                // Default stats if none exist
                if (carsRented) animateCounter(carsRented, 0);
                if (milesOvercome) animateCounter(milesOvercome, 0);
                if (hoursOnRoad) animateCounter(hoursOnRoad, 0);
                if (citiesVisited) animateCounter(citiesVisited, 0);
            }
            
            // Load comments
            if (commentsContainer) {
                if (data.comments && data.comments.length > 0) {
                    commentsContainer.innerHTML = '';
                    
                    data.comments.forEach(comment => {
                        const commentElement = document.createElement('div');
                        commentElement.className = 'comment';
                        commentElement.innerHTML = `
                            <div class="comment-header">
                                <strong>${comment.title || 'Comment'}</strong>
                                <span class="comment-date">${formatDate(comment.date)}</span>
                            </div>
                            <p>${comment.text || 'No comment text'}</p>
                        `;
                        commentsContainer.appendChild(commentElement);
                    });
                } else {
                    commentsContainer.innerHTML = '<p>No comments yet.</p>';
                }
            }
            
        } catch (error) {
            console.error('Error loading profile:', error);
            
            // Try to get user data from localStorage as fallback
            const userFirstName = localStorage.getItem('userFirstName');
            const userLastName = localStorage.getItem('userLastName');
            const userEmail = localStorage.getItem('userEmail');
            
            if (userFirstName && userLastName && profileName) {
                profileName.textContent = `${userFirstName} ${userLastName}`;
            }
            
            if (commentsContainer) {
                commentsContainer.innerHTML = '<p>Unable to load profile data. Please try refreshing the page.</p>';
            }
        }
    }

    // Load profile data when page loads
    loadProfileData();

    // Handle card hover effects
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Handle logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
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
});
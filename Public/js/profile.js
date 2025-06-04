
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
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
        const start = parseInt(element.textContent);
        const increment = (target - start) / (duration / 16);
        let current = start;

        const animate = () => {
            current += increment;
            element.textContent = Math.round(current);

            if (current < target) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        animate();
    }

    // Format date function
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Load profile data
    async function loadProfileData() {
        try {
            const response = await fetch('/api/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                throw new Error('Failed to load profile');
            }

            const { data } = await response.json();
            
            // Update profile info
            if (data.profileImage) {
                profileImage.src = data.profileImage;
            }
            profileName.textContent = `${data.firstName} ${data.lastName}`;
            profileLocation.textContent = data.location || 'Not specified';
            profileCountry.textContent = data.country || 'Not specified';
            profileBirthday.textContent = data.birthday ? formatDate(data.birthday) : 'Not specified';
            profileMemberSince.textContent = data.memberSince ? new Date(data.memberSince).getFullYear() : 'Not specified';
            
            // Update stats with animation
            if (data.stats) {
                animateCounter(carsRented, data.stats.carsRented || 0);
                animateCounter(milesOvercome, data.stats.milesOvercome || 0);
                animateCounter(hoursOnRoad, data.stats.hoursOnRoad || 0);
                animateCounter(citiesVisited, data.stats.citiesVisited || 0);
            }
            
            // Load comments
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
                        <p>${comment.text}</p>
                    `;
                    commentsContainer.appendChild(commentElement);
                });
            } else {
                commentsContainer.innerHTML = '<p>No comments yet.</p>';
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            alert('Failed to load profile data. Please try again later.');
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
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
    });
});

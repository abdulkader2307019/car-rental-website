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
    const profileCountry = document.getElementById('profileCountry');
    const profileMemberSince = document.getElementById('profileMemberSince');
    const bookingHistoryContainer = document.getElementById('bookingHistoryContainer');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editImageBtn = document.getElementById('editImageBtn');
    const imageInput = document.getElementById('imageInput');
    const editModal = document.getElementById('editModal');
    const reviewModal = document.getElementById('reviewModal');

    let currentRating = 0;

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

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = '/LoginPage/login';
                    return;
                }
                throw new Error(`Failed to load profile: ${response.status}`);
            }

            const result = await response.json();
            const data = result.data || result;
            
            // Update profile info
            if (data.profileImage && data.profileImage.data) {
                profileImage.src = '/api/profile/image';
            }
            
            if (profileName) {
                profileName.textContent = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User';
            }
            
            if (profileCountry) {
                profileCountry.textContent = data.country || 'Not specified';
            }
            
            if (profileMemberSince) {
                const memberSince = data.memberSince || data.createdAt;
                profileMemberSince.textContent = memberSince ? new Date(memberSince).getFullYear() : 'Not specified';
            }
            
            // Load booking history
            loadBookingHistory(data.bookingHistory || []);
            
        } catch (error) {
            console.error('Error loading profile:', error);
            
            // Try to get user data from localStorage as fallback
            const userFirstName = localStorage.getItem('userFirstName');
            const userLastName = localStorage.getItem('userLastName');
            
            if (userFirstName && userLastName && profileName) {
                profileName.textContent = `${userFirstName} ${userLastName}`;
            }
            
            if (bookingHistoryContainer) {
                bookingHistoryContainer.innerHTML = '<p>Unable to load profile data. Please try refreshing the page.</p>';
            }
        }
    }

    // Load booking history
    function loadBookingHistory(bookings) {
        if (!bookingHistoryContainer) return;

        if (!bookings || bookings.length === 0) {
            bookingHistoryContainer.innerHTML = '<p>No booking history found.</p>';
            return;
        }

        bookingHistoryContainer.innerHTML = '';
        
        bookings.forEach(booking => {
            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';
            
            const canReview = booking.status === 'confirmed' && new Date(booking.endDate) < new Date();
            
            bookingCard.innerHTML = `
                <div class="booking-header">
                    <div class="car-name">${booking.car?.brand || 'Unknown'} ${booking.car?.model || 'Car'}</div>
                    <div class="booking-status status-${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
                </div>
                <div class="booking-details">
                    <div class="detail-item">
                        <span class="detail-label">Start Date</span>
                        <span class="detail-value">${formatDate(booking.startDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">End Date</span>
                        <span class="detail-value">${formatDate(booking.endDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total Price</span>
                        <span class="detail-value">$${booking.totalPrice || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Pickup Location</span>
                        <span class="detail-value">${booking.locationPickup || 'N/A'}</span>
                    </div>
                </div>
                ${canReview ? `
                    <div class="booking-actions">
                        <button class="btn primary review-btn" data-car-id="${booking.car._id}">Rate Experience</button>
                    </div>
                ` : ''}
            `;
            
            bookingHistoryContainer.appendChild(bookingCard);
        });

        // Add event listeners for review buttons
        document.querySelectorAll('.review-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = e.target.getAttribute('data-car-id');
                openReviewModal(carId);
            });
        });
    }

    // Edit profile functionality
    editProfileBtn.addEventListener('click', () => {
        // Populate form with current data
        document.getElementById('editFirstName').value = localStorage.getItem('userFirstName') || '';
        document.getElementById('editLastName').value = localStorage.getItem('userLastName') || '';
        document.getElementById('editCountry').value = profileCountry.textContent !== 'Not specified' ? profileCountry.textContent : '';
        
        editModal.classList.remove('hidden');
    });

    // Handle profile form submission
    document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('firstName', document.getElementById('editFirstName').value);
        formData.append('lastName', document.getElementById('editLastName').value);
        formData.append('country', document.getElementById('editCountry').value);

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Update localStorage
                localStorage.setItem('userFirstName', result.data.firstName);
                localStorage.setItem('userLastName', result.data.lastName);
                
                // Update UI
                profileName.textContent = `${result.data.firstName} ${result.data.lastName}`;
                profileCountry.textContent = result.data.country || 'Not specified';
                
                editModal.classList.add('hidden');
                alert('Profile updated successfully!');
            } else {
                alert(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    });

    // Handle profile image upload
    editImageBtn.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Update profile image
                profileImage.src = '/api/profile/image?' + new Date().getTime(); // Add timestamp to force refresh
                alert('Profile image updated successfully!');
            } else {
                alert(result.message || 'Failed to update profile image');
            }
        } catch (error) {
            console.error('Error updating profile image:', error);
            alert('Error updating profile image. Please try again.');
        }
    });

    // Review modal functionality
    function openReviewModal(carId) {
        document.getElementById('reviewCarId').value = carId;
        currentRating = 0;
        updateStarDisplay();
        document.getElementById('reviewComment').value = '';
        reviewModal.classList.remove('hidden');
    }

    // Star rating functionality
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', (e) => {
            currentRating = parseInt(e.target.getAttribute('data-rating'));
            updateStarDisplay();
        });

        star.addEventListener('mouseover', (e) => {
            const hoverRating = parseInt(e.target.getAttribute('data-rating'));
            updateStarDisplay(hoverRating);
        });
    });

    document.getElementById('starRating').addEventListener('mouseleave', () => {
        updateStarDisplay();
    });

    function updateStarDisplay(hoverRating = null) {
        const rating = hoverRating || currentRating;
        document.querySelectorAll('.star').forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Handle review form submission
    document.getElementById('reviewForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (currentRating === 0) {
            alert('Please select a rating');
            return;
        }

        const carId = document.getElementById('reviewCarId').value;
        const comment = document.getElementById('reviewComment').value;

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    carId,
                    rating: currentRating,
                    comment
                })
            });

            const result = await response.json();

            if (result.success) {
                alert('Review submitted successfully!');
                reviewModal.classList.add('hidden');
                // Reload profile to update booking history
                loadProfileData();
            } else {
                alert(result.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review. Please try again.');
        }
    });

    // Modal close functionality
    document.getElementById('cancelEdit').addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    document.getElementById('cancelReview').addEventListener('click', () => {
        reviewModal.classList.add('hidden');
    });

    // Close modals when clicking outside
    [editModal, reviewModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/';
    });

    // Load profile data when page loads
    loadProfileData();
});
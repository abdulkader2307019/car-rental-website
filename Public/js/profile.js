document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/LoginPage/login';
        return;
    }

    const profileImage = document.getElementById('profileImage');
    const profileName = document.getElementById('profileName');
    const profileCountry = document.getElementById('profileCountry');
    const profileMemberSince = document.getElementById('profileMemberSince');
    const bookingHistoryContainer = document.getElementById('bookingHistoryContainer');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editImageBtn = document.getElementById('editImageBtn');
    const imageInput = document.getElementById('imageInput');
    const editModal = document.getElementById('editModal');

    function formatDate(dateString) {
        if (!dateString) return 'Not specified';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

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
            console.log('Profile data received:', result);
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to load profile');
            }

            const data = result.data;
            
            // Update profile information
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
            
            // Fallback to localStorage data
            const userFirstName = localStorage.getItem('userFirstName');
            const userLastName = localStorage.getItem('userLastName');
            
            if (userFirstName && userLastName && profileName) {
                profileName.textContent = `${userFirstName} ${userLastName}`;
            }
            
            if (profileImage) {
                profileImage.src = '/img/44.jpg';
            }
            
            if (bookingHistoryContainer) {
                bookingHistoryContainer.innerHTML = '<p>Unable to load profile data. Please try refreshing the page.</p>';
            }
        }
    }

    function loadBookingHistory(bookings) {
        if (!bookingHistoryContainer) return;

        console.log('Loading booking history:', bookings);

        if (!bookings || bookings.length === 0) {
            bookingHistoryContainer.innerHTML = '<p>No booking history found.</p>';
            return;
        }

        bookingHistoryContainer.innerHTML = '';
        
        bookings.forEach(booking => {
            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';
            
            const statusClass = `status-${booking.status}`;
            const statusText = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
            
            bookingCard.innerHTML = `
                <div class="booking-header">
                    <div class="car-name">${booking.car?.brand || 'Unknown'} ${booking.car?.model || 'Car'}</div>
                    <div class="booking-status ${statusClass}">${statusText}</div>
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
                    <div class="detail-item">
                        <span class="detail-label">Return Location</span>
                        <span class="detail-value">${booking.locationDropoff || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status</span>
                        <span class="detail-value ${statusClass}">${statusText}</span>
                    </div>
                </div>
            `;
            
            bookingHistoryContainer.appendChild(bookingCard);
        });
    }

    editProfileBtn.addEventListener('click', async () => {
        try {
            // Load current profile data for editing
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                const data = result.data;
                
                document.getElementById('editFirstName').value = data.firstName || '';
                document.getElementById('editLastName').value = data.lastName || '';
                document.getElementById('editEmail').value = data.email || '';
                document.getElementById('editPhoneNumber').value = data.phoneNumber || '';
                document.getElementById('editAge').value = data.age || '';
                document.getElementById('editCountry').value = data.country || '';
                document.getElementById('editGender').value = data.gender || '';
            } else {
                // Fallback to localStorage
                document.getElementById('editFirstName').value = localStorage.getItem('userFirstName') || '';
                document.getElementById('editLastName').value = localStorage.getItem('userLastName') || '';
                document.getElementById('editEmail').value = localStorage.getItem('userEmail') || '';
            }
        } catch (error) {
            console.error('Error loading profile for editing:', error);
            // Use localStorage as fallback
            document.getElementById('editFirstName').value = localStorage.getItem('userFirstName') || '';
            document.getElementById('editLastName').value = localStorage.getItem('userLastName') || '';
            document.getElementById('editEmail').value = localStorage.getItem('userEmail') || '';
        }
        
        editModal.classList.remove('hidden');
    });

    document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('firstName', document.getElementById('editFirstName').value);
        formData.append('lastName', document.getElementById('editLastName').value);
        formData.append('email', document.getElementById('editEmail').value);
        formData.append('phoneNumber', document.getElementById('editPhoneNumber').value);
        formData.append('age', document.getElementById('editAge').value);
        formData.append('country', document.getElementById('editCountry').value);
        formData.append('gender', document.getElementById('editGender').value);

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
                localStorage.setItem('userFirstName', result.data.firstName);
                localStorage.setItem('userLastName', result.data.lastName);
                localStorage.setItem('userEmail', result.data.email);
                
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

    editImageBtn.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB.');
            return;
        }

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
                profileImage.src = '/api/profile/image?' + new Date().getTime();
                alert('Profile image updated successfully!');
            } else {
                alert(result.message || 'Failed to update profile image');
            }
        } catch (error) {
            console.error('Error updating profile image:', error);
            alert('Error updating profile image. Please try again.');
        }
    });

    document.getElementById('cancelEdit').addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/';
    });

    // Load profile data on page load
    loadProfileData();
});
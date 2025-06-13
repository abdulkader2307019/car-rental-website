document.addEventListener('DOMContentLoaded', function() {
    const editModal = document.getElementById('edit-booking-modal');
    const editForm = document.getElementById('edit-booking-form');
    const cancelEditBtn = document.getElementById('cancel-booking-edit');
    const searchBar = document.getElementById('bookingSearchBar');
    const searchButton = document.getElementById('bookingSearchButton');
    const clearSearchButton = document.getElementById('bookingClearSearch');

    // Search functionality
    function filterBookings() {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = document.querySelectorAll('#bookings-table tbody tr');

        rows.forEach(row => {
            const userName = row.cells[1].textContent.toLowerCase();
            const carName = row.cells[2].textContent.toLowerCase();
            const bookingId = row.getAttribute('data-booking-id').toLowerCase();

            if (userName.includes(searchTerm) || carName.includes(searchTerm) || bookingId.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchButton.addEventListener('click', filterBookings);
    searchBar.addEventListener('input', filterBookings);
    clearSearchButton.addEventListener('click', function() {
        searchBar.value = '';
        filterBookings();
    });

    // Edit booking functionality
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-booking')) {
            const bookingId = e.target.getAttribute('data-id');
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/admin/bookings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();
                
                if (result.success) {
                    const booking = result.bookings.find(b => b._id === bookingId);
                    
                    if (booking) {
                        document.getElementById('edit-booking-id').value = booking._id;
                        document.getElementById('edit-booking-status').value = booking.status;
                        document.getElementById('edit-booking-start-date').value = 
                            new Date(booking.startDate).toISOString().split('T')[0];
                        document.getElementById('edit-booking-end-date').value = 
                            new Date(booking.endDate).toISOString().split('T')[0];
                        document.getElementById('edit-booking-pickup').value = booking.locationPickup;
                        document.getElementById('edit-booking-dropoff').value = booking.locationDropoff;
                        
                        editModal.classList.remove('hidden');
                    }
                }
            } catch (error) {
                console.error('Error fetching booking:', error);
                alert('Error loading booking data.');
            }
        }
    });

    // Update booking
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const bookingId = document.getElementById('edit-booking-id').value;
        const formData = {
            status: document.getElementById('edit-booking-status').value,
            startDate: document.getElementById('edit-booking-start-date').value,
            endDate: document.getElementById('edit-booking-end-date').value,
            locationPickup: document.getElementById('edit-booking-pickup').value,
            locationDropoff: document.getElementById('edit-booking-dropoff').value
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Booking updated successfully!');
                location.reload();
            } else {
                alert(data.message || 'Failed to update booking');
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Error updating booking. Please try again.');
        }
    });

    // Delete booking functionality
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-booking')) {
            const bookingId = e.target.getAttribute('data-id');
            const row = e.target.closest('tr');
            const userName = row.querySelector('td:nth-child(2)').textContent;

            if (confirm(`Are you sure you want to delete the booking for "${userName}"?`)) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/admin/bookings/${bookingId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('Booking deleted successfully!');
                        location.reload();
                    } else {
                        alert(data.message || 'Failed to delete booking');
                    }
                } catch (error) {
                    console.error('Error deleting booking:', error);
                    alert('Error deleting booking. Please try again.');
                }
            }
        }
    });

    // Cancel edit
    cancelEditBtn.addEventListener('click', function() {
        editModal.classList.add('hidden');
    });

    // Close modal when clicking outside
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            editModal.classList.add('hidden');
        }
    });

    // Logout functionality
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/LoginPage/login';
    });
});
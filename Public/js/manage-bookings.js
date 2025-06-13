document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('bookingSearch');
    const searchBtn = document.getElementById('searchBookings');
    const clearBtn = document.getElementById('clearBookingSearch');
    const editModal = document.getElementById('edit-booking-modal');
    const editForm = document.getElementById('edit-booking-form');
    const cancelEditBtn = document.getElementById('cancel-booking-edit');

    let currentBookings = [];

    async function loadBookings(search = '') {
        try {
            const token = localStorage.getItem('token');
            const url = search ? `/api/admin/bookings?search=${encodeURIComponent(search)}` : '/api/admin/bookings';
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                currentBookings = result.bookings;
                updateBookingsTable(result.bookings);
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    }

    function updateBookingsTable(bookings) {
        const tbody = document.querySelector('#bookings-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        bookings.forEach((booking, index) => {
            const row = document.createElement('tr');
            row.setAttribute('data-booking-id', booking._id);
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'N/A'}</td>
                <td>${booking.car ? `${booking.car.brand} ${booking.car.model}` : 'N/A'}</td>
                <td>${new Date(booking.startDate).toLocaleDateString()}</td>
                <td>${new Date(booking.endDate).toLocaleDateString()}</td>
                <td>${booking.locationPickup}</td>
                <td>${booking.locationDropoff}</td>
                <td>
                    <span class="status status-${booking.status}">
                        ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                </td>
                <td>$${booking.totalPrice}</td>
                <td class="actions">
                    <button class="btn primary edit-booking" data-id="${booking._id}">Edit</button>
                    <button class="btn danger delete-booking" data-id="${booking._id}">Delete</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        loadBookings(searchTerm);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        loadBookings();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            loadBookings(searchTerm);
        }
    });

    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-booking')) {
            const bookingId = e.target.getAttribute('data-id');
            const booking = currentBookings.find(b => b._id === bookingId);
            
            if (booking) {
                document.getElementById('edit-booking-id').value = booking._id;
                document.getElementById('edit-booking-status').value = booking.status;
                document.getElementById('edit-booking-pickup').value = booking.locationPickup;
                document.getElementById('edit-booking-dropoff').value = booking.locationDropoff;
                
                editModal.classList.remove('hidden');
            }
        }

        if (e.target.classList.contains('delete-booking')) {
            const bookingId = e.target.getAttribute('data-id');
            
            if (confirm('Are you sure you want to delete this booking?')) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/admin/bookings/${bookingId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert('Booking deleted successfully!');
                        loadBookings();
                    } else {
                        alert(result.message || 'Failed to delete booking');
                    }
                } catch (error) {
                    console.error('Error deleting booking:', error);
                    alert('Error deleting booking');
                }
            }
        }
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookingId = document.getElementById('edit-booking-id').value;
        const formData = {
            status: document.getElementById('edit-booking-status').value,
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

            const result = await response.json();
            if (result.success) {
                alert('Booking updated successfully!');
                editModal.classList.add('hidden');
                loadBookings();
            } else {
                alert(result.message || 'Failed to update booking');
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Error updating booking');
        }
    });

    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.classList.add('hidden');
        }
    });
});
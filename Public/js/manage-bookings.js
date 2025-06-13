document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);

    const searchInput = $('bookingSearch');
    const searchBtn = $('searchBookings');
    const clearBtn = $('clearBookingSearch');
    const editModal = $('edit-booking-modal');
    const editForm = $('edit-booking-form');
    const cancelEditBtn = $('cancel-booking-edit');
    const editId = $('edit-booking-id');
    const editStatus = $('edit-booking-status');
    const editPickup = $('edit-booking-pickup');
    const editDropoff = $('edit-booking-dropoff');
    const bookingsTableBody = document.querySelector('#bookings-table tbody');

    let currentBookings = [];

    async function loadBookings(search = '') {
        try {
            const token = localStorage.getItem('token');
            const url = search
    ? `/api/admin/bookings?search=${encodeURIComponent(search)}`
    : `/api/admin/bookings`;
const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                currentBookings = result.bookings;
                updateBookingsTable(result.bookings);
            }
        } catch (err) {
            console.error('Error loading bookings:', err);
        }
    }

    function updateBookingsTable(bookings) {
        if (!bookingsTableBody) return;

        const rows = bookings.map((booking, i) => {
            const user = booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'N/A';
            const car = booking.car ? `${booking.car.brand} ${booking.car.model}` : 'N/A';
            const start = new Date(booking.startDate).toLocaleDateString();
            const end = new Date(booking.endDate).toLocaleDateString();
            const statusLabel = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

            return `
                <tr data-booking-id="${booking._id}">
                    <td>${i + 1}</td>
                    <td>${user}</td>
                    <td>${car}</td>
                    <td>${start}</td>
                    <td>${end}</td>
                    <td>${booking.locationPickup}</td>
                    <td>${booking.locationDropoff}</td>
                    <td><span class="status status-${booking.status}">${statusLabel}</span></td>
                    <td>$${booking.totalPrice}</td>
                    <td class="actions">
                        <button class="btn primary edit-booking" data-id="${booking._id}">Edit</button>
                        <button class="btn danger delete-booking" data-id="${booking._id}">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');

        bookingsTableBody.innerHTML = rows;
    }

    function handleSearch() {
        const term = searchInput.value.trim();
        loadBookings(term);
    }

    function clearSearch() {
        searchInput.value = '';
        loadBookings();
    }

    searchBtn.addEventListener('click', handleSearch);
    clearBtn.addEventListener('click', clearSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    document.addEventListener('click', async (e) => {
        const target = e.target;

        if (target.classList.contains('edit-booking')) {
            const bookingId = target.dataset.id;
            const booking = currentBookings.find(b => b._id === bookingId);
            if (booking) {
                editId.value = booking._id;
                editStatus.value = booking.status;
                editPickup.value = booking.locationPickup;
                editDropoff.value = booking.locationDropoff;
                editModal.classList.remove('hidden');
            }
        }

        if (target.classList.contains('delete-booking')) {
            const bookingId = target.dataset.id;
            if (confirm('Are you sure you want to delete this booking?')) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/admin/bookings/${bookingId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const result = await response.json();
                    if (result.success) {
                        alert('Booking deleted successfully!');
                        loadBookings();
                    } else {
                        alert(result.message || 'Failed to delete booking');
                    }
                } catch (err) {
                    console.error('Error deleting booking:', err);
                    alert('Error deleting booking');
                }
            }
        }

        if (target === editModal) {
            editModal.classList.add('hidden');
        }
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookingId = editId.value;
        const formData = {
            status: editStatus.value,
            locationPickup: editPickup.value,
            locationDropoff: editDropoff.value
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
        } catch (err) {
            console.error('Error updating booking:', err);
            alert('Error updating booking');
        }
    });

    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    // Initial load
    loadBookings();
});

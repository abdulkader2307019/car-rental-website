let editingCarId = null;

// Save car functionality
document.getElementById('save-car').addEventListener('click', async () => {
    const form = document.getElementById('car-form');
    const formData = new FormData();

    // Get form values
    const brand = document.getElementById("car-brand").value;
    const model = document.getElementById("car-model").value;
    const type = document.getElementById("car-type").value;
    const location = document.getElementById("car-location").value;
    const pricePerDay = Number(document.getElementById("car-price").value);
    const availability = document.getElementById("car-status").value;
    const seats = Number(document.getElementById("car-seats").value);
    const fuel = document.getElementById("car-fuel").value;
    const transmission = document.getElementById("car-transmission").value;
    const year = parseInt(document.getElementById("car-year").value);
    const imageInput = document.getElementById("car-image");

    // Validate required fields
    if (!brand || !model || !type || !location || !pricePerDay || !availability || !seats || !fuel || !transmission || !year) {
        alert('Please fill in all required fields.');
        return;
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 5) {
        alert('Please enter a valid year between 1900 and ' + (currentYear + 5));
        return;
    }

    // Validate price
    if (pricePerDay <= 0) {
        alert('Price per day must be greater than 0.');
        return;
    }

    // Validate seats
    if (seats < 1 || seats > 12) {
        alert('Number of seats must be between 1 and 12.');
        return;
    }

    // Check if image is required (for new cars)
    if (!editingCarId && imageInput.files.length === 0) {
        alert('Please select an image for the car.');
        return;
    }

    // Append form data
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('type', type);
    formData.append('location', location);
    formData.append('pricePerDay', pricePerDay);
    formData.append('availability', availability);
    formData.append('seats', seats);
    formData.append('fuel', fuel);
    formData.append('transmission', transmission);
    formData.append('year', year);

    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to perform this action.');
            return;
        }

        let url = '/api/cars';
        let method = 'POST';

        if (editingCarId) {
            url = `/api/cars/${editingCarId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            alert(editingCarId ? 'Car updated successfully!' : 'Car saved successfully!');
            location.reload();
        } else {
            alert(result.message || 'Failed to save car. Please try again.');
        }
    } catch (err) {
        console.error("Failed to save car:", err);
        alert("Failed to save car. Please check your connection and try again.");
    }
});

// Clear form functionality
document.getElementById('clear-form').addEventListener('click', () => {
    document.getElementById('car-form').reset();
    editingCarId = null;
    document.getElementById('save-car').textContent = 'Save Car';
    document.getElementById('cancel-edit').style.display = 'none';
    document.getElementById('car-image').required = true;
});

// Cancel edit functionality
document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('car-form').reset();
    editingCarId = null;
    document.getElementById('save-car').textContent = 'Save Car';
    document.getElementById('cancel-edit').style.display = 'none';
    document.getElementById('car-image').required = true;
});

// Edit car functionality
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-car')) {
        const carId = e.target.getAttribute('data-id');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/cars/${carId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                const car = result.car;
                
                // Populate form with car data
                document.getElementById('car-brand').value = car.brand;
                document.getElementById('car-model').value = car.model;
                document.getElementById('car-type').value = car.type;
                document.getElementById('car-location').value = car.location;
                document.getElementById('car-price').value = car.pricePerDay;
                document.getElementById('car-status').value = car.availability.toString();
                document.getElementById('car-seats').value = car.specs.seats;
                document.getElementById('car-fuel').value = car.specs.fuel === 'Petrol' ? 'true' : 'false';
                document.getElementById('car-transmission').value = car.specs.transmission === 'Automatic' ? 'true' : 'false';
                document.getElementById('car-year').value = car.year || '';

                // Set editing mode
                editingCarId = carId;
                document.getElementById('save-car').textContent = 'Update Car';
                document.getElementById('cancel-edit').style.display = 'inline-block';
                document.getElementById('car-image').required = false;

                // Scroll to form
                document.getElementById('car-form').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Failed to load car data.');
            }
        } catch (error) {
            console.error('Error loading car:', error);
            alert('Error loading car data.');
        }
    }
});

// Delete car functionality
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-car')) {
        const carId = e.target.getAttribute('data-id');
        const row = e.target.closest('tr');
        const carName = row.querySelector('td:nth-child(2)').textContent;

        if (confirm(`Are you sure you want to delete "${carName}"? This action cannot be undone.`)) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/cars/${carId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success) {
                    alert('Car deleted successfully!');
                    location.reload();
                } else {
                    alert(result.message || 'Failed to delete car.');
                }
            } catch (error) {
                console.error('Error deleting car:', error);
                alert('Error deleting car. Please try again.');
            }
        }
    }
});

// Form validation on input
document.addEventListener('DOMContentLoaded', () => {
    const yearInput = document.getElementById('car-year');
    const priceInput = document.getElementById('car-price');
    const seatsInput = document.getElementById('car-seats');

    if (yearInput) {
        yearInput.addEventListener('input', (e) => {
            const year = parseInt(e.target.value);
            const currentYear = new Date().getFullYear();
            if (year && (year < 1900 || year > currentYear + 5)) {
                e.target.setCustomValidity(`Year must be between 1900 and ${currentYear + 5}`);
            } else {
                e.target.setCustomValidity('');
            }
        });
    }

    if (priceInput) {
        priceInput.addEventListener('input', (e) => {
            const price = parseFloat(e.target.value);
            if (price && price <= 0) {
                e.target.setCustomValidity('Price must be greater than 0');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }

    if (seatsInput) {
        seatsInput.addEventListener('input', (e) => {
            const seats = parseInt(e.target.value);
            if (seats && (seats < 1 || seats > 12)) {
                e.target.setCustomValidity('Seats must be between 1 and 12');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }

    // Load dashboard stats for reports page
    if (document.getElementById('total-bookings')) {
        loadDashboardStats();
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = '/LoginPage/login';
        });
    }
});

// Dashboard stats functionality
async function loadDashboardStats() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.success) {
            const { stats, details } = result;

            // Update stat cards
            document.getElementById('total-bookings').textContent = stats.totalBookings;
            document.getElementById('active-rentals').textContent = stats.activeRentals;
            document.getElementById('total-revenue').textContent = `$${stats.totalRevenue}`;
            document.getElementById('available-cars').textContent = stats.availableCars;

            // Add click handlers for stat cards
            document.querySelectorAll('.stat-card').forEach(card => {
                card.addEventListener('click', function() {
                    const target = this.getAttribute('data-target');
                    showReportDetails(target, details);
                });
            });
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function showReportDetails(target, details) {
    // Hide all report details
    document.querySelectorAll('.report-details').forEach(detail => {
        detail.classList.add('hidden');
    });

    // Show selected report details
    const targetElement = document.getElementById(target);
    if (targetElement) {
        targetElement.classList.remove('hidden');

        // Populate data based on target
        switch(target) {
            case 'bookings-details':
                populateBookingsDetails(details.bookings);
                break;
            case 'active-rentals-details':
                populateActiveRentalsDetails(details.activeRentals);
                break;
            case 'revenue-details':
                populateRevenueDetails(details.revenueData);
                break;
            case 'available-cars-details':
                populateAvailableCarsDetails(details.availableCars);
                break;
        }
    }
}

function populateBookingsDetails(bookings) {
    const tbody = document.getElementById('bookings-details-body');
    tbody.innerHTML = '';

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking._id.substring(0, 8)}...</td>
            <td>${booking.car ? `${booking.car.brand} ${booking.car.model}` : 'N/A'}</td>
            <td>${booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'N/A'}</td>
            <td>${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</td>
            <td>${booking.status}</td>
            <td>$${booking.totalPrice || 'N/A'}</td>
        `;
        tbody.appendChild(row);
    });
}

function populateActiveRentalsDetails(activeRentals) {
    const tbody = document.getElementById('active-rentals-details-body');
    tbody.innerHTML = '';

    activeRentals.forEach(rental => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rental._id.substring(0, 8)}...</td>
            <td>${rental.car ? `${rental.car.brand} ${rental.car.model}` : 'N/A'}</td>
            <td>${rental.user ? `${rental.user.firstName} ${rental.user.lastName}` : 'N/A'}</td>
            <td>${new Date(rental.startDate).toLocaleDateString()} - ${new Date(rental.endDate).toLocaleDateString()}</td>
            <td>$${rental.totalPrice || 'N/A'}</td>
        `;
        tbody.appendChild(row);
    });
}

function populateRevenueDetails(revenueData) {
    const tbody = document.getElementById('revenue-details-body');
    tbody.innerHTML = '';

    revenueData.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.car}</td>
            <td>${data.count}</td>
            <td>$${data.revenue}</td>
            <td>$${data.pricePerDay}</td>
        `;
        tbody.appendChild(row);
    });
}

function populateAvailableCarsDetails(availableCars) {
    const tbody = document.getElementById('available-cars-details-body');
    tbody.innerHTML = '';

    availableCars.forEach(car => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${car._id.substring(0, 8)}...</td>
            <td>${car.brand} ${car.model}</td>
            <td>${car.year || 'N/A'}</td>
            <td>$${car.pricePerDay}</td>
        `;
        tbody.appendChild(row);
    });
}
// Simple data storage
const data = {
    bookings: [],
    cars: [],
    users: []
};

// Initialize the dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    showSection('bookings');
});

// Load sample data if none exists
function loadData() {
    const savedData = localStorage.getItem('carRentalData');
    
    if (savedData) {
        Object.assign(data, JSON.parse(savedData));
    } else {
        // Sample data
        data.bookings = [
            {id: 1, userId: 1, carId: 1, dates: 'Jun 15-20, 2023', status: 'pending', total: 750},
            {id: 2, userId: 2, carId: 3, dates: 'Jun 18-25, 2023', status: 'approved', total: 1225},
            {id: 3, userId: 3, carId: 2, dates: 'Jul 1-10, 2023', status: 'rejected', total: 1800}
        ];
        
        data.cars = [
            {id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 150, status: 'available'},
            {id: 2, make: 'BMW', model: 'X5', year: 2021, price: 200, status: 'available'},
            {id: 3, make: 'Mercedes', model: 'E-Class', year: 2023, price: 175, status: 'unavailable'}
        ];
        
        data.users = [
            {id: 1, name: 'John Doe', email: 'john@example.com', status: 'active'},
            {id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active'},
            {id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'suspended'}
        ];
        
        saveData();
    }
    
    updateTables();
    updateStats();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('carRentalData', JSON.stringify(data));
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            
            // Update active nav link
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Car form
    document.getElementById('save-car').addEventListener('click', saveCar);
    document.getElementById('clear-form').addEventListener('click', () => {
        document.getElementById('car-form').reset();
    });
    
    // Settings form
    document.getElementById('settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Settings saved!');
    });
}

// Show a specific section
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(sectionId).classList.remove('hidden');
}

// Update all tables with current data
function updateTables() {
    updateBookingsTable();
    updateCarsTable();
    updateUsersTable();
}

// Update bookings table
function updateBookingsTable() {
    const tbody = document.querySelector('#bookings-table tbody');
    tbody.innerHTML = '';
    
    data.bookings.forEach(booking => {
        const user = data.users.find(u => u.id === booking.userId) || {};
        const car = data.cars.find(c => c.id === booking.carId) || {};
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${user.name || 'Unknown'}</td>
            <td>${car.make ? `${car.make} ${car.model}` : 'Unknown'}</td>
            <td>${booking.dates}</td>
            <td><span class="status-${booking.status}">${booking.status}</span></td>
            <td class="actions">
                ${booking.status === 'pending' ? `
                    <button class="btn primary" onclick="updateBookingStatus(${booking.id}, 'approved')">Approve</button>
                    <button class="btn danger" onclick="updateBookingStatus(${booking.id}, 'rejected')">Reject</button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update cars table
function updateCarsTable() {
    const tbody = document.querySelector('#cars-table tbody');
    tbody.innerHTML = '';
    
    data.cars.forEach(car => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${car.id}</td>
            <td>${car.make} ${car.model}</td>
            <td>${car.year}</td>
            <td>$${car.price}/day</td>
            <td><span class="status-${car.status}">${car.status}</span></td>
            <td>
                <button class="btn primary" onclick="editCar(${car.id})">Edit</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update users table
function updateUsersTable() {
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = '';
    
    data.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="status-${user.status}">${user.status}</span></td>
            <td>
                ${user.status === 'active' ? 
                    `<button class="btn danger" onclick="updateUserStatus(${user.id}, 'suspended')">Suspend</button>` :
                    `<button class="btn primary" onclick="updateUserStatus(${user.id}, 'active')">Activate</button>`
                }
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    document.getElementById('total-bookings').textContent = data.bookings.length;
    
    const activeRentals = data.bookings.filter(b => b.status === 'approved').length;
    document.getElementById('active-rentals').textContent = activeRentals;
    
    const totalRevenue = data.bookings.reduce((sum, b) => sum + (b.total || 0), 0);
    document.getElementById('total-revenue').textContent = `$${totalRevenue}`;
    
    const availableCars = data.cars.filter(c => c.status === 'available').length;
    document.getElementById('available-cars').textContent = availableCars;
}

// Booking actions
function updateBookingStatus(bookingId, newStatus) {
    const booking = data.bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = newStatus;
        saveData();
        updateTables();
        updateStats();
        alert(`Booking ${newStatus}!`);
    }
}

// User actions
function updateUserStatus(userId, newStatus) {
    const user = data.users.find(u => u.id === userId);
    if (user) {
        user.status = newStatus;
        saveData();
        updateTables();
        alert(`User ${newStatus}!`);
    }
}

// Car actions
function editCar(carId) {
    const car = data.cars.find(c => c.id === carId);
    if (car) {
        document.getElementById('car-make').value = car.make;
        document.getElementById('car-model').value = car.model;
        document.getElementById('car-year').value = car.year;
        document.getElementById('car-price').value = car.price;
        document.getElementById('car-status').value = car.status;
        
        // Scroll to form
        showSection('cars');
        document.getElementById('car-form').scrollIntoView();
    }
}

function saveCar() {
    const make = document.getElementById('car-make').value;
    const model = document.getElementById('car-model').value;
    const year = parseInt(document.getElementById('car-year').value);
    const price = parseInt(document.getElementById('car-price').value);
    const status = document.getElementById('car-status').value;
    
    if (!make || !model || !year || !price) {
        alert('Please fill all fields');
        return;
    }
    
    // Check if we're editing existing car
    const existingCar = data.cars.find(c => 
        c.make === make && c.model === model && c.year === year
    );
    
    if (existingCar) {
        // Update existing car
        existingCar.price = price;
        existingCar.status = status;
    } else {
        // Add new car
        const newId = data.cars.length > 0 ? Math.max(...data.cars.map(c => c.id)) + 1 : 1;
        data.cars.push({
            id: newId,
            make,
            model,
            year,
            price,
            status
        });
    }
    
    saveData();
    updateTables();
    updateStats();
    document.getElementById('car-form').reset();
    alert('Car saved successfully!');
}
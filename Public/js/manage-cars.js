document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('carSearch');
    const searchBtn = document.getElementById('searchCars');
    const clearBtn = document.getElementById('clearCarSearch');

    async function loadCars(search = '') {
    try {
        const token = localStorage.getItem('token');
        const url = search 
            ? `/api/admin/cars?search=${encodeURIComponent(search)}` 
            : '/api/admin/cars';
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            updateCarsTable(result.cars);
        } else {
            console.error('API error:', result.message);
        }
    } catch (error) {
        console.error('Error loading cars:', error);
        alert('Failed to load cars. Please try again.');
    }
}

    function updateCarsTable(cars) {
        const tbody = document.querySelector('#cars-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        cars.forEach((car, index) => {
            const row = document.createElement('tr');
            row.setAttribute('data-car-id', car._id);
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${car.brand} ${car.model}</td>
                <td>${car.year || 'N/A'}</td>
                <td>${car.type}</td>
                <td>${car.location}</td>
                <td>$${car.pricePerDay}</td>
                <td>
                    <span class="status ${car.availability ? 'active' : 'expired'}">
                        ${car.availability ? 'Available' : 'NotAvailable'}
                    </span>
                </td>
                <td>
                    ${car.image && car.image.data ? 
                        `<img src="/api/cars/${car._id}/image" alt="Car Image" class="car-thumbnail">` : 
                        '<span>No Image</span>'
                    }
                </td>
                <td class="actions">
                    <button class="btn primary edit-car" data-id="${car._id}">Edit</button>
                    <button class="btn danger delete-car" data-id="${car._id}">Delete</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        loadCars(searchTerm);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        loadCars();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            loadCars(searchTerm);
        }
    });
});
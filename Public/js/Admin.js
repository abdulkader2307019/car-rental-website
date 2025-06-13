document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/';
                } else {
                    console.error('Logout failed');
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Logout error:', error);
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/';
            }
        });
    }

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            document.querySelectorAll('.report-details').forEach(detail => {
                detail.classList.add('hidden');
            });
            
            const targetElement = document.getElementById(target);
            if (targetElement) {
                targetElement.classList.remove('hidden');
            }
        });
    });
});

let editingCarId = null;

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

                editingCarId = carId;
                document.getElementById('save-car').textContent = 'Update Car';
                document.getElementById('cancel-edit').style.display = 'inline-block';
                document.getElementById('car-image').required = false;

                document.getElementById('car-form').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Failed to load car data.');
            }
        } catch (error) {
            console.error('Error loading car:', error);
            alert('Error loading car data.');
        }
    }

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

const saveCarBtn = document.getElementById('save-car');
if (saveCarBtn) {
    saveCarBtn.addEventListener('click', async () => {
        const form = document.getElementById('car-form');
        const formData = new FormData();

        const brand = document.getElementById("car-brand").value;
        const model = document.getElementById("car-model").value;
        const type = document.getElementById("car-type").value;
        const location = document.getElementById("car-location").value;
        const pricePerDay = document.getElementById("car-price").value;
        const availability = document.getElementById("car-status").value;
        const seats = document.getElementById("car-seats").value;
        const fuel = document.getElementById("car-fuel").value;
        const transmission = document.getElementById("car-transmission").value;
        const year = document.getElementById("car-year").value;
        const imageInput = document.getElementById("car-image");

        if (!brand || !model || !type || !location || !pricePerDay || !availability || !seats || !fuel || !transmission || !year) {
            alert('Please fill in all required fields.');
            return;
        }

        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 5) {
            alert('Please enter a valid year between 1900 and ' + (currentYear + 5));
            return;
        }

        if (pricePerDay <= 0) {
            alert('Price per day must be greater than 0.');
            return;
        }

        if (seats < 1 || seats > 12) {
            alert('Number of seats must be between 1 and 12.');
            return;
        }

        if (!editingCarId && imageInput.files.length === 0) {
            alert('Please select an image for the car.');
            return;
        }

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
                alert(result.message || (editingCarId ? 'Car updated successfully!' : 'Car saved successfully!'));
                location.reload();
            } else {
                alert(result.message || 'Failed to save car. Please try again.');
            }
        } catch (err) {
            console.error("Failed to save car:", err);
            alert("Failed to save car. Please check your connection and try again.");
        }
    });
}

const clearFormBtn = document.getElementById('clear-form');
if (clearFormBtn) {
    clearFormBtn.addEventListener('click', () => {
        document.getElementById('car-form').reset();
        editingCarId = null;
        document.getElementById('save-car').textContent = 'Save Car';
        document.getElementById('cancel-edit').style.display = 'none';
        document.getElementById('car-image').required = true;
    });
}

const cancelEditBtn = document.getElementById('cancel-edit');
if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
        document.getElementById('car-form').reset();
        editingCarId = null;
        document.getElementById('save-car').textContent = 'Save Car';
        document.getElementById('cancel-edit').style.display = 'none';
        document.getElementById('car-image').required = true;
    });
}
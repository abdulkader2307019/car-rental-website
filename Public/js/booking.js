document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to make a booking.');
        window.location.href = '/LoginPage/login';
        return;
    }

    const form = document.getElementById('bookingForm');
    const planSelect = document.getElementById('plan');
    const pickupDateInput = document.getElementById('pickupDate');
    const returnDateInput = document.getElementById('returnDate');
    const applyDiscountBtn = document.getElementById('applyDiscount');
    const discountCodeInput = document.getElementById('discountCode');
    const receiptModal = document.getElementById('receiptModal');

    let originalPrice = window.carData.pricePerDay;
    let currentBookingData = null;
    let discountApplied = false;

    const today = new Date().toISOString().split('T')[0];
    pickupDateInput.min = today;
    returnDateInput.min = today;

    function calculatePrice() {
        const pickupDate = new Date(pickupDateInput.value);
        const returnDate = new Date(returnDateInput.value);
        
        if (pickupDate && returnDate && returnDate > pickupDate) {
            const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
            const plan = planSelect.value;
            
            let basePrice = originalPrice;
            let discountText = '';

            switch(plan) {
                case 'weekly':
                    basePrice = originalPrice * 0.9;
                    discountText = ' (10% weekly discount)';
                    break;
                case 'monthly':
                    basePrice = originalPrice * 0.8;
                    discountText = ' (20% monthly discount)';
                    break;
            }

            const totalPrice = basePrice * days;
            
            //document.getElementById('basePrice').textContent = `$${basePrice.toFixed(0)}`;
            document.getElementById('duration').textContent = `${days} day(s)${discountText}`;
            document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(0)}`;
        } else {
            document.getElementById('basePrice').textContent = `$${originalPrice}`;
            document.getElementById('duration').textContent = '1 day(s)';
            document.getElementById('totalPrice').textContent = `$${originalPrice}`;
        }
    }

    planSelect.addEventListener('change', calculatePrice);
    pickupDateInput.addEventListener('change', function() {
        returnDateInput.min = this.value;
        calculatePrice();
    });
    returnDateInput.addEventListener('change', function() {
        const pickupDate = new Date(pickupDateInput.value);
        const returnDate = new Date(this.value);

        if (returnDate <= pickupDate) {
            alert('Return date must be after pickup date.');
            this.value = '';
        }
        calculatePrice();
    });

    if (applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', async function() {
            const code = discountCodeInput.value.trim();
            
            if (!code) {
                alert('Please enter a discount code.');
                return;
            }

            if (discountApplied) {
                alert('A discount has already been applied to this booking.');
                return;
            }

            try {
                const currentTotal = parseFloat(document.getElementById('totalPrice').textContent.replace('$', ''));
                
                const response = await fetch('/api/discounts/apply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code: code,
                        originalPrice: currentTotal
                    })
                });

                const data = await response.json();

                if (data.success) {
                    const discountAmount = currentTotal - data.discountedPrice;
                    document.getElementById('discountRow').style.display = 'flex';
                    document.getElementById('discountAmount').textContent = `-$${discountAmount.toFixed(0)}`;
                    document.getElementById('totalPrice').textContent = `$${data.discountedPrice.toFixed(0)}`;
                    discountApplied = true;
                    applyDiscountBtn.disabled = true;
                    applyDiscountBtn.textContent = 'Applied';
                    alert('Discount applied successfully!');
                } else {
                    alert(data.message || 'Failed to apply discount');
                }
            } catch (error) {
                console.error('Error applying discount:', error);
                alert('Error applying discount. Please try again.');
            }
        });
    }

    function validateForm() {
        const pickupLocation = document.getElementById('pickupLocation').value;
        const returnLocation = document.getElementById('returnLocation').value;
        const pickupDate = pickupDateInput.value;
        const returnDate = returnDateInput.value;
        const pickupTime = document.getElementById('pickupTime').value;
        const returnTime = document.getElementById('returnTime').value;

        if (!pickupLocation || !returnLocation || !pickupDate || !returnDate || !pickupTime || !returnTime) {
            alert('Please fill in all required fields.');
            return false;
        }

        const pickup = new Date(`${pickupDate}T${pickupTime}`);
        const returnDateTime = new Date(`${returnDate}T${returnTime}`);

        if (returnDateTime <= pickup) {
            alert('Return date and time must be after pickup date and time.');
            return false;
        }

        return true;
    }

    function showReceipt(bookingData) {
        const receiptDetails = document.getElementById('receiptDetails');
        const pickupDateTime = new Date(`${bookingData.startDate}T${document.getElementById('pickupTime').value}`);
        const returnDateTime = new Date(`${bookingData.endDate}T${document.getElementById('returnTime').value}`);
        
        receiptDetails.innerHTML = `
            <div class="receipt-item">
                <span>Car:</span>
                <span>${window.carData.brand} ${window.carData.model}</span>
            </div>
            <div class="receipt-item">
                <span>Pickup:</span>
                <span>${bookingData.locationPickup}</span>
            </div>
            <div class="receipt-item">
                <span>Pickup Date & Time:</span>
                <span>${pickupDateTime.toLocaleString()}</span>
            </div>
            <div class="receipt-item">
                <span>Return:</span>
                <span>${bookingData.locationDropoff}</span>
            </div>
            <div class="receipt-item">
                <span>Return Date & Time:</span>
                <span>${returnDateTime.toLocaleString()}</span>
            </div>
            <div class="receipt-item">
                <span>Duration:</span>
                <span>${document.getElementById('duration').textContent}</span>
            </div>
            ${discountApplied ? `
            <div class="receipt-item">
                <span>Discount:</span>
                <span>${document.getElementById('discountAmount').textContent}</span>
            </div>
            ` : ''}
            <div class="receipt-item">
                <span>Total Amount:</span>
                <span>${document.getElementById('totalPrice').textContent}</span>
            </div>
        `;
        
        receiptModal.classList.remove('hidden');
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) return;

        const bookingData = {
            carId: window.carData.id,
            startDate: pickupDateInput.value,
            endDate: returnDateInput.value,
            locationPickup: document.getElementById('pickupLocation').value,
            locationDropoff: document.getElementById('returnLocation').value
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            const data = await response.json();

            if (data.success) {
                currentBookingData = data.booking;
                showReceipt(bookingData);
            } else {
                alert(data.error || 'Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Error creating booking. Please try again.');
        }
    });

    document.getElementById('confirmBooking').addEventListener('click', async function() {
        if (!currentBookingData) return;

        try {
            const response = await fetch(`/api/bookings/${currentBookingData._id}/confirm`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                alert('Booking confirmed successfully!');
                window.location.href = '/profile';
            } else {
                alert(data.error || 'Failed to confirm booking.');
            }
        } catch (error) {
            console.error('Confirm booking error:', error);
            alert('Error confirming booking. Please try again.');
        }
    });

    document.getElementById('cancelBooking').addEventListener('click', async function() {
        if (!currentBookingData) {
            receiptModal.classList.add('hidden');
            return;
        }

        try {
            const response = await fetch(`/api/bookings/${currentBookingData._id}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                alert('Booking cancelled.');
                receiptModal.classList.add('hidden');
                form.reset();
                calculatePrice();
            } else {
                alert(data.error || 'Failed to cancel booking.');
            }
        } catch (error) {
            console.error('Cancel booking error:', error);
            alert('Error cancelling booking. Please try again.');
        }
    });

    receiptModal.addEventListener('click', function(e) {
        if (e.target === receiptModal) {
            receiptModal.classList.add('hidden');
        }
    });

    calculatePrice();
});
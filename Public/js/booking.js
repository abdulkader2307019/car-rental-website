document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const planSelect = document.getElementById('plan');
    const priceDisplay = document.getElementById('priceCalc');
    const priceBreakdown = document.getElementById('priceBreakdown');
    const pickupDateInput = document.getElementById('pickupDate');
    const returnDateInput = document.getElementById('returnDate');
    const applyDiscountBtn = document.getElementById('applyDiscount');
    const discountCodeInput = document.getElementById('discountCode');

    let originalPrice = window.carData.pricePerDay;
    let currentPrice = originalPrice;
    let discountApplied = false;

    // Set minimum date to today
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
            let multiplier = days;
            let discountText = '';

            switch(plan) {
                case 'weekly':
                    basePrice = originalPrice * 0.9; // 10% discount
                    discountText = ' (10% weekly discount applied)';
                    break;
                case 'monthly':
                    basePrice = originalPrice * 0.8; // 20% discount
                    discountText = ' (20% monthly discount applied)';
                    break;
                default:
                    discountText = '';
            }

            currentPrice = basePrice * multiplier;
            priceDisplay.textContent = currentPrice.toFixed(0);
            priceBreakdown.textContent = `${days} day(s) × $${basePrice.toFixed(0)}${discountText}`;
        } else {
            currentPrice = originalPrice;
            priceDisplay.textContent = currentPrice.toFixed(0);
            priceBreakdown.textContent = 'Select dates to calculate total price';
        }
    }

    // Event listeners for price calculation
    planSelect.addEventListener('change', calculatePrice);
    pickupDateInput.addEventListener('change', function() {
        // Update return date minimum
        returnDateInput.min = this.value;
        calculatePrice();
    });
    returnDateInput.addEventListener('change', calculatePrice);

    // Date validation
    returnDateInput.addEventListener('change', function() {
        const pickupDate = new Date(pickupDateInput.value);
        const returnDate = new Date(this.value);

        if (returnDate <= pickupDate) {
            alert('Return date must be after pickup date.');
            this.value = '';
        }
    });

    // Discount functionality
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
            const response = await fetch('/api/discounts/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code,
                    originalPrice: currentPrice
                })
            });

            const data = await response.json();

            if (data.success) {
                currentPrice = data.discountedPrice;
                priceDisplay.textContent = currentPrice.toFixed(0);
                priceBreakdown.textContent += ` - Discount applied: ${code}`;
                discountApplied = true;
                applyDiscountBtn.disabled = true;
                applyDiscountBtn.textContent = 'Discount Applied';
                alert('Discount applied successfully!');
            } else {
                alert(data.message || 'Failed to apply discount');
            }
        } catch (error) {
            console.error('Error applying discount:', error);
            alert('Error applying discount. Please try again.');
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate form
        const pickup = document.getElementById('pickup').value.trim();
        const returnLoc = document.getElementById('return').value.trim();
        const pickupDate = pickupDateInput.value;
        const returnDate = returnDateInput.value;

        if (!pickup || !returnLoc || !pickupDate || !returnDate) {
            alert('Please fill in all required fields.');
            return;
        }

        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to make a booking.');
            window.location.href = '/LoginPage/login';
            return;
        }

        // Prepare booking data
        const bookingData = {
            carId: window.carData.id,
            startDate: pickupDate,
            endDate: returnDate,
            locationPickup: pickup,
            locationDropoff: returnLoc
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
                alert(`Booking successful! Your ${window.carData.brand} ${window.carData.model} has been booked.`);
                window.location.href = '/profile'; // Redirect to profile to see bookings
            } else {
                alert(data.error || 'Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Error creating booking. Please try again.');
        }
    });

    // Initial price calculation
    calculatePrice();
});
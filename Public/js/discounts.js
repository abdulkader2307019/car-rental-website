document.addEventListener('DOMContentLoaded', function() {
    const discountForm = document.getElementById('discount-form');
    const editDiscountForm = document.getElementById('edit-discount-form');
    const editModal = document.getElementById('edit-discount-modal');
    const clearFormBtn = document.getElementById('clear-discount-form');
    const cancelEditBtn = document.getElementById('cancel-edit');

    // Create new discount
    discountForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            code: document.getElementById('discount-code').value.trim().toUpperCase(),
            discountPercent: parseInt(document.getElementById('discount-percent').value),
            validUntil: document.getElementById('discount-valid-until').value,
            usageLimit: document.getElementById('discount-usage-limit').value || null
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/discounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Discount created successfully!');
                location.reload();
            } else {
                alert(data.message || 'Failed to create discount');
            }
        } catch (error) {
            console.error('Error creating discount:', error);
            alert('Error creating discount. Please try again.');
        }
    });

    // Clear form
    clearFormBtn.addEventListener('click', function() {
        discountForm.reset();
    });

    // Edit discount
    document.querySelectorAll('.edit-discount').forEach(button => {
        button.addEventListener('click', async function() {
            const discountId = this.getAttribute('data-id');
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/discounts`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                
                if (data.success) {
                    const discount = data.discounts.find(d => d._id === discountId);
                    
                    if (discount) {
                        // Populate edit form
                        document.getElementById('edit-discount-id').value = discount._id;
                        document.getElementById('edit-discount-code').value = discount.code;
                        document.getElementById('edit-discount-percent').value = discount.discountPercent;
                        document.getElementById('edit-discount-valid-until').value = 
                            new Date(discount.validUntil).toISOString().split('T')[0];
                        document.getElementById('edit-discount-usage-limit').value = discount.usageLimit || '';
                        
                        // Show modal
                        editModal.classList.remove('hidden');
                    }
                }
            } catch (error) {
                console.error('Error fetching discount:', error);
                alert('Error loading discount data.');
            }
        });
    });

    // Update discount
    editDiscountForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const discountId = document.getElementById('edit-discount-id').value;
        const formData = {
            code: document.getElementById('edit-discount-code').value.trim().toUpperCase(),
            discountPercent: parseInt(document.getElementById('edit-discount-percent').value),
            validUntil: document.getElementById('edit-discount-valid-until').value,
            usageLimit: document.getElementById('edit-discount-usage-limit').value || null
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/discounts/${discountId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Discount updated successfully!');
                location.reload();
            } else {
                alert(data.message || 'Failed to update discount');
            }
        } catch (error) {
            console.error('Error updating discount:', error);
            alert('Error updating discount. Please try again.');
        }
    });

    // Cancel edit
    cancelEditBtn.addEventListener('click', function() {
        editModal.classList.add('hidden');
    });

    // Delete discount
    document.querySelectorAll('.delete-discount').forEach(button => {
        button.addEventListener('click', async function() {
            const discountId = this.getAttribute('data-id');
            const discountCode = this.closest('tr').querySelector('.discount-code').textContent;

            if (confirm(`Are you sure you want to delete discount code "${discountCode}"?`)) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/discounts/${discountId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('Discount deleted successfully!');
                        location.reload();
                    } else {
                        alert(data.message || 'Failed to delete discount');
                    }
                } catch (error) {
                    console.error('Error deleting discount:', error);
                    alert('Error deleting discount. Please try again.');
                }
            }
        });
    });

    // Close modal when clicking outside
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            editModal.classList.add('hidden');
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const editUserModal = document.getElementById('edit-user-modal');
    const editUserForm = document.getElementById('edit-user-form');
    const cancelEditBtn = document.getElementById('cancel-edit-user');

    // Edit user functionality
    document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', async function() {
            const userId = this.getAttribute('data-id');
            const row = this.closest('tr');
            
            // Get user data from the table row
            const cells = row.querySelectorAll('td');
            const fullName = cells[1].textContent.trim().split(' ');
            const firstName = fullName[0] || '';
            const lastName = fullName.slice(1).join(' ') || '';
            const email = cells[2].textContent.trim();
            const phone = cells[3].textContent.trim();
            const age = cells[4].textContent.trim();
            const gender = cells[5].textContent.trim();
            const country = cells[6].textContent.trim();
            
            // Populate the form
            document.getElementById('edit-user-id').value = userId;
            document.getElementById('edit-first-name').value = firstName;
            document.getElementById('edit-last-name').value = lastName;
            document.getElementById('edit-email').value = email;
            document.getElementById('edit-phone').value = phone === 'N/A' ? '' : phone;
            document.getElementById('edit-age').value = age === 'N/A' ? '' : age;
            document.getElementById('edit-gender').value = gender === 'N/A' ? 'Other' : gender;
            document.getElementById('edit-country').value = country === 'N/A' ? '' : country;
            
            // Show modal
            editUserModal.classList.remove('hidden');
        });
    });

    // Update user form submission
    editUserForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const userId = document.getElementById('edit-user-id').value;
        const formData = {
            firstName: document.getElementById('edit-first-name').value.trim(),
            lastName: document.getElementById('edit-last-name').value.trim(),
            email: document.getElementById('edit-email').value.trim(),
            phoneNumber: document.getElementById('edit-phone').value.trim(),
            age: document.getElementById('edit-age').value ? parseInt(document.getElementById('edit-age').value) : undefined,
            gender: document.getElementById('edit-gender').value,
            country: document.getElementById('edit-country').value.trim()
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert('User updated successfully!');
                location.reload();
            } else {
                alert(data.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user. Please try again.');
        }
    });

    // Cancel edit
    cancelEditBtn.addEventListener('click', function() {
        editUserModal.classList.add('hidden');
    });

    // Delete user functionality
    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', async function() {
            const userId = this.getAttribute('data-id');
            const row = this.closest('tr');
            const userName = row.querySelector('td:nth-child(2)').textContent.trim();

            if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/admin/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('User deleted successfully!');
                        row.remove();
                    } else {
                        alert(data.message || 'Failed to delete user');
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user. Please try again.');
                }
            }
        });
    });

    // Close modal when clicking outside
    editUserModal.addEventListener('click', function(e) {
        if (e.target === editUserModal) {
            editUserModal.classList.add('hidden');
        }
    });
});
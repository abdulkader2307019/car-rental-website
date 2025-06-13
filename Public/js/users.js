document.addEventListener('DOMContentLoaded', () => {
    const editModal = document.getElementById('edit-user-modal');
    const editForm = document.getElementById('edit-user-form');
    const cancelBtn = document.getElementById('cancel-user-edit');

    // Open edit modal and populate fields
    document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-id');
            const row = button.closest('tr');
            const columns = row.querySelectorAll('td');

            document.getElementById('edit-user-id').value = userId;
            document.getElementById('edit-user-firstName').value = columns[1].innerText.split(' ')[0];
            document.getElementById('edit-user-lastName').value = columns[1].innerText.split(' ')[1] || '';
            document.getElementById('edit-user-email').value = columns[2].innerText;
            document.getElementById('edit-user-phoneNumber').value = columns[3].innerText !== 'N/A' ? columns[3].innerText : '';
            document.getElementById('edit-user-age').value = columns[4].innerText !== 'N/A' ? columns[4].innerText : '';
            document.getElementById('edit-user-country').value = columns[5].innerText !== 'N/A' ? columns[5].innerText : '';
            document.getElementById('edit-user-gender').value = columns[6].innerText !== 'N/A' ? columns[6].innerText : '';

            editModal.classList.remove('hidden');
        });
    });

    // Close modal
    cancelBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    // Submit updated user data
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = document.getElementById('edit-user-id').value;
        const payload = {
            firstName: document.getElementById('edit-user-firstName').value,
            lastName: document.getElementById('edit-user-lastName').value,
            email: document.getElementById('edit-user-email').value,
            phoneNumber: document.getElementById('edit-user-phoneNumber').value,
            age: document.getElementById('edit-user-age').value,
            country: document.getElementById('edit-user-country').value,
            gender: document.getElementById('edit-user-gender').value
        };

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                location.reload();
            } else {
                alert(data.message || 'Failed to update user');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating user');
        }
    });

    // Handle delete
    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-id');

            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    const res = await fetch(`/api/admin/users/${userId}`, {
                        method: 'DELETE'
                    });

                    const data = await res.json();
                    if (data.success) {
                        button.closest('tr').remove();
                    } else {
                        alert(data.message || 'Failed to delete user');
                    }
                } catch (err) {
                    console.error(err);
                    alert('Error deleting user');
                }
            }
        });
    });
});
// Search functionality
document.getElementById('searchUsers').addEventListener('click', () => {
    const query = document.getElementById('userSearch').value.toLowerCase();

    document.querySelectorAll('#users-table tbody tr').forEach(row => {
        const rowText = row.innerText.toLowerCase();
        row.style.display = rowText.includes(query) ? '' : 'none';
    });
});

// Clear search
document.getElementById('clearUserSearch').addEventListener('click', () => {
    document.getElementById('userSearch').value = '';
    document.querySelectorAll('#users-table tbody tr').forEach(row => {
        row.style.display = '';
    });
});
// trigger by enter key
document.getElementById('userSearch').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('searchUsers').click();
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const editModal = document.getElementById('edit-user-modal');
    const editForm = document.getElementById('edit-user-form');
    const cancelEditBtn = document.getElementById('cancel-user-edit');
    const searchBar = document.getElementById('userSearchBar');
    const searchButton = document.getElementById('userSearchButton');
    const clearSearchButton = document.getElementById('userClearSearch');

    // Search functionality
    function filterUsers() {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = document.querySelectorAll('#users-table tbody tr');

        rows.forEach(row => {
            const userName = row.cells[1].textContent.toLowerCase();
            const userEmail = row.cells[2].textContent.toLowerCase();
            const userPhone = row.cells[3].textContent.toLowerCase();

            if (userName.includes(searchTerm) || userEmail.includes(searchTerm) || userPhone.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchButton.addEventListener('click', filterUsers);
    searchBar.addEventListener('input', filterUsers);
    clearSearchButton.addEventListener('click', function() {
        searchBar.value = '';
        filterUsers();
    });

    // Edit user functionality
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-user')) {
            const userId = e.target.getAttribute('data-id');
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/admin/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();
                
                if (result.success) {
                    const user = result.users.find(u => u._id === userId);
                    
                    if (user) {
                        document.getElementById('edit-user-id').value = user._id;
                        document.getElementById('edit-user-first-name').value = user.firstName;
                        document.getElementById('edit-user-last-name').value = user.lastName;
                        document.getElementById('edit-user-email').value = user.email;
                        document.getElementById('edit-user-gender').value = user.gender || '';
                        
                        editModal.classList.remove('hidden');
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                alert('Error loading user data.');
            }
        }
    });

    // Update user
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const userId = document.getElementById('edit-user-id').value;
        const formData = {
            firstName: document.getElementById('edit-user-first-name').value,
            lastName: document.getElementById('edit-user-last-name').value,
            email: document.getElementById('edit-user-email').value,
            gender: document.getElementById('edit-user-gender').value
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

    // Delete user functionality
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-user')) {
            const userId = e.target.getAttribute('data-id');
            const row = e.target.closest('tr');
            const userName = row.querySelector('td:nth-child(2)').textContent;

            if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
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
                        location.reload();
                    } else {
                        alert(data.message || 'Failed to delete user');
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user. Please try again.');
                }
            }
        }
    });

    // Cancel edit
    cancelEditBtn.addEventListener('click', function() {
        editModal.classList.add('hidden');
    });

    // Close modal when clicking outside
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            editModal.classList.add('hidden');
        }
    });

    // Logout functionality
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/LoginPage/login';
    });
});
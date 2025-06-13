document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('userSearch');
    const searchBtn = document.getElementById('searchUsers');
    const clearBtn = document.getElementById('clearUserSearch');
    const editModal = document.getElementById('edit-user-modal');
    const editForm = document.getElementById('edit-user-form');
    const cancelEditBtn = document.getElementById('cancel-user-edit');

    let currentUsers = [];

    async function loadUsers(search = '') {
        try {
            const token = localStorage.getItem('token');
            const url = search ? `/api/admin/users?search=${encodeURIComponent(search)}` : '/api/admin/users';
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                currentUsers = result.users;
                updateUsersTable(result.users);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    function updateUsersTable(users) {
        const tbody = document.querySelector('#users-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.setAttribute('data-user-id', user._id);
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phoneNumber || 'N/A'}</td>
                <td>${user.age || 'N/A'}</td>
                <td>${user.country || 'N/A'}</td>
                <td>${user.gender || 'N/A'}</td>
                <td>${new Date(user.memberSince || user.createdAt).toLocaleDateString()}</td>
                <td class="actions">
                    <button class="btn primary edit-user" data-id="${user._id}">Edit</button>
                    <button class="btn danger delete-user" data-id="${user._id}">Delete</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        loadUsers(searchTerm);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        loadUsers();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            loadUsers(searchTerm);
        }
    });

    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-user')) {
            const userId = e.target.getAttribute('data-id');
            const user = currentUsers.find(u => u._id === userId);
            
            if (user) {
                document.getElementById('edit-user-id').value = user._id;
                document.getElementById('edit-user-firstName').value = user.firstName;
                document.getElementById('edit-user-lastName').value = user.lastName;
                document.getElementById('edit-user-email').value = user.email;
                document.getElementById('edit-user-phoneNumber').value = user.phoneNumber || '';
                document.getElementById('edit-user-age').value = user.age || '';
                document.getElementById('edit-user-country').value = user.country || '';
                document.getElementById('edit-user-gender').value = user.gender || '';
                
                editModal.classList.remove('hidden');
            }
        }

        if (e.target.classList.contains('delete-user')) {
            const userId = e.target.getAttribute('data-id');
            const user = currentUsers.find(u => u._id === userId);
            
            if (confirm(`Are you sure you want to delete user "${user.firstName} ${user.lastName}"?`)) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/admin/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert('User deleted successfully!');
                        loadUsers();
                    } else {
                        alert(result.message || 'Failed to delete user');
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user');
                }
            }
        }
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('edit-user-id').value;
        const formData = {
            firstName: document.getElementById('edit-user-firstName').value,
            lastName: document.getElementById('edit-user-lastName').value,
            email: document.getElementById('edit-user-email').value,
            phoneNumber: document.getElementById('edit-user-phoneNumber').value,
            age: document.getElementById('edit-user-age').value,
            country: document.getElementById('edit-user-country').value,
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

            const result = await response.json();
            if (result.success) {
                alert('User updated successfully!');
                editModal.classList.add('hidden');
                loadUsers();
            } else {
                alert(result.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user');
        }
    });

    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.classList.add('hidden');
        }
    });
});
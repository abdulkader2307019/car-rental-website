document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('carSearchBar');
    const searchButton = document.getElementById('carSearchButton');
    const clearSearchButton = document.getElementById('carClearSearch');

    // Search functionality
    function filterCars() {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = document.querySelectorAll('#cars-table tbody tr');

        rows.forEach(row => {
            const carName = row.cells[1].textContent.toLowerCase();
            const carType = row.cells[3].textContent.toLowerCase();
            const carBrand = row.cells[1].textContent.split(' ')[0].toLowerCase();

            if (carName.includes(searchTerm) || carType.includes(searchTerm) || carBrand.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchButton.addEventListener('click', filterCars);
    searchBar.addEventListener('input', filterCars);
    clearSearchButton.addEventListener('click', function() {
        searchBar.value = '';
        filterCars();
    });

    // Logout functionality
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/LoginPage/login';
    });
});
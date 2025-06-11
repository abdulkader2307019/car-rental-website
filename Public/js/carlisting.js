document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const searchBar = document.getElementById('searchBar');
    const priceFilter = document.getElementById('priceFilter');
    const typeFilter = document.getElementById('typeFilter');
    const locationFilter = document.getElementById('locationFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const carListings = document.querySelectorAll('.car');

    function filterCars() {
        const searchTerm = searchBar.value.toLowerCase();
        const priceSort = priceFilter.value;
        const typeSort = typeFilter.value;
        const locationSort = locationFilter.value;
        const availabilitySort = availabilityFilter.value;

        const carArray = Array.from(carListings);

        // Sort by price if selected
        if (priceSort === 'low') {
            carArray.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
        } else if (priceSort === 'high') {
            carArray.sort((a, b) => parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price')));
        }

        // Reorder DOM elements based on sort
        const container = document.querySelector('.car-listings');
        carArray.forEach(car => container.appendChild(car));

        // Filter cars
        carArray.forEach(car => {
            const carName = car.getAttribute('data-name').toLowerCase();
            const carType = car.getAttribute('data-type');
            const carLocation = car.getAttribute('data-location');
            const carAvailability = car.getAttribute('data-availability');

            const isSearchMatch = carName.includes(searchTerm);
            const isTypeMatch = typeSort === '' || carType === typeSort;
            const isLocationMatch = locationSort === '' || carLocation === locationSort;
            const isAvailabilityMatch = availabilitySort === '' || carAvailability === availabilitySort;

            if (isSearchMatch && isTypeMatch && isLocationMatch && isAvailabilityMatch) {
                car.style.display = 'block';
            } else {
                car.style.display = 'none';
            }
        });
    }

    // Event listeners for filtering
    searchButton.addEventListener('click', filterCars);
    searchBar.addEventListener('input', filterCars);
    priceFilter.addEventListener('change', filterCars);
    typeFilter.addEventListener('change', filterCars);
    locationFilter.addEventListener('change', filterCars);
    availabilityFilter.addEventListener('change', filterCars);

    // Initial filter
    filterCars();

    // Handle view details button clicks
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function () {
            const carId = this.getAttribute('data-car-id');
            if (carId) {
                window.location.href = `/car-details/${carId}`;
            }
        });
    });
});
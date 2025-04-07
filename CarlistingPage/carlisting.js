document.addEventListener('DOMContentLoaded', function () {

    const searchButton = document.getElementById('searchButton');
    const searchBar = document.getElementById('searchBar');
    const priceFilter = document.getElementById('priceFilter');
    const typeFilter = document.getElementById('typeFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const carListings = document.querySelectorAll('.car');

    function filterCars() {
        const searchTerm = searchBar.value.toLowerCase();
        const priceSort = priceFilter.value;
        const typeSort = typeFilter.value;
        const availabilitySort = availabilityFilter.value;

        carListings.forEach(car => {
            let carName = car.getAttribute('data-name').toLowerCase();
            let carPrice = parseFloat(car.getAttribute('data-price'));
            let carType = car.getAttribute('data-type');
            let carAvailability = car.getAttribute('data-availability');

            const isSearchMatch = carName.includes(searchTerm);
            const isPriceMatch = priceSort === '' || (priceSort === 'low' ? carPrice < 50000 : carPrice >= 50000);
            const isTypeMatch = typeSort === '' || carType === typeSort;
            const isAvailabilityMatch = availabilitySort === '' || carAvailability === availabilitySort;

            if (isSearchMatch && isPriceMatch && isTypeMatch && isAvailabilityMatch) {
                car.style.display = 'block';
            } else {
                car.style.display = 'none';
            }
        });
    }

    searchButton.addEventListener('click', filterCars);
    searchBar.addEventListener('input', filterCars);
    priceFilter.addEventListener('change', filterCars);
    typeFilter.addEventListener('change', filterCars);
    availabilityFilter.addEventListener('change', filterCars);

    filterCars();

});
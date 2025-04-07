document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const searchBar = document.getElementById('searchBar');
    const priceFilter = document.getElementById('priceFilter');
    const typeFilter = document.getElementById('typeFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const carListings = document.querySelectorAll('.car');

    function filterAndSortCars() {
        const searchTerm = searchBar.value.toLowerCase();
        const priceSort = priceFilter.value;
        const typeSort = typeFilter.value;
        const availabilitySort = availabilityFilter.value;

        let filteredCars = Array.from(carListings).filter(car => {
            const carName = car.getAttribute('data-name').toLowerCase();
            const carPrice = parseFloat(car.getAttribute('data-price'));
            const carType = car.getAttribute('data-type');
            const carAvailability = car.getAttribute('data-availability');

            const isSearchMatch = carName.includes(searchTerm);
            const isPriceMatch = priceSort === '' || (priceSort === 'low' ? carPrice < 50000 : carPrice >= 50000);
            const isTypeMatch = typeSort === '' || carType === typeSort;
            const isAvailabilityMatch = availabilitySort === '' || carAvailability === availabilitySort;

            return isSearchMatch && isPriceMatch && isTypeMatch && isAvailabilityMatch;
        });

        if (priceSort === 'low') {
            filteredCars.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
        } else if (priceSort === 'high') {
            filteredCars.sort((a, b) => parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price')));
        }

        carListings.forEach(car => {
            if (filteredCars.includes(car)) {
                car.style.display = 'block';
            } else {
                car.style.display = 'none';
            }
        });
    }

    searchButton.addEventListener('click', filterAndSortCars);
    searchBar.addEventListener('input', filterAndSortCars);
    priceFilter.addEventListener('change', filterAndSortCars);
    typeFilter.addEventListener('change', filterAndSortCars);
    availabilityFilter.addEventListener('change', filterAndSortCars);

    filterAndSortCars();

    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function () {
            const carName = button.closest('.car').getAttribute('data-name');
            const carPageUrl = `../CarDetails/car-details.html?car=${encodeURIComponent(carName)}`;
            window.location.href = carPageUrl;
        });
    });
});



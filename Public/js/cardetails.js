document.addEventListener("DOMContentLoaded", function () {
    const pricingSelect = document.getElementById("pricing-select");
    const priceDisplay = document.getElementById("price-display");

    if (pricingSelect && priceDisplay) {
        const pricingOptions = {
            daily: 100,
            weekly: 600,
            monthly: 2000
        };

        pricingSelect.addEventListener("change", function () {
            const selected = pricingSelect.value;
            const newPrice = pricingOptions[selected];
            priceDisplay.textContent = `$${newPrice}`;
        });
    }
});
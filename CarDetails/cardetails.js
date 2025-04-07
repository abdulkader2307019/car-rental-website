document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("check-btn").addEventListener("click", function () {
        const pickup = document.getElementById("pickup").value.trim();
        const returnLoc = document.getElementById("return").value.trim();
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;

        if (!pickup || !returnLoc || !startDate || !endDate) {
            alert("Please fill in all fields.");
            return;
        }

        if (new Date(endDate) <= new Date(startDate)) {
            alert("End date must be after the start date.");
            return;
        }

        alert(`Checking availability from ${pickup} to ${returnLoc}\nFrom ${startDate} to ${endDate}`);
    });

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

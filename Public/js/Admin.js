
document.getElementById('save-car').addEventListener('click', async () => {
    const form = document.getElementById('car-form');
    const formData = new FormData();

    formData.append('brand', document.getElementById("car-brand").value);
    formData.append('model', document.getElementById("car-model").value);
    formData.append('type', document.getElementById("car-type").value);
    formData.append('location', document.getElementById("car-location").value);
    formData.append('pricePerDay', document.getElementById("car-price").value);
    formData.append('availability', document.getElementById("car-status").value === 'available');
    formData.append('seats', document.getElementById("car-seats").value);
    formData.append('fuel', document.getElementById("car-fuel").value);
    formData.append('transmission', document.getElementById("car-transmission").value);
    formData.append('year', document.getElementById("car-year").value);

    const imageInput = document.getElementById("car-image");
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    try {
        const response = await fetch('/api/cars', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("Success:", result);
        alert("✅ Car saved successfully!");
        form.reset(); // optional: clears the form

    } catch (err) {
        console.error("Failed to save car:", err);
        alert("❌ Failed to save car. Please check your input or try again.");
    }
});

// document.addEventListener("DOMContentLoaded", () => {
//     const navLinks = document.querySelectorAll(".side-nav .nav-links a");

//     navLinks.forEach(link => {
//         link.addEventListener("click", function () {
//             // Remove 'active' from all links
//             navLinks.forEach(l => l.classList.remove("active"));

//             // Add 'active' to the clicked one
//             this.classList.add("active");
//         });
//     });
// });

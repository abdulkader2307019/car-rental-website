

const rentalPlan = document.querySelector('select');
const priceDisplay = document.getElementById('priceCalc');
rentalPlan.addEventListener("change", ()=>{
    let price;
    switch(rentalPlan.value){
        case "daily":
            price = 100;
            break;
        case "weekly":
            price = 600;
            break;
        case "annual":
            price = 5000;
            break;
        default:
            price=0;
    }
    priceDisplay.textContent = `${price}$`;
});

const form = document.forms["bookingForm"];
form.addEventListener("submit",function(e) {
    const pickup = form["pickup"].value;
    const returnLoc = form["return"].value;
    const pickupDate = form["pickup-date"].value;
    const returnDate = form["return-date"].value;
    if(!pickup || !returnLoc || !pickupDate || !returnDate){
        alert("Please fill in all required fields.");
        e.preventDefault();
    }
});

form["return-date"].addEventListener("change", () => {
    const pickupDate = new Date(form["pickup-date"].value);
    const returnDate = new Date(form["return-date"].value);

    if (returnDate < pickupDate) {
        alert("Return date must be after pickup date.");
        form["return-date"].value = "";
    }
});

form["pickup-date"].addEventListener("change",()=>{
    const pickupDate = new Date(form["pickup-date"].value);
    const returnDate = new Date(form["return-date"].value);
    if(returnDate < pickupDate){
        alert("Return date must be after pickup date.");
        form["pickup-date"].value="";
    }
});
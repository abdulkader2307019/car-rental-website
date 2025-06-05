const Booking=require("../models/bookingSchema")  


const createBooking= async (req, res) => {
    const { carId, startDate, endDate, locationPickup, locationDropoff } = req.body;
  
    if (!carId || !startDate || !endDate || !locationPickup || !locationDropoff) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const car = await Car.findById(carId);
    if (!car || !car.availability) {
      return res.status(404).json({ error: 'Car not available' });
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
    if (days <= 0) return res.status(400).json({ error: 'Invalid date range' });
  
    const totalPrice = days * car.pricePerDay;
  
    const booking = await Booking.create({
      user: req.user.id,
      car: carId,
      startDate,
      endDate,
      locationPickup,
      locationDropoff,
      totalPrice,
      status: 'pending'
    });
  
    res.status(201).json(booking);
  };




module.exports=createBooking;


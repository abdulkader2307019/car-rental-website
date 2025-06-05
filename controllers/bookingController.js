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
const viewBooking=async (req, res) => {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car')
      .sort({ startDate: -1 });
  
    res.json(bookings);
  };
  const cancelBooking= async (req, res) => {
    const booking = await Booking.findById(req.params.id);
  
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
  
    if (new Date(booking.startDate) <= new Date()) {
      return res.status(400).json({ error: 'Cannot cancel ongoing or past bookings' });
    }
  
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  };



module.exports={createBooking,viewBooking,cancelBooking};


const Booking = require("../models/bookingSchema");
const Car = require("../models/carSchema");

const createBooking = async (req, res) => {
  try {
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

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

const viewBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car')
      .sort({ startDate: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('View booking error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    if (new Date(booking.startDate) <= new Date()) {
      return res.status(400).json({ error: 'Cannot cancel ongoing or past bookings' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('user car');
    
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

module.exports = {
  createBooking,
  viewBooking,
  cancelBooking,
  getAllBookings,
  updateBooking,
  deleteBooking
};
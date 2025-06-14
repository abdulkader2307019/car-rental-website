const Booking = require("../models/bookingSchema");
const Car = require("../models/carSchema");
const mongoose = require("mongoose");
const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, locationPickup, locationDropoff } = req.body;

    if (!carId || !startDate || !endDate || !locationPickup || !locationDropoff) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }

    const car = await Car.findById(carId);
    if (!car || !car.availability) {
      return res.status(404).json({ 
        success: false,
        error: 'Car not available' 
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid date range' 
      });
    }

    const totalPrice = days * car.pricePerDay;

    // Start a transaction to ensure both operations succeed or fail together
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the booking
      const booking = await Booking.create([{
        user: req.user.id,
        car: carId,
        startDate,
        endDate,
        locationPickup,
        locationDropoff,
        totalPrice,
        status: 'pending'
      }], { session });

      // Update car availability to false
      await Car.findByIdAndUpdate(
        carId,
        { availability: false },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      const populatedBooking = await Booking.findById(booking[0]._id)
        .populate('car', 'brand model pricePerDay')
        .populate('user', 'firstName lastName email');

      res.status(201).json({ 
        success: true, 
        booking: populatedBooking,
        message: 'Booking created successfully'
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error; // This will be caught by the outer catch block
    }

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create booking' 
    });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    booking.status = 'confirmed';
    await booking.save();

    res.json({ 
      success: true, 
      message: 'Booking confirmed successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to confirm booking' 
    });
  }
};

const viewBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car', 'brand model pricePerDay')
      .sort({ startDate: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('View booking error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch bookings' 
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        error: 'Booking not found' 
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized' 
      });
    }

    if (new Date(booking.startDate) <= new Date()) {
      return res.status(400).json({ 
        success: false,
        error: 'Cannot cancel ongoing or past bookings' 
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    await Car.findByIdAndUpdate(booking.car, { availability: true });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('car', 'brand model pricePerDay')
      .populate('user', 'firstName lastName email');

    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully', 
      booking: populatedBooking 
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to cancel booking' 
    });
  }
};


module.exports = {
  createBooking,
  confirmBooking,
  viewBooking,
  cancelBooking
};
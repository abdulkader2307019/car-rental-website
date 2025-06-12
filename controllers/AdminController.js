const User = require('../models/User');
const Car = require('../models/carSchema');
const Booking = require('../models/bookingSchema');

/** -------------------------------
 * USERS
 ----------------------------------*/

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, age, gender, country } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        age,
        gender,
        country
      }, 
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** -------------------------------
 * CARS
 ----------------------------------*/

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new car
exports.addCar = async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json({ success: true, car: newCar });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update a car
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, car });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Car deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** -------------------------------
 * BOOKINGS
 ----------------------------------*/

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model');
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking (e.g., approve or change status)
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** -------------------------------
 * REPORTS
 ----------------------------------*/

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeRentals = await Booking.countDocuments({ status: 'confirmed' });
    const availableCars = await Car.countDocuments({ availability: true });
    
    // Calculate total revenue
    const bookings = await Booking.find({ status: 'confirmed' });
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    // Get detailed data
    const allBookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model pricePerDay')
      .sort({ createdAt: -1 });
    
    const allCars = await Car.find();
    
    res.json({
      success: true,
      stats: {
        totalBookings,
        activeRentals,
        totalRevenue,
        availableCars
      },
      data: {
        bookings: allBookings,
        cars: allCars
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
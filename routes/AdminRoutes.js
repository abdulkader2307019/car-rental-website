const express = require('express');
const router = express.Router();

const { protect, isAdmin } = require('../middleware/authMiddleware');

const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

// Protect all routes, allow only admins
router.use(protect, isAdmin);

/**
 * --- USER ROUTES ---
 */

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user by id
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * --- CAR ROUTES ---
 */

// Get all cars
router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new car
router.post('/cars', async (req, res) => {
  try {
    const { make, model, year, dailyPrice, status } = req.body;
    const newCar = new Car({ make, model, year, dailyPrice, status });
    await newCar.save();
    res.status(201).json({ success: true, car: newCar });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update car by id
router.put('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, car });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete car by id
router.delete('/cars/:id', async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Car deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * --- BOOKINGS ROUTES ---
 */

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('car', 'make model dailyPrice');
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update booking status or details by id
router.put('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete booking by id
router.delete('/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
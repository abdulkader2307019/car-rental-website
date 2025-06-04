const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

const User = require('../models/User');
const Car = require('../models/carSchema');
const Booking = require('../models/bookingSchema');

// Protect all routes: Only accessible by authenticated admins
router.use(protect, isAdmin);

// Get all users
router.get('/users',AdminController.getAllUsers);

// Delete user by ID
router.delete('/users/:id', AdminController.deleteUser);

// Get all cars
router.get('/cars', AdminController.getAllCars);

// Create a new car
router.post('/cars',AdminController.addCar);

// Update car by ID
router.put('/cars/:id', AdminController);

// Delete car by ID
router.delete('/cars/:id', AdminController.deleteCar);

// GET /api/bookings with optional filters (status, user, car)
router.get('/bookings', AdminController.getAllBookings);

// PUT /api/bookings/:id/approve → Confirm booking
router.put('/bookings/:id/approve', AdminController.approveBooking);

// Update booking by ID (generic)
router.put('/bookings/:id', AdminController.updateBooking);

// Delete booking by ID
router.delete('/bookings/:id', AdminController.deleteBooking);

module.exports = router;
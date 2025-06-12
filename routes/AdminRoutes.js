const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Protect all routes: Only accessible by authenticated admins
router.use(protect, isAdmin);

// User routes
router.get('/users', AdminController.getAllUsers);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);

// Car routes
router.get('/cars', AdminController.getAllCars);
router.post('/cars', AdminController.addCar);
router.put('/cars/:id', AdminController.updateCar);
router.delete('/cars/:id', AdminController.deleteCar);

// Booking routes
router.get('/bookings', AdminController.getAllBookings);
router.put('/bookings/:id', AdminController.updateBooking);
router.delete('/bookings/:id', AdminController.deleteBooking);

// Reports route
router.get('/dashboard-stats', AdminController.getDashboardStats);

module.exports = router;
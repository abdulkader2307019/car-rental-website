const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Users routes
router.get('/users', protect, isAdmin, AdminController.getAllUsers);
router.put('/users/:id', protect, isAdmin, AdminController.updateUser);
router.delete('/users/:id', protect, isAdmin, AdminController.deleteUser);

// Cars routes
router.get('/cars', protect, isAdmin, AdminController.getAllCars);
router.post('/cars', protect, isAdmin, AdminController.addCar);
router.put('/cars/:id', protect, isAdmin, AdminController.updateCar);
router.delete('/cars/:id', protect, isAdmin, AdminController.deleteCar);

// Bookings routes
router.get('/bookings', protect, isAdmin, AdminController.getAllBookings);
router.put('/bookings/:id', protect, isAdmin, AdminController.updateBooking);
router.delete('/bookings/:id', protect, isAdmin, AdminController.deleteBooking);

// Reports routes
router.get('/stats', protect, isAdmin, AdminController.getDashboardStats);

module.exports = router;
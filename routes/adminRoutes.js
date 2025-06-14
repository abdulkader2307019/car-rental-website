const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/users', protect, isAdmin, AdminController.getAllUsers);
router.put('/users/:id', protect, isAdmin, AdminController.updateUser);
router.delete('/users/:id', protect, isAdmin, AdminController.deleteUser);

router.get('/cars',protect,isAdmin,AdminController.getAllCars)

router.get('/bookings', protect, isAdmin, AdminController.getAllBookings);
router.put('/bookings/:id', protect, isAdmin, AdminController.updateBooking);
router.delete('/bookings/:id', protect, isAdmin, AdminController.deleteBooking);


module.exports = router;
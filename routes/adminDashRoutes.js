const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');


router.get('/manage-bookings', protect, isAdmin, AdminController.manage_get_bookings);
router.get('/manage-cars', protect, isAdmin, AdminController.manage_get_cars);
router.get('/manage-users', protect, isAdmin, AdminController.manage_get_users);
router.get('/manage-discounts', protect, isAdmin, AdminController.manage_get_discounts);
router.get('/reports-section', protect, isAdmin, AdminController.manage_get_reports);

module.exports = router;
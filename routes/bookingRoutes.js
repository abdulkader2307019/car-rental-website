const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post('/', protect, bookingController.createBooking);
router.get('/user', protect, bookingController.viewBooking);
router.put('/:id/confirm', protect, bookingController.confirmBooking);
router.put('/:id/cancel', protect, bookingController.cancelBooking);

router.get('/', protect, isAdmin, bookingController.getAllBookings);
router.put('/:id', protect, isAdmin, bookingController.updateBooking);
router.delete('/:id', protect, isAdmin, bookingController.deleteBooking);

module.exports = router;
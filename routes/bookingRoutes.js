const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post('/', protect, bookingController.createBooking);
router.get('/user', protect, bookingController.viewBooking);
router.put('/:id/confirm', protect, bookingController.confirmBooking);
router.put('/:id/cancel', protect, bookingController.cancelBooking);

module.exports = router;
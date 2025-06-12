const express = require('express');
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// User routes
router.post('/', protect, reviewController.review_post);
router.get('/car/:carId', reviewController.car_review_get);

// Admin routes
router.delete('/:id', protect, isAdmin, reviewController.admin_review_delete);

module.exports = router;
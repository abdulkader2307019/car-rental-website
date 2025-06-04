const express = require('express');
const router = express.Router();

const reviewController = require("../controllers/reviewController")
const {protect, isAdmin}= require("../middleware/authMiddleware");

router.post('/api/reviews',protect,reviewController.review_post)

router.get('/api/reviews/:carId',reviewController.car_review_get)       

router.delete('/api/reviews/:id', protect, isAdmin,reviewController.admin_review_delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const discountController = require("../controllers/discountController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Admin routes for managing discounts
router.post('/', protect, isAdmin, discountController.discount_post);
router.get('/', protect, isAdmin, discountController.discount_get);
router.put('/:id', protect, isAdmin, discountController.discount_update);
router.delete('/:id', protect, isAdmin, discountController.discount_delete);

// Public route for applying discounts
router.post('/apply', discountController.discount_apply_post);

module.exports = router;
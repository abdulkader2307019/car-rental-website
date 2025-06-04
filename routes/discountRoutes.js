const express = require('express');
const router = express.Router();


const discountController = require("../controllers/discountConstroller")
const {protect, isAdmin}= require("../middleware/authMiddleware");

router.post('/api/discounts',protect,isAdmin,discountController.discount_post)


router.post('/api/discounts/apply',protect,discountController.discount_apply_post)

router.get('/api/discounts',protect,isAdmin,discountController.discount_get)

module.exports = router;
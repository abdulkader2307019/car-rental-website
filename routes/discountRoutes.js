const express = require('express');
const router = express.Router();
//const Discount = require("../models/discountSchema");

var moment = require("moment");
const discountController = require("../controllers/discountConstroller")
const {protect, isAdmin}= require("../middleware/authMiddleware");

router.post('/api/discounts',protect,isAdmin,discountController.discount_post)

module.exports = router;
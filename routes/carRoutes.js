
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/api/cars',protect,isAdmin,carController.addCar);


module.exports = router;

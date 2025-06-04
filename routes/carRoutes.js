
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('../api/cars',protect,isAdmin,carController.addCar);
router.put('../api/cars/:id',protect,isAdmin,carController.editCar);
router.delete('../api/cars/:id',protect,isAdmin,carController.deleteCar);
router.get('../api/cars/:id',protect,carController.getCarById)
router.get('../api/cars/:id',protect,carController.getCars);
module.exports = router;

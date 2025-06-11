const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);

// Protected admin routes
router.post('/', protect, isAdmin, carController.addCar);
router.put('/:id', protect, isAdmin, carController.editCar);
router.delete('/:id', protect, isAdmin, carController.deleteCar);

module.exports = router;
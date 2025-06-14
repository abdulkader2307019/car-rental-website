const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);

// Protected admin routes
router.post('/', protect, isAdmin, upload.single('image'), carController.addCar);
router.put('/:id', protect, isAdmin, upload.single('image'), carController.editCar);
router.delete('/:id', protect, isAdmin, carController.deleteCar);
router.get('/:id/image', carController.getCarImage);
    
module.exports = router;
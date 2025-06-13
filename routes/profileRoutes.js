const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/bookingSchema');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const bookings = await Booking.find({ user: req.user._id })
      .populate('car', 'brand model pricePerDay')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        bookingHistory: bookings
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.put('/', protect, upload.single('profileImage'), async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, age, country, gender } = req.body;
    
    const updateData = {};
    
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (age) updateData.age = parseInt(age);
    if (country) updateData.country = country;
    if (gender) updateData.gender = gender;
    
    if (req.file) {
      updateData.profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/image', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.profileImage || !user.profileImage.data) {
      return res.status(404).send('Profile image not found');
    }
    
    res.set('Content-Type', user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading profile image');
  }
});

module.exports = router;
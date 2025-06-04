
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
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

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const { firstName, lastName, location, country, birthday } = req.body;
    
    const updateData = {
      firstName: firstName || req.user.firstName,
      lastName: lastName || req.user.lastName,
      location: location || req.user.location,
      country: country || req.user.country
    };
    
    if (birthday) {
      updateData.birthday = new Date(birthday);
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

// @route   PUT /api/profile/stats
// @desc    Update user stats
// @access  Private
router.put('/stats', protect, async (req, res) => {
  try {
    const { carsRented, milesOvercome, hoursOnRoad, citiesVisited } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          'stats.carsRented': carsRented || req.user.stats.carsRented,
          'stats.milesOvercome': milesOvercome || req.user.stats.milesOvercome,
          'stats.hoursOnRoad': hoursOnRoad || req.user.stats.hoursOnRoad,
          'stats.citiesVisited': citiesVisited || req.user.stats.citiesVisited
        } 
      },
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
      data: user.stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/profile/comments
// @desc    Add a comment to user profile
// @access  Private
router.post('/comments', protect, async (req, res) => {
  try {
    const { text, title } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $push: { 
          comments: { 
            text, 
            title,
            date: new Date() 
          } 
        } 
      },
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
      data: user.comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

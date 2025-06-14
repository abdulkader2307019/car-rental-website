const User = require('../models/User');
const Car = require('../models/carSchema');
const Booking = require('../models/bookingSchema');
const Discount = require('../models/discountSchema')

exports.getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
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
    
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    res.json({ success: true, user, message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const cars = await Car.find({
        $or: [
          { brand: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      query = {
        $or: [
          { user: { $in: users.map(u => u._id) } },
          { car: { $in: cars.map(c => c._id) } },
          { status: { $regex: search, $options: 'i' } },
          { locationPickup: { $regex: search, $options: 'i' } },
          { locationDropoff: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const bookings = await Booking.find(query)
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking, message: 'Booking updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.manage_get_bookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model pricePerDay')
      .sort({ createdAt: -1 });
    res.render('AdminPage/manage-bookings', { bookings, currentPage: 'bookings' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading bookings');
  }
}

exports.getAllCars = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { brand: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { type: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch cars',
      error: error.message 
    });
  }
};

exports.manage_get_cars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.render('AdminPage/manage-cars', { cars, currentPage: 'cars' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading cars');
  }
};

exports.manage_get_users = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('AdminPage/manage-users', { users, currentPage: 'users' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading users');
  }
}

exports.manage_get_discounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.render('AdminPage/manage-discounts', { discounts, currentPage: 'discounts' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading discounts');
  }
};

exports.manage_get_reports = async (req, res) => {
  try {
    const users = await User.find();
    const cars = await Car.find();
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model pricePerDay');
    res.render('AdminPage/reports-section', { 
      users, 
      cars, 
      bookings, 
      currentPage: 'reports' 
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading reports');
  }
};
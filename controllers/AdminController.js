const User = require('../models/User');
const Car = require('../models/carSchema');
const Booking = require('../models/bookingSchema');

/** -------------------------------
 * USERS
 ----------------------------------*/

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, gender } = req.body;
    
    // Validate gender
    if (gender && !['male', 'female'].includes(gender.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Gender must be either male or female' 
      });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email.toLowerCase();
    if (gender) updateData.gender = gender.toLowerCase();

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** -------------------------------
 * CARS
 ----------------------------------*/

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new car
exports.addCar = async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json({ success: true, car: newCar });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update a car
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, car });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** -------------------------------
 * BOOKINGS
 ----------------------------------*/

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model');
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { status, startDate, endDate, locationPickup, locationDropoff } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (locationPickup) updateData.locationPickup = locationPickup;
    if (locationDropoff) updateData.locationDropoff = locationDropoff;

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model');
    
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** -------------------------------
 * REPORTS
 ----------------------------------*/

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeRentals = await Booking.countDocuments({ status: 'confirmed' });
    const availableCars = await Car.countDocuments({ availability: true });
    
    // Calculate total revenue
    const confirmedBookings = await Booking.find({ status: 'confirmed' });
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    // Get detailed data
    const allBookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model pricePerDay')
      .sort({ createdAt: -1 });
    
    const allCars = await Car.find({ availability: true });
    
    // Revenue by car
    const revenueByCarMap = new Map();
    confirmedBookings.forEach(booking => {
      if (booking.car) {
        const carId = booking.car.toString();
        if (!revenueByCarMap.has(carId)) {
          revenueByCarMap.set(carId, { count: 0, revenue: 0, car: null });
        }
        const carData = revenueByCarMap.get(carId);
        carData.count += 1;
        carData.revenue += booking.totalPrice || 0;
      }
    });
    
    // Populate car details for revenue data
    const revenueData = [];
    for (const [carId, data] of revenueByCarMap) {
      const car = await Car.findById(carId);
      if (car) {
        revenueData.push({
          car: `${car.brand} ${car.model}`,
          count: data.count,
          revenue: data.revenue,
          pricePerDay: car.pricePerDay
        });
      }
    }

    res.json({
      success: true,
      stats: {
        totalBookings,
        activeRentals,
        totalRevenue,
        availableCars
      },
      details: {
        bookings: allBookings,
        activeRentals: allBookings.filter(b => b.status === 'confirmed'),
        availableCars: allCars,
        revenueData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
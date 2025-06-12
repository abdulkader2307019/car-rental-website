const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.json());
const path = require('path')
app.set("views", path.join(__dirname, "views"));

require('dotenv').config();
const port = process.env.PORT || 3000;
const DB_URL = process.env.MONGODB_URI;

const Car = require('./models/carSchema');
const User = require('./models/User');
const Booking = require('./models/bookingSchema');
const Discount = require('./models/discountSchema');

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const discountRoutes = require('./routes/discountRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/discounts', discountRoutes);

// Legacy registration route (for form submission)
app.post('/user/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      age,
      country
    } = req.body;

    console.log('Registration attempt:', { firstName, lastName, email, phoneNumber });

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Create and save new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password, // will be hashed in pre-save hook
      age: age || undefined,
      country: country || 'Egypt'
    });

    await newUser.save();
    
    // Generate token
    const token = jwt.sign(
      { id: newUser._id }, 
      process.env.JWT_SECRET || 'fallback_secret_key_for_development', 
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email
    });
    
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error: ' + err.message 
    });
  }
});

// View routes
app.get("/", (req, res) => {
  res.render("index", { root: __dirname });
});

app.get("/carlisting", async (req, res) => {
  try {
    const cars = await Car.find();
    res.render("carlisting", { cars });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading cars');
  }
});

app.get("/car-details/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).send('Car not found');
    }
    res.render("car-details", { car });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading car details');
  }
});

app.get("/booking/:carId", async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) {
      return res.status(404).send('Car not found');
    }
    res.render("booking", { car });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading booking page');
  }
});

app.get("/LoginPage/login", (req, res) => {
  res.render("LoginPage/login");
});

app.get('/AdminPage/manage-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model');
    res.render('AdminPage/manage-bookings', { bookings, currentPage: 'bookings' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading bookings');
  }
});

app.get('/AdminPage/manage-cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.render('AdminPage/manage-cars', { cars, currentPage: 'cars' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading cars');
  }
});

app.get('/AdminPage/manage-users', async (req, res) => {
  try {
    const users = await User.find();
    res.render('AdminPage/manage-users', { users, currentPage: 'users' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading users');
  }
});

app.get('/AdminPage/manage-discounts', async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.render('AdminPage/manage-discounts', { discounts, currentPage: 'discounts' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading discounts');
  }
});

app.get('/AdminPage/reports-section', async (req, res) => {
  try {
    const users = await User.find();
    const cars = await Car.find();
    const bookings = await Booking.find();
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
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

// API route to get car image
app.get('/api/cars/:id/image', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || !car.image || !car.image.data) {
      return res.status(404).send('Image not found');
    }
    
    res.set('Content-Type', car.image.contentType);
    res.send(car.image.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading image');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
      console.log('Database connected successfully');
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
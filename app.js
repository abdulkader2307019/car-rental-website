const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.json());
app.set("views", path.join(__dirname, "views"));

require('dotenv').config();
const port = process.env.PORT || 3000;
const DB_URL = process.env.MONGODB_URI;

const Car = require('./models/carSchema');
const User = require('./models/User');
const Booking = require('./models/bookingSchema');
const Discount = require('./models/discountSchema');
const Review = require('./models/reviewSchema');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const discountRoutes = require('./routes/discountRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
//const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/reviews', reviewRoutes);
//app.use('/api/admin', adminRoutes);

app.get("/", async (req, res) => {
  try {
    const featuredCars = await Car.find({ availability: true })
      .sort({ pricePerDay: -1 })
      .limit(8);
    res.render("index", { featuredCars });
  } catch (err) {
    console.log(err);
    res.render("index", { featuredCars: [] });
  }
});

app.get("/about", (req, res) => {
  res.render("about");
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
    
    const reviews = await Review.find({ car: req.params.id })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.render("car-details", { car, reviews });
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
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model');
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
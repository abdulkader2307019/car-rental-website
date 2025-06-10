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

const multer = require('multer');
const storage = multer.memoryStorage();
const img = multer({ storage });

const Car = require('./models/carSchema');
const User = require('./models/User');
const Booking = require('./models/bookingSchema');

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Car management route
app.post('/api/cars', img.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded', currentPage: 'cars' });
    }

    const car = new Car({
      brand: req.body.brand,
      model: req.body.model,
      type: req.body.type,
      location: req.body.location,
      pricePerDay: Number(req.body.pricePerDay),
      availability: req.body.availability === 'true',
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      specs: {
        seats: Number(req.body.seats),
        fuel: req.body.fuel,
        transmission: req.body.transmission
      },
      year: parseInt(req.body.year)
    });

    await car.save();
    res.status(201).json({ message: 'Car added successfully', car });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

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

app.get("/carlisting", (req, res) => {
  res.render("carlisting");
});

app.get("/LoginPage/login", (req, res) => {
  res.render("LoginPage/login");
});

app.get('/AdminPage/manage-bookings', (req, res) => {
  Booking.find().then(result => {
    res.render('AdminPage/manage-bookings', { bookings: result, currentPage: 'bookings' });
  }).catch(err => {
    console.log(err);
    res.status(500).send('Error loading bookings');
  });
});

app.get('/AdminPage/manage-cars', (req, res) => {
  Car.find().then(result => {
    res.render('AdminPage/manage-cars', { cars: result, currentPage: 'cars' });
  }).catch(err => {
    console.log(err);
    res.status(500).send('Error loading cars');
  });
});

app.get('/AdminPage/manage-users', (req, res) => {
  User.find().then(result => {
    res.render('AdminPage/manage-users', { users: result, currentPage: 'users' });
  }).catch(err => {
    console.log(err);
    res.status(500).send('Error loading users');
  });
});

app.get('/AdminPage/reports-section', (req, res) => {
  User.find().then(result => {
    res.render('AdminPage/reports-section', { users: result, currentPage: 'reports' });
  }).catch(err => {
    console.log(err);
    res.status(500).send('Error loading reports');
  });
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.get("/car-details", (req, res) => {
  res.render("car-details");
});

app.get("/booking", (req, res) => {
  res.render("booking");
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
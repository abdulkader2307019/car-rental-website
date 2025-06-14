const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const cookieParser = require('cookie-parser');
const sessionMiddleware = require('./middleware/sessionMiddleware');

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

require('dotenv').config();
const port = process.env.PORT || 3000;
const DB_URL = process.env.MONGODB_URI ;

const Car = require('./models/carSchema');
const User = require('./models/User');
const Booking = require('./models/bookingSchema');
const Discount = require('./models/discountSchema');


const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const discountRoutes = require('./routes/discountRoutes');
 const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const adminDashRoutes = require('./routes/adminDashRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/admin', adminRoutes);
app.use('/AdminPage',adminDashRoutes);
app.use(userRoutes);



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
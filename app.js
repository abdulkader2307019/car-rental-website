const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.json());
const path = require('path')
app.set("views", path.join(__dirname, "views"));

require('dotenv').config();
const port = process.env.PORT;
const DB_URL = process.env.MONGODB_URI;
app.use(express.json());


// const discountRoutes = require('./routes/discountRoutes');
// app.use(discountRoutes);
// const reviewRoutes = require('./routes/reviewRoutes');
// app.use(reviewRoutes);
// const carRoutes = require('./routes/carRoutes');
// app.use(carRoutes);
// //const AdminRoutes = require('./routes/AdminRoutes');
// // app.use(AdminRoutes);
// const bookingRoutes = require('./routes/bookingRoutes');
// app.use(bookingRoutes);
// const authRoutes = require('./routes/authRoutes');
// app.use(authRoutes);
// app.post("/user/add.html", (req, res) => {
//   const user = new User(req.body);
//   user.save()
//     .then(result => {
//       res.redirect("/");
//     })
//     .catch(err => {
//       console.log(err);
//     })
// })
const multer = require('multer');
const storage = multer.memoryStorage(); // store in memory, not disk
const img = multer({ storage });



const Car = require('./models/carSchema');
const User = require('./models/User');
const Booking = require('./models/bookingSchema');


const { log } = require("console");

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Received body:", req.body);  
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // Optional: create token
        const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token, // optional
            user: {
                id: user._id,
                name: user.firstName + ' ' + user.lastName,
                email: user.email,
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/api/cars', img.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' , currentPage: 'cars' });
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

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered');
    }

    // Create and save new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password, // will be hashed in pre-save hook
      age: age || undefined,
      country: country || undefined
    });

    await newUser.save();
    
    res.status(201).render('index');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Internal server error');
  }
});





app.get("/", (req, res) => {
  res.render("index", { root: __dirname });
});

app.get("/carlisting", (req, res) => {
  res.render("carlisting");
});

app.get("/LoginPage/login", (req, res) => {
  res.render("LoginPage/login");
});

// app.get("/AdminPage/Admin", (req, res) => {   
//     res.render("AdminPage/Admin");
// });

app.get('/AdminPage/manage-bookings',(req,res)=>{

  Booking.find().then(result=>{
    //console.log(result);    
    res.render('AdminPage/manage-bookings',{bookings:result, currentPage: 'bookings' });
  }).catch(err=>{
    console.log(err);
  })
  // res.render('AdminPage/manage-bookings')

});
app.get('/AdminPage/manage-cars',(req,res)=>{

  Car.find().then(result=>{
    //console.log(result);    
    res.render('AdminPage/manage-cars',{cars:result, currentPage: 'cars' });
  }).catch(err=>{
    console.log(err);
  })

  

});
app.get('/AdminPage/manage-users',(req,res)=>{

  User.find().then(result=>{
    //console.log(result);    
    res.render('AdminPage/manage-users',{users:result, currentPage: 'users' });
  }).catch(err=>{
    console.log(err);
  })


  // res.render('AdminPage/manage-users')

});
app.get('/AdminPage/reports-section',(req,res)=>{

  User.find().then(result=>{
    //console.log(result);    
    res.render('AdminPage/reports-section',{users:result, currentPage: 'reports' });
  }).catch(err=>{
    console.log(err);
  })
  // res.render('AdminPage/reports-section')

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


// app.get("/AdminPage/Admin.ejs", (req, res) => {
//   User.find()
//     .then((result) => {
//       console.log(result)
//       res.render("AdminPage/Admin.ejs", { arr: result })
//     })
//     .catch(err => {
//       console.log(err);
//     })

// })

// app.post("/user/add.html", (req, res) => {
//   const user = new User(req.body);
//   user.save()
//     .then(result => {
//       res.redirect("/");
//     })
//     .catch(err => {
//       console.log(err);
//     })
// })


mongoose
  .connect(
    DB_URL
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
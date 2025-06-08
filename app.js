const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const User = require("./models/User")
app.set('view engine', 'ejs')

const path = require('path')
app.set("views", path.join(__dirname, "views"));

require('dotenv').config();
const port = process.env.PORT;
const DB_URL = process.env.MONGODB_URI;
app.use(express.json());


const discountRoutes = require('./routes/discountRoutes');
app.use(discountRoutes);
const reviewRoutes = require('./routes/reviewRoutes');
app.use(reviewRoutes);
const carRoutes = require('./routes/carRoutes');
app.use(carRoutes);
//const AdminRoutes = require('./routes/AdminRoutes');
// app.use(AdminRoutes);
const bookingRoutes = require('./routes/bookingRoutes');
app.use(bookingRoutes);

const multer = require('multer');
const storage = multer.memoryStorage(); // store in memory, not disk
const img = multer({ storage });



const Car = require('./models/carSchema');
const { log } = require("console");

app.post('/api/cars', img.single('image'), async (req, res) => {
  try {
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
      year:req.body.year
    });
    if (!req.file) {
  return res.status(400).json({ error: 'No image uploaded' });
}
    await car.save();
    res.status(201).json({ message: 'Car added successfully', car });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

  res.render('AdminPage/manage-bookings')

});
app.get('/AdminPage/manage-cars',(req,res)=>{

  Car.find().then(result=>{
    //console.log(result);    
    res.render('AdminPage/manage-cars',{cars:result});
  }).catch(err=>{
    console.log(err);
  })

  

});
app.get('/AdminPage/manage-users',(req,res)=>{

  res.render('AdminPage/manage-users')

});
app.get('/AdminPage/reports-section',(req,res)=>{

  res.render('AdminPage/reports-section')

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

app.post("/user/add.html", (req, res) => {
  const user = new User(req.body);
  user.save()
    .then(result => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    })
})


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
  const express = require("express");
  const app = express();
  const mongoose = require("mongoose");
  app.use(express.static("public"));
  app.use(express.urlencoded({extended:true}));
  //const User = require("./models/User")
  app.set('view engine','ejs')
  require('dotenv').config();
  const port = process.env.PORT;
  const DB_URL = process.env.MONGODB_URI;
  app.use(express.json());

  const discoutRoutes = require('./routes/discountRoutes');
  app.use(discoutRoutes);
  const reviewRoutes = require('./routes/reviewRoutes');
  app.use(reviewRoutes);
  const carRoutes = require('./routes/carRoutes');
  app.use(carRoutes);
 

   const multer = require('multer');
   const storage = multer.memoryStorage();
   const img = multer({ storage });

   const Car = require('./models/carSchema')

   app.post('/api/cars', img.single('image'), async (req, res) => {
  const car = new Car({
    brand: req.body.brand,
    model: req.body.model,
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype
    }
  });

  await car.save();
  res.status(201).json({ message: 'Car saved', car });
});

  app.get("/", (req, res) => {
    res.render("booking", { root: __dirname });
  });

  app.get("/AdminPage/Admin.ejs",(req,res)=>{
      User.find()
      .then((result)=>{
          console.log(result)
          res.render("AdminPage/Admin.ejs",{arr:result})
      })
      .catch(err=>{
          console.log(err);
      })

  })

  app.post("/user/add.html",(req,res)=>{
      const user = new User(req.body);
      user.save()
      .then(result => {
          res.redirect("/");
      })
      .catch(err =>{
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
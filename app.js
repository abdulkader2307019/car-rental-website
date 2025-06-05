  const express = require("express");
  const app = express();
  const mongoose = require("mongoose");
  app.use(express.static("public"));
  app.use(express.urlencoded({extended:true}));
  const User = require("./models/User")
  app.set('view engine','ejs')

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
   const bookingRoutes=require ('./routes/bookingRoutes'); 
   app.use(bookingRoutes);

  app.get("/", (req, res) => {
    res.render("index", { root: __dirname });
  });

  app.get("/carlisting", (req, res) => {
    res.render("carlisting");
  });

  app.get("/LoginPage/login", (req, res) => {
    res.render("LoginPage/login");
  });

  app.get("/AdminPage/Admin", (req, res) => {
    res.render("AdminPage/Admin");
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
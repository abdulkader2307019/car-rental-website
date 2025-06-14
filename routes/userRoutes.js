
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')

router.get("/", userController.user_get_home);

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/carlisting", userController.user_get_carlisting);

router.get("/car-details/:id", userController.user_get_carDetail);

router.get("/profile", (req, res) => {
  res.render("profile");
});

router.get("/booking/:carId", userController.user_get_booking);

router.get("/LoginPage/login", (req, res) => {
  res.render("LoginPage/login");
});


module.exports = router;
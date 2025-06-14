const Car = require('../models/carSchema');

const user_get_home = async (req, res) => {
  try {
    const featuredCars = await Car.find({ availability: true })
      .sort({ pricePerDay: -1 })
      .limit(8);
    res.render("index", { featuredCars });
  } catch (err) {
    console.log(err);
    res.render("index", { featuredCars: [] });
  }
}

const user_get_carlisting = async (req, res) => {
  try {
    const cars = await Car.find();
    res.render("carlisting", { cars });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading cars');
  }
}

const user_get_carDetail = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).send('Car not found');
    }
    
    res.render("car-details", { car});
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading car details');
  }
}

const user_get_booking = async (req, res) => {
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
}

module.exports = {user_get_home,user_get_carlisting,user_get_carDetail,user_get_booking};
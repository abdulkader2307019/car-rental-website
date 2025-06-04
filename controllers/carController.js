const Car = require('../models/carSchema');

const addCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ message: 'Car added successfully', car });
  } catch (err) {
    res.status(500).json({ message: 'Error adding car', error: err });
  }
};

module.exports = addCar;
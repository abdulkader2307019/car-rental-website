const Car = require('../models/carSchema');

//Add Car
const addCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ message: 'Car added successfully', car });
  } catch (err) {
    res.status(500).json({ message: 'Error adding car', error: err });
  }
};

//Edit Car
const editCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car updated', car: updatedCar });
  } catch (err) {
    res.status(500).json({ message: 'Error updating car'});
}
};

//Delete Car
const deleteCar = async (req, res) => {
  try {
    const deleted = await Car.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting car' });
  }
};

//Search Car By Id
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving car' });
  }
};

//Filters for search
const getCars = async (req, res) => { 
  try {
    const query = {};

    if (req.query.type) query.type = req.query.type;
    if (req.query.location) query.location = req.query.location;
    if (req.query.availability) query.availability = req.query.availability === 'true';
    if (req.query.priceMax) query.pricePerDay = { $lte: Number(req.query.priceMax) };

    const cars = await Car.find(query); 
    res.json(cars); 

  } catch (err) {
    res.status(500).json({ message: 'Error fetching cars' });
  }
};

module.exports = {addCar,editCar,deleteCar,getCarById,getCars};
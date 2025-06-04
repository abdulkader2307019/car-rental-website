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

const editCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car updated', car: updatedCar });
  } catch (err) {
    res.status(500).json({ message: 'Error updating car'});
}
};

module.exports = {addCar,editCar};
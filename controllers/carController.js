const Car = require('../models/carSchema');

// Add Car
const addCar = async (req, res) => {
  try {
    const carData = {
      brand: req.body.brand,
      model: req.body.model,
      type: req.body.type,
      location: req.body.location,
      pricePerDay: Number(req.body.pricePerDay),
      availability: req.body.availability === 'true',
      specs: {
        seats: Number(req.body.seats),
        fuel: req.body.fuel === 'true' ? 'Petrol' : 'Electric',
        transmission: req.body.transmission === 'true' ? 'Automatic' : 'Manual'
      },
      year: parseInt(req.body.year)
    };

    // Handle image upload if present
    if (req.file) {
      carData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const car = new Car(carData);
    await car.save();
    res.status(201).json({ 
      success: true,
      message: 'Car added successfully', 
      car 
    });
  } catch (err) {
    console.error('Error adding car:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error adding car', 
      error: err.message 
    });
  }
};

// Edit Car
const editCar = async (req, res) => {
  try {
    const updateData = {
      brand: req.body.brand,
      model: req.body.model,
      type: req.body.type,
      location: req.body.location,
      pricePerDay: Number(req.body.pricePerDay),
      availability: req.body.availability === 'true',
      specs: {
        seats: Number(req.body.seats),
        fuel: req.body.fuel === 'true' ? 'Petrol' : 'Electric',
        transmission: req.body.transmission === 'true' ? 'Automatic' : 'Manual'
      },
      year: parseInt(req.body.year)
    };

    // Handle image upload if present
    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ 
        success: false,
        message: 'Car not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Car updated successfully', 
      car: updatedCar 
    });
  } catch (err) {
    console.error('Error updating car:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating car',
      error: err.message
    });
  }
};

// Delete Car
const deleteCar = async (req, res) => {
  try {
    const deleted = await Car.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        message: 'Car not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Car deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting car:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting car',
      error: err.message 
    });
  }
};

// Search Car By Id
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ 
        success: false,
        message: 'Car not found' 
      });
    }
    res.json({
      success: true,
      car
    });
  } catch (err) {
    console.error('Error retrieving car:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving car',
      error: err.message 
    });
  }
};

// Filters for search
const getCars = async (req, res) => { 
  try {
    const query = {};

    if (req.query.type) query.type = req.query.type;
    if (req.query.location) query.location = req.query.location;
    if (req.query.availability) query.availability = req.query.availability === 'true';
    if (req.query.priceMax) query.pricePerDay = { $lte: Number(req.query.priceMax) };

    const cars = await Car.find(query); 
    res.json({
      success: true,
      cars
    }); 
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching cars',
      error: err.message 
    });
  }
};

module.exports = { addCar, editCar, deleteCar, getCarById, getCars };
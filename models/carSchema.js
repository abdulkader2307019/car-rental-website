const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (the structure of the car)
const carSchema = new Schema({
  brand: String,
  model: String,
  type: String, // e.g., SUV, sedan
  image: {
    data: Buffer,
    contentType: String
  },
  pricePerDay: Number,
  availability: Boolean,
  location: String,
  specs: { seats: Number, fuel: String, transmission: String }
}, { timestamps: true });

// Create a model based on that schema
const Car = mongoose.model("car", carSchema);

// export the model
module.exports = Car;
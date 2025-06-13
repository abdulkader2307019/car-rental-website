const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const carSchema = new Schema({
  brand: String,
  model: String,
  year: Number,
  type: String,
  image: {
    data: Buffer,
    contentType: String
  },
  pricePerDay: Number,
  availability: Boolean,
  location: String,
  specs: { seats: Number, fuel: String, transmission: String }
}, { timestamps: true });


const Car = mongoose.model("Car", carSchema);



module.exports = Car;
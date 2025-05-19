const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (the structure of the booking)
const bookingSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  startDate: Date,
  endDate: Date,
  locationPickup: String,
  locationDropoff: String,
  status: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'pending' },
  totalPrice: Number
}
, { timestamps: true });

// Create a model based on that schema
const Booking = mongoose.model("booking", bookingSchema);

// export the model
module.exports = Booking;
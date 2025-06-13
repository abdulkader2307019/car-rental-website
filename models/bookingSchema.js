const mongoose = require("mongoose");
const Schema = mongoose.Schema;


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


const Booking = mongoose.model("booking", bookingSchema);


module.exports = Booking;
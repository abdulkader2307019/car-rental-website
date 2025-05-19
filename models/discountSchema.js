const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (the structure of the discount)
const discountSchema = new Schema({
  fireName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  age: Number,
  country: String,
  gender: String,
  passwordHash: String,
  isAdmin: { type: Boolean, default: false },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]

}, { timestamps: true });

// Create a model based on that schema
const Discount = mongoose.model("discount", discountSchema);

// export the model
module.exports = Discount;
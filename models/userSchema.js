const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (the structure of the user)
const userSchema = new Schema({
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
const User = mongoose.model("user", userSchema);

// export the model
module.exports = User;
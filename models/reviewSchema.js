const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (the structure of the review)
const reviewSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  rating: Number,
  comment: String,
  createdAt: Date
}, { timestamps: true });

// Create a model based on that schema
const Review = mongoose.model("review", reviewSchema);

// export the model
module.exports = Review;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (the structure of the discount)
const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountPercent: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  validUntil: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  }
});
// Create a model based on that schema
const Discount = mongoose.model("discount", discountSchema);

// export the model
module.exports = Discount;
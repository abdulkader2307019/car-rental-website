
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber:{
    type:String,
    required:true,
    trim:true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  country: {
    type: String,
    default: 'Egypt'
  },
  age: {
    type: Number,
  },
  memberSince: {
    type: Date,
    default: Date.now
  },
  stats: {
    carsRented: {
      type: Number,
      default: 0
    },
    milesOvercome: {
      type: Number,
      default: 0
    },
    hoursOnRoad: {
      type: Number,
      default: 0
    },
    citiesVisited: {
      type: Number,
      default: 0
    }
  },
  comments: [{
    text: String,
    title: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

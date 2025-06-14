const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'fallback_secret_key_for_development', 
    { expiresIn: '30d' }
  );
};

const register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { firstName, lastName, email, password, phoneNumber, age, country, gender } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields: firstName, lastName, email, password'
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phoneNumber: phoneNumber || '',
      age: age ? parseInt(age) : undefined,
      country: country || 'Egypt',
      gender: gender || 'Other'
    });

    console.log('User created successfully:', user._id);

    const token = generateToken(user._id);
    
    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin || false;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin || false
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('Login successful for user:', email);

    const token = generateToken(user._id);
    
    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin || false;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin || false
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not log out'
      });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });
};

module.exports = {
  register,
  login,
  logout
};
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
console.log('MongoDB URI:', process.env.MONGODB_URI); 
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 2010  ,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
});

module.exports = sessionMiddleware;
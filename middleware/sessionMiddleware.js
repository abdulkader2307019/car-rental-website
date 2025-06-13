const session = require('express-session');
const MongoStore = require('connect-mongo');
console.log('MongoDB URI:', process.env.MONGODB_URI); 

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here'  ,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://abdulkader2307019:sh121212@cluster0.cpspzvf.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0',
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
});

module.exports = sessionMiddleware;
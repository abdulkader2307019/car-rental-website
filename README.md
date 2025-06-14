# CarVoo!! - Premium Car Rental Platform

A comprehensive car rental management system built with Node.js, Express, and MongoDB, featuring user authentication, booking management, admin dashboard, and discount system.

## 🚗 Description

CarVoo!! is a full-featured car rental platform that provides a seamless experience for both customers and administrators. The application offers a modern, responsive interface for browsing and booking premium vehicles, while providing administrators with powerful tools to manage inventory, bookings, users, and business analytics.

### Key Features

- **User Management**: Secure registration, login, and profile management
- **Car Inventory**: Comprehensive car catalog with detailed specifications and images
- **Booking System**: Real-time booking with date validation and pricing calculations
- **Discount System**: Flexible discount codes with usage limits and expiration dates
- **Admin Dashboard**: Complete administrative interface for managing all aspects of the business
- **Responsive Design**: Mobile-first design that works across all devices
- **Image Management**: Secure image upload and storage for cars and user profiles
- **Session Management**: Secure session handling with MongoDB store
- **Search & Filtering**: Advanced search and filtering capabilities for cars

## 🛠 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-session** - Session management
- **connect-mongo** - MongoDB session store
- **multer** - File upload handling
- **cookie-parser** - Cookie parsing middleware
- **dotenv** - Environment variable management

### Frontend
- **EJS** - Templating engine
- **Vanilla JavaScript** - Client-side functionality
- **CSS3** - Styling with modern features
- **HTML5** - Semantic markup

### Development Tools
- **nodemon** - Development server with auto-restart
- **moment** - Date manipulation library

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (v4.0.0 or higher)

## 🚀 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/carvoo-car-rental.git
cd carvoo-car-rental
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/carvoo

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Session Configuration
SESSION_SECRET=your_super_secure_session_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database Setup
Ensure MongoDB is running on your system:

```bash
# For macOS (using Homebrew)
brew services start mongodb-community

# For Ubuntu/Debian
sudo systemctl start mongod

# For Windows
net start MongoDB
```

### 5. Start the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 💻 Usage

### For Customers

1. **Browse Cars**: Visit the homepage to view featured cars or go to `/carlisting` to see all available vehicles
2. **Register/Login**: Create an account or login at `/LoginPage/login`
3. **View Car Details**: Click on any car to see detailed specifications and pricing
4. **Make a Booking**: Select dates, locations, and complete the booking process
5. **Manage Profile**: View booking history and update personal information

### For Administrators

1. **Access Admin Dashboard**: Login with admin credentials and navigate to `/AdminPage/manage-bookings`
2. **Manage Cars**: Add, edit, or remove vehicles from the inventory
3. **Handle Bookings**: View, update, or cancel customer bookings
4. **User Management**: View and manage customer accounts
5. **Discount Codes**: Create and manage promotional discount codes
6. **Reports**: View business analytics and performance metrics

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

#### Cars
- `GET /api/cars` - Get all cars with filtering
- `GET /api/cars/:id` - Get specific car details
- `POST /api/cars` - Add new car (Admin only)
- `PUT /api/cars/:id` - Update car (Admin only)
- `DELETE /api/cars/:id` - Delete car (Admin only)

#### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user` - Get user's bookings
- `PUT /api/bookings/:id/confirm` - Confirm booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

#### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/carvoo` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `SESSION_SECRET` | Secret key for sessions | Required |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

### Database Schema

#### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  age: Number,
  country: String,
  gender: String,
  profileImage: { data: Buffer, contentType: String },
  isAdmin: Boolean,
  memberSince: Date
}
```

#### Car Schema
```javascript
{
  brand: String,
  model: String,
  year: Number,
  type: String,
  image: { data: Buffer, contentType: String },
  pricePerDay: Number,
  availability: Boolean,
  location: String,
  specs: {
    seats: Number,
    fuel: String,
    transmission: String
  }
}
```

#### Booking Schema
```javascript
{
  user: ObjectId (ref: User),
  car: ObjectId (ref: Car),
  startDate: Date,
  endDate: Date,
  locationPickup: String,
  locationDropoff: String,
  status: String (enum: pending, confirmed, cancelled),
  totalPrice: Number
}
```

## 🏗 Architecture Overview

### Project Structure
```
carvoo/
├── controllers/          # Business logic controllers
│   ├── authController.js
│   ├── carController.js
│   ├── bookingController.js
│   ├── profileController.js
│   ├── discountController.js
│   ├── AdminController.js
│   └── userController.js
├── middleware/           # Custom middleware
│   ├── authMiddleware.js
│   └── sessionMiddleware.js
├── models/              # Database schemas
│   ├── User.js
│   ├── carSchema.js
│   ├── bookingSchema.js
│   └── discountSchema.js
├── routes/              # Route definitions
│   ├── authRoutes.js
│   ├── carRoutes.js
│   ├── bookingRoutes.js
│   ├── profileRoutes.js
│   ├── discountRoutes.js
│   ├── adminRoutes.js
│   ├── adminDashRoutes.js
│   └── userRoutes.js
├── views/               # EJS templates
│   ├── AdminPage/
│   ├── LoginPage/
│   ├── partials/
│   └── *.ejs
├── Public/              # Static assets
│   ├── css/
│   ├── js/
│   └── img/
├── app.js               # Application entry point
└── package.json
```

### Design Patterns

1. **MVC Architecture**: Clear separation of concerns with Models, Views, and Controllers
2. **Middleware Pattern**: Modular request processing with authentication and session management
3. **Repository Pattern**: Database operations abstracted through Mongoose models
4. **Factory Pattern**: Consistent error handling and response formatting

### Security Features

- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **JWT Authentication**: Stateless authentication with secure token generation
- **Session Management**: Server-side sessions with MongoDB persistence
- **Input Validation**: Server-side validation for all user inputs
- **File Upload Security**: Restricted file types and size limits for image uploads
- **CORS Protection**: Controlled cross-origin resource sharing

## 🤝 Contributing

We welcome contributions to CarVoo!! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow JavaScript ES6+ standards
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure responsive design for all new UI components
- Write unit tests for new features

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 CarVoo!!

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **Express.js Community** - For the robust web framework
- **MongoDB Team** - For the flexible NoSQL database
- **Mongoose ODM** - For elegant MongoDB object modeling
- **EJS Template Engine** - For server-side rendering capabilities
- **Poppins Font Family** - For the modern typography
- **Unsplash** - For high-quality stock images used in the application

## 📞 Support

For support, email support@carvoo.com or create an issue in the GitHub repository.

## 🔮 Future Enhancements

- **Payment Integration**: Stripe/PayPal integration for online payments
- **Real-time Notifications**: WebSocket implementation for live updates
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed business intelligence dashboard
- **Multi-language Support**: Internationalization (i18n) implementation
- **API Documentation**: Swagger/OpenAPI documentation
- **Automated Testing**: Comprehensive test suite with Jest
- **Docker Support**: Containerization for easy deployment
- **CI/CD Pipeline**: Automated testing and deployment workflows

---

**CarVoo!!** - Drive Your Dreams, Rent Your Ride Today! 🚗✨
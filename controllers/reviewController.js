const Review = require('../models/reviewSchema');
const Booking = require('../models/bookingSchema');
const Car = require('../models/carSchema');

const review_post = async (req, res) => {
    try {
        const { carId, rating, comment } = req.body;

        if (!carId || !rating) {
            return res.status(400).json({ 
                success: false,
                message: 'Car ID and rating are required.' 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false,
                message: 'Rating must be between 1 and 5.' 
            });
        }

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ 
                success: false,
                message: 'Car not found.' 
            });
        }

        const hasBooked = await Booking.exists({
            user: req.user.id,
            car: carId,
            status: 'confirmed'
        });

        if (!hasBooked) {
            return res.status(403).json({ 
                success: false,
                message: 'You must book the car before reviewing it.' 
            });
        }

        const existingReview = await Review.findOne({ user: req.user.id, car: carId });
        if (existingReview) {
            return res.status(409).json({ 
                success: false,
                message: 'You already reviewed this car.' 
            });
        }

        const review = new Review({
            user: req.user.id,
            car: carId,
            rating,
            comment
        });

        await review.save();

        res.status(201).json({ 
            success: true,
            message: 'Review submitted successfully.', 
            review 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: 'Server error while submitting review.' 
        });
    }
};

const car_review_get = async (req, res) => {
    try {
        const { carId } = req.params;

        const reviews = await Review.find({ car: carId })
            .populate('user', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            reviews
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching reviews.' 
        });
    }
};

const admin_review_delete = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({ 
                success: false,
                message: 'Review not found.' 
            });
        }

        res.json({ 
            success: true,
            message: 'Review deleted successfully.' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: 'Server error while deleting review.' 
        });
    }
};

module.exports = { review_post, car_review_get, admin_review_delete };
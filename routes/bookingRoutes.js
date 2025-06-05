const express=require("express")
const router=express.Router();
const bookingController=require("../controllers/bookingController")
const { protect,isAdmin}=require("../middleware/authMiddleware")

router.post('/api/bookings',protect,bookingController.createBooking);

module.exports=router;

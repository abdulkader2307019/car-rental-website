const express=require("express")
const router=express.Router();
const bookingController=require("../controllers/bookingController")
const { protect,isAdmin}=require("../middleware/authMiddleware")

router.post('/api/bookings',protect,bookingController.createBooking);
router.get('/user/bookings',bookingController.viewBooking,protect );
router.put('/bookings/:id/cancel',protect,bookingController.cancelBooking);

module.exports=router;





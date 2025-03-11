const express = require('express');
const userAuth = require('../middleware/userAuth');
const { getUserBookings, getBookingDetails, getBookingsByScheduleId } = require('../controllers/bookingControllers');
const theaterOwnerAdminAuth = require('../middleware/theaterOwnerAdminAuth');
const router = express.Router();

// Create a booking
// router.post('/create-booking', userAuth, createBooking);

// Get all user bookings
router.get('/user-bookings', userAuth, getUserBookings);

// Get booking details 
router.get('/booking-details/:bookingId', userAuth, getBookingDetails);


// Get All Bookings by ScheduleId
router.get('/all-bookings/:scheduleId', theaterOwnerAdminAuth, getBookingsByScheduleId)


module.exports = { bookingRouter: router };

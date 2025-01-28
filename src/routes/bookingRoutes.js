const express = require('express');
const userAuth = require('../middleware/userAuth');
const { createBooking, getUserBookings, getBookingDetails, updateBookingStatus, deleteBooking } = require('../controllers/bookingControllers');
const router = express.Router();

// Create a booking
router.post('/create-booking', userAuth, createBooking);

// Get all user bookings
router.get('/user-bookings', userAuth, getUserBookings);

// Get booking details 
router.get('/booking/:bookingId', userAuth, getBookingDetails);

// Update booking status
router.patch('/update-booking/:bookingId', userAuth, updateBookingStatus);

// Delete a booking
router.delete('/delete-booking/:bookingId', userAuth, deleteBooking);

module.exports = { bookingRouter: router };

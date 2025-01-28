const bookingModel = require("../models/bookingModel");

const createBooking = async (req, res) => {
  try {
    const { showTime, showDate, movieId, theaterId, seats, totalPrice, paymentId, paymentType } = req.body;
    const userId = req.user.id;

    if (!showTime || !showDate || !movieId || !theaterId || !seats || !totalPrice || !paymentId || !paymentType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = new bookingModel({
      showTime,
      showDate,
      movieId,
      theaterId,
      seats,
      totalPrice,
      paymentId,
      paymentType,
      userId,
    });

    await booking.save();
    res.status(201).json({ data: booking, message: "Booking created successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await bookingModel
      .find({ userId })
      .populate('movieId', 'title')
      .populate('theaterId', 'name location')
      .sort({ createdAt: -1 });

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json({ data: bookings, message: "Bookings fetched successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingModel
      .findById(bookingId)
      .populate('movieId', 'title description genre duration')
      .populate('theaterId', 'name location')
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ data: booking, message: "Booking details fetched successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { bookingStatus } = req.body;
    const userId = req.user.id;

    const booking = await bookingModel.findOneAndUpdate(
      { _id: bookingId, userId },
      { bookingStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or not authorized" });
    }

    res.status(200).json({ data: booking, message: "Booking status updated successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await bookingModel.findOneAndDelete({ _id: bookingId, userId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or not authorized" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
  }
};




module.exports = {
  createBooking,
  getUserBookings,
  getBookingDetails,
  updateBookingStatus,
  deleteBooking,
};

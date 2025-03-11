const Booking = require("../models/bookingModel");

// const createBooking = async (req, res) => {
//   try {
//     const {
//       showTime,
//       showDate,
//       movieId,
//       theaterId,
//       seats,
//       totalPrice,
//       paymentId,
//       paymentType,
//     } = req.body;
//     const userId = req.user.id;

//     if (
//       !showTime ||
//       !showDate ||
//       !movieId ||
//       !theaterId ||
//       !seats ||
//       !totalPrice ||
//       !paymentId ||
//       !paymentType
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const booking = new bookingModel({
//       showTime,
//       showDate,
//       movieId,
//       theaterId,
//       seats,
//       totalPrice,
//       paymentId,
//       paymentType,
//       userId,
//     });

//     await booking.save();
//     res
//       .status(201)
//       .json({ data: booking, message: "Booking created successfully" });
//   } catch (error) {
//     return res
//       .status(error.statusCode || 500)
//       .json({ message: error.message || "Internal server error" });
//   }
// };

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ userId, bookingStatus: "Confirmed", }).sort({ createdAt: -1 });

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res
      .status(200)
      .json({ data: bookings, message: "Bookings fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate(
      "userId",
      "name email"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res
      .status(200)
      .json({ data: booking, message: "Booking details fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getBookingsByScheduleId = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const bookings = await Booking.find({
      "scheduleDetails.schedule._id": scheduleId,
      bookingStatus: "Confirmed",
    }).populate("userId", "name email");

    res
      .status(200)
      .json({ data: bookings, message: "All Bookings fetched successfully" });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  // createBooking,
  getUserBookings,
  getBookingDetails,
  getBookingsByScheduleId,
};

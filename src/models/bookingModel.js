const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    scheduleDetails: {
      type: Object,
      required: true,
    },
    seats: [
      {
        seatId: {
          type: String,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Pending"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

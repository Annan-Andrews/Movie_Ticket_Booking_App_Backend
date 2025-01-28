const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    showTime: {
      type: String,
      required: true,
    },
    showDate: {
      type: Date,
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'movie',
      required: true,
    },
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true,
    },
    seats: [
      {
        seat_no: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Pending"],
      default: "Confirmed",
    },
    bookingDate: {
      type: Date,
      default: Date.now, 
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    updatedAt: {
      type: Date,
      default: Date.now, 
    },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model('Booking', bookingSchema);

module.exports = bookingModel;

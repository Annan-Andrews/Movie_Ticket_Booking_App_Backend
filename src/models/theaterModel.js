const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    seats: [
      {
        seatId: { type: String, required: true }, // Example: A1, B5
      },
    ],
    movieSchedules: [
      {
        movieId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "movie",
        },
        showTime: {
          type: String,
          required: true,
        },
        showDate: {
          type: Date,
          required: true,
        },
        price: {
          type: Number,
          min: 0,
        },
        seats: [
          {
            seatId: { type: String, required: true }, // Example: A1, B5
            isBooked: { type: Boolean, default: false },
            bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          },
        ],
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TheaterOwnerAdmin",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const theaterModel = mongoose.model("Theater", theaterSchema);

module.exports = theaterModel;

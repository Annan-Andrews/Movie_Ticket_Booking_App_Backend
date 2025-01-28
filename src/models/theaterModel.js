const mongoose = require('mongoose');
const movieModel = require('./movieModel')

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
    seats: {
      type: Number,
      required: true,
      min: 1, 
    },
    movieSchedules: [
      {
        movieId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'movie', 
        },
        showTime: {
          type: String,
        },
        showDate: {
          type: Date,
        },
        price: {
          type: Number,
          min: 0,
        },
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel', 
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    
  },
  { timestamps: true } 
);

const theaterModel = mongoose.model('Theater', theaterSchema);

module.exports = theaterModel;

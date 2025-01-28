const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  language: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    default: 'https://davidkoepp.com/wp-content/themes/blankslate/images/Movie%20Placeholder.jpg',
  },
  poster: {
    type: String,
    default: 'https://th.bing.com/th/id/OIP.Fd_UF0a50oxLd-Xy8IjPDgHaEj?rs=1&pid=ImgDetMain',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TheaterOwnerAdmin',  
  },
},
{ timestamps: true }
);

const movieModel = mongoose.model('movie', movieSchema);

module.exports = movieModel

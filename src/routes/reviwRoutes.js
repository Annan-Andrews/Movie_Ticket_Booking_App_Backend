const express = require('express');
const userAuth = require('../middleware/userAuth');
const { addReview, getMovieReviews, deleteReview, getAverageRating } = require('../controllers/reviewControllers');
const router = express.Router();

// add-review
router.post("/add-review", userAuth, addReview);

// get-movie-review
router.get("/get-movie-reviews/:movieId", getMovieReviews);

// delete-review
router.delete('/delete-review/:reviewId',userAuth, deleteReview);

// get-avg-rating
router.get('/get-avg-rating/:movieId', getAverageRating);

module.exports = { reviewRouter: router };
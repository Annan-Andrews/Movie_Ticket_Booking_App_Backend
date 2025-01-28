const express = require('express');
const theaterOwnerAdminAuth = require('../middleware/theaterOwnerAdminAuth');
const { createMovie, getMovies, getMovieDetails, deleteMovie, searchMovies } = require('../controllers/movieControllers');
const { upload } = require('../middleware/multer');
const router = express.Router();

// Create movie
router.post('/create-movie', theaterOwnerAdminAuth, upload, createMovie);

// Get all movies
router.get('/get-all-movies',getMovies);

// Search movies
router.get('/search-movies', searchMovies);

// Get details of a specific movie
router.get('/get-movie-details/:movieId',getMovieDetails);

// Delete a movie
router.delete('/delete-movie/:movieId', theaterOwnerAdminAuth, deleteMovie);



// Get movies by genre
// Get movies by theater
// Get top-rated movies



module.exports = { movieRouter: router };

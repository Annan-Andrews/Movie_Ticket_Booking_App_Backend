const express = require('express');
const theaterOwnerAdminAuth = require('../middleware/theaterOwnerAdminAuth');
const { createMovie, getMovies, getMovieDetails, deleteMovie, searchMovies, getMoviesByOwnerId, editMovie } = require('../controllers/movieControllers');
const { upload } = require('../middleware/multer');
const router = express.Router();

// Create movie
router.post('/create-movie', theaterOwnerAdminAuth, upload, createMovie);

// Edit movie
router.post('/edit-movie/:movieId', theaterOwnerAdminAuth, upload, editMovie);

// Get all movies
router.get('/get-all-movies',getMovies);

// Get all movies by specific theater OWner
router.get('/view-movies/:ownerId', theaterOwnerAdminAuth, getMoviesByOwnerId)

// Search movies
router.get('/search-movies', searchMovies);

// Get details of a specific movie
router.get('/get-movie-details/:movieId',getMovieDetails);

// Delete a movie
router.post('/delete-movie/:movieId', theaterOwnerAdminAuth, deleteMovie);



// Get movies by genre
// Get movies by theater
// Get top-rated movies



module.exports = { movieRouter: router };

const express = require('express');
const theaterOwnerAdminAuth = require('../middleware/theaterOwnerAdminAuth');
const { createTheater, addMovieSchedules, getAllTheaters, getMovieSchedules, updateTheater, deleteTheater, getTheatersByMovie } = require('../controllers/theaterControllers');
const router = express.Router()


// create-theater
router.post('/create-theater', theaterOwnerAdminAuth, createTheater);


// add-movie-Schedules
router.post('/add-movie-schedules/:theaterId', theaterOwnerAdminAuth, addMovieSchedules);

// view-all-theater
router.get('/view-all-theaters', getAllTheaters);

// view-moive-shedules of specific theater
router.get('/view-movie-schedules/:theaterId', getMovieSchedules);


// Update theater details
router.put('/update-theater/:theaterId', theaterOwnerAdminAuth, updateTheater);

// Delete a theater
router.delete('/delete-theater/:theaterId', theaterOwnerAdminAuth, deleteTheater);

// Get theaters by movie
router.get('/get-theaters-by-movie/:movieId', getTheatersByMovie);



module.exports = { theaterRouter: router };
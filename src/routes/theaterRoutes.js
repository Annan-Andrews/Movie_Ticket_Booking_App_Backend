const express = require('express');
const theaterOwnerAdminAuth = require('../middleware/theaterOwnerAdminAuth');
const { createTheater, addMovieSchedules, getAllTheaters, getMovieSchedules, updateTheater, deleteTheater, getTheatersByMovie, getTheatersByOwnerId, getTheaterDetails, getMovieSchedulesbyOwnerId, deleteMovieScheduleByMovieId } = require('../controllers/theaterControllers');
const router = express.Router()


// create-theater
router.post('/create-theater', theaterOwnerAdminAuth, createTheater);


// add-movie-Schedules
router.post('/add-movie-schedules/:theaterId', theaterOwnerAdminAuth, addMovieSchedules);

// view-all-theater
router.get('/view-all-theaters', getAllTheaters);

// view-theater of specific theater owner
router.get('/view-theater/:ownerId', theaterOwnerAdminAuth, getTheatersByOwnerId)


// view-moive-shedules of specific theater
router.get('/view-movie-schedules/:theaterId', getMovieSchedules);


// view-all-moive-shedules of specific theater owner
router.get('/movie-schedules/:ownerId', theaterOwnerAdminAuth, getMovieSchedulesbyOwnerId);


// view-theater-details
router.get('/get-theater-details/:theaterId', theaterOwnerAdminAuth, getTheaterDetails)


// Update theater details
router.post('/update-theater/:theaterId', theaterOwnerAdminAuth, updateTheater);

// Delete a theater
router.post('/delete-theater/:theaterId', theaterOwnerAdminAuth, deleteTheater);

// Get theaters by movie
router.get('/get-theaters-by-movie/:movieId', getTheatersByMovie);


// delete movieSchedule
// router.post('/deleteMovieSchedule/:movieScheduleId', theaterOwnerAdminAuth, deleteMovieSchedule)



// delete movieSchedules of specific movie  
router.post('/delete-movieSchedule/:movieId', theaterOwnerAdminAuth, deleteMovieScheduleByMovieId)



module.exports = { theaterRouter: router };
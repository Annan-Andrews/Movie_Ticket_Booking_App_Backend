const theaterModel = require("../models/theaterModel");
const movieModel = require("../models/movieModel");
const mongoose = require("mongoose");

const createTheater = async (req, res, next) => {
  try {
    const { name, location, totalseats } = req.body;

    if (!name || !location || !totalseats) {
      return res.status(400).json({ message: "all fileds required" });
    }

    const ownerId = req.user.id;

    const existingTheater = await theaterModel.findOne({
      name,
      location,
      ownerId,
    });
    if (existingTheater) {
      return res.status(400).json({ message: "Theater already exists" });
    }

    const generateSeatsLayout = (totalseats, seatsPerRow = 20) => {
      const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Supports up to 26 rows
      let totalRows = Math.floor(totalseats / seatsPerRow);
      const remainingSeats = totalseats % seatsPerRow;
      const seatLayout = [];

      if (remainingSeats > 0) {
        totalRows += 1;
      }

      for (let i = 0; i < totalRows; i++) {
        const seatsInCurrentRow =
          i === totalRows - 1 && remainingSeats > 0
            ? remainingSeats
            : seatsPerRow;

        for (let j = 1; j <= seatsInCurrentRow; j++) {
          seatLayout.push({
            seatId: `${rows[i]}${j}`,
          });
        }
      }
      return seatLayout;
    };

    const seats = generateSeatsLayout(totalseats);

    const theaterData = new theaterModel({
      name,
      location,
      seats,
      movieSchedules: [],
      ownerId,
    });
    await theaterData.save();

    res.json({ data: theaterData, message: "Theater created successfully" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const addMovieSchedules = async (req, res, next) => {
  try {
    const { theaterId } = req.params;
    const { movieId, showTime, showDate, price } = req.body;

    if (!movieId || !showTime || !showDate || price === undefined) {
      return res
        .status(400)
        .json({ message: "All schedule fields are required" });
    }

    const theater = await theaterModel.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const seats = theater.seats.map((seat) => ({
      seatId: seat.seatId,
      isBooked: false,
    }));

    const movie = await movieModel.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    theater.movieSchedules.push({ movieId, showTime, showDate, price, seats });
    await theater.save();

    res.json({ data: theater, message: "Movie schedule added successfully" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getAllTheaters = async (req, res, next) => {
  try {
    const theaters = await theaterModel.find().populate("ownerId", "name");
    res.json({ data: theaters, message: "All theaters fetched successfully" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getMovieSchedules = async (req, res, next) => {
  try {
    const { theaterId } = req.params;
    const theater = await theaterModel
      .findById(theaterId)
      .populate("movieSchedules.movieId");

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.json({
      data: theater.movieSchedules,
      message: "Movie schedules fetched successfully",
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getMovieSchedulesbyOwnerId = async (req, res, next) => {
  try {
    const { ownerId } = req.params;
    const movieSchedule = await theaterModel
      .findOne({ ownerId })
      .select("name movieSchedules")
      .populate("movieSchedules.movieId", "title");

    if (!movieSchedule) {
      return res.status(404).json({ message: "movieSchedule not found" });
    }

    res.json({
      data: movieSchedule,
      message: "Movie schedules fetched successfully",
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};


const getAllMovieSchedules = async (req, res, next) => {
  try {
    
    const movieSchedule = await theaterModel
      .find()
      .select("name movieSchedules")
      .populate("movieSchedules.movieId", "title");

    if (!movieSchedule) {
      return res.status(404).json({ message: "movieSchedule not found" });
    }

    res.json({
      data: movieSchedule,
      message: "All Movie schedules fetched successfully",
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const updateTheater = async (req, res, next) => {
  try {
    const { theaterId } = req.params;
    const { name, location, seats } = req.body;

    const theater = await theaterModel.findByIdAndUpdate(
      theaterId,
      { name, location, seats },
      { new: true }
    );

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.json({
      data: theater,
      message: "Theater details updated successfully",
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const deleteTheater = async (req, res, next) => {
  try {
    const { theaterId } = req.params;
    const theater = await theaterModel.findByIdAndDelete(theaterId);

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.json({ data: theater, message: "Theater deleted successfully" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getTheatersByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const theaters = await theaterModel.find({
      "movieSchedules.movieId": movieId,
    });

    if (theaters.length === 0) {
      return res
        .status(404)
        .json({ message: "No theaters found for this movie" });
    }

    res.json({
      data: theaters,
      message: "Theaters for the movie fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getTheatersByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const theaters = await theaterModel
      .find({ ownerId }) // Directly match ownerId
      .populate("movieSchedules.movieId", "title genre duration rating") // Populate movie details
      .lean(); // Improves performance by returning plain JS objects

    if (!theaters.length) {
      return res
        .status(404)
        .json({ message: "No theaters found for this owner" });
    }

    res
      .status(200)
      .json({ data: theaters, message: "Theaters fetched successfully" });
  } catch (error) {
    console.error("Error fetching theaters by ownerId:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getTheaterDetails = async (req, res, next) => {
  try {
    const { theaterId } = req.params;

    const theater = await theaterModel
      .findById(theaterId)
      .populate("movieSchedules.movieId", "title");

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.json({
      data: theater,
      message: "Theater details fetched successfully",
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const deleteMovieScheduleByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const objectId = new mongoose.Types.ObjectId(movieId); // Convert to ObjectId

    if (!movieId) {
      return res
        .status(400)
        .json({ success: false, message: "Movie ID is required" });
    }

    // Find and update theaters that have this movieId in their movieSchedules
    const result = await theaterModel.updateMany(
      { "movieSchedules.movieId": objectId }, // Find theaters with this movie in schedule
      { $pull: { movieSchedules: { movieId: objectId } } } // Correct: Remove the movie schedule by movieId
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No schedules found for this movie ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movie schedule deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting movie schedule:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getMovieScheduleByScheduleId = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    // Find the theater and its movie schedules by the scheduleId
    const theater = await theaterModel
      .findOne({ "movieSchedules._id": scheduleId })
      .select("name movieSchedules")
      .populate("movieSchedules.movieId", "title image");

    if (!theater) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Find the specific schedule by scheduleId
    const schedule = theater.movieSchedules.find(
      (schedule) => schedule._id.toString() === scheduleId
    );

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    
    res.json({
      data: { theaterName: theater.name, schedule },
      message: "Movie schedule fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createTheater,
  addMovieSchedules,
  getAllTheaters,
  getMovieSchedules,
  updateTheater,
  deleteTheater,
  getTheatersByMovie,
  getTheatersByOwnerId,
  getTheaterDetails,
  getMovieSchedulesbyOwnerId,
  deleteMovieScheduleByMovieId,
  getMovieScheduleByScheduleId,
  getAllMovieSchedules,
};

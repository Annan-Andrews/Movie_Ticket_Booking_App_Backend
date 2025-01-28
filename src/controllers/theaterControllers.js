const theaterModel = require("../models/theaterModel");
const movieModel = require("../models/movieModel");

const createTheater = async(req,res,next) => {
  try {
    const {name, location, seats} = req.body;

    if (!name || !location || !seats) {
      return res.status(400).json({ message: "all fileds required" });
    }

    const ownerId = req.user.id;

    const existingTheater = await theaterModel.findOne({ name, location, ownerId });
    if (existingTheater) {
      return res.status(400).json({ message: "Theater already exists" });
    }

    const theaterData = new theaterModel({
      name,
      location,
      seats,
      movieSchedules: [],
      ownerId,
    })
    await theaterData.save()

    res.json({ data: theaterData, message: "Theater created successfully" });
    
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
  }
}

const addMovieSchedules = async (req, res, next) => {
  try {
    const { theaterId } = req.params;
    const { movieId, showTime, showDate, price } = req.body;

    if (!movieId || !showTime || !showDate || price === undefined) {
      return res.status(400).json({ message: "All schedule fields are required" });
    }

    const theater = await theaterModel.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const movie = await movieModel.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    theater.movieSchedules.push({ movieId, showTime, showDate, price });
    await theater.save();

    res.json({ data: theater, message: "Movie schedule added successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
  }
};

const getAllTheaters = async (req, res, next) => {
  try {
    const theaters = await theaterModel.find().select("-movieSchedules"); 
    res.json({ data: theaters, message: "All theaters fetched successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
  }
};

const getMovieSchedules = async (req, res, next) => {
  try {
    const { theaterId } = req.params;
    const theater = await theaterModel.findById(theaterId).populate("movieSchedules.movieId");
    
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.json({ data: theater.movieSchedules, message: "Movie schedules fetched successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
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

    res.json({ data: theater, message: "Theater details updated successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
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
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
  }
};

const getTheatersByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const theaters = await theaterModel.find({
      "movieSchedules.movieId": movieId
    });

    if (theaters.length === 0) {
      return res.status(404).json({ message: "No theaters found for this movie" });
    }

    res.json({ data: theaters, message: "Theaters for the movie fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createTheater, 
  addMovieSchedules, 
  getAllTheaters, 
  getMovieSchedules, 
  updateTheater, 
  deleteTheater, 
  getTheatersByMovie
}
const { cloudinaryInstance } = require("../config/cloudinary");
const movieModel = require("../models/movieModel");

const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      genre,
      duration,
      releaseDate,
      language,
      rating,
    } = req.body;

    if (
      !title ||
      !description ||
      !genre ||
      !duration ||
      !releaseDate ||
      !language
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ownerId = req.user.id;

    let cloudinaryImageResponse;
    let cloudinaryPosterResponse;

    // Upload images directly from memory buffer
    const uploadToCloudinary = (fileBuffer, folder) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinaryInstance.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    if (req.files?.image?.[0]) {
      cloudinaryImageResponse = await uploadToCloudinary(
        req.files.image[0].buffer,
        "movies"
      );
    }

    if (req.files?.poster?.[0]) {
      cloudinaryPosterResponse = await uploadToCloudinary(
        req.files.poster[0].buffer,
        "movies"
      );
    }

    console.log("cloudinaryImageResponse ===", cloudinaryImageResponse);
    console.log("cloudinaryPosterResponse ===", cloudinaryPosterResponse);

    const movieData = new movieModel({
      title,
      description,
      genre,
      duration,
      releaseDate,
      language,
      rating,
      ownerId,
      image: cloudinaryImageResponse?.secure_url || undefined,
      poster: cloudinaryPosterResponse?.secure_url || undefined,
    });

    await movieData.save();

    res
      .status(201)
      .json({ data: movieData, message: "Movie created successfully" });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const editMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const {
      title,
      description,
      genre,
      duration,
      releaseDate,
      language,
      rating,
    } = req.body;

    const ownerId = req.user.id;

    let cloudinaryImageResponse;
    let cloudinaryPosterResponse;

    // Upload images directly from memory buffer
    const uploadToCloudinary = (fileBuffer, folder) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinaryInstance.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    if (req.files?.image?.[0]) {
      cloudinaryImageResponse = await uploadToCloudinary(
        req.files.image[0].buffer,
        "movies"
      );
    }

    if (req.files?.poster?.[0]) {
      cloudinaryPosterResponse = await uploadToCloudinary(
        req.files.poster[0].buffer,
        "movies"
      );
    }

    console.log("cloudinaryImageResponse ===", cloudinaryImageResponse);
    console.log("cloudinaryPosterResponse ===", cloudinaryPosterResponse);

    const movie = await movieModel.findByIdAndUpdate(
      movieId,
      {
        title,
        description,
        genre,
        duration,
        releaseDate,
        language,
        rating,
        image: cloudinaryImageResponse?.secure_url || undefined,
        poster: cloudinaryPosterResponse?.secure_url || undefined,
      },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res
      .status(200)
      .json({ data: movie, message: "Movie updated successfully" });
  } catch (error) {
    console.error("Error updating movie:", error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getMovies = async (req, res, next) => {
  try {
    const movieList = await movieModel.find().select("-duration -poster");

    res.json({ data: movieList, message: "All movies fetched" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getMovieDetails = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;

    const movieData = await movieModel.findById(movieId);

    if (!movieData) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json({ data: movieData, message: "Movie Details Fetched" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    movieId = req.params.movieId;
    ownerId = req.user.id;

    const deletedMovie = await movieModel.findOneAndDelete({
      _id: movieId,
      ownerId,
    });

    if (!deletedMovie) {
      return res
        .status(404)
        .json({ message: "Movie not found or not authorized" });
    }

    res
      .status(200)
      .json({ data: deletedMovie, message: "Movie deleted successfully" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const searchMovies = async (req, res, next) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Title is required for searching" });
    }

    const filter = {
      title: { $regex: title, $options: "i" },
    };

    const movies = await movieModel.find(filter);

    if (movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found matching the title" });
    }

    res.json({ data: movies, message: `Results for Search : ${title}` });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getMoviesByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const movies = await movieModel
      .find({ ownerId })
      .select("-duration -poster");

    if (!movies.length) {
      return res
        .status(404)
        .json({ message: "No movies found for this owner" });
    }

    res
      .status(200)
      .json({ data: movies, message: "movies fetched successfully" });
  } catch (error) {
    console.error("Error fetching movies by ownerId:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createMovie,
  getMovies,
  getMovieDetails,
  deleteMovie,
  searchMovies,
  getMoviesByOwnerId,
  editMovie,
};

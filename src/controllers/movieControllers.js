const { cloudinaryInstance } = require("../config/cloudinary");
const movieModel = require("../models/movieModel");

const createMovie = async(req,res,next) =>{
  try {
    const { title, description, genre, duration, releaseDate, language } = req.body;

    let cloudinaryImageResponse;
    let cloudinaryPosterResponse;

    if (!title || !description || !genre || !duration || !releaseDate || !language) {
      return res.status(400).json({ message: "all fileds required" });
    }

    const ownerId = req.user.id;

    if (req.file) {
      if (req.file.fieldname === 'image') {
        cloudinaryImageResponse = await cloudinaryInstance.uploader.upload(req.file.path);
      } else if (req.file.fieldname === 'poster') {
        cloudinaryPosterResponse = await cloudinaryInstance.uploader.upload(req.file.path);
      }
    }

    const movieData = new movieModel({
      title,
      description,
      genre,
      duration, 
      releaseDate, 
      language, 
      ownerId,
      image: cloudinaryImageResponse?.secure_url || undefined, 
      poster: cloudinaryPosterResponse?.secure_url || undefined,
    })
    await movieData.save()
    
    res.json({ data: movieData, message: "Movie created successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});
  }

}

const getMovies = async (req, res, next) => {
  try {
    const movieList = await movieModel.find().select("-duration -poster");

    res.json({ data: movieList, message: "All movies fetched" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

const getMovieDetails = async(req,res,next) => {
  try {
    const movieId = req.params.movieId
    
    const movieData = await movieModel.findById(movieId)

    if(!movieData){
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json({ data: movieData, message: "Movie Details Fetched" });
    
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
}

const deleteMovie = async(req,res,next) => {
  try {
    movieId = req.params.movieId
    ownerId = req.user.id

    const deletedMovie = await movieModel.findOneAndDelete({ _id: movieId, ownerId });

    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found or not authorized" });
    }

    res.status(200).json({ data: deletedMovie, message: "Movie deleted successfully" });

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
}

const searchMovies = async (req, res, next) => {
  try {
    const { title } = req.query; 

    if (!title) {
      return res.status(400).json({ message: "Title is required for searching" });
    }

    const filter = {
      title: { $regex: title, $options: 'i' },
    };

    const movies = await movieModel.find(filter);

    if (movies.length === 0) {
      return res.status(404).json({ message: "No movies found matching the title" });
    }

    res.json({ data: movies, message: `Results for Search : ${title}` });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};


module.exports = {createMovie, getMovies, getMovieDetails, deleteMovie, searchMovies}
const movieModel = require("../models/movieModel");
const reviewModel = require("../models/reviewModel");

const addReview = async (req, res) => {
  try {
      const { movieId, rating, comment } = req.body;
      const userId = req.user.id;

      // Validate if the movie exists
      const movie = await movieModel.findById(movieId);
      if (!movie) {
          return res.status(404).json({ message: "Movie not found" });
      }

      if (rating > 5 || rating <= 1) {
          return res.status(400).json({ message: "Please provide a proper rating" });
      }

      // Create or update the review
      const review = await reviewModel.findOneAndUpdate(
        { userId, movieId }, 
        { rating, comment }, 
        { new: true, upsert: true }
      );

      res.status(201).json({ data: review, message: "review added successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

const getMovieReviews = async (req, res) => {
  try {
      const { movieId } = req.params;

      const reviews = await reviewModel.find({ movieId }).populate("userId", "name").sort({ createdAt: -1 });

      if (!reviews.length) {
          return res.status(404).json({ message: "No reviews found for this movie" });
      }

      res.status(200).json({ data: reviews, message: "reviews fetched successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

const deleteReview = async (req, res) => {
  try {
      const { reviewId } = req.params;
      const userId = req.user.id;

      const review = await reviewModel.findOneAndDelete({ _id: reviewId, userId });

      if (!review) {
          return res.status(404).json({ message: "Review not found or not authorized" });
      }

      res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

const getAverageRating = async (req, res) => {
  try {
      const { movieId } = req.params;

      const reviews = await reviewModel.find({ movieId });

      if (!reviews.length) {
          return res.status(404).json({ message: "No reviews found for this course" });
      }

      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

      res.status(200).json({ data: averageRating, message: "avg reviews fetched" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {addReview, getMovieReviews, deleteReview, getAverageRating}
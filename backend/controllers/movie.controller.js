import { Movie } from "../models/movie.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Genre } from "../models/genre.model.js";

const createMovie = asyncHandler(async(req,res) => {
    const {name , image , year ,genre , detail , cast} = req.body;

    if(!name || !year || !detail || !genre){
        throw new ApiError(400 , "All required fields (name, year, genre, detail) must be provided");
    }

    const existingGenre = await Genre.findById(genre);
    if(!existingGenre){
        throw new ApiError(400 , "Invalid genre ID");
    }

    const movie = await Movie.create({
        name,
        image,
        year,
        genre,
        detail,
        cast,
    });

    if(!movie){
        throw new ApiError(400 , "Movie not created");
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , movie , "Movie created successfully"));
});

const getAllMovies = asyncHandler(async(req,res) => {
    const movies = await Movie.find({});

    if(!movies){
        throw new ApiError(400 , "Movies not found");
    }

    return res
             .status(200)
             .json(new ApiResponse(200 , movies , "Movies fetched successfully"));
});

const getSpecificMovie = asyncHandler(async(req,res) => {
    const {movieId} = req.params;

    if(!movieId){
        throw new ApiError(400 , "Movie id is required");
    }

    const specificMovie = await Movie.findById(movieId);

    if(!specificMovie){
        throw new ApiError(400 , "Movie not found");
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , specificMovie , "Movie fetched successfully"));
});

const updateMovie = asyncHandler(async(req,res) => {
    const {movieId} = req.params;

    if(!movieId){
        throw new ApiError(400 , "Movie Id not found");
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
        movieId , req.body,
        {
            new : true
        }
    );
    if(!updatedMovie){
        throw new ApiError(400 , "Movie not found");
    }

    return res
             .status(200)
             .json(new ApiResponse(200 , updatedMovie , "Movie updated successfully"));
});

const movieReview = asyncHandler(async(req,res) => {
    const {rating , comment} = req.body;
    const movie = await Movie.findById(req.params.id);

    if(movie){
        const alreadyReviewed = movie.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );
        if(alreadyReviewed){
            throw new ApiError(400 , "Movie already reviewed");
        }

        const review = {
            name : req.user.username,
            rating : Number(rating),
            comment,
            user : req.user._id
        }

        movie.reviews.push(review);
        movie.numReviews = movie.reviews.length
        movie.rating = movie.reviews.reduce((acc , item) => item.rating + acc , 0)/movie.reviews.length;

        await movie.save();

        return res.status(200).json(new ApiResponse(200 ,movie ,  "Movie review done"));
    }
})

const deleteMovie = asyncHandler(async(req,res) => {
    const {movieId} = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if(!deletedMovie){
        throw new ApiError(400 , "Movie not found");
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , {} , "Movie deleted successfully"));
})

const getNewMovies = asyncHandler(async(req,res) => {
    const newMovies = await Movie.find().sort({createdAt : -1 }).limit(10);

    if(!newMovies){
        throw new ApiError(400 , "Movies not found");
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , newMovies , "Movies fetched successfully"));
})

const getTopMovies = asyncHandler(async(req,res) => {
    const topRatedMovies = await Movie.find().sort({numReviews : -1}).limit(10);

    if(!topRatedMovies){
        throw new ApiError(400 , "Movies with top rating not found");
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , topRatedMovies , "Top Rated Movies fetched successfully"));
})

const getRandomMovies = asyncHandler(async(req,res) => {
    const randomMovies = await Movie.aggregate([{$sample : {size : 10}}]);
    
    if(!randomMovies){
        throw new ApiError(400 , "Movies not found");
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , randomMovies , "Movies fetched successfully"));
})

const deleteComment = asyncHandler(async(req,res) => {
    const {movieId , reviewId} = req.body;

    const movie = await Movie.findById(movieId);

    if(!movie){
        throw new ApiError(400 , "Movie not found");
    }

    const reviewIndex = movie.reviews.findIndex(
        (r) => r._id.toString() === reviewId
    );

    if(reviewIndex === -1){
        throw new ApiError(400 , "Comment not found");
    }

    movie.reviews.splice(reviewIndex , 1)
    movie.numReviews = movie.reviews.length
    movie.rating = movie.reviews.length > 0
      ? movie.reviews.reduce((acc, item) => item.rating + acc , 0) / movie.reviews.length : 0;

    await movie.save();

    return res
             .status(200)
             .json(new ApiResponse(200 , {} , "Comment deleted successfully"));


})

export {
    createMovie,
    getAllMovies,
    getSpecificMovie,
    updateMovie,
    deleteMovie,
    movieReview,
    getNewMovies,
    getTopMovies,
    getRandomMovies,
    deleteComment
}
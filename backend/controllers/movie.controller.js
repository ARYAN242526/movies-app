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
})


export {createMovie}
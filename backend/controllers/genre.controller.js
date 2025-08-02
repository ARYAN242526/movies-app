import { Genre } from "../models/genre.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createGenre = asyncHandler(async(req, res) => {
    const {name} = req.body;

    if(!name){
        throw new ApiError(400 , "Genre name is required");
    }

    const existingGenre = await Genre.findOne({name});

    if(existingGenre){
        throw new ApiError(400, "Genre already exists");
    }

    const genre = await Genre.create({name});

    if(!genre){
        throw new ApiError(400 , "Genre not created");
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , genre , "Genre created successfully"));
});

const updateGenre = asyncHandler(async(req,res) => {
    const {genreId} = req.params;
    const {name} = req.body;
    
    if(!genreId || !name){
        throw new ApiError(400 , "Genre ID and name both are required");
    }

    const genre = await Genre.findById(genreId);

    if(!genre){
        throw new ApiError(400 , "Genre not found");
    }

    const updatedGenre = await Genre.findByIdAndUpdate(
        genreId , {
            $set : {
                name : name
            }
        },
        {new : true}
    );

    return res
             .status(200)
             .json(new ApiResponse(200 ,updatedGenre, "Genre updated successfully"))
});

const removeGenre = asyncHandler(async(req,res) => {
    const {genreId} = req.params;

    const removed = await Genre.findByIdAndDelete(genreId);

    if(!removed){
        throw new ApiError(400 , "Genre not found");
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , {} , "Genre removed successfully"));
});

const listGenres = asyncHandler(async(req,res) => {
    const genres = await Genre.find({});

    if(!genres){
        throw new ApiError(400 , "Genres not found")
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , genres , "All Genres listed successfully"));
});

const readGenre = asyncHandler(async(req,res) => {
    const {genreId} = req.params;

    const genre = await Genre.findById(genreId);

    if(!genre){
        throw new ApiError(400 , "Genre not found");
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , genre , "Genre read successfully"));
})

export {createGenre,
    updateGenre,
    removeGenre,
    listGenres,
    readGenre
}
import { Router } from "express";

// middlewares
import { authenticate , authorizeAdmin } from "../middlewares/auth.middleware.js";
import checkId from "../middlewares/checkId.js";

// controllers
import { createMovie, deleteMovie, getAllMovies , getSpecificMovie, updateMovie , movieReview, getNewMovies, getTopMovies, getRandomMovies, deleteComment} from "../controllers/movie.controller.js";


const router = Router();

// Public routes
router.get('/all-movies' , getAllMovies);
router.get('/specific-movie/:movieId' , getSpecificMovie);
router.get('/new-movies' , getNewMovies);
router.get('/top-movies' , getTopMovies);
router.get('/random-movies' , getRandomMovies);

// Restricted routes
router.post('/:id/reviews', authenticate , authorizeAdmin , checkId , movieReview);

// Admin
router.post('/create-movie' , authenticate, authorizeAdmin , createMovie);
router.put('/update-movie/:movieId' ,authenticate , authorizeAdmin, updateMovie);
router.delete('/delete-movie/:movieId' ,authenticate , authorizeAdmin, deleteMovie);
router.delete('/delete-comment' ,authenticate , authorizeAdmin, deleteComment);




export default router;
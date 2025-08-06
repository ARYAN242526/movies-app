import { Router } from "express";

// middlewares
import { authenticate , authorizeAdmin } from "../middlewares/auth.middleware.js";
// import checkId from "../middlewares/checkId.js";

// controllers
import { createMovie } from "../controllers/movie.controller.js";


const router = Router()

// Public routes
// router.get('/all-movies' , getAllMovies);


// Restricted routes

// Admin
router.post('/create-movie' , authenticate, authorizeAdmin , createMovie)






export default router;
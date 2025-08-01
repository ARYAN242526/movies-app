import { Router } from "express";

// Controllers
import { createGenre, updateGenre , removeGenre, listGenres, readGenre } from "../controllers/genre.controller.js";


// Middlewares
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";


const router = Router();

router.route('/').post(authenticate , authorizeAdmin , createGenre);
router.route('/:genreId').put(authenticate , authorizeAdmin , updateGenre);
router.route('/:genreId').delete(authenticate , authorizeAdmin , removeGenre);
router.route('/genres').get(listGenres);
router.route('/:genreId').get(readGenre);

export default router
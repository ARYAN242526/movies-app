import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from "path";

import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import genreRoutes from './routes/genre.routes.js';
import movieRoutes from './routes/movie.routes.js';


// Configuration
dotenv.config()

connectDB();

const app = express()

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

// Routes
app.use('/api/v1/users' , userRoutes);
app.use('/api/v1/genre' , genreRoutes);
app.use('/api/v1/movies' , movieRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  
})
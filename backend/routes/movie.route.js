import express from 'express';
import { getTrendingMovie,getMovieTrailers,getMovieDetails,getSimmilarMovie,getMoviesByCategory } from '../controllers/movie.controller.js';

const router = express.Router();

router.get("/trending",getTrendingMovie);
router.get("/:id/trailers",getMovieTrailers);
router.get("/:id/details",getMovieDetails);
router.get("/:id/simmilar",getSimmilarMovie);
router.get("/:category",getMoviesByCategory);

export default router;
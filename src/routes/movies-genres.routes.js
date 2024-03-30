import { Router } from 'express'
import { methods as movieController } from './../controllers/movies-genres.controller'

const router = Router()

router.get('/', movieController.getMoviesGenres)

router.get('/movies-with-genres', movieController.getMoviesWithGenres)

router.get(
  '/movies-with-genres/:name',
  movieController.getMovieWithGenresByName
)

export default router

import { Router } from 'express'
import { methods as movieController } from '../controllers/movies-genres.controller.js'

const router = Router()

router.get('/', movieController.getMoviesGenres)

router.get('/:name', movieController.getMovieGenresByName)

export default router

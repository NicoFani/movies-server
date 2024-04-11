import { Router } from 'express'
import { methods as movieController } from './../controllers/movie.controller'

const router = Router()

router.get('/', movieController.getMovies)

router.get('/:id', movieController.getMovie)

router.get('/:id/genres', movieController.getGenresByMovieId)

router.get('/genres/:genreId', movieController.getMoviesByGenreId)

router.post('/', movieController.addMovie)

router.put('/:id', movieController.updateMovie)

router.delete('/:id', movieController.deleteMovie)

export default router

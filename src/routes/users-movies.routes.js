import { Router } from 'express'
import { methods as movieController } from './../controllers/users-movies.controller'

const verifyToken = require('../../middlewares/verifyToken')

const router = Router()

router.get('/', movieController.getUsersMovies)

router.get('/:id_usuario/:id_pelicula', movieController.getUserMovie)

router.post('/', verifyToken, movieController.addUserMovie)

router.delete(
  '/:id_usuario/:id_pelicula',
  verifyToken,
  movieController.deleteUserMovie
)

export default router

import { Router } from 'express'
import { methods as movieController } from './../controllers/users-movies.controller'

const router = Router()

router.get('/', movieController.getUsersMovies)

export default router

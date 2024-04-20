import { Router } from 'express'
import { methods as movieController } from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = Router()

router.get('/', movieController.getUsers)

router.get('/:id/movies', verifyToken, movieController.getUserMoviesByUserId)

router.post('/register', movieController.addUser)

router.post('/login', movieController.loginUser)

export default router

import { Router } from 'express'
import { methods as movieController } from '../controllers/genre.controller.js'

const router = Router()

router.get('/', movieController.getGenres)

export default router

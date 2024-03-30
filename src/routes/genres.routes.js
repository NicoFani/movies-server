import { Router } from 'express'
import { methods as movieController } from './../controllers/genre.controller'

const router = Router()

router.get('/', movieController.getGenres)

export default router

import { Router } from 'express'

import {
   RecipeCardHandler
} from './controllers'

const router = Router()


// router.post('/recipe-card', RecipeCardHandler)

router.get('/recipe-card/:id/:templateName/:outputType', RecipeCardHandler)

export default router
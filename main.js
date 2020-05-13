require('dotenv').config()
import express from 'express'
import cors from 'cors'
const morgan = require('morgan')

import { RecipeCardRouter } from './templates'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

const PORT = process.env.PORT || 4000

// Routes
app.use('/templates', RecipeCardRouter)

app.listen(PORT, () => {
   console.log(`Server started on ${PORT}`)
})
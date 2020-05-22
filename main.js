require('dotenv').config()
import express from 'express'
import cors from 'cors'
const path = require("path");
const morgan = require('morgan')
var Express = require('express')
import { TemplateHandler } from './controllers'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(Express.static(path.join(__dirname, 'assets')));

const PORT = process.env.PORT || 4000

// Routes
app.use('/templates/', TemplateHandler)

app.listen(PORT, () => {
   console.log(`Server started on ${PORT}`)
})
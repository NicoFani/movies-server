import express from 'express'
import morgan from 'morgan'

// Routes
import moviesRoutes from './routes/movies.routes'
import genresRoutes from './routes/genres.routes'
import moviesGenresRoutes from './routes/movies-genres.routes'

const cors = require('cors')
const app = express()

// Cors

app.use(cors())

// Settings
app.set('port', 4000)

// Middlewares
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/api/movies', moviesRoutes)
app.use('/api/genres', genresRoutes)
app.use('/api/movies-genres', moviesGenresRoutes)

export default app

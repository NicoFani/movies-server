const express = require('express')
import morgan from 'morgan'

// Routes
import moviesRoutes from './routes/movies.routes.js'
import genresRoutes from './routes/genres.routes.js'
import moviesGenresRoutes from './routes/movies-genres.routes.js'
import usersRoutes from './routes/users.routes.js'
import usersMoviesRoutes from './routes/users-movies.routes.js'

const cors = require('cors')
const app = express()
const path = require('path')

// Cors

app.use(cors())

// Settings
app.set('port', 4000)

// Middlewares
app.use(morgan('dev'))
app.use(express.json())

app.use(express.static(path.join(__dirname, '../../movies-frontend')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../movies-frontend', 'index.html'))
})

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../../movies-frontend', 'index.html'))
})

app.get('/login', (req, res) => {
  try {
    res.sendFile(
      path.join(__dirname, '../../movies-frontend', 'login/login.html')
    )
  } catch (error) {
    console.log(error)
  }
})

app.get('/signup', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../movies-frontend', 'signup/signup.html')
  )
})

// Routes
app.use('/api/movies', moviesRoutes)
app.use('/api/genres', genresRoutes)
app.use('/api/movies-genres', moviesGenresRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/users-movies', usersMoviesRoutes)

const main = () => {
  app.listen(app.get('port'))
  console.log(`Server on port ${app.get('port')}`)
}

main()

export default app

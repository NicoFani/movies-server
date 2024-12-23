import { getConnection } from '../database/database.js'

const getMovies = async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.promise().query('SELECT * FROM peliculas')
    const movies = result[0]
    res.json(movies)
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

const getMovie = async (req, res) => {
  try {
    const { id } = req.params
    const connection = await getConnection()
    const result = await connection
      .promise()
      .query('SELECT * FROM peliculas WHERE id = ?', id)
    const movie = result[0]
    res.json(movie[0])
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

const getGenresByMovieId = async (req, res) => {
  try {
    const { id } = req.params
    const connection = await getConnection()
    const result = await connection
      .promise()
      .query(
        'SELECT generos.nombre FROM generos JOIN peliculas_generos ON generos.id = peliculas_generos.id_genero WHERE peliculas_generos.id_pelicula = ?',
        id
      )
    const genres = result[0]
    res.json(genres)
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

const getMoviesByGenreId = async (req, res) => {
  try {
    const { genreId } = req.params
    const connection = await getConnection()

    // Consulta para obtener todas las películas del género específico
    const moviesResult = await connection
      .promise()
      .query(
        'SELECT * FROM peliculas WHERE id IN (SELECT id_pelicula FROM peliculas_generos WHERE id_genero = ?)',
        [genreId]
      )

    const movies = moviesResult[0]

    // Consulta para obtener todos los géneros relacionados con cada película
    for (let i = 0; i < movies.length; i++) {
      const movieId = movies[i].id
      const genresResult = await connection
        .promise()
        .query(
          'SELECT generos.nombre FROM generos INNER JOIN peliculas_generos ON generos.id = peliculas_generos.id_genero WHERE peliculas_generos.id_pelicula = ?',
          [movieId]
        )

      const genres = genresResult[0].map((row) => row.nombre)
      movies[i].generos = genres
    }

    res.json(movies)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const addMovie = async (req, res) => {
  try {
    const { nombre, director, anio, imagen, duracion } = req.body

    if (!nombre || !director || !anio || !imagen || !duracion) {
      return res.status(400).json({ message: 'Missing fields' })
    }

    const newMovie = { nombre, director, anio, imagen, duracion }
    const connection = await getConnection()
    const result = await connection
      .promise()
      .query('INSERT INTO peliculas SET ?', newMovie)
    res.json({ message: 'Movie added' })
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, director, anio, imagen, duracion } = req.body

    if (!nombre || !director || !anio || !imagen || !duracion) {
      return res.status(400).json({ message: 'Missing fields' })
    }

    const movie = { nombre, director, anio, imagen, duracion }
    const connection = await getConnection()
    const result = await connection
      .promise()
      .query('UPDATE peliculas SET ? WHERE id = ?', [movie, id])
    res.json(result)
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params
    const connection = await getConnection()
    const [existingMovie] = await connection
      .promise()
      .query('SELECT * FROM peliculas WHERE id = ?', id)

    if (existingMovie.length === 0) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    const result = await connection
      .promise()
      .query('DELETE FROM peliculas WHERE id = ?', id)
    res.json(result)
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

export const methods = {
  getMovies,
  getMovie,
  getGenresByMovieId,
  getMoviesByGenreId,
  addMovie,
  updateMovie,
  deleteMovie
}

import { getConnection } from '../database/database.js'

const getUsersMovies = async (req, res) => {
  try {
    const connection = await getConnection()

    const result = await connection
      .promise()
      .query(
        'SELECT usuarios.nombre_usuario AS nombre_usuario, GROUP_CONCAT(peliculas.nombre SEPARATOR ", ") AS peliculas_favoritas FROM usuarios LEFT JOIN usuarios_peliculas ON usuarios.id = usuarios_peliculas.id_usuario LEFT JOIN peliculas ON usuarios_peliculas.id_pelicula = peliculas.id GROUP BY usuarios.id;'
      )
    res.json(result[0])
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

// La utilizo para ver si una pelicula esta en la lista de favoritos de un usuario
const getUserMovie = async (req, res) => {
  try {
    const connection = await getConnection()
    const { id_usuario, id_pelicula } = req.params

    console.log('id_usuario', id_usuario)
    console.log('id_pelicula', id_pelicula)

    if (!id_usuario || !id_pelicula) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const result = await connection
      .promise()
      .query(
        'SELECT * FROM usuarios_peliculas WHERE id_usuario = ? AND id_pelicula = ?;',
        [id_usuario, id_pelicula]
      )
    if (result[0].length === 0) {
      return res.json({ found: false })
    } else {
      return res.json({ found: true })
    }
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

const addUserMovie = async (req, res) => {
  try {
    const connection = await getConnection()
    const { id_usuario, id_pelicula } = req.body

    if (!id_usuario || !id_pelicula) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    await connection
      .promise()
      .query(
        'INSERT INTO usuarios_peliculas (id_usuario, id_pelicula) VALUES (?, ?);',
        [id_usuario, id_pelicula]
      )
    res.json({ message: 'Movie added to user' })
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

const deleteUserMovie = async (req, res) => {
  try {
    const connection = await getConnection()
    const { id_usuario, id_pelicula } = req.params
    console.log('id_usuario', id_usuario)
    console.log('id_pelicula', id_pelicula)

    if (!id_usuario || !id_pelicula) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    await connection
      .promise()
      .query(
        'DELETE FROM usuarios_peliculas WHERE id_usuario = ? AND id_pelicula = ?;',
        [id_usuario, id_pelicula]
      )
    res.json({ message: 'Movie deleted from user' })
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

export const methods = {
  getUsersMovies,
  getUserMovie,
  addUserMovie,
  deleteUserMovie
}

import { getConnection } from './../database/database'

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

export const methods = {
  getUsersMovies
}

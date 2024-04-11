import { getConnection } from './../database/database'

const getMoviesGenres = async (req, res) => {
  try {
    const connection = await getConnection()

    const result = await connection
      .promise()
      .query(
        'SELECT peliculas.*, GROUP_CONCAT(generos.nombre SEPARATOR ", ") as generos FROM peliculas LEFT JOIN peliculas_generos ON peliculas.id = peliculas_generos.id_pelicula LEFT JOIN generos ON peliculas_generos.id_genero = generos.id GROUP BY peliculas.id'
      )
    res.json(result[0])
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

const getMovieGenresByName = async (req, res) => {
  try {
    const { name } = req.params
    const connection = await getConnection()

    const result = await connection
      .promise()
      .query(
        'SELECT peliculas.*, GROUP_CONCAT(generos.nombre SEPARATOR ", ") as generos FROM peliculas LEFT JOIN peliculas_generos ON peliculas.id = peliculas_generos.id_pelicula LEFT JOIN generos ON peliculas_generos.id_genero = generos.id WHERE peliculas.nombre LIKE ? GROUP BY peliculas.id',
        [`%${name}%`]
      )
    res.json(result[0])
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

export const methods = {
  getMoviesGenres,
  getMovieGenresByName
}

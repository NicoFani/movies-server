import { getConnection } from '../database/database.js'

const getGenres = async (req, res) => {
  try {
    const connection = await getConnection()

    const result = await connection.promise().query('SELECT * FROM generos')
    const genres = result[0]
    res.json(genres)
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

export const methods = {
  getGenres
}

import { getConnection } from './../database/database'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getUsers = async (req, res) => {
  try {
    const connection = await getConnection()

    const result = await connection.promise().query('SELECT * FROM usuarios')
    const users = result[0]
    res.json(users)
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

const addUser = async (req, res) => {
  try {
    console.log('pase aca')
    const connection = await getConnection()
    const { email, nombre_usuario, contraseña } = req.body

    if (!email || !nombre_usuario || !contraseña) {
      res.status(400)
      return res.json({ message: 'Missing fields' })
    }

    const existingUser = await connection
      .promise()
      .query('SELECT * FROM usuarios WHERE email = ? OR nombre_usuario = ?', [
        email,
        nombre_usuario
      ])

    if (existingUser[0].length > 0) {
      res.status(400)
      return res.json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10)

    await connection
      .promise()
      .query(
        'INSERT INTO usuarios (email, nombre_usuario, contraseña) VALUES (?, ?, ?)',
        [email, nombre_usuario, hashedPassword]
      )
    res.json({ message: 'User added' })
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}
const getUserMoviesByUserId = async (req, res) => {
  try {
    const connection = await getConnection()
    const { id } = req.params

    const result = await connection.promise().query(
      `SELECT peliculas.*, GROUP_CONCAT(generos.nombre SEPARATOR ", ") as generos
         FROM usuarios_peliculas
         JOIN peliculas ON usuarios_peliculas.id_pelicula = peliculas.id
         LEFT JOIN peliculas_generos ON peliculas.id = peliculas_generos.id_pelicula
         LEFT JOIN generos ON peliculas_generos.id_genero = generos.id
         WHERE usuarios_peliculas.id_usuario = ?
         GROUP BY peliculas.id`,
      [id]
    )

    res.json(result[0])
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const loginUser = async (req, res) => {
  try {
    const connection = await getConnection()
    const { nombre_usuario, contraseña } = req.body

    if (!nombre_usuario || !contraseña) {
      res.status(400)
      return res.json({ message: 'Missing fields' })
    }

    const user = await connection
      .promise()
      .query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [
        nombre_usuario
      ])

    if (user[0].length === 0) {
      res.status(400)
      return res.json({ message: 'User not found' })
    }

    const storedPassword = user[0][0].contraseña

    const match = await bcrypt.compare(contraseña, storedPassword)

    if (!match) {
      res.status(400)
      return res.json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { nombre_usuario, id: user[0][0].id },
      process.env.SECRET_KEY || 'passwordJWT',
      { expiresIn: '1h' }
    )
    console.log('Entraste')
    res.json({ token })
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

// TENGO QUE TERMINAR DE HACER LA FUNCION PARA VALIDAR EL TOKEN

// function validateToken(req, res, next) {
//   const token = req.headers['authorization']
//   if (!token) {
//     res.status(401)
//     return res.json({ message: 'Unauthorized' })
//   }

//   jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
//     if (err) {
//       res.status(401)
//       return res.json({ message: 'Unauthorized' })
//     }
//     req.user = user
//     next()
//   })
// }

export const methods = {
  getUsers,
  getUserMoviesByUserId,
  addUser,
  loginUser
}

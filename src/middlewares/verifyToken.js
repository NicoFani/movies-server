import jwt from 'jsonwebtoken'
import promisify from 'util'

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  console.log('Entraste al middleware')

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' })
  }

  try {
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.SECRET_KEY || 'passwordJWT'
    )
    req.userId = decoded.id // Asigna el ID del usuario a req.userId
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export { verifyToken }

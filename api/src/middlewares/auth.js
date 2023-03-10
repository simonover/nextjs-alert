import jwt from 'jsonwebtoken'

import config from '../config/index.js'

export const checkAdmin = async (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(400).json({ message: 'No authorization' })
  }
  const accessToken = req.headers.authorization.split(' ')[1]
  try {
    jwt.verify(accessToken, config.SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: err })
      req.user = user
      return next()
    })
  } catch (error) {
    return res.status(401).json({ message: error })
  }
}

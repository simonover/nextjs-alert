import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

import config from '../config/index.js'

const prisma = new PrismaClient()

export const login = async (req, res, next) => {
  try {
    const { password } = req.body
    const admin = await prisma.user.findFirst({
      where: {
        username: 'admin',
      },
    })
    if (admin.password === password) {
      const token = createToken(admin)
      return res.status(200).json({ token })
    } else {
      return res.status(400).json({ err: 'Password is wrong.' })
    }
  } catch (error) {
    next(error)
  }
}

const createToken = (user) => {
  const dataStoredInToken = { username: user.username }
  const expiresIn = 86400 * 365
  const secretKey = config.SECRET_KEY

  return jwt.sign(dataStoredInToken, secretKey, { expiresIn })
}

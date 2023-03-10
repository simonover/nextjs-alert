import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

const main = async () => {
  const user = await prisma.user.findFirst({
    where: {
      username: 'admin',
    },
  })
  if (!user) {
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password: process.env.ADMIN_PASSWORD,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
  })

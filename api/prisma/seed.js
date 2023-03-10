import { PrismaClient } from '@prisma/client'
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
        password: 'xD2hhAP@akum3e5aW',
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

//Back-end API RESTfull
import { fastify } from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const app = fastify()
const port = 3333 
const prisma = new PrismaClient()

app.register(cors)

app.get('/habits', async () => {

  const habits = await prisma.habit.findMany({
    where:{
      title: {
        startsWith: 'Beber'
      }
    }
  })
  return habits
})

app.listen({
  port: port
}).then(() => {
  console.log(`HTTP Server running on port ${port}`)
})
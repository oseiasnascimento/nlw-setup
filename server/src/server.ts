//Back-end API RESTfull
import { fastify } from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'

const app = fastify()
const hostname = 'localhost'
const port = 3333 

app.register(cors)
app.register(appRoutes)

app.listen({
  port: port
}).then(() => {
  console.log(`HTTP Server running at http://${hostname}:${port}/`)
})
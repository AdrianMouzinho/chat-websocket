import { createServer } from 'node:http'
import { join } from 'node:path'
import express from 'express'
import { Server } from 'socket.io'

const app = express()

app.use(express.static(join(__dirname, '..', 'public')))

const server = createServer(app)

const io = new Server(server)

export { server, io }
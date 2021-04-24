import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import path from 'path'

import './database'
import { routes } from './routes'

const app = express()

const http = createServer(app)
const socketIO = new Server(http)

socketIO.on('connection', (socket: Socket) => {
  // console.log(socket.id)
})

app.use(express.static(path.join(__dirname, '..', 'public')))
app.set('views', path.join(__dirname, '..', 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.get("/client", (request, response) => response.render('html/client.html'))

app.use(express.json())
app.use(routes)

export { app, http, socketIO }

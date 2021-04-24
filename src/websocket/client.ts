import { Socket } from 'socket.io'

import { socketIO } from '../http'
import { ConnectionService } from '../services/ConnectionService'
import { UserService } from '../services/UserService'
import { MessageService } from '../services/MessageService'

interface IParams {
  text: string
  email: string
}

socketIO.on('connect', (socket: Socket) => {
  const connectionService = new ConnectionService()
  const userService = new UserService()
  const messageService = new MessageService()

  socket.on('client_first_access', async (params) => {
    const socket_id = socket.id
    const { text, email } = params as IParams
    let user_id = null

    const userExists = await userService.findByEmail(email)

    if (!userExists) {
      const user = await userService.create({ email })
      await connectionService.create({ socket_id, user_id: user.id })

      user_id = user.id

    } else {
      user_id = userExists.id
      const connection = await connectionService.findByUserId(userExists.id)

      if (!connection) {
        await connectionService.create({ socket_id, user_id: userExists.id })
      } else {
        connection.socket_id = socket_id

        await connectionService.create(connection)
      }
    }

    await messageService.create({ text, user_id })

    const allMessages = await messageService.listByUser(user_id)

    socket.emit('client_list_all_messages', allMessages)

    const users = await connectionService.findAllWithoutAdmin()
    socketIO.emit('admin_list_all_users', users)
  })

  socket.on('client_send_to_admin', async params => {
    const { text, socket_admin_id } = params
    const socket_id = socket.id

    const { user_id } = await connectionService.findBySocketId(socket_id)

    const message = await messageService.create({
      text,
      user_id
    })

    socketIO.to(socket_admin_id).emit('admin_receive_message', {
      message,
      socket_id
    })
  })
})

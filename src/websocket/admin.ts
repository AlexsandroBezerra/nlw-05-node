import { Socket } from 'socket.io'

import { socketIO } from '../http'
import { ConnectionService } from '../services/ConnectionService'
import { MessageService } from '../services/MessageService'


socketIO.on('connect', async (socket: Socket) => {
  const connectionService = new ConnectionService()
  const messageService = new MessageService()

  const connectionsWithoutAdmin = await connectionService.findAllWithoutAdmin()
  socketIO.emit('admin_list_all_users', connectionsWithoutAdmin)

  socket.on('admin_list_messages_by_user', async (params, callback) => {
    const { user_id } = params

    const messages = await messageService.listByUser(user_id)

    callback(messages)
  })

  socket.on('admin_send_message', async params => {
    const { user_id, text } = params

    await messageService.create({
      text,
      user_id,
      admin_id: socket.id
    })

    const { socket_id } = await connectionService.findByUserId(user_id)

    socketIO.to(socket_id).emit('admin_send_to_client', {
      text,
      socket_id: socket.id
    })
  })

  socket.on('admin_user_in_support', async params => {
    const { user_id } = params

    await connectionService.updateAdminId(user_id, socket.id)

    const connectionsWithoutAdmin = await connectionService.findAllWithoutAdmin()
    socketIO.emit('admin_list_all_users', connectionsWithoutAdmin)
  })
})

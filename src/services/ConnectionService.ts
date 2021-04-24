import { getCustomRepository } from 'typeorm'

import { ConnectionsRepository } from '../repositories/ConnectionsRepository'

interface ICreateConnection {
  admin_id?: string
  socket_id: string
  user_id: string
  id?: string
}

export class ConnectionService {
  constructor (
    private connectionsRepository = getCustomRepository(ConnectionsRepository)
  ) {}

  async create({ user_id, socket_id, admin_id, id }: ICreateConnection) {
    const connection = this.connectionsRepository.create({
      id,
      user_id,
      admin_id,
      socket_id
    })

    await this.connectionsRepository.save(connection)

    return connection
  }

  async findByUserId(user_id: string) {
    const connection = await this.connectionsRepository.findOne({ user_id })

    return connection
  }
}

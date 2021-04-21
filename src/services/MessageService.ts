import { getCustomRepository } from 'typeorm'
import { MessagesRepository } from '../repositories/MessagesRepository'

interface ICreateMessage {
  admin_id?: string
  user_id: string
  text: string
}

export class MessageService {
  constructor (
    private messagesRepository = getCustomRepository(MessagesRepository)
  ) {}

  async create({ admin_id, text, user_id }: ICreateMessage) {
    const message = this.messagesRepository.create({ admin_id, text, user_id })

    await this.messagesRepository.save(message)

    return message
  }

  async listByUser(user_id: string) {
    const messages = await this.messagesRepository.find({ user_id })

    return messages
  }
}

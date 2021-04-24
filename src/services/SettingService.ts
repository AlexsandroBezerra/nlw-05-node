import { getCustomRepository } from "typeorm"
import { Setting } from "../entities/Setting"

import { SettingsRepository } from "../repositories/SettingsRepository"

interface ICreateSetting {
  username: string
  chat: boolean
}

export class SettingService {
  constructor (
    private settingsRepository = getCustomRepository(SettingsRepository)
  ) {}

  async create({ chat, username }: ICreateSetting) {
    const userAlreadyExists = this.settingsRepository.findOne({ username })

    if (userAlreadyExists) {
      throw new Error('User already exists.')
    }

    const setting = this.settingsRepository.create({
      username,
      chat
    })

    await this.settingsRepository.save(setting)

    return setting
  }

  async findByUsername(username: string) {
    const settings = await this.settingsRepository.findOne({ username })

    return settings
  }

  async update(username: string, chat: boolean) {
    await this.settingsRepository.createQueryBuilder()
      .update(Setting)
      .set({ chat })
      .where("username = :username", { username })
      .execute()
  }
}

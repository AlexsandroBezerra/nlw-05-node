import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { SettingsRepository } from '../repositories/SettingsRepository'

export class SettingsController {
  async create(request: Request, response: Response) {
    const { username } = request.body

    const settingsRepository = getCustomRepository(SettingsRepository)

    const setting = settingsRepository.create({
      username
    })

    await settingsRepository.save(setting)

    return response.json(setting)
  }
}

import { Request, Response } from 'express'

import { SettingService } from '../services/SettingService'

export class SettingsController {
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const { username, chat } = request.body

      const settingService = new SettingService()
      const setting = await settingService.create({ username, chat })

      return response.json(setting)
    } catch (err) {
      return response.status(400).json({ message: err.message })
    }
  }
}

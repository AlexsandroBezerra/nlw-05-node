import { Router } from 'express'
import { MessagesController } from './controllers/MessagesController'

import { SettingsController } from './controllers/SettingsController'
import { UsersController } from './controllers/UsersController'

const routes = Router()

const settingsController = new SettingsController()
const usersController = new UsersController()
const messagesController = new MessagesController()

routes.post('/users', usersController.create)

routes.post('/settings', settingsController.create)
routes.get('/settings/:username', settingsController.findByUsername)
routes.get('/settings', settingsController.update)

routes.get('/messages/:id', messagesController.showByUser)
routes.post('/messages', messagesController.create)

export { routes }

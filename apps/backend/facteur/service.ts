import type { NotificationChannels } from '@facteurjs/adonisjs/types'
import type { NotificationManager } from '@facteurjs/adonisjs'

import app from '@adonisjs/core/services/app'

let facteur: NotificationManager<NotificationChannels>

await app?.booted(async () => {
  facteur = await app.container.make('notifications.manager')
})

export { facteur as default }

import type { InferChannels } from '@facteurjs/adonisjs/types'

import { databases } from '@facteurjs/adonisjs/database'
import { defineConfig, channels } from '@facteurjs/adonisjs'

const config = defineConfig({
  databaseAdapter: databases.lucid({ connectionName: 'postgres' }),
  channels: {
    transmit: channels.transmit(),
    database: channels.database({ connectionName: 'postgres' }),
  },

  preferences: {
    global: {
      channels: {
        transmit: true,
        database: true,
      },
    },
  },
})

export default config

declare module '@facteurjs/adonisjs/types' {
  interface NotificationChannels extends InferChannels<typeof config> { }
}

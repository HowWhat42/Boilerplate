import type { NotificationOptions } from '@facteurjs/adonisjs/types'
import type User from '#users/models/user'

import { Notification } from '@facteurjs/adonisjs/types'
import { TransmitMessage } from '@facteurjs/adonisjs/channels/transmit'
import { DatabaseMessage } from '@facteurjs/adonisjs/channels/database'

interface Params {
  userFullname: string
}

export default class ExampleNotification extends Notification<User, Params> {
  static options: NotificationOptions<User> = {
    name: 'Example Invitation',
    tags: ['Test'],
    deliverBy: {
      transmit: true,
      database: true,
    },
  }

  asTransmitMessage(): TransmitMessage {
    return TransmitMessage.create().setContent({
      title: "Notification Example",
      body: `This is a test notification for ${this.params.userFullname}.`,
      timestamp: new Date().toISOString(),
    })
  }

  asDatabaseMessage(): DatabaseMessage {
    return DatabaseMessage.create()
      .setContent({
        title: "Notification Example",
        body: `This is a test notification for ${this.params.userFullname}.`,
      })
      .setType('example_notification')
  }
}

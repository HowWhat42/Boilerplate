import type { Address } from '#common/types/address'

import { column, computed } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { UserSchema } from '#database/schema'
import { withUUID } from '#common/mixins/with_uuid'
import { NotifiableTargets } from '@facteurjs/adonisjs/types'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export default class User extends compose(UserSchema, AuthFinder, withUUID()) {
  @column({
    prepare: (value: Address) => JSON.stringify(value),
  })
  declare address: Address

  @computed()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  notificationTargets(): NotifiableTargets {
    return {
      transmit: { channel: `users/${this.id}` },
      database: { notifiableId: this.id },
    }
  }

  getModelId(): string {
    return this.id
  }
}

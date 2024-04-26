import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Category from '#models/category'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categoryId: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare urlImage: string

  @column()
  declare brand: string

  @column()
  declare price: number

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  getImageUrl(): string {
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3333'
    return `${baseUrl}/images/${this.urlImage}`
  }
}

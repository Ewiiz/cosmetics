import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'coupons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('coupon_code').notNullable()
      table.float('discount').notNullable()
      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

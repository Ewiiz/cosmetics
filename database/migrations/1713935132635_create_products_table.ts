import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('category_id').references('categories.id').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.string('url_image').notNullable()
      table.string('brand').notNullable()
      table.float('price').notNullable()
      table.integer('quantity').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

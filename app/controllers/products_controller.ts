import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ProductsController {
  get3Products() {
    return db
      .from('products')
      .select('id', 'title', 'price', 'description', 'brand', 'url_image')
      .limit(3)
  }

  getProducts() {
    return db.from('products').select('id', 'title', 'price', 'description', 'brand', 'url_image')
  }

  async getProduct({ params }: HttpContext) {
    const id = params.id
    return db
      .from('products')
      .where('id', id)
      .select('id', 'title', 'price', 'description', 'brand', 'url_image')
  }
}

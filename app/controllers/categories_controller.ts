import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Category from '#models/category'

export default class CategoriesController {
  getCategories() {
    return db.from('categories').select('id', 'category_name')
  }

  async getProductInCategories({ params, response }: HttpContext) {
    const { id } = params

    const productInCategories = await Category.query()
      .preload('products', (query) => {
        query.select('id', 'title', 'price', 'brand', 'url_image')
      })
      .where('id', id)
      .select('id', 'category_name')

    if (productInCategories.length === 0)
      return response.notFound({ message: "Cette catégorie n'existe pas." })

    return response.ok({ productInCategories })
  }
}

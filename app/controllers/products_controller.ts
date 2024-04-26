import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'

export default class ProductsController {
  async get3Products() {
    const products = await db
      .from('products')
      .select('id', 'title', 'price', 'brand', 'url_image')
      .limit(3)

    return products.map((product) => ({
      ...product,
      url_image: this.getImageUrl(product.url_image),
    }))
  }

  async getProducts() {
    const products = await db.from('products').select('id', 'title', 'price', 'brand', 'url_image')

    return products.map((product) => ({
      ...product,
      url_image: this.getImageUrl(product.url_image),
    }))
  }

  async getProduct({ params }: HttpContext) {
    const id = params.id
    const products = await db
      .from('products')
      .where('id', id)
      .select('id', 'title', 'price', 'description', 'brand', 'url_image')

    return products.map((product) => ({
      ...product,
      url_image: this.getImageUrl(product.url_image),
    }))
  }

  async getImagesForProducts({ params, response }: HttpContext) {
    let basePath: string = 'uploads'

    const imagePath: string = app.makePath(basePath, params.filename)
    console.log(imagePath)
    return response.download(imagePath)
  }

  private getImageUrl(imageFilename: string): string {
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3333'
    return `${baseUrl}/images/${imageFilename}`
  }
}

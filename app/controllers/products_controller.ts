import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductsController {
  async get3Products() {
    const products = await Product.query()
      .select('id', 'title', 'price', 'brand', 'url_image')
      .limit(3)

    return products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      brand: product.brand,
      urlImage: product.getImageUrl(),
    }))
  }

  async getProducts() {
    const products = await Product.query().select('id', 'title', 'price', 'brand', 'url_image')

    return products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      brand: product.brand,
      urlImage: product.getImageUrl(),
    }))
  }

  async getProduct({ params }: HttpContext) {
    const id = params.id
    const products = await Product.query()
      .where('id', id)
      .select('id', 'title', 'price', 'description', 'brand', 'url_image')

    return products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      brand: product.brand,
      urlImage: product.getImageUrl(),
    }))
  }
}

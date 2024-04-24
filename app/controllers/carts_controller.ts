import type { HttpContext } from '@adonisjs/core/http'

import Cart from '#models/cart'
import { productToCartValidator } from '#validators/cart'
import Product from '#models/product'

export default class CartsController {
  async index({ response }: HttpContext) {
    const carts = await Cart.query().preload('product')

    // Transformation des données des produits en un format approprié
    const productsInfo = carts.map((cartItem) => ({
      productId: cartItem.product.id,
      title: cartItem.product.title,
      price: cartItem.product.price,
      imageUrl: cartItem.product.urlImage,
      quantity: cartItem.quantity,
    }))
    // Retourner le tableau des informations sur les produits
    return response.ok({ productsInfo })
  }

  async store({ request, response }: HttpContext) {
    const { productId, quantity } = await request.validateUsing(productToCartValidator)

    const existingCartItem = await Cart.query().where('productId', productId).first()

    if (existingCartItem) {
      return response.conflict({
        message: 'Le produit est déjà dans votre panier',
      })
    }

    try {
      await this.verifyProductQuantity(productId, quantity)
    } catch (err) {
      if (err) return response.abort({ message: err.message })
    }

    await Cart.create({
      productId,
      quantity,
    })

    return response.created({
      message: 'Le produit a été ajouté au panier avec succès',
    })
  }

  async update({ request, response }: HttpContext) {
    const { productId, quantity } = await request.validateUsing(productToCartValidator)

    const cartItem = await Cart.query().where('product_id', productId).first()

    if (!cartItem) {
      return response.conflict({
        message: 'Le produit est déjà dans votre panier',
      })
    }

    try {
      await this.verifyProductQuantity(productId, quantity)
    } catch (err) {
      if (err) return response.abort({ message: err.message })
    }

    cartItem.quantity = quantity
    await cartItem.save()

    return response.ok({ message: `Ajout de ${quantity} articles réussi.` })
  }

  async destroy({ params, response }: HttpContext) {
    const id: number = Number(params.id)
    if (!id) return response.badRequest({ message: "L'identifiant est requis pour cette requête." })

    try {
      // Récupérer le produit à supprimer
      const productToDelete = await Cart.query().where('product_id', id).firstOrFail()

      await productToDelete.delete()

      return response.ok({
        message: `Le produit a bien été supprimé du panier.`,
      })
    } catch (error) {
      // Si le produit n'a pas été trouvé dans le panier
      return response.notFound({
        message: "Le produit demandé n'a pas été trouvé dans votre panier.",
      })
    }
  }

  private async verifyProductQuantity(productId: number, quantity: number): Promise<void> {
    const product = await Product.query().where('id', productId).select('quantity').firstOrFail()

    if (product.quantity < quantity) {
      throw new Error(`Seulement ${product.quantity} exemplaires restants en stock.`)
    }
  }
}

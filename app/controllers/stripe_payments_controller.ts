// import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'

import Stripe from 'stripe'
import Cart from '#models/cart'

const YOUR_DOMAIN = 'http://localhost:3333'

const stripe = new Stripe(env.get('STRIPE_SECRET'))

export default class StripePaymentsController {
  async startPayment({ response }: HttpContext) {
    // TODO Si y a un système de compte faire un auth.user et récupérer son panier.

    const cart = await Cart.query().preload('product')

    const lineItems = cart.map((cartItem) => {
      return {
        quantity: cartItem.quantity,
        price_data: {
          currency: 'EUR',
          product_data: {
            name: cartItem.product.title,
          },
          unit_amount: cartItem.product.price * 100,
        },
      }
    })

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/fail`,
    })
    console.log(session.url)
    response.redirect(session.url!)
  }

  successPayment({}: HttpContext) {
    console.log('success')
  }

  cancelPayment({}: HttpContext) {
    console.log('cancel')
  }
}

// Exemple de base du contenu de line_items
// [
// {
//   quantity: 1,
//   price_data: {
//     currency: 'EUR',
//     product_data: {
//       name: 'Produit test',
//     },
//     unit_amount: 2250,
//   },
// },
// ],

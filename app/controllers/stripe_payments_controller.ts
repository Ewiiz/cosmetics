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

    if (cart.length === 0) {
      return response.badRequest({
        message: 'Le panier est vide. Vous ne pouvez pas procéder au paiement.',
      })
    }

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
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    })
    console.log(session.url)
    response.redirect(session.url!)
  }

  async successPayment({ response, request }: HttpContext) {
    const session = await stripe.checkout.sessions.retrieve(request.qs().session_id)

    if (session.payment_status === 'paid') {
      // await Cart.query().delete()

      return response.redirect(`${env.get('FRONT_URL')}/success`)
    } else {
      return response.abort({ message: "Le paiement n'a pas été effectué." })
    }
    // console.log({
    //   1: session.amount_total,
    //   2: session.currency,
    //   3: session.payment_status,
    //   4: session.customer_details,
    // })
  }

  cancelPayment({ response }: HttpContext) {
    return response.redirect(`${env.get('FRONT_URL')}/fail`)
  }

  webhook({ response, request }: HttpContext) {
    const sig = request.header('stripe-signature')
    let event

    try {
      event = stripe.webhooks.constructEvent(request.raw()!, sig!, env.get('WEBHOOK_SECRET'))
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const paymentIntentSucceeded = event.data.object
        console.log(paymentIntentSucceeded)

        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    response.send({})
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

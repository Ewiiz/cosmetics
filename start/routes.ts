/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const ProductsController = () => import('#controllers/products_controller')

router.get('/', async () => {
  return {
    API_BY: 'CODE-HIVE',
  }
})

router.get('/products', [ProductsController, 'getProducts'])
router.get('/products/:id', [ProductsController, 'getProduct'])

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const CategoriesController = () => import('#controllers/categories_controller')
const CartsController = () => import('#controllers/carts_controller')
const ProductsController = () => import('#controllers/products_controller')

router.get('/', async () => {
  return {
    API_BY: 'CODE-HIVE',
  }
})

router.get('accueil', [ProductsController, 'get3Products'])
router.get('products', [ProductsController, 'getProducts'])
router.get('products/:id', [ProductsController, 'getProduct'])

router.get('categories', [CategoriesController, 'getCategories'])
router.get('categories/:id', [CategoriesController, 'getProductInCategories'])

router.get('cart', [CartsController, 'index'])
router.post('cart', [CartsController, 'store'])
router.patch('cart', [CartsController, 'update'])
router.delete('cart/:id', [CartsController, 'destroy'])

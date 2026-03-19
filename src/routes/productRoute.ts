import express from 'express'
import productController from '../controllers/productController'
import { checkProductData } from '../middleware/validate'

const router = express.Router()

router.get('/products', checkProductData, productController.getProducts)

router.get('/products/:id', checkProductData, productController.getDetail)

router.post('/products', checkProductData, productController.addProduct)

router.put('/products/:id', checkProductData, productController.updateProduct)

router.delete('/products/:id', checkProductData, productController.deleteProduct)

export default router

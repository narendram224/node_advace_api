
import express from 'express'
import productController from '../controllers/product/product.controller'
import { isAuthenticatedUser,authorizeRoles } from '../middleware'
// import {productController} from '../controllers'
const router =  express.Router()

// for fetching the all products

router.route('/product').get(productController.getProduct)
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),productController.newProduct)
router.route('/product/:id').get(productController.getSingleProduct)
router.route('/admin/product/:id').put(isAuthenticatedUser,authorizeRoles('admin'),productController.updateProduct)
router.route('/admin/product/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),productController.deleteProduct)

// export router
export default router
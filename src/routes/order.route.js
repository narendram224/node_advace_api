import express from 'express'
import { orderController } from '../controllers'
import { authorizeRoles, isAuthenticatedUser } from '../middleware'
const router = express.Router()

router.route('/order/new').post(isAuthenticatedUser,orderController.newOrder)

router.route('/order/:id').get(isAuthenticatedUser,orderController.singleOrder)
router.route('/orders/me').get(isAuthenticatedUser,orderController.myOrder)
router.route('/admin/orders').get(isAuthenticatedUser,authorizeRoles('admin'),orderController.getAllOrders)
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'),orderController.updateOrder)
                                .delete(isAuthenticatedUser,authorizeRoles('admin'),orderController.deleteOrder)






export default router;

import express from 'express'
import { reviewController } from '../controllers'
import { authorizeRoles, isAuthenticatedUser } from '../middleware'
const router = express.Router()

router.route('/review/new').post(isAuthenticatedUser,reviewController.newReview)

// router.route('/review/:id').get(isAuthenticatedUser,orderController.singleOrder)

export default router
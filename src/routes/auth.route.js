
import express from 'express';
import { userController } from '../controllers';
import { authorizeRoles, isAuthenticatedUser } from '../middleware';
const router = express.Router();

router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
router.route('/logout').get(userController.logout)
router.route('/password/forgot').post(userController.forgetPassword)
router.route('/password/reset/:token').put(userController.resetPassword)
router.route('/me').get( isAuthenticatedUser,userController.getUserProfile)
router.route('/password/update').put( isAuthenticatedUser,userController.updatePassword)
router.route('/admin/users').get( isAuthenticatedUser,authorizeRoles('admin'),userController.allUsers)








export default router;
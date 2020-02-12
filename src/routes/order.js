import { Router } from 'express';
import { AuthMiddleware, UserMiddleware, OrderMiddleware } from '../middlewares';
import { OrderController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const {
  whitelist, orderChecks, verifyParameters, queryCheck, feedbackCheck
} = OrderMiddleware;
const { verifyRoles } = UserMiddleware;
const {
  clientOrder, serverOrder, viewOrders, updateStatus, getUserOrders,
  viewOrdersByStatus, orderFeedback
} = OrderController;
const { admin, all } = PermissionsData;
router.post('/paystack/verify-client', authenticate, verifyRoles(all), isVerified, orderChecks, clientOrder);
router.post('/paystack/verify-server', whitelist, orderChecks, serverOrder);
router.get('/all', authenticate, verifyRoles(admin), isVerified, viewOrders);
router.get('/', authenticate, verifyRoles(all), isVerified, getUserOrders);
router.get('/key', authenticate, verifyRoles(admin), isVerified, queryCheck, viewOrdersByStatus); // key?status=value
router.patch('/:id', authenticate, verifyRoles(admin), isVerified, verifyParameters, updateStatus);
router.post('/:id/feedback', authenticate, verifyRoles(all), isVerified, feedbackCheck, orderFeedback);

export default router;

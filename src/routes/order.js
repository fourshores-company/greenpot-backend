import { Router } from 'express';
import { AuthMiddleware, UserMiddleware, OrderMiddleware } from '../middlewares';
import { OrderController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const { whitelist, orderChecks, verifyParameters } = OrderMiddleware;
const { verifyRoles } = UserMiddleware;
const {
  clientOrder, serverOrder, viewOrders, updateStatus, getUserOrders
} = OrderController;
const { admin, all } = PermissionsData;
router.post('/paystack/verify-client', authenticate, verifyRoles(all), isVerified, orderChecks, clientOrder);
router.post('/paystack/verify-server', whitelist, orderChecks, serverOrder);
router.get('/all', authenticate, verifyRoles(admin), isVerified, viewOrders);
router.get('/', authenticate, verifyRoles(all), isVerified, getUserOrders);
router.patch('/:id', authenticate, verifyRoles(admin), isVerified, verifyParameters, updateStatus);

export default router;

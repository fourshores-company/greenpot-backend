import { Router } from 'express';
import { AuthMiddleware, UserMiddleware, OrderMiddleware } from '../middlewares';
import { OrderController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const { whitelist, orderChecks } = OrderMiddleware;
const { verifyRoles } = UserMiddleware;
const { clientOrder, serverOrder } = OrderController;
const { admin, all } = PermissionsData;
router.post('/paystack/verify-client', authenticate, verifyRoles(all), isVerified, orderChecks, clientOrder);
router.post('/paystack/verify-server', whitelist, orderChecks, serverOrder);


export default router;

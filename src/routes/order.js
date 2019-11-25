import { Router } from 'express';
import { AuthMiddleware, UserMiddleware, OrderMiddleware } from '../middlewares';
import { OrderController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const { verifyRoles } = UserMiddleware;
const {
  beforeCreatingOrder,
} = OrderMiddleware;
const {
  createOrder,
} = OrderController;
const { admin, all } = PermissionsData;
router.post('/', authenticate, verifyRoles(all), isVerified, beforeCreatingOrder, createOrder);


export default router;

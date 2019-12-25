import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { PayController } from '../controllers';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const {
  withPaystack,
} = PayController;
router.post('/paystack', authenticate, isVerified, withPaystack);
// router.get('/paystack/status', payStatus);

export default router;

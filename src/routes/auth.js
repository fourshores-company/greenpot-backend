import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { AuthController } from '../controllers';

const router = Router();
const {
  onSignup,
} = AuthMiddleware;

const {
  signup,
} = AuthController;

router.post('/signup', onSignup, signup);
export default router;

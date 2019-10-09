import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { AuthController } from '../controllers';

const router = Router();
const {
  onSignup, onLogin
} = AuthMiddleware;

const {
  signup, login, verifyEmail
} = AuthController;

router.post('/signup', onSignup, signup);
router.post('/login', onLogin, login);
router.get('/verify', verifyEmail);
export default router;

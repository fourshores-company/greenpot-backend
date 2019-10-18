import { Router } from 'express';
import passport from '../config/passport';
import { AuthMiddleware } from '../middlewares';
import { AuthController } from '../controllers';

const router = Router();
const {
  onSignup, onLogin, onPasswordReset, authenticate,
} = AuthMiddleware;

const {
  signup, login, verifyEmail, socialLogin, resetPassword, resetPasswordByEmail,
  verifyPasswordReset
} = AuthController;

router.post('/signup', onSignup, signup);
router.post('/login', onLogin, login);
router.get('/verify', verifyEmail);
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback',
  passport.authenticate('google'),
  socialLogin);
router.post('/reset-password', authenticate, onPasswordReset, resetPassword);
router.post('/reset-password/email', onPasswordReset, resetPasswordByEmail);
router.get('/reset-password/email', verifyPasswordReset);

export default router;

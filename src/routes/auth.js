/* eslint-disable linebreak-style */
import { Router } from 'express';
import passport from '../config/passport';
import { AuthMiddleware } from '../middlewares';
import { AuthController } from '../controllers';

const router = Router();
const {
  onSignup, onLogin
} = AuthMiddleware;

const {
  signup, login, verifyEmail, socialLogin
} = AuthController;

router.post('/signup', onSignup, signup);
router.post('/login', onLogin, login);
router.get('/verify', verifyEmail);
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback',
  passport.authenticate('google'),
  socialLogin);

export default router;

import { Router } from 'express';
import { AuthMiddleware, UserMiddleware } from '../middlewares';
import { UserController } from '../controllers';

const router = Router();

const { authenticate } = AuthMiddleware;
const { profileCheck } = UserMiddleware;
const { updateProfile, getProfile } = UserController;
router.put('/profile/:userId', authenticate, profileCheck, updateProfile);
router.get('/profile/:userId', authenticate, profileCheck, getProfile);

export default router;

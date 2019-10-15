import { Router } from 'express';
import { AuthMiddleware, UserMiddleware } from '../middlewares';
import { UserController } from '../controllers';
const router = Router();

const { authenticate } = AuthMiddleware;
const { onUpdateProfile } = UserMiddleware;
const { updateProfile } = UserController;
router.put('/profile/:userId', authenticate, onUpdateProfile, updateProfile);

export default router;

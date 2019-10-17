import { Router } from 'express';
import { AuthMiddleware, UserMiddleware } from '../middlewares';
import { UserController } from '../controllers';

const router = Router();

const { authenticate } = AuthMiddleware;
const { profileCheck, onDeleteAccount } = UserMiddleware;
const { updateProfile, getProfile, deleteAccount } = UserController;
router.put('/profile/:userId', authenticate, profileCheck, updateProfile);
router.get('/profile/:userId', authenticate, profileCheck, getProfile);
router.put('/profile/:userId', authenticate, profileCheck, updateProfile);
router.delete('/account/:userId', authenticate, onDeleteAccount, deleteAccount);

export default router;

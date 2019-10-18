import { Router } from 'express';
import { AuthMiddleware, UserMiddleware } from '../middlewares';
import { UserController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate } = AuthMiddleware;
const {
  profileCheck, onDeleteAccount, verifyRoles, onAssign
} = UserMiddleware;
const {
  updateProfile, getProfile, deleteAccount, assignRole
} = UserController;
const { user, admin, all } = PermissionsData;

router.put('/profile/:userId', authenticate, profileCheck, updateProfile);
router.get('/profile/:userId', authenticate, profileCheck, getProfile);
router.delete('/:userId', authenticate, onDeleteAccount, deleteAccount);
router.patch('/role', authenticate, onAssign, verifyRoles(all), assignRole);

export default router;

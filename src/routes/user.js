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
  updateProfile, getProfile, deleteAccount, assignSuperAdmin, assignRoles
} = UserController;
const { all, superAdmin } = PermissionsData;

router.put('/profile/:userId', authenticate, profileCheck, updateProfile);
router.get('/profile/:userId', authenticate, profileCheck, getProfile);
router.delete('/:userId', authenticate, onDeleteAccount, deleteAccount);
router.patch('/assign-super', authenticate, onAssign, verifyRoles(all), assignSuperAdmin);
router.patch('/assign-role', authenticate, onAssign, verifyRoles(superAdmin), assignRoles);

export default router;

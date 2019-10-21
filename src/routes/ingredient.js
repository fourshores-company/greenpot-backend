import { Router } from 'express';
import { AuthMiddleware, UserMiddleware, IngredientMiddleware } from '../middlewares';
import { IngredientController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const { verifyRoles } = UserMiddleware;
const { onAddIngredient } = IngredientMiddleware;
const { addIngredient } = IngredientController;
const { admin } = PermissionsData;

router.post('/', authenticate, verifyRoles(admin), isVerified, onAddIngredient, addIngredient);

export default router;

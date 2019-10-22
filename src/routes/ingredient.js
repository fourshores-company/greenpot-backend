import { Router } from 'express';
import { AuthMiddleware, UserMiddleware, IngredientMiddleware } from '../middlewares';
import { IngredientController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const { verifyRoles } = UserMiddleware;
const { onAddIngredient, ingredientCheck } = IngredientMiddleware;
const {
  addIngredient, updateIngredient, deleteIngredient, getAllIngredients
} = IngredientController;
const { admin } = PermissionsData;

router.post('/', authenticate, verifyRoles(admin), isVerified, onAddIngredient, addIngredient);
router.patch('/:id', authenticate, verifyRoles(admin), isVerified, ingredientCheck, updateIngredient);
router.delete('/:id', authenticate, verifyRoles(admin), isVerified, ingredientCheck, deleteIngredient);
router.get('/all', authenticate, verifyRoles(admin), isVerified, getAllIngredients);

export default router;

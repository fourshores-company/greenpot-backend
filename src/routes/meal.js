import { Router } from 'express';
import { AuthMiddleware, UserMiddleware, MealMiddleware } from '../middlewares';
import { MealController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const { verifyRoles } = UserMiddleware;
const { mealCheck, ingredientCheck } = MealMiddleware;
const { newMeal, addIngredientToMeal, viewMeals } = MealController;
const { admin } = PermissionsData;
router.post('/', authenticate, verifyRoles(admin), isVerified, mealCheck, newMeal);
router.post('/add-ingredient', authenticate, verifyRoles(admin), isVerified, ingredientCheck, addIngredientToMeal);
router.get('/', authenticate, verifyRoles(admin), isVerified, viewMeals);

export default router;

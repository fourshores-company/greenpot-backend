import { Router } from 'express';
import { AuthMiddleware, UserMiddleware, MealMiddleware } from '../middlewares';
import { MealController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const { verifyRoles } = UserMiddleware;
const {
  mealCheck, ingredientCheck, onMealCategory, mealCategoryCheck
} = MealMiddleware;
const {
  newMeal, addIngredientToMeal, viewMeals, newCategory, addMealToCategory
} = MealController;
const { admin } = PermissionsData;
router.post('/', authenticate, verifyRoles(admin), isVerified, mealCheck, newMeal);
router.post('/add-ingredient', authenticate, verifyRoles(admin), isVerified, ingredientCheck, addIngredientToMeal);
router.get('/', authenticate, verifyRoles(admin), isVerified, viewMeals);
router.post('/category/', authenticate, verifyRoles(admin), isVerified, onMealCategory, newCategory);
router.post('/category/add-meal', authenticate, verifyRoles(admin), isVerified, mealCategoryCheck, addMealToCategory);


export default router;

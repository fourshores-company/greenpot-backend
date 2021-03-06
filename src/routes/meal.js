import { Router } from 'express';
import { AuthMiddleware, UserMiddleware, MealMiddleware } from '../middlewares';
import { MealController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const { verifyRoles } = UserMiddleware;
const {
  mealCheck, ingredientCheck, onMealCategory, mealCategoryCheck, beforeDeletingIngredient,
  categoryQueryCheck, beforeDeletingMeal
} = MealMiddleware;
const {
  newMeal, addIngredientToMeal, viewMeals, newCategory, addMealToCategory,
  deleteIngredient, deleteMealFromCategory, deleteMealCategory, deleteMeal,
  MealsByCategory,
} = MealController;
const { admin, all } = PermissionsData;
router.post('/', authenticate, verifyRoles(admin), isVerified, mealCheck, newMeal);
router.post('/add-ingredient', authenticate, verifyRoles(admin), isVerified, ingredientCheck, addIngredientToMeal);
router.get('/', authenticate, verifyRoles(all), isVerified, viewMeals);
router.post('/category/', authenticate, verifyRoles(admin), isVerified, onMealCategory, newCategory);
router.post('/category/add-meal', authenticate, verifyRoles(admin), isVerified, mealCategoryCheck, addMealToCategory);
router.delete('/:mealId/ingredient/:ingredientId', authenticate, verifyRoles(admin), isVerified, beforeDeletingIngredient, deleteIngredient);
router.delete('/category/:categoryId/meal/:mealId', authenticate, verifyRoles(admin), isVerified, mealCategoryCheck, deleteMealFromCategory);
router.delete('/category/:id', authenticate, verifyRoles(admin), isVerified, categoryQueryCheck, deleteMealCategory);
router.delete('/:mealId', authenticate, verifyRoles(admin), isVerified, beforeDeletingMeal, deleteMeal);
router.get('/category', authenticate, verifyRoles(all), isVerified, categoryQueryCheck, MealsByCategory);


export default router;

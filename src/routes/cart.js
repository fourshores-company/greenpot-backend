import { Router } from 'express';
import { AuthMiddleware, UserMiddleware, CartMiddleware } from '../middlewares';
import { CartController } from '../controllers';
import { PermissionsData } from '../utils';

const router = Router();

const { authenticate, isVerified } = AuthMiddleware;
const { verifyRoles } = UserMiddleware;
const { beforeAddToCart, mealCheck } = CartMiddleware;
const {
  addToCart, getAllMeals, deleteMealFromCart, updateMeal,
} = CartController;
const { all } = PermissionsData;

router.post('/', authenticate, verifyRoles(all), isVerified, beforeAddToCart, addToCart);
router.get('/', authenticate, verifyRoles(all), isVerified, getAllMeals);
router.delete('/:mealId', authenticate, verifyRoles(all), isVerified, mealCheck, deleteMealFromCart);
router.patch('/:mealId/:quantity', authenticate, verifyRoles(all), isVerified, mealCheck, updateMeal);
export default router;

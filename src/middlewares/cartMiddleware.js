import { OrderValidation } from '../validations';
// we might have to rename this validation
// checkoutValidation maybe, or cartValidation if only used by cart
// as the orders might not need a middleware
import { Toolbox } from '../utils';
import { MealService, CartService } from '../services';

const { errorResponse, matchIds } = Toolbox;
const { createOrderValidation, validateMeal } = OrderValidation;
const { findMultipleMeals } = MealService;
const { findMeal } = CartService;

/**
 * Middleware for carts
 * @class CartMiddleware
 */
export default class CartMiddleware {
  /**
   * validate values before adding to cart
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return an object {error or response}
   * @memberof CartMiddleware
   */
  static async beforeAddToCart(req, res, next) {
    try {
      const { meals } = req.body;
      // ?name change needed
      createOrderValidation({ meals });
      const mealIds = meals.map((meal) => meal.mealId);
      const mealsInDatabase = await findMultipleMeals({ id: mealIds });
      if (!matchIds(mealIds, mealsInDatabase)) return errorResponse(res, { code: 400, message: 'one of the meals does not exist' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

  /**
   * middleware to run validations and checks before deleting a meal
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   * @memberof CartMiddleware
   */
  static async mealCheck(req, res, next) {
    try {
      const { mealId } = req.params;
      validateMeal(req.params);
      const mealInCart = await findMeal({ id: mealId, userId: req.tokenData.id });
      if (!mealInCart) return errorResponse(res, { code: 404, message: 'meal does not exist in our database' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
}

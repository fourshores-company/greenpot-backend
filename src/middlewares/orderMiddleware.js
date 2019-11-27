import { OrderValidation } from '../validations';
import { Toolbox } from '../utils';
import { OrderService, MealService } from '../services';

const { errorResponse, calculateOrderPrice } = Toolbox;
const { createOrderValidation } = OrderValidation;
const { findMultipleMeals } = MealService;
/**
 * Middleware for order routes
 * @class OrderMiddleware
 */
export default class OrderMiddleware {
  /**
   * validate request before creating a new order
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return an object {error or response}
   * @memberof OrderMiddleware
   */
  static async beforeCreatingOrder(req, res, next) {
    const { meals } = req.body;
    try {
      createOrderValidation({ meals });
      const mealIdArray = meals.map((meal) => meal.mealId);
      // query for the meals to check if they exist
      const queriedMeals = await findMultipleMeals({ id: mealIdArray });
      // check if all meal id's were found and returned
      let allMealsFound = true;
      mealIdArray.forEach((mealId) => {
        const found = queriedMeals.find((meal) => meal.id === mealId);
        if (found === undefined) allMealsFound = false;
      });
      if (!allMealsFound) return errorResponse(res, { code: 400, message: 'one of the meals does not exist' });
      const price = calculateOrderPrice(meals, queriedMeals);
      req.orderPrice = price;
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
}

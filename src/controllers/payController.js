import { Toolbox, Payments } from '../utils';
import { CartService, MealService } from '../services';
import { PayValidation } from '../validations';

const {
  successResponse, errorResponse, calculateOrderPrice, validate,
} = Toolbox;
const {
  getMealsInCart,
} = CartService;
const {
  findMultipleMeals,
} = MealService;
const {
  validateParameters,
} = PayValidation;
/**
 * Pay Controller to hold methods for payment options
 * @memberof PayController
 */
export default class PayController {
  /**
   * pay with paystack
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with paystack body { status, url }.
   * @memberof payController
   */
  static async withPaystack(req, res) {
    const { address } = req.body;
    try {
      validateParameters({ address });
      /**
       * PLEASE UNCOMMENT ALL LINES BELOW BEFORE PRODUCTION
       * OR WHEN TESTING PAYSTACK API FOR YOURSELF
       */
      const mealsInCart = await getMealsInCart({ userId: req.tokenData.id });
      if (!mealsInCart.length) return errorResponse(res, { code: 404, message: 'There are no meals in your cart' });
      const meals = mealsInCart.map(({
        id, userId, createdAt, updatedAt, ...items
      }) => items);
      const mealIds = meals.map((meal) => meal.mealId);
      const mealsInDatabase = await findMultipleMeals({ id: mealIds });
      const price = calculateOrderPrice(meals, mealsInDatabase);
      const metadata = {
        userId: req.tokenData.id, meals, address, price,
      };
      const payload = {
        email: req.tokenData.email,
        amount: price * 100,
        metadata,
      };

      const paystack = await Payments.viaPaystack(payload);
      if (!paystack.status) errorResponse(res, { code: 400, message: paystack.message });
      const url = paystack.data.authorization_url;
      successResponse(res, { message: `success, redirect to ${url}`, url });
      /**
       * PLEASE DELETE SINGLE LINE BELOW BEFORE PRODUCTION
       * OR COMMENT WHEN TESTING PAYSTACK API FOR YOURSELF
       */
      // successResponse(res, { message: 'success, redirect to https://greenpot-api.herokuapp.com/v1.0/api/docs' });
    } catch (error) {
      if (error === 'Please enter a strring') return errorResponse(res, { code: 400, message: error });
      errorResponse(res, {});
    }
  }
}

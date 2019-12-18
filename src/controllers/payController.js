import { Toolbox, Payments } from '../utils';
import { CartService, MealService } from '../services';

const {
  successResponse, errorResponse, calculateOrderPrice
} = Toolbox;
const {
  getMealsInCart,
} = CartService;
const {
  findMultipleMeals,
} = MealService;
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
    try {
      /**
       * PLEASE UNCOMMENT ALL LINES BELOW BEFORE PRODUCTION
       * OR WHEN TESTING PAYSTACK API FOR YOURSELF
       */
      // const allMeals = await getMealsInCart({ userId: req.tokenData.id });
      // if (!allMeals.length) return errorResponse(res, { code: 404, message: 'There are no meals in your cart' });
      // const mealIds = allMeals.map((meal) => meal.mealId);
      // const mealsInDatabase = await findMultipleMeals({ id: mealIds });
      // const price = calculateOrderPrice(allMeals, mealsInDatabase);
      // const payload = {
      //   email: req.tokenData.email,
      //   amount: price * 100,
      // };

      // const paystack = await Payments.viaPaystack(payload);
      // if (!paystack.status) errorResponse(res, { code: 400, message: paystack.message });
      // const url = paystack.data.authorization_url;
      // successResponse(res, { message: `success, redirect to ${url}`, url });
      /**
       * PLEASE DELETE SINGLE LINE BELOW BEFORE PRODUCTION
       * OR COMMENT WHEN TESTING PAYSTACK API FOR YOURSELF
       */
      successResponse(res, { message: 'success, redirect to https://greenpot-api.herokuapp.com/v1.0/api/docs' });
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

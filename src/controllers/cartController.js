import { CartService, MealService } from '../services';
import { Toolbox } from '../utils';

const {
  successResponse, errorResponse, calculateOrderPrice,
} = Toolbox;

const {
  addMealsToCart, getMealsInCart, deleteCartMealByKey, updateBykey,
} = CartService;

const {
  findMultipleMeals,
} = MealService;
/**
 * Cart Controller
 * @class CartController
 */
export default class CartController {
  /**
   * add user meals to cart
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the added cart.
   * @memberof CartController
   */
  static async addToCart(req, res) {
    try {
      const { meals } = req.body;
      const payload = {
        userId: req.tokenData.id,
        meals,
      };
      const addedMeals = await addMealsToCart(payload);
      successResponse(res, { message: 'meals added to cart', Meals: [...addedMeals] }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * get all meals in cart
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the added cart.
   * @memberof CartController
   */
  static async getAllMeals(req, res) {
    try {
      const allMeals = await getMealsInCart({ userId: req.tokenData.id });
      if (!allMeals.length) return errorResponse(res, { code: 404, message: 'There are no meals in your cart' });
      const mealIds = allMeals.map((meal) => meal.mealId);
      const mealsInDatabase = await findMultipleMeals({ id: mealIds });
      const price = calculateOrderPrice(allMeals, mealsInDatabase);
      successResponse(res, { ...allMeals, price }, 200);
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * delete meal from cart
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response.
   * @memberof CartController
   */
  static async deleteMealFromCart(req, res) {
    const { mealId } = req.params;
    try {
      await deleteCartMealByKey({ mealId, userId: req.tokenData.id });
      successResponse(res, { message: 'meal deleted successfully' });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * update a meal
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the updated ingredients
   * @memberof IngredientController
   */
  static async updateMeal(req, res) {
    try {
      const mealId = Number(req.params.mealId);
      const quantity = Number(req.params.quantity);
      if (!req.params.quantity) return errorResponse(res, { code: 400, message: 'no quantity found in params' });
      const meal = await updateBykey({ quantity }, { mealId, userId: req.tokenData.id });

      successResponse(res, { message: 'cart meal updated successfully', meal });
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

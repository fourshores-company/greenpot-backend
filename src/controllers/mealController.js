import { MealService } from '../services';
import { Toolbox } from '../utils';


const {
  successResponse, errorResponse,
} = Toolbox;

const {
  addMeal, getAllMeals, addIngredientToMeal
} = MealService;

/**
 * Meal Controller
 * @class MealController
 */
export default class MealController {
  /**
   * add a new meal
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the added meal.
   * @memberof MealController
   */
  static async newMeal(req, res) {
    try {
      const addedMeal = await addMeal(req.body);
      successResponse(res, { message: 'Meal added successfully', addedMeal });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * add ingredient to meal
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response.
   * @memberof MealController
   */
  static async addIngredientToMeal(req, res) {
    try {
      const ingredient = await addIngredientToMeal(req.body);
      successResponse(res, { message: 'Ingredient added to meal successfully', ingredient });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * get all meals
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the meals.
   * @memberof MealController
   */
  static async viewMeals(req, res) {
    try {
      const allMeals = await getAllMeals();
      if (!allMeals.length) return errorResponse(res, { code: 404, message: 'There are no meals' });
      return successResponse(res, { ...allMeals });
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

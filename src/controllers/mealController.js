import { MealService, CategoryService } from '../services';
import { Toolbox } from '../utils';


const {
  successResponse, errorResponse,
} = Toolbox;

const {
  addMeal, getAllMeals, addIngredientToMeal, deleteIngredientFromMeal, deleteMealBykey,
} = MealService;
const {
  addCategory,
  addMealToCategory,
  deleteMealFromCategory,
  deleteCategoryBykey,
} = CategoryService;

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
   * deelete an ingredient from a meal
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response.
   * @memberof MealController
   */
  static async deleteIngredient(req, res) {
    const { mealId, ingredientId } = req.params;
    try {
      await deleteIngredientFromMeal({ mealId, ingredientId });
      successResponse(res, { message: 'Ingredient deleted successfully' });
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

  /**
   * add meal category
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the meal category.
   * @memberof MealController
   */
  static async newCategory(req, res) {
    try {
      const addedCategory = await addCategory(req.body);
      successResponse(res, { message: 'Category added successfully', addedCategory });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * add meal to category
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response.
   * @memberof MealController
   */
  static async addMealToCategory(req, res) {
    try {
      const mealCategory = await addMealToCategory(req.body);
      successResponse(res, { message: 'Meal added to category successfully', mealCategory });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * delete meal from category
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response.
   * @memberof MealController
   */
  static async deleteMealFromCategory(req, res) {
    const { mealId, categoryId } = req.params;
    try {
      await deleteMealFromCategory({ mealId, categoryId });
      successResponse(res, { message: 'meal deleted successfully' });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * delete a meal
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response.
   * @memberof MealController
   */
  static async deleteMeal(req, res) {
    const { mealId } = req.params;
    try {
      await deleteMealBykey({ id: mealId });
      successResponse(res, { message: 'meal deleted successfully' });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * delete meal category
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with message
   * @memberof MealController
   */
  static async deleteMealCategory(req, res) {
    try {
      const id = Number(req.params.id);
      await deleteCategoryBykey({ id });
      successResponse(res, { message: 'category deleted successfully' });
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

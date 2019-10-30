import { MealValidation } from '../validations';
import { Toolbox } from '../utils';
import { MealService, IngredientService, CategoryService } from '../services';

const {
  validateMeal, validateMealParameters, validateCategory, validateCategoryParameters
} = MealValidation;
const { findMeal } = MealService;
const { findIngredient } = IngredientService;
const { findCategory } = CategoryService;
const { errorResponse } = Toolbox;
/**
 * Middleware for meal routes
 * @class MealMiddleware
 */
export default class MealMiddleware {
  /**
   * validate meal request data
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   * @memberof MealMiddleware
   */
  static async mealCheck(req, res, next) {
    try {
      validateMeal(req.body);
      const { name } = req.body;
      const mealExists = await findMeal({ name });
      if (mealExists) return errorResponse(res, { code: 400, message: 'meal already exists' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

  /**
   * validate ingredient being added to meal
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   * @memberof MealMiddleware
   */
  static async ingredientCheck(req, res, next) {
    try {
      const { ingredientId, mealId } = req.body;
      validateMealParameters(req.body);
      const mealExists = await findMeal({ id: mealId });
      if (!mealExists) return errorResponse(res, { code: 404, message: 'meal does not exist in our database' });
      const ingredient = await findIngredient({ id: ingredientId });
      if (!ingredient) return errorResponse(res, { code: 404, message: 'ingredient does not exist in our database' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

  /**
   * validate category of a meal
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   * @memberof MealMiddleware
   */
  static async onMealCategory(req, res, next) {
    try {
      validateCategory(req.body);
      const { category } = req.body;
      const categoryExists = await findCategory({ category });
      if (categoryExists) return errorResponse(res, { code: 400, message: 'category already exists' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

  /**
   * validate meal being added to category
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   * @memberof MealMiddleware
   */
  static async mealCategoryCheck(req, res, next) {
    try {
      const { mealId, categoryId } = req.body;
      validateCategoryParameters(req.body);
      const mealExists = await findMeal({ id: mealId });
      if (!mealExists) return errorResponse(res, { code: 404, message: 'meal does not exist in our database' });
      const category = await findCategory({ id: categoryId });
      if (!category) return errorResponse(res, { code: 404, message: 'category does not exist in our database' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
}

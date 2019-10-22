import { IngredientValidations } from '../validations';
import { Toolbox } from '../utils';
import { IngredientService } from '../services';

const { errorResponse } = Toolbox;
const { addIngredientValidation } = IngredientValidations;
const { findIngredient } = IngredientService;
/**
 * Middleware for ingredient routes
 * @class IngredientMiddleware
 */
export default class IngredientMiddleware {
  /**
   * validate request before adding ingredients
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   */
  static async onAddIngredient(req, res, next) {
    const { name, unit } = req.body;
    try {
      addIngredientValidation({ name, unit });
      const ingredientExists = await findIngredient({ name });
      if (ingredientExists) return errorResponse(res, { code: 400, message: 'ingredient already exists' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
}

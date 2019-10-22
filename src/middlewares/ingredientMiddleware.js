import { IngredientValidations } from '../validations';
import { Toolbox } from '../utils';
import { IngredientService } from '../services';

const { errorResponse } = Toolbox;
const { addIngredientValidation, validateIngredient } = IngredientValidations;
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
   * @memberof IngredientMiddleware
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

  /**
   * validate request for update ingredients
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} = object response
   * @memberof IngredientMiddleware
   */
  static async ingredientCheck(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (req.body) validateIngredient(req.body);
      const ingredient = await findIngredient({ id });
      if (!ingredient) return errorResponse(res, { code: 404, message: 'ingredient does not exist in our database' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

}

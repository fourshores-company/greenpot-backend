import { IngredientService } from '../services';
import { Toolbox } from '../utils';

const {
  successResponse, errorResponse,
} = Toolbox;

const { addIngredient } = IngredientService;

/**
 * Ingredients Controller
 * @class IngredientController
 */
export default class IngredientController {
  /**
   * add a new ingredient
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof IngredientController
   */
  static async addIngredient(req, res) {
    const { name, unit } = req.body;
    try {
      const addedIngredient = await addIngredient({ name, unit });
      successResponse(res, { message: 'Ingredient added successfully', addedIngredient }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

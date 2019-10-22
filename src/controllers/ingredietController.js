import { IngredientService } from '../services';
import { Toolbox } from '../utils';

const {
  successResponse, errorResponse,
} = Toolbox;

const {
  addIngredient, updateBykey, deleteBykey, getAllIngredients
} = IngredientService;

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

  /**
   * update an ingredient
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the updated ingredients
   * @memberof IngredientController
   */
  static async updateIngredient(req, res) {
    try {
      const id = Number(req.params.id);
      if (!req.body) return errorResponse(res, { code: 400, message: 'no values found in request body' });
      const ingredient = await updateBykey(req.body, { id });
      successResponse(res, { message: 'Ingredient update was successful', ingredient });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * delete an ingredient
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with message
   * @memberof IngredientController
   */
  static async deleteIngredient(req, res) {
    try {
      const id = Number(req.params.id);
      await deleteBykey({ id });
      successResponse(res, { message: 'Ingredient deleted succesfully' });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * get all ingredients
   * @param {object} req
   * @param {object} res
   * @returns {JSON} A JSON response with all ingredients
   * @memberof IngredientController
   */
  static async getAllIngredients(req, res) {
    try {
      const allIngredients = await getAllIngredients();
      if (!allIngredients.length) return errorResponse(res, { code: 404, message: 'There are no ingredients' });
      return successResponse(res, { ...allIngredients });
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

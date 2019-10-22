import { ApiError } from '../utils';
import db from '../models';

const { Ingredient } = db;

/**
 * Service interface for Ingredient db model
 */
export default class IngredientService {
  /**
   * Add new ingredient to database
   * @static
   * @param {object} ingredient - new ingredient object
   * @returns {Promis-Object} A promise object with ingredient details
   * @memberof IngredientService
   */
  static async addIngredient(ingredient) {
    try {
      const { dataValues: addedIngredient } = await Ingredient.create(ingredient);
      return addedIngredient;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * find ingredient in database
   * @param {object} keys - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with ingredient details
   * @memberof IngredientService
   */
  static async findIngredient(keys) {
    return Ingredient.findOne({ where: keys });
  }

  /**
   * update ingredient key given an option
   * @param {object} updateData - data to update
   * @param {object} keys - query key to update
   * @returns {promise-object | error} A promise object with ingredient detail
   * @memberof IngredientService
   */
  static async updateBykey(updateData, keys) {
    const [rowaffected, [ingredient]] = await Ingredient.update(
      updateData, { returning: true, where: keys }
    );
    if (!rowaffected) throw new ApiError(404, 'Not Found');
    return ingredient.dataValues;
  }

  /**
   * delete ingredient key given an option
   * @param {object} keys - query key to delete
   * @returns {promise-object | error} A number showing how many rows were deleted
   * @memberof IngredientService
   */
  static async deleteBykey(keys) {
    const numberOfRowsDeleted = await Ingredient.destroy({ where: keys });
    if (!numberOfRowsDeleted) throw new ApiError(404, 'Not Found');
    return true;
  }

  /**
   * get all ingredients
   * @returns {promise-object} - all ingredients
   * @memberof IngredientService
   */
  static async getAllIngredients() {
    const ingredients = await Ingredient.findAll({
      attributes: ['name', 'unit'], where: {}
    }).map((values) => values.get({ plain: true }));

    return ingredients;
  }
}

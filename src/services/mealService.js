import { ApiError } from '../utils';
import db from '../models';

const {
  Meal, Ingredient, MealIngredient,
} = db;

/**
 * Services for Meal db model
 * @class MealService
 */
export default class MealService {
  /**
   * add meal
   * @static
   * @param {object} meal
   * @returns {Promis-Object} A promise object with meal details
   * @memberof MealService
   */
  static async addMeal(meal) {
    try {
      const { dataValues: value } = await Meal.create(meal);
      return value;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * find a meal
   * @param {object} keys - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with meal details
   * @memberof MealService
   */
  static async findMeal(keys) {
    return Meal.findOne({ where: keys });
  }

  /**
   * update a meal given a key
   * @param {object} updateData - data to update
   * @param {object} keys - query key to update
   * @returns {promise-object | error} A promise object with meal detail
   * @memberof MealService
   */
  static async updateMealBykey(updateData, keys) {
    const [rowaffected, [meal]] = await Meal.update(
      updateData, { returning: true, where: keys }
    );
    if (!rowaffected) throw new ApiError(404, 'Not Found');
    return meal.dataValues;
  }

  /**
   * delete a meal
   * @param {object} keys - query key to delete
   * @returns {promise-object | error} A number showing how many rows were deleted
   * @memberof MealService
   */
  static async deleteMealBykey(keys) {
    const numberOfRowsDeleted = await Meal.destroy({ where: keys });
    if (!numberOfRowsDeleted) throw new ApiError(404, 'Not Found');
    return true;
  }

  /**
   * get all meals
   * @returns {promise-object} - all meals
   * @memberof MealService
   */
  static async getAllMeals() {
    const meals = await Meal.findAll({
      include: [{
        model: Ingredient,
        as: 'ingredients',
        required: false,
        attributes: ['name', 'unit'],
        through: {
          model: MealIngredient,
          attributes: ['ingredientQuantity'],
        }
      }],
      attributes: ['name', 'recipe', 'price', 'prepTime', 'imageUrl'],
      where: {}
    }).map((values) => values.get({ plain: true }));

    return meals;
  }

  /**
   * add ingredient to meal
   * @param {object} payload - { mealId, ingredientId, ingredientQuantity }
   * @returns {promise-object} - updated meal
   * @memberof MealService
   */
  static async addIngredientToMeal(payload) {
    try {
      console.log('meal payload here: ', payload);
      const { dataValues: value } = await MealIngredient.create(payload);
      return value;
    } catch (error) {
      throw new Error(error);
    }
  }
}

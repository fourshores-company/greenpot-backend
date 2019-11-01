import { ApiError } from '../utils';
import db from '../models';


const {
  Category, MealCategory,
} = db;

/**
 * Services for meal categories db model
 * @class CategoryService
 */
export default class CategoryService {
  /**
   * add category
   * @static
   * @param {object} category
   * @returns {Promis-Object} A promise object with category details
   * @memberof CategoryService
   */
  static async addCategory(category) {
    try {
      const { dataValues: value } = await Category.create(category);
      return value;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * find a category
   * @param {object} keys - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with category details
   * @memberof CategoryService
   */
  static async findCategory(keys) {
    return Category.findOne({ where: keys });
  }

  /**
   * update a category given a key
   * @param {object} updateData - data to update
   * @param {object} keys - query key to update
   * @returns {promise-object | error} A promise object with category detail
   * @memberof CategoryService
   */
  static async updateCategoryBykey(updateData, keys) {
    const [rowaffected, [category]] = await Category.update(
      updateData, { returning: true, where: keys }
    );
    if (!rowaffected) throw new ApiError(404, 'Not Found');
    return category.dataValues;
  }

  /**
   * delete a category
   * @param {object} keys - query key to delete
   * @returns {promise-object | error} A number showing how many rows were deleted
   * @memberof CategoryService
   */
  static async deleteCategoryBykey(keys) {
    const numberOfRowsDeleted = await Category.destroy({ where: keys });
    if (!numberOfRowsDeleted) throw new ApiError(404, 'Not Found');
    return true;
  }

  /**
   * add meal to category
   * @param {object} payload - { mealId, categoryId }
   * @returns {promise-object} - updated category
   * @memberof CategoryService
   */
  static async addMealToCategory(payload) {
    try {
      const { dataValues: value } = await MealCategory.create(payload);
      return value;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * find meal by meal category
   * @param {object} categoryId
   * @param {object} mealId
   * @returns {promise-object} - meal in category
   * @memberof CategoryService
   */
  static async findMealByCategory(categoryId, mealId) {
    return MealCategory.findOne({ where: mealId, categoryId });
  }
}

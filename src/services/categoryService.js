import { ApiError } from '../utils';
import db from '../models';


const {
  Category, Meal, MealCategory,
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
   * @param {object} payload { mealId, categoryId }
   * @returns {promise-object} - meal in category
   * @memberof CategoryService
   */
  static async findMealByCategory(payload) {
    return MealCategory.findOne({ where: payload });
  }

  /**
   * delete meal from category
   * @param {object} payload {mealId, categoryId}
   * @returns {boolean | error} - true if successfull or an error if it fails
   * @memberof CategoryService
   */
  static async deleteMealFromCategory(payload) {
    try {
      const numberOfRowsDeleted = await MealCategory.destroy({ where: payload });
      if (!numberOfRowsDeleted) throw new ApiError(404, 'Not Found');
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @param {string} category - object containing query key and value
   * e.g { id: 5 }, { category: value }
   * @returns {promise-object} - meals in category
   * @memberof CategoryService
   */
  static async getMealsByCategory(category) {
    const value = await Category.findAll({
      include: [{
        model: Meal,
        as: 'meals',
        required: false,
        attributes: ['name', 'recipe', 'price', 'prepTime', 'imageUrl'],
        through: {
          model: MealCategory
        }
      }],
      where: { category }
    }).map((values) => values.get({ plain: true }));

    return value;
  }
}

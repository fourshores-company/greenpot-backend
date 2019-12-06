import { ApiError } from '../utils';
import db from '../models';

const {
  Cart,
} = db;

/**
 * Service for Carts
 * @class CartService
 */
export default class CartService {
  /**
   * Add meals to cart
   * @static
   * @param {object} payload
   * @returns {Promis-Object} A promise object with cart details
   * @memberof OrderService
   */
  static async addMealsToCart(payload) {
    try {
      const mealArray = [...payload.meals];
      mealArray.forEach((meal) => {
        meal.userId = payload.userId;
      });
      return Cart.bulkCreate(mealArray, { returning: true, where: { userId: payload.userId } });
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * get all user meals in cart
   * @param {object} key - key value for search
   * e.g { userId: 5 }
   * @returns {promise-Object} - A promise object with meals in cart
   * @memberof CartService
   */
  static async getMealsInCart(key) {
    return Cart.findAll({ where: key });
  }

  /**
   * delete meal in cart
   * @param {object} keys - query keu to delete
   * @returns {promise-object | error} A number showing how many rows were deleted
   * @memberof CartService
   */
  static async deleteCartMealByKey(keys) {
    const numberOfRowsDeleted = await Cart.destroy({ where: keys });
    if (!numberOfRowsDeleted) throw new ApiError(404, 'Not Found');
    return true;
  }

  /**
   * find a meal
   * @param {object} keys - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with meal details
   * @memberof CartService
   */
  static async findMeal(keys) {
    return Cart.findOne({ where: keys });
  }

  /**
   * update cart meal key given an option
   * @param {object} updateData - data to update
   * @param {object} keys - query key to update
   * @returns {promise-object | error} A promise object with ingredient detail
   * @memberof CartService
   */
  static async updateBykey(updateData, keys) {
    const [rowaffected, [meal]] = await Cart.update(
      updateData, { returning: true, where: keys }
    );
    if (!rowaffected) throw new ApiError(404, 'Not Found');
    return meal.dataValues;
  }
}

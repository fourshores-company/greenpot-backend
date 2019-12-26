import { ApiError } from '../utils';
import db from '../models';


const {
  Order, OrderMeal, DeliverOrder, sequelize,
} = db;

/**
 * Service for Orders
 * @class OrderService
 */
export default class OrderService {
  /**
   * create order
   * @static
   * @param {object} payload
   * @returns {Promis-Object} A promise object with order details
   * @memberof OrderService
   */
  static async createOrder(payload) {
    try {
    //  Start transaction
    // P.S remeber to include the price
      return sequelize.transaction((t) => Order.create({
        userId: payload.userId, price: payload.price, paystackReference: payload.reference,
      }, { transaction: t }).then((order) => {
        // add order id to the meals before uploading
        const updateMealArray = [...payload.meals];
        updateMealArray.forEach((meal) => {
          meal.orderId = order.id;
        });
        return OrderMeal.bulkCreate(updateMealArray, { transaction: t })
          .map((values) => values.get({ plain: true }));
      }))
      // Transaction has been committed
      // result is whatever the result of the promise chain returned to the transaction callback

        .then((result) => result)
        .catch((err) => {
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
          throw new Error(err);
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * find an order
   * @param {object} keys - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with order details
   * @memberof OrderService
   */
  static async findOrder(keys) {
    return Order.findOne({ raw: true, where: keys });
  }

  /**
   * update an order given a key
   * @param {object} updateData - data to update
   * @param {object} keys - query key to update
   * @returns {promise-object | error} A promise object with order detail
   * @memberof OrderService
   */
  static async updateOrderBykey(updateData, keys) {
    const [rowaffected, [order]] = await Order.update(
      updateData, { returning: true, where: keys }
    );
    if (!rowaffected) throw new ApiError(404, 'Not Found');
    return order.dataValues;
  }

  /**
   * delete an order
   * @param {object} keys - query key to delete
   * @returns {promise-object | error} A number showing how many rows were deleted
   * @memberof OrderService
   */
  static async deleteOrderBykey(keys) {
    const numberOfRowsDeleted = await Order.destroy({ where: keys });
    if (!numberOfRowsDeleted) throw new ApiError(404, 'Not Found');
    return true;
  }

  /**
   * create a delivery
   * @param {object} payload - delivery data { userId, orderId, address }
   * @returns {Promis-Object} A promise object with user details
   * @memberof OrderService
   */
  static async createDelivery(payload) {
    try {
      const { dataValues: delivery } = await DeliverOrder.create(payload);
      return delivery;
    } catch (error) {
      throw new Error(error);
    }
  }
}

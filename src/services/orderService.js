import { ApiError } from '../utils';
import db from '../models';


const {
  Order, OrderMeal, DeliverOrder, Meal, sequelize,
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
   * Find multiple orders given the key
   * @param {object} keys - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with order details
   * @memberof OrderService
   */
  static async findOrdersBykey(keys) {
    try {
      const orders = await Order.findAll({
        include: [{
          model: Meal,
          as: 'meals',
          required: false,
          attributes: ['name'],
          through: {
            model: OrderMeal,
            attributes: ['quantity'],
          },
        }, {
          model: DeliverOrder,
          as: 'address',
          attributes: ['address'],
        }],
        attributes: ['id', 'userId', 'status', 'price'],
        where: keys
      }).map((values) => values.get({ plain: true }));
      return orders;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * update order status
   * @param {object} status - status to update
   * @param {object} keys - query key to update
   * @returns {promise-object | error} A promise object with order detail
   * @memberof OrderService
   */
  static async updateOrderStatus(status, keys) {
    try {
      const [rowaffected, [order]] = await Order.update(
        status, { returning: true, where: keys }
      );
      if (!rowaffected) throw new ApiError(404, 'Not Found');
      return order.dataValues;
    } catch (error) {
      throw new Error(error);
    }
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

  /**
   * get all orders
   * @returns {promise-object} - all orders
   * @memberof OrderService
   */
  static async getAllOrders() {
    try {
      const orders = await Order.findAll({
        include: [{
          model: Meal,
          as: 'meals',
          required: false,
          attributes: ['name'],
          through: {
            model: OrderMeal,
            attributes: ['quantity'],
          },
        }, {
          model: DeliverOrder,
          as: 'address',
          attributes: ['address'],
        }],
        attributes: ['id', 'userId', 'status', 'price'],
        where: {}
      }).map((values) => values.get({ plain: true }));
      return orders;
    } catch (error) {
      throw new Error(error);
    }
  }
}

/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { OrderService, CartService, UserService } from '../services';
import { Toolbox, Payments } from '../utils';

const {
  successResponse, errorResponse,
} = Toolbox;

const {
  createOrder, createDelivery, getAllOrders, updateOrderStatus, findOrdersBykey
} = OrderService;
const {
  deleteCartMealByKey,
} = CartService;
const {
  findUser,
} = UserService;
/**
 * Order Controller
 * @class OrderController
 */
export default class OrderController {
  /**
   * create a new order via client side
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the created order.
   * @memberof OrderController
   */
  static async clientOrder(req, res) {
    const { reference } = req.query;
    try {
      const { data } = await Payments.validatePaystack(reference);
      if (data.status === 'failed' || data.status === 'abandoned') return errorResponse(res, { code: 400, message: `Payment error: ${data.gateway_response}` });
      const { metadata } = data;
      const payload = {
        userId: req.tokenData.id,
        meals: metadata.meals,
        price: metadata.price,
        reference,
      };
      const createdOrder = await createOrder(payload);
      await deleteCartMealByKey({ userId: req.tokenData.id });
      const deliveryData = {
        userId: metadata.userId,
        orderId: createdOrder[0].orderId,
        address: metadata.address,
      };
      const delivery = await createDelivery(deliveryData);
      successResponse(res, { message: 'order created', createdOrder, delivery }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * create a new order via server side
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the created order.
   * @memberof OrderController
   */
  static async serverOrder(req, res) {
    const { data } = req.body;
    if (data.status === 'failed' || data.status === 'abandoned') return errorResponse(res, { code: 400, message: `Payment error: ${data.gateway_response}` });
    try {
      const { metadata } = data;
      const payload = {
        userId: metadata.userId,
        meals: metadata.meals,
        price: metadata.price,
        reference: data.reference,
      };
      const createdOrder = await createOrder(payload);
      await deleteCartMealByKey({ userId: metadata.userId });
      const deliveryData = {
        userId: metadata.userId,
        orderId: createdOrder[0].orderId,
        address: metadata.address,
      };
      const delivery = await createDelivery(deliveryData);
      successResponse(res, { message: 'order created', createdOrder, delivery }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * get all orders
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the created order.
   * @memberof OrderController
   */
  static async viewOrders(req, res) {
    try {
      const orders = await getAllOrders();
      if (!orders.length) return errorResponse(res, { code: 404, message: 'There are no orders' });
      for (const items of orders) {
        const {
          firstName, lastName, phoneNumber
        } = await findUser({ id: items.userId });
        delete items.userId;
        items.user = { firstName, lastName, phoneNumber };
      }
      return successResponse(res, { orders });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * get orders by user
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the created order.
   * @memberof OrderController
   */
  static async getUserOrders(req, res) {
    try {
      console.log('user data: ', req.tokenData);
      const { id } = req.tokenData;
      const userOrders = await findOrdersBykey({ userId: id });
      if (!userOrders.length) return errorResponse(res, { code: 404, message: 'There are no orders' });
      return successResponse(res, { userOrders });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
    * update order status
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the created order.
   * @memberof OrderController
  */
  static async updateStatus(req, res) {
    try {
      const id = Number(req.params.id);
      const status = req.query;
      const order = await updateOrderStatus(status, { id });
      successResponse(res, { message: 'order successfully updated', order });
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

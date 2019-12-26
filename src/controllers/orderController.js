import { OrderService, CartService, } from '../services';
import { Toolbox, Payments } from '../utils';

const {
  successResponse, errorResponse,
} = Toolbox;

const {
  createOrder, createDelivery
} = OrderService;
const {
  deleteCartMealByKey,
} = CartService;

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
}

import { OrderService } from '../services';
import { Toolbox } from '../utils';

const {
  successResponse, errorResponse,
} = Toolbox;

const {
  createOrder
} = OrderService;

/**
 * Ingredients Controller
 * @class IngredientController
 */
export default class OrderController {
  /**
   * create a new order
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the created order.
   * @memberof OrderController
   */
  static async createOrder(req, res) {
    const { meals } = req.body;
    const payload = {
      userId: req.tokenData.id,
      meals,
    };
    try {
      const createdOrder = await createOrder(payload);
      successResponse(res, { message: 'order created', createdOrder }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }
}
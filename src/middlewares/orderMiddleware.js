import { Toolbox } from '../utils';
import { OrderService } from '../services';
import { OrderValidation } from '../validations';

const { errorResponse } = Toolbox;
const { findOrder } = OrderService;
const { validateParameters, validateQuery, validateFeedback } = OrderValidation;
const IP = ['52.31.139.75', '52.49.173.169', '52.214.14.220', '127.0.0.1'];
/**
 * Middleware for order routes
 * @class OrderMiddleware
 */
export default class OrderMiddleware {
  /**
   * validate request before creating a new order
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return an object {error or response}
   * @memberof OrderMiddleware
   */
  static async orderChecks(req, res, next) {
    let reference;
    if (req.query.reference) {
      reference = req.query.reference;
    } else if (req.body.data) {
      reference = req.body.data.reference;
    }
    try {
      const orderInDatabase = await findOrder({ paystackReference: reference });
      if (orderInDatabase) return errorResponse(res, { code: 400, message: 'Order with reference has already been created in database' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

  /**
   * verify paystack IP whitelists
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return an object {error or response}
   * @memberof OrderMiddleware
   */
  static async whitelist(req, res, next) {
    try {
      const reqIP = req.headers.host.split(':');
      const permitted = IP.includes(reqIP[0]);
      if (permitted) return next();
      return errorResponse(res, { code: 403, message: 'Halt! You\'re not a recognized payment webhook IP' });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * verify status parameters
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return an object {error or response}
   * @memberof OrderMiddleware
   */
  static async verifyParameters(req, res, next) {
    try {
      const id = Number(req.params.id);
      validateParameters({
        id,
        status: req.params.status,
      });
      const orderInDatabase = await findOrder({ id });
      if (!orderInDatabase) return errorResponse(res, { code: 404, message: 'order does not exist in our database' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

  /**
   * order query check
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return an object {error or response}
   * @memberof OrderMiddleware
   */
  static async queryCheck(req, res, next) {
    try {
      validateQuery(req.query);
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

  /**
   * order feedback parameter check
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return an object {error or response}
   * @memberof OrderMiddleware
   */
  static async feedbackCheck(req, res, next) {
    try {
      const { id } = req.params;
      const { feedback } = req.body;
      validateFeedback({ id, feedback });
      const orderInDatabase = await findOrder({ id });
      if (!orderInDatabase) return errorResponse(res, { code: 404, message: 'order does not exist in our database' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
}

import { ProfileValidation } from '../validations';
import { Toolbox } from '../utils';

const {
  errorResponse, checkToken, verifyToken
} = Toolbox;
const {
  validateProfile
} = ProfileValidation;
/**
 * Middleware for user routes
 * @class UserMiddleware
 */
export default class UserMiddleware {
  /**
   * validate user profile during update
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   */
  static async onUpdateProfile(req, res, next) {
    try {
      const { userId } = req.params;
      const token = checkToken(req);
      const tokenData = verifyToken(token);
      const validated = await validateProfile(req.body);
      if (tokenData.id === Number(userId)) {
        if (validated) next();
      } else {
        return errorResponse(res, { code: 401, message: 'Access denied, check your inputed details' });
      }
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
}

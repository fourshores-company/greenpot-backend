import { AuthValidation } from '../validations';
import { Toolbox, ApiError } from '../utils';
import { UserService } from '../services';

const {
  errorResponse,
} = Toolbox;
const {
  validateUserSignup
} = AuthValidation;
const {
  findUser
} = UserService;

/**
 * Middleware for user authentication routes
 * @class AuthMiddleware
 */
export default class AuthMiddleware {
  /**
   * Middleware method for user validation during signup
   * @param {object} req - the api request
   * @param {object} res - api response returened by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  static async onSignup(req, res, next) {
    try {
      const validated = await validateUserSignup(req.body);
      if (validated) {
        const { email } = req.body;
        const oldUser = await findUser({ email });
        if (!oldUser) {
          next();
        } else {
          errorResponse(res, { code: 409, message: `User with email "${email}" already exists` });
        }
      }
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
}

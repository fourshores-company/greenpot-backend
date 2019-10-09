import { AuthValidation } from '../validations';
import { Toolbox } from '../utils';
import { UserService } from '../services';

const {
  errorResponse, checkToken, verifyToken
} = Toolbox;
const {
  validateUserSignup, validateUserLogin
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
        const member = await findUser({ email });
        if (!member) {
          next();
        } else {
          errorResponse(res, { code: 409, message: `User with email "${email}" already exists` });
        }
      }
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

  /**
   * Method for user validation during login
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  static async onLogin(req, res, next) {
    try {
      const validated = await validateUserLogin(req.body);
      if (validated) {
        const { email } = req.body;
        const member = await findUser({ email });
        if (member) {
          req.member = member;
          next();
        } else {
          errorResponse(res, { code: 404, message: `User with email "${email}" does not exists. Please check your details` });
        }
      }
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

  /**
   * Method for checking user validation status
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  static async checkUserValidation(req, res, next) {
    try {
      const token = checkToken(req);
      if (!token) return errorResponse(res, { code: 401, message: 'Access denied, Token required' });
      const { tokenData: email } = verifyToken(token);
      const member = await findUser({ email });
      if (member) {
        if (member.isVerified) {
          next();
        } else {
          errorResponse(res, { code: 401, message: 'You email needs to be verified to access this route' });
        }
      } else {
        errorResponse(res, { code: 404, message: 'User does not exists. Please check your details' });
      }
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

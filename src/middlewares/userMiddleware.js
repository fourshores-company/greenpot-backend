import { ProfileValidation } from '../validations';
import { Toolbox } from '../utils';
import { UserService } from '../services';

const {
  errorResponse, checkToken, verifyToken
} = Toolbox;
const {
  validateProfile, validateUserId
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
  static async profileCheck(req, res, next) {
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

  /**
   * validate user account before deleting
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   */
  static async onDeleteAccount(req, res, next) {
    try {
      const userId = Number(req.params.userId);
      await validateUserId(userId);
      // Check if the user exixts
      const user = await UserService.findUser({ id: userId });
      if (!user) return errorResponse(res, { code: 400, message: 'User does not exist' });
      const token = checkToken(req);
      const tokenData = verifyToken(token);
      if (tokenData.id === userId) {
        next();
      } else {
        return errorResponse(res, { code: 401, message: 'Access denied, you can only delete your own account' });
      }
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
}

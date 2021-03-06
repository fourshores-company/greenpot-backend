import { ProfileValidation } from '../validations';
import { rolesSchema, superAdminSchema } from '../validations/adminValidation';
import { Toolbox } from '../utils';
import { UserService, RoleService } from '../services';

const {
  errorResponse, validate
} = Toolbox;
const {
  validateProfile, validateUserId, validateUserEmail
} = ProfileValidation;
const {
  findUser, updateBykey,
} = UserService;
const {
  findRoleUser
} = RoleService;
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
      const { tokenData } = req;
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
      const user = await findUser({ id: userId });
      if (!user) return errorResponse(res, { code: 400, message: 'User does not exist' });
      const { tokenData } = req;
      if (tokenData.id === userId) {
        next();
      } else {
        return errorResponse(res, { code: 401, message: 'Access denied, you can only delete your own account' });
      }
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }

  /**
   * verify user roles
   * @param {array} permissions - array with role id's permitted on route
   * @returns {function} - returns an async functon
   * @memberof UserMiddleware
   */
  static verifyRoles(permissions) {
    return async function bar(req, res, next) {
      try {
        const { id } = req.tokenData;
        const user = await findUser({ id });
        if (!user) return errorResponse(res, { code: 404, message: 'User does not exist' });
        const { roleId } = await findRoleUser({ userId: id });
        const permitted = permissions.includes(roleId);
        if (permitted) return next();
        return errorResponse(res, { code: 403, message: 'Halt! You\'re not authorised' });
      } catch (Error) {
        errorResponse(res, {});
      }
    };
  }

  /**
   * validate admin assign inputs
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   */
  static async onAssign(req, res, next) {
    try {
      const schema = (req.body.email) ? rolesSchema : superAdminSchema;
      const { error } = validate(req.body, schema);
      if (error) {
        const message = error.details[0].context.label;
        return errorResponse(res, { code: 400, message });
      }
      next();
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * validate email and change the user's verified status
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - return and object {error or response}
   */
  static async onEmailUpdate(req, res, next) {
    const newEmail = req.body.email;
    const oldEmail = req.tokenData.email;
    const { id } = req.tokenData;
    try {
      validateUserEmail(newEmail);
      const userExists = await findUser({ email: newEmail });
      if (newEmail === oldEmail) return errorResponse(res, { code: 401, message: 'the old and new emails are the same' });
      if (userExists) return errorResponse(res, { code: 401, message: 'user already exists' });
      await updateBykey({ isVerified: false }, { id });
      next();
    } catch (error) {
      errorResponse(res, { message: error });
    }
  }
}

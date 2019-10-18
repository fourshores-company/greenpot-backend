import { UserService, RoleService } from '../services';
import { Toolbox } from '../utils';
import env from '../config/env';

const {
  ADMIN_KEY
} = env;
const {
  successResponse, errorResponse
} = Toolbox;

const {
  updateBykey, findUser, deleteBykey
} = UserService;
const {
  updateRole
} = RoleService;
/**
 * Collection of classes cor controlling user profiles
 * @class UserController
 */
export default class UserController {
  /**
   * update a user profile
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof UserController
   */
  static async updateProfile(req, res) {
    try {
      const id = req.params.userId;
      const user = await updateBykey(req.body, { id });
      successResponse(res, { message: 'Profile update was successful', user });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * get user profile
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - A jsom response with user details
   * @memberof UserController
   */
  static async getProfile(req, res) {
    try {
      const id = req.params.userId;
      const user = await findUser({ id });
      successResponse(res, { user });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * delete a user's account
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response
   * with a message informing the user that the account has been deleted.
   * @memberof UserController
   */
  static async deleteAccount(req, res) {
    try {
      const id = req.params.userId;
      await deleteBykey({ id });
      // Clear the token from the cookie
      res.clearCookie('token', { maxAge: 70000000, httpOnly: true });
      // Redirect back to home page after deleting the account
      res.redirect(200, '/');
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
 * Assign admin
 * @param {object} req
 * @param {object} res
 * @returns {JSON} - A jsom response with role details
 * @memberof UserController
 */
  static async assignRole(req, res) {
    try {
      const { roleId, adminKey } = req.body;
      const { id } = req.tokenData;
      if (adminKey === ADMIN_KEY) {
        const updatedRole = await updateRole(id, roleId);
        return successResponse(res, { message: 'User role update successful', updatedRole });
      }
      return errorResponse(res, { code: 400, message: 'Incorrect admin key' });
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

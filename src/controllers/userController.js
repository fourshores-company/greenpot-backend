import { UserService, RoleService } from '../services';
import { Toolbox, Mailer } from '../utils';
import env from '../config/env';

const {
  ADMIN_KEY
} = env;
const {
  successResponse, errorResponse,
} = Toolbox;

const {
  updateBykey, findUser, deleteBykey
} = UserService;
const {
  updateRole
} = RoleService;

const { sendVerificationEmail } = Mailer;
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
   * Assign super admin
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - A jsom response with role details
   * @memberof UserController
   */
  static async assignSuperAdmin(req, res) {
    try {
      const { adminKey } = req.body;
      const { id } = req.tokenData;
      if (adminKey === ADMIN_KEY) {
        const updatedRole = await updateRole(id, 1);
        return successResponse(res, { message: 'Successfully assigned as Super Admin', updatedRole });
      }
      return errorResponse(res, { code: 400, message: 'Incorrect admin key' });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * assign roles
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - A jsom response with role details
   * @memberof UserController
   */
  static async assignRoles(req, res) {
    try {
      const { roleId, email } = req.body;
      const user = await findUser({ email });
      if (!user) return errorResponse(res, { code: 404, message: 'User does not exist' });
      const updatedRole = await updateRole(user.id, roleId);
      return successResponse(res, { message: 'Role update successful', updatedRole });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * updates a user's email
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - A jsom response with a success message
   * @memberof UserController
   */
  static async updateEmail(req, res) {
    const newEmail = req.body.email;
    const oldEmail = req.tokenData.email;
    const { id, firstName } = req.tokenData;
    try {
      await updateBykey({ email: newEmail }, { id });
      const emailSent = await sendVerificationEmail(req, { id, newEmail, firstName });
      if (!emailSent) {
        // Rollback email to the old one and the status to verified
        await updateBykey({ email: oldEmail, isVerified: true }, { id });
        return errorResponse(res, { message: 'Issue updating email, try again' });
      }
      res.clearCookie('token', { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { message: 'Update successful, please use the link sent to your email to verify your profile' });
    } catch (error) {
      errorResponse(res, { message: error });
    }
  }
}

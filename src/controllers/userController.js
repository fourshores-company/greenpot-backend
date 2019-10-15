import { UserService } from '../services';
import { Toolbox } from '../utils';

const {
  successResponse, errorResponse
} = Toolbox;

const {
  updateBykey
} = UserService;
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
}

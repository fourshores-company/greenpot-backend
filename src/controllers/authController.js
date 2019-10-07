import { UserService } from '../services';
import { Toolbox } from '../utils';

const {
  successResponse, errorResponse, createToken, hashPassword
} = Toolbox;
const {
  addUser
} = UserService;
/**
 * Colllection of  methids for controlling user authentications
 * @class AuthController
 */
export default class AuthController {
  /**
   * Signup new user
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AuthController
   */
  static async signup(req, res) {
    try {
      const { body } = req;
      const user = await addUser({ ...body });
      user.token = await createToken({ email: user.email, id: user.id });
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { user }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

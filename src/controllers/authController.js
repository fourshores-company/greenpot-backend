import { UserService } from '../services';
import { Toolbox } from '../utils';

const {
  successResponse, errorResponse, createToken, comparePassword
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
      user.token = createToken({ email: user.email, id: user.id });
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { user }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * login existing user
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = req.member;
      if (!comparePassword(password, user.password)) {
        return errorResponse(res, { code: 401, message: 'This password is incorrect' });
      }
      user.token = createToken({ email, id: user.id });
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { message: 'Login Successful' });
    } catch (error) {
      errorResponse(res, {});
    }
  }
}

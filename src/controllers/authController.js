/* eslint-disable linebreak-style */
import { UserService } from '../services';
import { Toolbox, Mailer } from '../utils';

const {
  successResponse, errorResponse, createToken, comparePassword,
  verifyToken, hashPassword
} = Toolbox;
const {
  sendVerificationEmail
} = Mailer;
const {
  addUser, updateBykey
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
      const emailSent = await sendVerificationEmail(req, user);
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { user, emailSent }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * login existing user
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
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

  /**
   * verify user email
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  static async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      const tokenData = verifyToken(token);
      const { id } = tokenData;
      const user = await updateBykey({ isVerified: true }, { id });
      successResponse(res, { message: `Welome ${user.firstName}, you have been verified!` });
    } catch (error) {
      if (error.message === 'Invalid Token') {
        return errorResponse(res, { code: 400, message: 'We could not verify your email, the token provided was invalid' });
      }
      if (error.message === 'Not Found') {
        return errorResponse(res, { code: 404, message: 'Sorry, we do not recognise this user in our database' });
      }
      errorResponse(res, {});
    }
  }

  /**
   * login user in with google
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   */
  static socialLogin(req, res) {
    const { id, email } = req.user;
    try {
      const token = createToken({ id, email });
      res.cookie('token', token, { maxAge: 70000000, httpOnly: true });
      successResponse(res, { message: 'Successfully logged in via Google' }, 200);
    } catch (error) {
      errorResponse(res, { code: error.status, message: error.message });
    }
  }

  /**
   * reset user password
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   */
  static async resetPassword(req, res) {
    try {
      const { password } = req.body;
      const hasedhPassword = hashPassword(password);
      const { id } = req.tokenData;
      const user = await updateBykey({ password: hasedhPassword }, { id });
      if (user) {
        successResponse(res, { message: 'Password has been changed successfully' });
      }
    } catch (error) {
      if (error.message === 'Not Found') {
        return errorResponse(res, { code: 404, message: 'Sorry, we do not recognise this user in our database' });
      }
      errorResponse(res, {});
    }
  }
}

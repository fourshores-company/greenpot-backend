import { UserService, RoleService } from '../services';
import { Toolbox, Mailer } from '../utils';

const {
  successResponse, errorResponse, createToken, comparePassword,
  verifyToken, hashPassword
} = Toolbox;
const {
  sendVerificationEmail, sendPasswordResetEmail
} = Mailer;
const {
  addUser, updateBykey, findUser
} = UserService;
const {
  assignRole, findRoleUser
} = RoleService;
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
      const body = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        phoneNumber: req.body.phoneNumber,
      };
      const user = await addUser({ ...body });
      const assignedRole = await assignRole(user.id, 3);
      user.token = createToken({
        email: user.email,
        id: user.id,
        roleId: 3,
        firstName: user.firstName
      });
      /**
       * REMEMBER TO UNCOMMENT THE BELOW BEFORE PRODUCTION
       */
      // const emailSent = await sendVerificationEmail(req, user);
      /**
       * REMEMBER TO DELETE LINE BEFORE PRODUCTION
       */
      const emailSent = true;
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { user, assignedRole, emailSent }, 201);
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
      const { roleId } = await findRoleUser({ userId: user.id });
      if (!comparePassword(password, user.password)) {
        return errorResponse(res, { code: 401, message: 'This password is incorrect' });
      }
      user.token = createToken({
        email,
        id: user.id,
        roleId,
        firstName: user.firstName,
      });
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

  /**
   * send password reset email
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   */
  static async resetPasswordByEmail(req, res) {
    try {
      const { email } = req.body;
      const user = await findUser({ email });
      if (!user) return errorResponse(res, { code: 404, message: 'Sorry, we do not recognise this user in our database' });
      /**
       * REMEMBER TO UNCOMMENT LINE BELOW BEFORE PRODUCTION
       */
      // const emailSent = await sendPasswordResetEmail(req, user);
      /**
       * REMEMBER TO DELETE LINE BELOW BEFORE PRODUCTION
       */
      const emailSent = true;
      if (emailSent) return successResponse(res, { message: 'A password reset link has been sent to your email' });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
   * verify password reset link
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   */
  static async verifyPasswordReset(req, res) {
    try {
      const { token } = req.query;
      res.cookie('token', token, { maxAge: 70000000, httpOnly: true });
      const tokenData = verifyToken(token);
      if (tokenData) {
        const url = `${req.protocol}s://${req.get('host')}/v1.0/api/auth/reset-password`;
        successResponse(res, { message: `success, redirect to ${url} with password objects` });
      }
    } catch (error) {
      if (error.message === 'Invalid Token') {
        return errorResponse(res, { code: 400, message: 'The token provided was invalid' });
      }
      const status = error.status || 500;
      errorResponse(res, { code: status, message: `could not verify, ${error.message}` });
    }
  }
}

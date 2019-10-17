import { Toolbox, ApiError } from '../utils';
import db from '../models';

const { hashPassword } = Toolbox;
const { User } = db;

/**
 * Service interface for User db model
 */
export default class UserService {
  /**
   * Add new user to database
   * @static
   * @param {object} user - new user object
   * @returns {Promis-Object} A promise object with user details
   * @memberof UserService
   */
  static async addUser(user) {
    user.password = hashPassword(user.password);
    const { dataValues: addedUser } = await User.create(user);
    return addedUser;
  }

  /**
   * find user in database
   * @param {object} keys - object containing query key and value
   * e.g { id: 5 }
   * @returns {promise-Object} - A promise object with user detauls
   * @memberof UserService
   */
  static async findUser(keys) {
    return User.findOne({ where: keys });
  }

  /**
   * update user key given an option
   * @param {object} updateData - data to update
   * @param {object} keys - query key to update
   * @returns {promise-object | error} A promise object with user detail
   * @memberof UserService
   */
  static async updateBykey(updateData, keys) {
    const [rowaffected, [user]] = await User.update(updateData, { returning: true, where: keys });
    if (!rowaffected) throw new ApiError(404, 'Not Found');
    return user.dataValues;
  }

  /**
   * delete user key given an option
   * @param {object} keys - query key to delete
   * @returns {promise-object | error} A number showing how many rows were deleted
   * @memberof UserService
   */
  static async deleteBykey(keys) {
    const numberOfRowsDeleted = await User.destroy({ where: keys });
    if (!numberOfRowsDeleted) throw new ApiError(404, 'Not Found');
    return true;
  }
}

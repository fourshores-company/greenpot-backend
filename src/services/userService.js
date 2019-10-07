import { Toolbox } from '../utils';
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
}

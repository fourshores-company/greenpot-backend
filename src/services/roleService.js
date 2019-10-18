import db from '../models';
import { ApiError } from '../utils';

const { RoleUser } = db;

/**
 * Service interface for RoleUser db model
 */
export default class RoleService {
  /**
   * assing role
   * @param {object} userId
   * @param {object} roleId
   * @returns {Promise-Object} - promise object with role detail
   * @memberof RoleService
   */
  static async assignRole(userId, roleId) {
    const { dataValues: assinged } = await RoleUser.create({ userId, roleId });
    return assinged;
  }

  /**
   * find roles by userId or users by roleId
   * @param {object} keys
   * @returns {Promise-object} - promise object with roles assigned to user
   * @memberof RoleService
   */
  static async findRoleUser(keys) {
    const [{ dataValues: values }] = await RoleUser.findAll({ where: keys });
    return values;
  }

  /**
   * update role in database
   * @param {object} userId
   * @param {object} roleId
   * @returns {Promise-object} A promise object with updated roles
   * @memberof RoleService
   */
  static async updateRole(userId, roleId) {
    const [rowaffected, [user]] = await RoleUser.update({ roleId }, { returning: true, where: { userId } });
    if (!rowaffected) throw new ApiError(404, 'Not Found');
    return user.dataValues;
  }
}

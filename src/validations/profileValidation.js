import joi from '@hapi/joi';
import { validationData } from '../utils';

/**
 * validation class for user profile
 * @class ProfileValidation
 */
export default class ProfileValidation {
  /**
   * object for vvalidation profile data
   * @param {object} user - user object
   * @returns {object | boolean} - returns an error object or valid boolean
   */
  static async validateProfile(user) {
    const schema = {
      firstName: joi.string().min(3).max(25)
        .label('Please enter a valid firstname \n the field must not be empty and it must be more than 2 letters'),
      lastName: joi.string().min(3).max(25)
        .label('Please enter a valid lastname \n the field must not be empty and it must be more than 2 letters'),
      gender: joi.string().valid('male', 'female')
        .label('please input a gender (male or female)'),
      birthDate: joi.date().iso().label('Please input a valid date format: yy-mm-dd'),
      addressLine1: joi.string().min(3).max(60).regex(/^[\w',-\\/.\s]*$/)
        .label('Please enter a valid address that is within 3 to 60 characters long'),
      addressLine2: joi.string().min(3).max(60).regex(/^[\w',-\\/.\s]*$/)
        .label('Please enter a valid address that is within 3 to 60 characters long'),
      city: joi.string().min(3).max(25).label('Please input a city name'),
      state: joi.valid(validationData.states).label('Please input a valid state name'),
      country: joi.string().min(3).max(50).label('Please input a country'),
      zip: joi.string().min(3).max(6).label('Please input a zip code'),
      phoneNumber: joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).label('Please input a valid phone number')
    };
    const { error } = joi.validate({ ...user }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }

  /**
   * object for vvalidation user id
   * @param {number} id - user id
   * @returns {object | boolean} - returns an error object or valid boolean
   */
  static async validateUserId(id) {
    const schema = {
      id: joi.number().integer().min(1),
    };
    const { error } = joi.validate({ id }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }
}

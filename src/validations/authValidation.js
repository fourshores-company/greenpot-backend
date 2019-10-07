import joi from '@hapi/joi';
import passwordComplexity from 'joi-password-complexity';

// password complexity object
const complexityOptions = {
  min: 8,
  max: 250,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3,
};

/**
 * User authentication validation class
 * @class AuthValidation
 */
export default class AuthValidation {
  /**
   * validate user parameters during signup
   * @param {object} userObject - the user object
   * @returns {object | boolean} - returns a boolean if validation passes
   * or an error object
   */
  static async validateUserSignup(userObject) {
    const schema = {
      firstName: joi.string().min(3).max(25).required()
        .label('Please enter a valid firstname \n the field must not be empty and it must be more than 2 letters'),
      lastName: joi.string().min(3).max(25).required()
        .label('Please enter a valid lastname \n the field must not be empty and it must be more than 2 letters'),
      email: joi.string().email().required()
        .label('Please enter a valid company email address'),
      password: new passwordComplexity(complexityOptions).required()
        .label('Password is required. \n It should be more than 8 characters, and should include at least a capital letter, and a number'),
      gender: joi.string().valid('male', 'female')
        .label('please input a gender (male or female)'),
      birthDate: joi.date().iso().label('Please input a valid date format: yy-mm-dd'),
      addressLine1: joi.string().min(3).max(60).regex(/^[\w',-\\/.\s]*$/)
        .required()
        .label('Please enter a valid address that is within 3 to 60 characters long'),
      addressLine2: joi.string().min(3).max(60).regex(/^[\w',-\\/.\s]*$/)
        .required()
        .label('Please enter a valid address that is within 3 to 60 characters long'),
      city: joi.string().min(3).max(25).label('Please input a city name'),
      state: joi.string().min(3).max(25).label('Please input a state name'),
      country: joi.string().min(3).max(50).label('Please input a country'),
      phoneNumber: joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).label('Please input a valid phone number')
    };
    const { error } = joi.validate({ ...userObject }, schema);
    if (error) {
      throw error.details[0].context.label;
    }
    return true;
  }
}

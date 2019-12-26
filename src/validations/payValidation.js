import joi from '@hapi/joi';


const address = joi.string().min(3).max(200).regex(/^[\w',-\\/.\s]*$/)
  .required()
  .label('Please enter a strring');

/**
 * validation class for payments
 * @class PayValidation
 */
export default class PayValidation {
  /**
   *
   * @param {object} payload - object to be validated
   * @returns {object | boolean} - returns an error object or valid boolean
   */
  static validateParameters(payload) {
    const schema = {
      address
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }
}

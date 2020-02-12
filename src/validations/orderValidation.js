import joi from '@hapi/joi';

/**
 * validation class for Orers
 * @class OrderValidations
 */
export default class OrderValidations {
  /**
   * validation for parameters on update of order status
   * @param {object} payload
    * @returns {object | boolean} - returns an error object or valid boolean
    * @memberof OrderValidations
   */
  static validateParameters(payload) {
    const schema = {
      id: joi.number().positive().required().label('Please enter a positive number'),
      status: joi.string().valid('pending', 'completed')
        .label('please input a status (completed or pending)'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }

  /**
   * validate query parameters
   * @param {object} payload
   * @returns {object | boolean} - returns an error object or valid boolean
   * @memberof OrderValidations
   */
  static validateQuery(payload) {
    const schema = {
      status: joi.string().valid('pending', 'completed')
        .label('please input a status (completed or pending)'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }

  /**
   * validate feedback
   * @param {object} payload
   * @returns {object | boolean} - returns an error object or valid boolean
   * @memberof OrderValidations
   */
  static validateFeedback(payload) {
    const schema = {
      id: joi.number().positive().required().label('Please enter a positive number'),
      feedback: joi.string().min(10).max(500).regex(/^[\w',-\\/.\s]*$/)
        .required()
        .label('Please enter a valid feedback. more than 10 characters and less than 500'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }
}

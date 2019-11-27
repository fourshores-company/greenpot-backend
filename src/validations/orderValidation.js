import joi from '@hapi/joi';

const mealObject = joi.object().keys({
  mealId: joi.number().integer().min(1),
  quantity: joi.number().integer().min(1),
});
const meals = joi.array().items(mealObject);
/**
 * validation class for Orers
 * @class OrderValidations
 */
export default class OrderValidations {
  /**
   *
   * @param {object} payload - object to be validated
   * @returns {object | boolean} - returns an error object or valid boolean
   */
  static createOrderValidation(payload) {
    const schema = {
      meals
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }
}

import joi from '@hapi/joi';

const mealObject = joi.object().keys({
  mealId: joi.number().integer().min(1),
  quantity: joi.number().integer().min(1),
});
const meals = joi.array().items(mealObject);
/**
 * validation class for Orers
 * @class CartValidations
 */
export default class CartValidations {
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

  /**
    * validation for parameters on deleting a meal
    * @param {object} payload
    * @returns {object | boolean} - returns an error object or valid boolean
    * @memberof OrderValidations
    */
  static validateMeal(payload) {
    const schema = {
      mealId: joi.number().positive().required().label('Please enter a positive number'),
      quantity: joi.number().positive().label('Please enter a positive number'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }
}

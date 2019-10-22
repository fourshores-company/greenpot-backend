import joi from '@hapi/joi';

const name = joi.string().min(3).max(30).required()
  .label('Please enter a valid name \n the field must not be empty and it must be more than 2 letters');
const unit = joi.string().min(3).max(60).regex(/^(grams|kilograms|litres)$/i)
  .required()
  .label('Please enter a valid unit: grams, kilograms, litres. A space should separate the number and unit');

/**
 * validation class for Ingredients
 * @class IngredientValidations
 */
export default class IngredientValidations {
  /**
   * object for adding ingredients
   * @param {object} payload - object to be validated
   * @returns {object | boolean} - returns an error object or valid boolean
   */
  static addIngredientValidation(payload) {
    const schema = {
      name,
      unit,
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }

  /**
   * object for updating ingredients
   * @param {object} payload
   * @returns {object | boolean} - returns error object or validation boolean
   */
  static validateIngredient(payload) {
    const schema = {
      name: joi.string().min(3).max(30)
        .label('Please enter a valid name \n the field must not be empty and it must be more than 2 letters'),
      unit: joi.string().min(3).max(60).regex(/^(grams|kilograms|litres)$/i)
        .label('Please enter a valid unit: grams, kilograms, litres. A space should separate the number and unit')
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }
}

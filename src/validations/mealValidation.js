import joi from '@hapi/joi';

const name = joi.string().min(3).max(30).required()
  .label('Please enter a valid name \n the field must not be empty and it must be more than 2 letters');
const recipe = joi.string().uri().required().label('Please upload an link to recipe');
const price = joi.number().required().label('Please add price of meal');
const prepTime = joi.string().min(3).max(60).regex(/^\d+\s(hours|minutes)$/i)
  .required()
  .label('Please enter a valid prep Time with format: \'x minutes\' or \'y hours\'');
const imageUrl = joi.string().uri().required().label('Please upload an Image of the meal');
const number = joi.number().positive().required().label('Please enter a positive number');
/**
 * validation class for meals
 * @class MealValidation
 */
export default class MealValidation {
  /**
   * validation for adding a meal
   * @param {object} mealObject
   * @returns {object | boolean} - returns an error object or valid boolean
   * @memberof MealValidation
   */
  static validateMeal(mealObject) {
    const schema = {
      name,
      recipe,
      price,
      prepTime,
      imageUrl,
    };
    const { error } = joi.validate({ ...mealObject }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }

  /**
   * validation for parameters on add ingredient
   * @param {object} payload
   * @returns {object | boolean} - returns an error object or valid boolean
   * @memberof MealValidation
   */
  static validateMealParameters(payload) {
    const schema = {
      mealId: number,
      ingredientId: number,
      ingredientQuantity: number,
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }
}

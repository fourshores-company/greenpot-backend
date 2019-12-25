import Paystack from 'paystack';
import env from '../config/env';

const {
  PAYSTACK_TEST_SECRET_KEY
} = env;

const paystack = Paystack(PAYSTACK_TEST_SECRET_KEY);
/**
 * Methods for payments class
 * @class Payments
 */
export default class Payments {
  /**
   * create user payment url via paystack
   * @param {obj} payload - { email, amount, }
   * @returns {JSON} - Returns json with paystack url
   * @memberof Payments
   */
  static async viaPaystack(payload) {
    const { email, amount, metadata } = payload;
    let stackBody;
    try {
      await paystack.transaction.initialize({
        email,
        amount,
        metadata,
      }).then((body) => {
        // console.log('paystack body: ', body);
        stackBody = body;
      });
      return stackBody;
    } catch (error) {
      return error;
    }
  }

  /**
   * validate user payment via paystack
   * @param {string} reference - paystack reference
   * @returns {Promise<boolean>} - Returns json with payment details
   * @memberof Payments
   */
  static async validatePaystack(reference) {
    let stackBody;
    try {
      await paystack.transaction.verify(reference).then((body) => {
        // console.log('paystack body: ', body);
        stackBody = body;
      });
      return stackBody;
    } catch (error) {
      return error;
    }
  }
}

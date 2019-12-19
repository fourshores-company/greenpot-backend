import Paystack from 'paystack';
import env from '../config/env';

const {
  PAYSTACK_TEST_SECRET_KEY
} = env;

const paystack = Paystack(PAYSTACK_TEST_SECRET_KEY);
/**
 * Methods for payments class
 * payments use paystack
 * @class Payments
 */
export default class Payments {
  /**
   * validate user payments via paystack
   * @param {obj} payload - { email, amount, }
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Payments
   */
  static async viaPaystack(payload) {
    const { email, amount } = payload;
    let stackBody;
    try {
      await paystack.transaction.initialize({
        email,
        amount,
      }).then((body) => {
        // console.log('paystack body: ', body);
        stackBody = body;
      });
      return stackBody;
    } catch (error) {
      return error;
    }
  }
}

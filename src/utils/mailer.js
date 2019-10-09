import sendgrid from '@sendgrid/mail';
import env from '../config/env';
import Toolbox from './toolbox';

const {
  ADMIN_EMAIL, SENDGRID_KEY
} = env;
const {
  createVerificationLink
} = Toolbox;

sendgrid.setApiKey(SENDGRID_KEY);


/**
 * Methods for mailer class
 * mailer uses sengrid
 * @class Mailer
 */
export default class Mailer {
  /**
   * Send email verification to user after signup
   * @param {object} req
   * @param {object} user - { id, email, firstName ...etc}
   * @returns {Promise<boolean>} - Returns true if mail is send, false if not
   * @memberof Mailer
   */
  static async sendVerificationEmail(req, user) {
    const { id, email, firstName } = user;
    const verificationLink = createVerificationLink(req, { id, email });
    const mail = {
      to: email,
      from: ADMIN_EMAIL,
      templateId: 'd-beee2089c3ef484c92a6029a2884e1b5',
      dynamic_template_data: {
        name: firstName,
        verification_link: verificationLink
      }
    };
    try {
      await sendgrid.send(mail);
      return true;
    } catch (e) {
      return false;
    }
  }
}

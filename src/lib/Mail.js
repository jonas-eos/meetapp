/**
 * @overview Mail lib
 * This files manipulate nodemailer lib to send mail.
 *
 * @requires nodeMailer
 *
 * @requires src/config/mail
 */
import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  /**
   * @method sendMail
   *
   * @description
   * Send a mail with a message to a destination mail.
   *
   * @param message
   *
   */
  sendMail(message) {
    return this.transport.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();

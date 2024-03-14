import { Service } from 'typedi';
import { TransportOptions, createTransport } from 'nodemailer';

import * as C from '../constants';
import { IAppUser, IVerifyUser } from 'interfaces/user.interface';

const trasporter = createTransport({
  host: C.SMTP_SERVER,
  port: C.SMTP_PORT,
  auth: {
    user: C.SMTP_LOGIN,
    pass: C.SMTP_KEY,
  },
} as TransportOptions);

@Service()
export class NotificationService {
  /**
   * @method sendEmail
   * @private
   * @async
   * @param {string} to
   * @param {string} subject
   * @param {string} text
   * @returns {Promise<void>}
   */
  private async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: `Location Tracker <${C.SMTP_LOGIN}>`,
      to,
      subject,
      text,
    };
    try {
      await trasporter.sendMail(mailOptions);
    } catch (e) {
      console.error('Failed to send email:', e);
      throw new Error('Email sending failed');
    }
  }

  /**
   * @method sendVerificationEmail
   * @async
   * @param {IUser} user
   * @param {string} token
   * @returns {Promise<void>}
   */
  async sendVerificationEmail(user: IVerifyUser, token: string): Promise<void> {
    const text = `Hello ${user.firstName} ${user.lastName}\n\n Please verify your account by clicking the link: ${C.SERVER_LINK}/?token=${token}\n\nThank you!\nLocation Tracker`;
    await this.sendEmail(user.emailAddress, 'Account Verification for Location Tracker', text);
  }

  /**
   * @method sendForgotPasswordEmail
   * @async
   * @param {IUser} user
   * @param {string} token
   * @returns {Promise<void>}
   */
  async sendForgotPasswordEmail(user: IAppUser, token: string): Promise<void> {
    const text = `Hello ${user.firstName} ${user.lastName}\n\n Please reset your password by clicking the link: ${C.APP_LINK}/forgot-password/?t=${token}\n\nThank you!\nLocation Tracker`;
    await this.sendEmail(user.emailAddress, 'Reset Password for Location Tracker', text);
  }
}

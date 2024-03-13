import { Service } from 'typedi';
import * as C from '../constants';
import { IAppUser } from 'interfaces/user.interface';
import { createTransport } from 'nodemailer';

const trasporter = createTransport({
  host: C.SMTP_SERVER,
  port: C.SMTP_PORT,
  auth: {
    user: C.SMTP_LOGIN,
    pass: C.SMTP_KEY,
  },
});

@Service()
export class NotificationService {
  /**
   * @method sendVerificationEmail
   * @async
   * @param {IUser} user
   * @param {string} token
   * @returns {Promise<void>}
   */
  async sendVerificationEmail(user: IAppUser, token: string): Promise<void> {
    const mailOptions = {
      from: `Location Tracker <${C.SMTP_LOGIN}>`,
      to: user.emailAddress,
      subject: 'Account Verification for Location Tracker',
      text: `Hello ${user.firstName} ${user.lastName}\n\n Please verify your account by clicking the link: ${C.SERVER_LINK}/?token=${token}\n\nThank you!\nLocation Tracker`,
    };
    try {
      await trasporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Email sending failed');
    }
  }

  /**
   * @method sendForgotPasswordEmail
   * @async
   * @param {IUser} user
   * @param {string} token
   * @returns {Promise<void>}
   */
  async sendForgotPasswordEmail(user: IAppUser, token: string): Promise<void> {
    const mailOptions = {
      from: `Location Tracker <${C.SMTP_LOGIN}>`,
      to: user.emailAddress,
      subject: 'Reset Password for Location Tracker',
      text: `Hello ${user.firstName} ${user.lastName}\n\n Please reset your password by clicking the link: ${C.APP_LINK}/forgot-password/?token=${token}\n\nThank you!\nLocation Tracker`,
    };

    await trasporter.sendMail(mailOptions);
  }

  /**
   * @method sendForgotPasswordEmail
   * @async
   * @param {IUser} user
   * @param {string} token
   * @returns {Promise<void>}
   */
  async sendForgotPasswordEmail(user: IAppUser, token: string): Promise<void> {
    const mailOptions = {
      from: C.SMTP_LOGIN,
      to: user.emailAddress,
      subject: 'Reset Password for Location Tracker',
      text: `Hello ${user.firstName} ${user.lastName}\n\n Please reset your password by clicking the link: ${C.APP_LINK}/forgot-password/?token=${token}\n\nThank you!\nLocation Tracker`,
    };

    await trasporter.sendMail(mailOptions);
  }
}

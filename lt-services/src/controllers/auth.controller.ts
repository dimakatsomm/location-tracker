import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';

import * as C from '../constants';
import { ICredentials, INewUser, IVerifyUser } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { mapUserToAppUser } from '../mappers/auth.mapper';
import { handleError } from 'utils/error.utils';
import { generateJwtToken } from 'utils/auth.utils';

@Service()
export class AuthController {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private userService: UserService,
    @Inject() private notificationService: NotificationService,
  ) {}

  /**
   * @method register
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  register = async (req: Request, res: Response) => {
    try {
      const newUser = req.body as INewUser;
      const userExists = await this.userService.getUserWithUsernameOrEmail({
        username: newUser.username,
        emailAddress: newUser.emailAddress,
        password: '',
      });
      if (userExists) {
        return res.status(409).json({ status: false, data: { message: `Username or email address is already in use.` } });
      }

      const user: IVerifyUser = await this.userService.register(newUser);

      const token = generateJwtToken({ userId: user.id, email: user.emailAddress }, C.JWT_VERIFY_EXPIRES_IN);
      await this.notificationService.sendVerificationEmail(user, token);

      return res.status(201).json({ status: true, data: { message: `Account verification link has been sent.` } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      handleError(res, e);
    }
  };

  /**
   * @method verify
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  verify = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.validateUser(req.auth.userId, req.auth.email || '');
      if (!user) {
        return res.status(404).json({ status: false, data: { message: `User does not exist.` } });
      }

      if (user.verified) {
        return res.status(208).json({ status: true, data: { message: `User already verified. Please login.` } });
      }

      await this.userService.verifyUserAccount(user.id);

      return res.status(302).redirect(`${C.APP_LINK}/verified`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      handleError(res, e);
    }
  };

  /**
   * @method resendVerification
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  resendVerification = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.checkIfUserExistsByEmail((req.query.email as string) || '');
      if (!user) {
        return res.status(404).json({ status: false, data: { message: `User does not exist.` } });
      }

      if (user.verified) {
        return res.status(208).json({ status: true, data: { message: `User already verified. Please login.` } });
      }

      const token = generateJwtToken({ userId: user.id, email: user.emailAddress }, C.JWT_VERIFY_EXPIRES_IN);
      await this.notificationService.sendVerificationEmail(user, token);

      return res.status(200).json({ status: true, data: { message: `Account verification link has been sent.` } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      handleError(res, e);
    }
  };

  /**
   * @method login
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  login = async (req: Request, res: Response) => {
    try {
      const loginUser = req.body as ICredentials;
      if (!loginUser?.username && !loginUser?.emailAddress) {
        return res.status(404).json({ status: false, data: { message: `No username or email provided for login.` } });
      }
      const user = await this.userService.getUserWithUsernameOrEmail(loginUser);
      if (!user) {
        return res.status(400).json({ status: false, data: { message: `User login details provided are incorrect.` } });
      }

      const correctPassword: boolean = await compare(loginUser.password, user.password);
      if (!correctPassword) {
        return res.status(403).json({ status: false, data: { message: `User login details provided are incorrect.` } });
      }

      const token = generateJwtToken({ userId: user.id }, C.JWT_LOGIN_EXPIRES_IN);

      return res.status(200).json({ status: true, data: { user: mapUserToAppUser(user), token } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      handleError(res, e);
    }
  };

  /**
   * @method forgotPassword
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  forgotPassword = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.checkIfUserExistsByEmail(req.query.email as string);
      if (!user) {
        return res.status(404).json({ status: false, data: { message: `User does not exist.` } });
      }

      if (!user.verified) {
        return res.status(403).json({ status: false, data: { message: `Account not verified. Please verify account.` } });
      }

      const token = generateJwtToken({ userId: user.id, email: user.emailAddress }, C.JWT_FORGOT_PASSWORD_EXPIRES_IN);

      await this.notificationService.sendForgotPasswordEmail(user, token);

      return res.status(200).json({ status: true, data: { message: `Password reset link has been sent.` } });
    } catch (e) {
      handleError(res, e);
    }
  };

  /**
   * @method resetPassword
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  resetPassword = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.checkIfUserExists(req.auth.userId);
      if (!user) {
        return res.status(404).json({ status: false, data: { message: `User does not exist.` } });
      }

      if (!user.verified) {
        return res.status(403).json({ status: false, data: { message: `Account not verified. Please verify account.` } });
      }

      await this.userService.updatePassword(user.id, req.body.password);

      return res.status(302).redirect(`${C.APP_LINK}/login`);
    } catch (e) {
      handleError(res, e);
    }
  };
}

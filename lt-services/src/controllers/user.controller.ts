import { compare } from 'bcrypt';
import { IUser } from 'database/types/user.type';
import { NextFunction, Request, Response } from 'express';
import { IAppUser, ILoginUser, INewUser } from 'interfaces/user.interface';
import { sign } from 'jsonwebtoken';
import { UserService } from 'services/user.service';
import * as C from '../constants';
import { Inject, Service } from 'typedi';

@Service()
export class UserController {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private userService: UserService) {}

  /**
   * @method register
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = req.body as INewUser;
      const userExists = await this.userService.getUserWithUsernameOrEmail({ username: newUser.username, emailAddress: newUser.emailAddress, password: '' });
      if (!!userExists) {
        return res.status(404).json({ status: false, data: { message: `Username or email address is already in use.`}});
      }

      const user: IAppUser = await this.userService.register(newUser);

      const token = sign({ userId: user.id }, C.JWT_SECRET_KEY, { expiresIn: '1h'});

      return res.status(201).json({ status: true, data: { user, token } });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  /**
   * @method login
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginUser = req.body as ILoginUser;
      if (!loginUser?.username && !loginUser?.emailAddress) {
        return res.status(404).json({ status: false, data : { message: `No username or email provided for login.` }});
      }
      const user: IUser = await this.userService.getUserWithUsernameOrEmail(loginUser);
      if (!user) {
        return res.status(403).json({ status: false, data : { message: `User login details provided are incorrect.` }});
      }

      const correctPassword: boolean = await compare(loginUser.password, user.password);
      if (!correctPassword) {
        return res.status(403).json({ status: false, data : { message: `User login details provided are incorrect.` }});
      }

      const token = sign({ userId: user.id }, C.JWT_SECRET_KEY, { expiresIn: '1h'});

      return res.status(200).json({ status: true, data: { user, token }});
    } catch (e) {
      console.error(e);
      return res.status(500).json({ status: false, data: e });
    }
  };
}

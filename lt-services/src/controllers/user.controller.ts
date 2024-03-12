import { NextFunction, Request, Response } from 'express';
import { IAppUser, ILoginUser, INewUser } from 'interfaces/user.interface';
import { UserService } from 'services/user.service';
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
      const user: IAppUser = await this.userService.register(newUser);

      return res.status(200).json({ status: true, data: user });
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
      const user: IAppUser = await this.userService.login(loginUser);

      return res.status(200).json({ status: true, data: user });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}

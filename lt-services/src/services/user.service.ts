import { User } from 'database/models/user.model';
import { IUser } from 'database/types/user.type';
import { IAppUser, ILoginUser, INewUser } from 'interfaces/user.interface';
import { Service } from 'typedi';

@Service()
export class UserService {
  /**
   * @method register
   * @async
   * @param {INewUser} newUser
   * @returns {Promise<IUser>}
   */
  async register(newUser: INewUser): Promise<IAppUser> {
    return (await User.create(newUser)) as IAppUser;
  }

  /**
   * @method getUserWithUsernameOrEmail
   * @param {ILoginUser} user
   * @returns {Promise<IUser>}
   */
  getUserWithUsernameOrEmail(user: ILoginUser): Promise<IUser | null> {
    return User.findOne({ $or: [{ username: user.username }, { emailAddress: user.emailAddress }] });
  }

  /**
   * @method checkIfUserExists
   * @param {string} userId
   * @returns {Promise<IUser>}
   */
  checkIfUserExists(userId: string): Promise<IUser | null> {
    return User.findOne({ id: userId });
  }
}

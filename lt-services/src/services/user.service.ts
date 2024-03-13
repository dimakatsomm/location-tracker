import { Service } from 'typedi';
import { User } from '../database/models/user.model';
import { IUser } from '../database/types/user.type';
import { IAppUser, ICredentials, INewUser } from '../interfaces/user.interface';

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
   * @param {ICredentials} user
   * @returns {Promise<IUser>}
   */
  getUserWithUsernameOrEmail(user: ICredentials): Promise<IUser | null> {
    return User.findOne({ $or: [{ username: user.username }, { emailAddress: user.emailAddress }] });
  }

  /**
   * @method checkIfUserExists
   * @param {string} userId
   * @returns {Promise<IUser>}
   */
  checkIfUserExists(userId: string): Promise<IUser | null> {
    return User.findOne({ _id: userId });
  }

  /**
   * @method validateUser
   * @param {string} userId
   * @param {string} emailAddress
   * @returns {Promise<IUser>}
   */
  validateUser(userId: string, emailAddress: string): Promise<IUser | null> {
    return User.findOne({ $and: [{ _id: userId, emailAddress }] });
  }

  /**
   * @method verifyUserAccount
   * @async
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async verifyUserAccount(userId: string): Promise<void> {
    await User.updateOne({ _id: userId }, { verified: true });
  }
}

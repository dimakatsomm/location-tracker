import { Service } from 'typedi';
import { genSalt, hashSync } from 'bcrypt';
import { User } from '../database/models/user.model';
import { IUser } from '../database/types/user.type';
import { ICredentials, INewUser, IVerifyUser } from '../interfaces/user.interface';
import * as C from '../constants';

@Service()
export class UserService {
  /**
   * @method register
   * @async
   * @param {INewUser} newUser
   * @returns {Promise<IVerifyUser>}
   */
  async register(newUser: INewUser): Promise<IVerifyUser> {
    const user = (await User.create(newUser))
    await this.updatePassword(user.id, newUser.password);
    return user as IVerifyUser;
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
   * @method checkIfUserExistsByEmail
   * @param {string} email
   * @returns {Promise<IUser>}
   */
  checkIfUserExistsByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ emailAddress: email });
  }

  /**
   * @method validateUser
   * @param {string} userId
   * @param {string} emailAddress
   * @returns {Promise<IUser>}
   */
  validateUser(userId: string, emailAddress: string): Promise<IUser | null> {
    return User.findOne({ _id: userId, emailAddress });
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

  /**
   * @method verifyUserAccount
   * @async
   * @param {string} userId
   * @param {string} password
   * @returns {Promise<void>}
   */
  async updatePassword(userId: string, password: string): Promise<void> {
    const salt = await genSalt(C.SALT_WORK_FACTOR);
    const hashedPassword = await hashSync(password, salt);
    await User.updateOne({ _id: userId }, { password: hashedPassword });
  }
}

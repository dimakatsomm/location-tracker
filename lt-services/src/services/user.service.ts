import { compare } from "bcrypt";
import { User } from "database/models/user.model";
import { IUser } from "database/types/user.type";
import { IAppUser, ILoginUser, INewUser } from "interfaces/user.interface";
import { Service } from "typedi";

@Service()
export class UserService {
  /**
   * @method register
   * @async
   * @param {INewUser} newUser
   * @returns {Promise<IUser>}
   */
  async register(newUser: INewUser): Promise<IAppUser> {
    let userExists = await this.checkIfUserExists(newUser.username, newUser.emailAddress);
    if (userExists) {
        throw new Error(`Username or email address is already in use.`)
    }
    return User.create(newUser) as IAppUser;
  }

  /**
   * @method login
   * @async
   * @param {INewUser} user
   * @returns {Promise<IUser>}
   */
  async login(user: ILoginUser): Promise<IAppUser> {
    if (!user?.username && !user?.emailAddress) {
        throw new Error(`No username or email provided for login.`);
    }

    const u: IUser = User.findOne( $or: [{ username: user.username }, { emailAddress: user.emailAddress }]);
    const correctPassword: boolean = await compare(user.password, u.password);
    if (!correctPassword) {
        throw new Error(`User login details provided are incorrect.`);
    }
    

    return u as IAppUser;
  }

  /**
   * @method checkIfUserExists
   * @async
   * @private
   * @param {string} username
   * @param {string} emailAddress
   * @returns {Promise<boolean>}
   */
  private async checkIfUserExists(username: string, emailAddress: string): Promise<boolean> {
    const user = await User.findOne( $or: [{ username }, { emailAddress }]);
    return !!user;
  }
}

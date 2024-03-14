import { UserService } from '../../services/user.service';
import { User } from '../../database/models/user.model';
import * as C from '../../constants';
import { jest } from '@jest/globals';

jest.mock('../database/models/user.model');

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and hash their password', async () => {
      const newUser = { username: 'testUser', password: 'password123', emailAddress: 'test@example.com' };
      User.create = jest.fn().mockResolvedValue(newUser);
      userService.updatePassword = jest.fn();

      const result = await userService.register(newUser);

      expect(User.create).toHaveBeenCalledWith(newUser);
      expect(userService.updatePassword).toHaveBeenCalledWith(expect.any(String), newUser.password);
      expect(result).toEqual(expect.objectContaining({ username: 'testUser', emailAddress: 'test@example.com' }));
    });
  });

  describe('getUserWithUsernameOrEmail', () => {
    it('should find a user by username or email', async () => {
      const credentials = { username: 'testUser', emailAddress: 'test@example.com' };
      User.findOne = jest.fn().mockResolvedValue(credentials);

      const result = await userService.getUserWithUsernameOrEmail(credentials);

      expect(User.findOne).toHaveBeenCalledWith({ $or: [{ username: credentials.username }, { emailAddress: credentials.emailAddress }] });
      expect(result).toEqual(credentials);
    });
  });

  // Additional tests for checkIfUserExists, checkIfUserExistsByEmail, validateUser, verifyUserAccount, and updatePassword methods follow a similar pattern.
  // Ensure to mock User model methods and any other dependencies as needed.
});

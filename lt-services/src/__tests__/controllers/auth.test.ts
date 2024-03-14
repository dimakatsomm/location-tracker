import { AuthController } from '../../controllers/auth.controller';
import { Request, Response } from 'express';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { sign } from 'jsonwebtoken';
import * as C from '../../constants';

// Mock services
const mockedUserService = mockDeep<UserService>();
const mockedNotificationService = mockDeep<NotificationService>();

// Helper to create a mock Express response
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController', () => {
  let controller: AuthController;
  let req: Partial<Request>;
  let res: Response;

  beforeEach(() => {
    mockReset(mockedUserService);
    mockReset(mockedNotificationService);
    controller = new AuthController(mockedUserService, mockedNotificationService);
    res = mockResponse();
  });

  describe('register', () => {
    // Example test for the register method
    it('should return 409 if user exists', async () => {
      req = {
        body: { username: 'testUser', emailAddress: 'test@example.com', password: 'password123' },
      };
      mockedUserService.getUserWithUsernameOrEmail.mockResolvedValueOnce(true); // Simulate user exists

      await controller.register(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ status: false, data: { message: `Username or email address is already in use.` } });
    });

    // Add more tests here for different scenarios...
  });

  // Add tests for verify, resendVerification, login, forgotPassword, resetPassword...
});

import { NotificationService } from '../../services/notification.service';
import { Service } from 'typedi';
import * as nodemailer from 'nodemailer';
import * as C from '../../constants';

jest.mock('nodemailer');
const mockedCreateTransport = nodemailer.createTransport as jest.MockedFunction<typeof nodemailer.createTransport>;

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let mockTransporter: { sendMail: jest.Mock };

  beforeEach(() => {
    mockTransporter = { sendMail: jest.fn() };
    mockedCreateTransport.mockReturnValue(mockTransporter as any);
    notificationService = Service.of(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('should send a verification email successfully', async () => {
      const user = { emailAddress: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      const token = 'test-token';

      await notificationService.sendVerificationEmail(user, token);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: `Location Tracker <${C.SMTP_LOGIN}>`,
        to: user.emailAddress,
        subject: 'Account Verification for Location Tracker',
        text: expect.stringContaining(token),
      });
    });

    it('should throw an error if sending email fails', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Email sending failed'));

      const user = { emailAddress: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      const token = 'test-token';

      await expect(notificationService.sendVerificationEmail(user, token)).rejects.toThrow('Email sending failed');
    });
  });

  describe('sendForgotPasswordEmail', () => {
    it('should send a forgot password email successfully', async () => {
      const user = { emailAddress: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      const token = 'reset-token';

      await notificationService.sendForgotPasswordEmail(user, token);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: `Location Tracker <${C.SMTP_LOGIN}>`,
        to: user.emailAddress,
        subject: 'Reset Password for Location Tracker',
        text: expect.stringContaining(token),
      });
    });

    it('should throw an error if sending email fails', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Email sending failed'));

      const user = { emailAddress: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      const token = 'reset-token';

      await expect(notificationService.sendForgotPasswordEmail(user, token)).rejects.toThrow('Email sending failed');
    });
  });
});

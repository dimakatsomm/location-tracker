import { validateUserToken, validateUser } from '../../middleware/auth.middleware';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as validator from 'validator';
import * as C from '../../constants';

jest.mock('jsonwebtoken');
jest.mock('validator');
jest.mock('../../constants', () => ({
  JWT_SECRET_KEY: 'test_secret_key',
}));

describe('Auth Middleware', () => {
  describe('validateUserToken', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      nextFunction = jest.fn();
    });

    it('should return 401 if no token is provided', () => {
      validateUserToken()(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 if token is not a valid JWT', () => {
      mockRequest.headers = { authorization: 'invalid_token' };
      validator.isJWT.mockReturnValue(false);
      validateUserToken()(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 if token verification fails', () => {
      mockRequest.headers = { authorization: 'valid_token' };
      validator.isJWT.mockReturnValue(true);
      jwt.verify.mockImplementation(() => {
        throw new Error('verification failed');
      });
      validateUserToken()(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should call next if token is valid', () => {
      mockRequest.headers = { authorization: 'valid_token' };
      validator.isJWT.mockReturnValue(true);
      jwt.verify.mockReturnValue({ userId: '123' });
      validateUserToken()(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  // Similar tests for `validateUser` function can be added here.
});
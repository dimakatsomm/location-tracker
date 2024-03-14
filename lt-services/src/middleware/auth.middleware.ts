import { NextFunction, Request, Response } from 'express';

import { redisClient } from '../index';
import { decodeToken, validateTokenPresence } from '../utils/auth.utils';
import { handleError } from '../utils/error.utils';
import { JwtPayload } from 'jsonwebtoken';

// Higher-order function for Redis token retrieval and comparison
const validateTokenWithRedis = (redisKeyPattern: string, errorMessage: string) => async (decodedToken: JwtPayload
  , token: string) => {
  const redisToken = await redisClient.get(redisKeyPattern.replace(':userId', decodedToken.userId));
  if (!redisToken || token !== redisToken) {
    throw new Error(errorMessage);
  }
};

export const validateUserSession = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req.headers['Authorization'] as string).split(' ')[1] || '';
    validateTokenPresence(token);
    const decodedToken = decodeToken(token);

    await validateTokenWithRedis(`session:user:${decodedToken.userId}`, 'Invalid user session. Access denied.')(decodedToken, token);
    req.auth = { userId: decodedToken.userId };

    next();
  } catch (e) {
    handleError(res, e);
  }
};

export const validateUser = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.query.token as string;
    validateTokenPresence(token);
    const decodedToken = decodeToken(token);

    await validateTokenWithRedis(`verification:user:${decodedToken.userId}`, 'Invalid verification token. Access denied.')(decodedToken, token);
    req.auth = { userId: decodedToken.userId, email: decodedToken.email };

    next();
  } catch (e) {
    handleError(res, e)
  }
};
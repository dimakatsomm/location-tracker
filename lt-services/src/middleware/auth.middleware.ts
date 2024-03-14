import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { isJWT } from 'validator';

import * as C from '../constants';
import { logError } from 'utils/logger.utils';

export const validateUserToken = () => (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token || !isJWT(token)) {
    return res.status(401).json({ status: false, data: { message: 'No user token provided. Access denied.' } });
  }

  try {
    const decodedToken = verify(token, C.JWT_SECRET_KEY) as JwtPayload;
    req.auth = { userId: decodedToken.userId };
  } catch (e) {
    logError(e);
    return res.status(401).json({ status: false, data: { message: 'Invalid user token. Access denied.', error: e } });
  }
  next();
};

export const validateUser = () => (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token as string;
  if (!token || !isJWT(token)) {
    return res.status(401).json({ status: false, data: { message: 'No user token provided. Access denied.' } });
  }

  try {
    const decodedToken = verify(token, C.JWT_SECRET_KEY) as JwtPayload;
    req.auth = { userId: decodedToken.userId, email: decodedToken.email };
  } catch (e) {
    logError(e);
    return res.status(401).json({ status: false, data: { message: 'Invalid user token. Access denied.', error: e } });
  }
  next();
};

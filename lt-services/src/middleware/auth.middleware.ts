import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { isJWT } from 'validator';
import * as C from '../constants';

export const validateUserToken = () => (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token || !isJWT(token)) {
    return res.status(401).json({ status: false, data: { message: 'No user token provided. Access denied.' } });
  }

  try {
    const decodedToken = verify(token, C.JWT_SECRET_KEY) as JwtPayload;
    req.auth.userId = decodedToken.userId;
  } catch (e) {
    return res.status(401).json({ status: false, data: { message: 'Invalid user token. Access denied.' } });
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
    req.auth.userId = decodedToken.userId;
    req.auth.email = decodedToken.email;
  } catch (e) {
    return res.status(401).json({ status: false, data: { message: 'Invalid user token. Access denied.' } });
  }
  next();
};

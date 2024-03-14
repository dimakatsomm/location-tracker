import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { isJWT } from 'validator';
import * as C from '../constants';
import { redisClient } from 'index';

export const validateUserToken = () => async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token || !isJWT(token)) {
    return res.status(401).json({ status: false, data: { message: 'No user token provided. Access denied.' } });
  }

  try {
    const decodedToken = verify(token, C.JWT_SECRET_KEY) as JwtPayload;

    const userToken = await redisClient.get(`session:user:${decodedToken.userId}`);
    if (!userToken) {
      return res.status(401).json({ status: false, data: { message: 'Session expired. Please login.' } });
    }

    if (token !== userToken) {
      return res.status(401).json({ status: false, data: { message: 'Invalid user session. Access denied.' } });
    }

    req.auth = { userId: decodedToken.userId };
  } catch (e) {
    console.error(e);
    return res.status(401).json({ status: false, data: { message: 'Invalid user token. Access denied.', error: e } });
  }
  next();
};

export const validateUser = () => async (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token as string;
  if (!token || !isJWT(token)) {
    return res.status(401).json({ status: false, data: { message: 'No user token provided. Access denied.' } });
  }

  try {
    const decodedToken = verify(token, C.JWT_SECRET_KEY) as JwtPayload;

    const verificationToken = await redisClient.get(`verification:user:${decodedToken.userId}`);
    if (!verificationToken) {
      return res.status(401).json({ status: false, data: { message: 'Session expired. Please login.' } });
    }

    if (token !== verificationToken) {
      return res.status(401).json({ status: false, data: { message: 'Invalid verification token. Access denied.' } });
    }

    req.auth = { userId: decodedToken.userId, email: decodedToken.email };
  } catch (e) {
    console.error(e);
    return res.status(401).json({ status: false, data: { message: 'Invalid user token. Access denied.', error: e } });
  }
  next();
};

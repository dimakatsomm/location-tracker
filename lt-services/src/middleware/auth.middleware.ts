import * as C from '../constants';
import { NextFunction, Response } from 'express';
import { IAuthUser, IJwtPayload, IUserRequest } from 'interfaces/auth.interface';
import { verify } from 'jsonwebtoken';
import { isJWT } from 'validator';

export default () => (req: Request & IAuthUser, res: Response, next: NextFunction) => {
  const token = req.headers.get('Authorization');

  if (!token || !isJWT(token)) {
    return res.status(401).json({ message: 'No user token provided. Access denied.' });
  }

  try {
    const decodedToken = verify(token, C.JWT_SECRET_KEY) as IJwtPayload;
    req.auth.userId = decodedToken.userId;
  } catch (e) {
    return res.status(401).json({ message: 'Invalid user token. Access denied.' });
  }
  next();
};

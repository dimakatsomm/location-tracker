import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IUserRequest extends Request {
  auth: {
    userId: string;
  };
}

export interface IAuthUser {
  auth: {
    userId: string;
  };
}

export interface IJwtPayload extends JwtPayload {
  userId: string;
}

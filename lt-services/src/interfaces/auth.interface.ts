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

export interface IValidateUser {
  auth: {
    userId: string;
    email: string;
  };
}
export interface IJwtAuthPayload extends JwtPayload {
  userId: string;
}

export interface IJwtValidatePayload extends JwtPayload {
  userId: string;
  email: string;
}

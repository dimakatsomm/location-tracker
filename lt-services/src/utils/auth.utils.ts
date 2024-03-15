import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { genSalt, hashSync } from 'bcrypt';
import { isJWT } from 'validator';

import * as C from '../constants';
import { redisClient } from '../index';

// Utility for token generation
export const generateJwtToken = (payload: object, expiresIn: string): string => {
  return sign(payload, C.JWT_SECRET_KEY, { expiresIn });
};

// Utility for token presence and format validation
export const validateTokenPresence = (token: string): void => {
  if (!token || !isJWT(token)) {
    throw new Error('No user token provided. Access denied.');
  }
};

// Utility for token decoding
export const decodeToken = (token: string): JwtPayload => {
  try {
    return verify(token, C.JWT_SECRET_KEY) as JwtPayload;
  } catch (e) {
    throw new Error('Invalid user token. Access denied.');
  }
};

// Utility for password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(C.SALT_WORK_FACTOR);
  return hashSync(password, salt);
};

// Utility for session storing
export const setTokenWithExpiration = async (
  key: string,
  token: string,
  expirationInSeconds: number,
): Promise<void> => {
  await Promise.all([redisClient.set(key, token), redisClient.expire(key, expirationInSeconds)]);
};

import { sign } from 'jsonwebtoken';
import * as C from '../constants';
import { genSalt, hashSync } from 'bcrypt';

export const generateJwtToken = (payload: object, expiresIn: string): string => {
  return sign(payload, C.JWT_SECRET_KEY, { expiresIn });
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(C.SALT_WORK_FACTOR);
  return hashSync(password, salt);
};

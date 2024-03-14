import 'dotenv/config';
import { env } from 'process';

export const PORT: number = Number(env.PORT || '3000');
export const MONGOURI: string = env.MONGOURI || '';
export const NODE_GEOCODER_API_KEY: string = env.NODE_GEOCODER_API_KEY || '';
export const SALT_WORK_FACTOR: number = Number(env.SALT_WORK_FACTOR || '10');
export const JWT_SECRET_KEY: string = env.JWT_SECRET_KEY || '9WSlNZMcuquKDhiR';
export const JWT_VERIFY_EXPIRES_IN: string = env.JWT_VERIFY_EXPIRES_IN || '10m';
export const JWT_FORGOT_PASSWORD_EXPIRES_IN: string = env.JWT_FORGOT_PASSWORD_EXPIRES_IN || '30m';
export const JWT_LOGIN_EXPIRES_IN: string = env.JWT_LOGIN_EXPIRES_IN || '1h';
export const APP_LINK: string = env.APP_LINK || 'http://www.google.com';
export const SERVER_LINK: string = env.SERVER_LINK || `http://localhost:${PORT}`;
export const SMTP_SERVER: string = env.SMTP_SERVER || '';
export const SMTP_PORT: string = env.SMTP_PORT || '';
export const SMTP_LOGIN: string = env.SMTP_LOGIN || '';
export const SMTP_KEY: string = env.SMTP_KEY || '';

import 'dotenv/config';
import { env } from 'process';

export const PORT: number = Number(env.PORT || '3000');
export const MONGOURI: string = env.MONGOURI || '';
export const NODE_GEOCODER_API_KEY: string = env.NODE_GEOCODER_API_KEY || '';
export const SALT_WORK_FACTOR: number = Number(env.SALT_WORK_FACTOR || '10');

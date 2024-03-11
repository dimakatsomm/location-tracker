import 'dotenv/config';
import { env } from 'process';

export const PORT: number = Number(env.PORT || '3000');
export const MONGOURI: string = env.MONGOURI || '';
export const NODE_GEOCODER_API_KEY: string = env.NODE_GEOCODER_API_KEY || '';

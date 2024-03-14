import { Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleError = (res: Response, e: any) => {
  console.error(e);
  return res.status(e.statusCode || 500).json({ status: false, data: { message: e.data?.message || e.message, error: e } });
};

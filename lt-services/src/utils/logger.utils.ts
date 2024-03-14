import moment from 'moment';
import { Logger, createLogger, format, transports } from 'winston';

const formattedDate = moment().format('YYYYMMDD');

const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new transports.File({ filename: `${formattedDate}-error.log`, level: 'error' }),
    new transports.File({ filename: `${formattedDate}-combined.log` }),
  ],
});

// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    }),
  );
}

export const logError = (e: any) => {
  logger.error(e);
};

export const logInfo = (e: any) => {
  logger.info(e);
};

export const logWarn = (e: any) => {
  logger.info(e);
};

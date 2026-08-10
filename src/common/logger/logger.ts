// src\common\logger\logger.ts
import 'winston-daily-rotate-file';
import { createLogger, format, transports } from 'winston';

/* istanbul ignore next */
const myFormat = format.printf((info) => {
  const { timestamp, module, level, message, error, ...meta } = info;
  // Les métadonnées étaient jetées : un log `graphql` s'affichait sans sa durée
  // ni son nombre de requêtes SQL, c'est-à-dire sans ce qu'il avait à dire.
  const extra = Object.entries(meta)
    .filter(([key]) => key !== 'splat' && !key.startsWith('Symbol('))
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');
  const head = `${timestamp} ${module} ${level}: ${message}`;
  if (error) return `${head} => ${error}${extra ? ` ${extra}` : ''}`;
  return extra ? `${head} ${extra}` : head;
});

// Default
const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.json(),
  ),
  defaultMeta: { module: 'gold' },
  transports: [new transports.Console()],
});

/* istanbul ignore next */
if (process.env.NODE_ENV === 'prod') {
  logger.level = 'debug';

  const transport = new transports.DailyRotateFile({
    level: 'info',
    filename: 'logs/gold-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
  });

  logger.add(transport);
} else {
  logger.level = 'debug';
  logger.transports[0].format = format.combine(
    format.errors({ stack: true }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.colorize(),
    myFormat,
  );
}

export { logger };

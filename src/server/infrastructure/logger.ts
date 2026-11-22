import 'server-only';

import { env } from '@/env';

import pino, { type LevelWithSilent, type LoggerOptions } from 'pino';

function resolveLogLevel(
  environment: string,
  configuredLevel: LevelWithSilent | undefined
): LevelWithSilent {
  if (environment === 'development') return configuredLevel ?? 'debug';
  if (environment === 'test') return 'silent';
  return configuredLevel ?? 'info';
}

const options: LoggerOptions = {
  level: resolveLogLevel(env.NODE_ENV, env.LOG_LEVEL),
  base: undefined,
  redact: {
    censor: '[Redacted]',
    paths: [
      'password',
      '*.password',
      'pass',
      '*.pass',
      'token',
      '*.token',
      'accessToken',
      '*.accessToken',
      'refreshToken',
      '*.refreshToken',
      'authorization',
      'Authorization',
      'headers.authorization',
      'headers.cookie',
      'req.headers.authorization',
      'req.headers.cookie',
      'cookie',
      'cookies',
      'BETTER_AUTH_SECRET',
      'DATABASE_URL',
    ],
  },
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            levelFirst: false,
            translateTime: 'yyyy-mm-dd HH:MM:ss.l o',
          },
        }
      : undefined,
};

const logger = pino(options);

export { logger };

/* istanbul ignore file */
import { version } from '../../package.json';
import { Configuration } from '@src/config/configuration';

const dotenv = require('dotenv').config().parsed;
const dotenvlocal = require('dotenv').config({ path: `.env.local`, override: true }).parsed;

const merged = Object.assign({}, dotenv, dotenvlocal);

const defaults: Configuration = {
  version,
  env: {
    mode: 'defaults',
    port: parseInt(merged.APP_PORT) ?? 3001
  },
  graphQL: {
    schemaFileName: true,
    playground: true,
    introspection: true,
    installSubscriptionHandlers: true,
  },
  jwt: {
    refreshTokenName: 'gold-refresh-token',
    secret: 'secretKey',
    signOptions: {
      expiresIn: '8h'
    }
  }
};

export { defaults };

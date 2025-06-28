/* istanbul ignore file */
import { version } from '../../package.json';
import { Configuration } from '@src/config/configuration';

const dotenv = require('dotenv').config().parsed;
const dotenvlocal = require('dotenv').config({ path: `.env.local`, override: true }).parsed;

const merged = Object.assign({}, dotenv, dotenvlocal);

const defaults: Configuration = {
  app_name: 'gold',
  version,
  env: {
    mode: 'defaults',
    port: parseInt(merged.APP_PORT) ?? 3000
  },
  graphQL: {
    schemaFileName: true,
    playground: true,
    introspection: true,
    installSubscriptionHandlers: true,
  },
  jwt: {
    refreshTokenName: 'gold-refresh-token',
    secret: merged.JWT_SECRET ?? 'secretKey',
    signOptions: {
      expiresIn: '8h'
    }
  },
  bdd: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'gold'
  },
  morgans: {
    url: 'http://morgans:8000/graphql'
  },
  puppet: {
    url: 'http://puppet:3000',
    token: 'token'
  },
  throttle: [
    {
      ttl: 60000,
      limit: 10,
    },
  ],
  db: null,
};

export { defaults };

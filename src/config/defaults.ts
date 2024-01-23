import { version } from '../../package.json';
import { release } from '../../package.json';
import { Configuration } from './configuration';

const dotenv = require('dotenv').config().parsed;
const dotenvlocal = require('dotenv').config({ path: `.env.local`, override: true }).parsed;

const merged = Object.assign({}, dotenv, dotenvlocal);

const defaults: Configuration = {
  version: `${version}-${release}`,
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
  client: {
    token: merged.TOKEN_CLIENT ?? 'token'
  }
};

export { defaults };

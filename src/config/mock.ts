/* istanbul ignore file */
import { Configuration } from '@src/config/configuration';

const conf: Configuration = {
  env: {
    mode: 'mock'
  },
  graphQL: {
    schemaFileName: 'docs/gqlschema.gql',
    playground: true,
    introspection: true,
    installSubscriptionHandlers: true,
  },
  bdd: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'gold'
  },
  jwt: {
    signOptions: {
      expiresIn: '8h',
    },
  },
};

export { conf };

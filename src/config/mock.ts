import { Configuration } from './configuration';

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
  client: {
    token: 'token'
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

import * as request from 'supertest';
import { ApolloDriver } from '@nestjs/apollo';
import { NestApplication } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { config } from '@src/config';
import { AuthModule } from '@presentation/auth/auth.module';

describe('AuthResolver (e2e)', () => {
  let app: NestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          autoSchemaFile: config.graphQL.schemaFileName,
          context: ({ req, res }) => {
            return { req, res };
          },
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('auth', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `query {
          auth(
              dto: {
                login: "ropo"
                password: "password"
              }
          ){
            accessToken
            id
            code
            name_first
            name_last
            description
            mail
            creation
            modification
            language
          }
        }`,
      })
      .expect(({ body }) => {
        const data = body.data.auth;
        expect(data.id).toEqual(1);
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});


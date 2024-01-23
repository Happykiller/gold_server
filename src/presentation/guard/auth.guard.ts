import * as jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';

import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserSession, UserUsecaseModel } from '../auth/jwt.strategy';
import { config } from '../../config';

export class Context {
  req: any;// eslint-disable-line @typescript-eslint/no-explicit-any
  res: any;// eslint-disable-line @typescript-eslint/no-explicit-any
}

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {

  /* istanbul ignore next */
  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const gqlExecutionContext = GqlExecutionContext.create(executionContext);
    const context: Context = gqlExecutionContext.getContext();
    const accessToken = ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()])(context.req);

    if (!accessToken) throw new UnauthorizedException('Access token is not set');

    let userSession: UserSession;
    try {
      userSession = jwt.verify(accessToken, config.jwt.secret) as UserSession;
    } catch (err) {
      throw new UnauthorizedException('Token expired');
    }

    const user: UserUsecaseModel = {
      id: 1,
      code: userSession.code,
      active: true
    };

    if (user) {
      const refreshToken: string = jwt.sign(
        {
          code: userSession.code,
        },
        config.jwt.secret,
        {
          expiresIn: config.jwt.signOptions.expiresIn
        }
      );

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is not set');
      }

      if (user.active !== true) throw new UnauthorizedException('User is deactivated');
      context.res.header(config.jwt.refreshTokenName, refreshToken);
    } else {
      throw new UnauthorizedException('User is not set');
    }

    return this.activate(executionContext);
  }

  /* istanbul ignore next */
  async activate(executionContext: ExecutionContext): Promise<boolean> {
    return super.canActivate(executionContext) as Promise<boolean>;
  }

  getRequest(executionContext: ExecutionContext): unknown {
    const gqlExecutionContext = GqlExecutionContext.create(executionContext);
    const context: Context = gqlExecutionContext.getContext();
    return context.req;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  handleRequest(err: any, userSession: UserSession): any {
    if (err || !userSession) {
      throw new UnauthorizedException('Session is not set');
    }
    return userSession as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
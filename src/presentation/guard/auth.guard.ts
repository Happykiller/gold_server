import * as jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { config } from '@src/config';
import inversify from '@src/inversify/investify';
import { UserSession } from '@src/presentation/auth/jwt.strategy';
import { UserUsecaseModel } from '@src/usecase/model/user.usecase.model';

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

    const user: UserUsecaseModel = await inversify.getUserUsecase.execute({
      id: userSession.id
    });

    if (user) {
      const refreshToken: string = jwt.sign(
        {
          code: userSession.code,
          id: userSession.id
        },
        config.jwt.secret,
        {
          expiresIn: config.jwt.signOptions.expiresIn
        }
      );

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is not set');
      }

      if (!user.active) throw new UnauthorizedException('User is deactivated');
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
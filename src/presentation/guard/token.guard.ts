import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common';

import { config } from '../../config';

@Injectable()
export class TokenGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      let authorization;
      
      try {
        // From POST
        authorization = ctx.getContext().req.header('Authorization');
      } catch(e) {
        if (ctx.getContext().req.connectionParams) {
          // From React/appolo
          authorization = ctx.getContext().req.connectionParams['Authorization'];
        } else {
          // From Playground
          authorization = ctx.getContext().req['Authorization'];
        }
      }
      if (!authorization || authorization.replace('Bearer ', '') !== config.client.token) {
        throw new UnauthorizedException();
      }
      return true
    } catch(e) {
      throw new UnauthorizedException();
    }
  }
}
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { config } from '../../config';

export interface UserSession {
  id: number;
  code: string;
}

export interface UserUsecaseModel {
  id: number;
  code: string;
  active: boolean
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(payload: { code?: string }): Promise<UserSession> {
    if (!payload.code) {
      throw new UnauthorizedException();
    } else {
      const user: UserUsecaseModel = {
        id: 1,
        code: payload.code,
        active: true
      };
      return new Promise(resolve => {
        resolve({
          id: user.id,
          code: user.code
        });
      });
    }
  }
}

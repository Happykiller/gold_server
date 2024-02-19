/* istanbul ignore file */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { config } from '@src/config';
import inversify from '@src/inversify/investify';
import { UserUsecaseModel } from '@usecase/model/user.usecase.model';

export interface UserSession {
  id: number;
  code: string;
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
      const user: UserUsecaseModel = await inversify.getUserUsecase.execute({
        code: payload.code
      });
      return new Promise(resolve => {
        resolve({
          id: user.id,
          code: user.code
        });
      });
    }
  }
}

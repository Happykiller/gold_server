import * as jwt from 'jsonwebtoken';

import { config } from '../../config';
import { JwtService } from './jwt.service';

export class JwtServiceReal implements JwtService {
  sign(dto: any): string {
    const token: string = jwt.sign(
      {
        code: dto.code,
        id: dto.id,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.signOptions.expiresIn,
      },
    );
    return token;
  }

  decode(token: string): any {
    return jwt.decode(token);
  }

  verify(token: string): any {
    const payload = jwt.verify(token, config.jwt.secret);
    return payload;
  }
}

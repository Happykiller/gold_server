import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

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
        // sunny-apis type `expiresIn` en `string` nu, alors que les types
        // récents de jsonwebtoken n'acceptent qu'un littéral de durée
        // (`'8h'`, `'7d'`…) ou un nombre. La valeur configurée est valide,
        // c'est la déclaration en amont qui est trop large.
        expiresIn: config.jwt.signOptions.expiresIn as SignOptions['expiresIn'],
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

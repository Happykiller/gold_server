import * as sha256 from 'crypto-js/sha256';
import * as base64 from 'crypto-js/enc-base64';
import * as hmacSHA512 from 'crypto-js/hmac-sha512';

import { config } from '@src/config';
import { CryptService } from '@src/service/crypt/crypt.service';
import { CryptServiceDto } from '@src/service/crypt/dto/crypt.service.dto';

export class CryptServiceReal implements CryptService {
  crypt(dto: CryptServiceDto): string {
    const hashDigest = sha256('gold' + dto.message);
    const hmacDigest = base64.stringify(hmacSHA512(hashDigest, config.jwt.secret));
    return hmacDigest;
  }
}
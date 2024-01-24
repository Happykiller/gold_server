import { CryptServiceDto } from '@src/service/crypt/dto/crypt.service.dto';

export interface CryptService {
  crypt(dto: CryptServiceDto): string;
}
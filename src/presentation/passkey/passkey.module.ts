import { Module } from '@nestjs/common';

import inversify from '@src/inversify/investify';
import { PasskeyResolver } from '@presentation/passkey/passkey.resolver';

@Module({
  imports: [],
  providers: [
    PasskeyResolver,
    {
      useValue: inversify,
      provide: 'Inversify',
    },
  ],
})
export class PasskeyModule {}

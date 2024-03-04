import { Module } from '@nestjs/common';

import { SystemResolver } from '@presentation/system/system.resolver';

@Module({
  imports: [],
  providers: [
    SystemResolver
  ],
})

export class SystemModule {}
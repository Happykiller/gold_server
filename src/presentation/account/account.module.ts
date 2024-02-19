/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { AccountResolver } from './account.resolver';

@Module({
  imports: [],
  providers: [
    AccountResolver
  ],
})
export class AccountModule {}
/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { AccountResolver } from './account.resolver';
import { AccountFieldsResolver } from './account.fields.resolver';

@Module({
  imports: [],
  providers: [AccountResolver, AccountFieldsResolver],
})
export class AccountModule {}

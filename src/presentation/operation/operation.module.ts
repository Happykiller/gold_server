/* istanbul ignore file */
import { Module } from '@nestjs/common';

import { OperationResolver } from '@presentation/operation/operation.resolver';

@Module({
  imports: [],
  providers: [
    OperationResolver
  ],
})
export class OperationModule {}
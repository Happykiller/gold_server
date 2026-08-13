/* istanbul ignore file */
import { Module } from '@nestjs/common';

import { OperationResolver } from '@presentation/operation/operation.resolver';
import { OperationEventsResolver } from '@presentation/operation/operationEvents.resolver';

@Module({
  imports: [],
  providers: [OperationResolver, OperationEventsResolver],
})
export class OperationModule {}

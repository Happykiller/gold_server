import { Module } from '@nestjs/common';
import { OperationResolver } from './operation.resolver';

@Module({
  imports: [],
  providers: [
    OperationResolver
  ],
})
export class OperationModule {}
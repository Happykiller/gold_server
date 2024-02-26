import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateOperationInputResolver } from '@presentation/operation/dto/create.operation.resolver.dto';

@InputType()
export class UpdateOperationInputResolver extends PartialType(CreateOperationInputResolver) {
  @Field(() => Int)
  operation_id: number;
}
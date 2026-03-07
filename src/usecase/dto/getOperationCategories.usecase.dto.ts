import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetOperationCategoriesUsecaseDto {

    @Field(/* istanbul ignore next */ type => Int)
    user_id: number;

}

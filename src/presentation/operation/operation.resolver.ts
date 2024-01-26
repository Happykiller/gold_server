import { UseGuards } from '@nestjs/common';
import { Field, ObjectType, Mutation, Query, Resolver, Int, Args, InputType, PartialType, Float } from '@nestjs/graphql';

import { GetAccountInputResolver } from '../account/account.resolver';
import { GqlAuthGuard } from '../guard/auth.guard';
import inversify from '../../inversify/investify';
import { CurrentSession } from '../guard/userSession.decorator';
import { UserSession } from '../auth/jwt.strategy';

@ObjectType()
export class OperationModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  account_id: number;
  @Field(() => Int, { nullable: true })
  account_id_dest: number;
  @Field(() => Float)
  amount: number;
  @Field(() => String)
  date: string;
  @Field(() => Int)
  status_id: number;
  @Field(() => Int)
  type_id: number;
  @Field(() => Int, { nullable: true })
  third_id: number;
  @Field(() => Int, { nullable: true })
  category_id: number;
  @Field(() => String)
  description: string;
  @Field(() => Boolean)
  active: boolean;
  @Field(() => Int)
  creator_id: number;
  @Field(() => String)
  creation_date: string;
  @Field(() => Int, { nullable: true })
  modificator_id: number;
  @Field(() => String, { nullable: true })
  modification_date: string;
}

@InputType()
export class GetOperationInputResolver {
  @Field(() => Int)
  operation_id: number;
}

@InputType()
export class CreateOperationInputResolver {
  @Field(() => Int)
  account_id: number;
  @Field(() => Int, { nullable: true })
  account_id_dest: number;
  @Field(() => Float)
  amount: number;
  @Field(() => String)
  date: string;
  @Field(() => Int)
  status_id: number;
  @Field(() => Int)
  type_id: number;
  @Field(() => Int, { nullable: true })
  third_id: number;
  @Field(() => Int, { nullable: true })
  category_id: number;
  @Field(() => String, { nullable: true })
  description: string;
}

@InputType()
export class CreateOperationLinkInputResolver {
  @Field(() => Int)
  operation_id: number;
  @Field(() => Int)
  operation_ref_id: number;
}

@ObjectType()
export class OperationLinkModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  operation_id: number;
  @Field(() => Int)
  operation_ref_id: number;
  @Field(() => Boolean)
  active: boolean;
  @Field(() => Int)
  creator_id: number;
  @Field(() => String)
  creation_date: string;
  @Field(() => Int, { nullable: true })
  modificator_id: number;
  @Field(() => String, { nullable: true })
  modification_date: string;
}

@InputType()
export class UpdateOperationInputResolver extends PartialType(CreateOperationInputResolver) {
  @Field(() => Int)
  operation_id: number;
}

@ObjectType()
export class OperationTypeModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  label: string;
  @Field(() => String)
  description: string;
  @Field(() => Boolean)
  active: boolean;
  @Field(() => Int)
  creator_id: number;
  @Field(() => String)
  creation_date: string;
  @Field(() => Int, { nullable: true })
  modificator_id: number;
  @Field(() => String, { nullable: true })
  modification_date: string;
}

@ObjectType()
export class OperationCategoryModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  label: string;
  @Field(() => String)
  description: string;
  @Field(() => Boolean)
  active: boolean;
  @Field(() => Int)
  creator_id: number;
  @Field(() => String)
  creation_date: string;
  @Field(() => Int, { nullable: true })
  modificator_id: number;
  @Field(() => String, { nullable: true })
  modification_date: string;
}

@ObjectType()
export class OperationStatutModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  label: string;
  @Field(() => String)
  description: string;
  @Field(() => Boolean)
  active: boolean;
  @Field(() => Int)
  creator_id: number;
  @Field(() => String)
  creation_date: string;
  @Field(() => Int, { nullable: true })
  modificator_id: number;
  @Field(() => String, { nullable: true })
  modification_date: string;
}

@ObjectType()
export class OperationThirdModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  label: string;
  @Field(() => String)
  description: string;
  @Field(() => Boolean)
  active: boolean;
  @Field(() => Int)
  creator_id: number;
  @Field(() => String)
  creation_date: string;
  @Field(() => Int, { nullable: true })
  modificator_id: number;
  @Field(() => String, { nullable: true })
  modification_date: string;
}

@InputType()
export class GetOperationLinkInputResolver {
  @Field(() => Int)
  operation_link_id: number;
}

@Resolver('OperationResolver')
export class OperationResolver {
  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationModelResolver]
  )
  async operations(@CurrentSession() session: UserSession, @Args('dto') dto: GetAccountInputResolver): Promise<OperationModelResolver[]> {
    return inversify.getOperationsUsecase.execute({
      user_id: session.id,
      ... dto
    });
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => OperationModelResolver
  )
  async operation(@CurrentSession() session: UserSession, @Args('dto') dto: GetOperationInputResolver): Promise<OperationModelResolver> {
    return inversify.getOperationUsecase.execute({
      user_id: session.id,
      ... dto
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => OperationModelResolver
  )
  async createOperation(@CurrentSession() session: UserSession, @Args('dto') dto: CreateOperationInputResolver): Promise<OperationModelResolver> {
    return inversify.createOperationUsecase.execute({
      user_id: session.id,
      ... dto
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => OperationModelResolver
  )
  async updateOperation(@CurrentSession() session: UserSession, @Args('dto') dto: UpdateOperationInputResolver): Promise<OperationModelResolver> {
    return inversify.updateOperationUsecase.execute({
      user_id: session.id,
      ... dto
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => Boolean
  )
  async deleteOperation(@CurrentSession() session: UserSession, @Args('dto') dto: GetOperationInputResolver): Promise<boolean> {
    return inversify.deleteOperationUsecase.execute({
      user_id: session.id,
      operation_id: dto.operation_id
    });
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationTypeModelResolver]
  )
  async operationTypes(): Promise<OperationTypeModelResolver[]> {
    return inversify.getOperationTypesUsecase.execute();
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationCategoryModelResolver]
  )
  async operationCategories(): Promise<OperationCategoryModelResolver[]> {
    return inversify.getOperationCategoriesUsecase.execute();
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationStatutModelResolver]
  )
  async operationStatus(): Promise<OperationStatutModelResolver[]> {
    return inversify.getOperationStatusUsecase.execute();
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationThirdModelResolver]
  )
  async operationThirds(): Promise<OperationThirdModelResolver[]> {
    return inversify.getOperationTypesUsecase.execute();
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationLinkModelResolver]
  )
  async operationLinks(@CurrentSession() session: UserSession, @Args('dto') dto: GetOperationInputResolver): Promise<OperationLinkModelResolver[]> {
    return inversify.getOperationLinksUsecase.execute({
      user_id: session.id,
      operation_id: dto.operation_id
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => OperationLinkModelResolver
  )
  async createOperationLink(@CurrentSession() session: UserSession, @Args('dto') dto: CreateOperationLinkInputResolver): Promise<OperationLinkModelResolver> {
    return inversify.createOperationLinkUsecase.execute({
      user_id: session.id,
      ... dto
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => Boolean
  )
  async deleteOperationLink(@CurrentSession() session: UserSession, @Args('dto') dto: GetOperationLinkInputResolver): Promise<boolean> {
    return inversify.deleteOperationLinkUsecase.execute({
      user_id: session.id,
      operation_link_id: dto.operation_link_id
    });
  }
}
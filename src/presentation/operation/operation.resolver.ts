import { UseGuards } from '@nestjs/common';
import { Field, ObjectType, Mutation, Query, Resolver, Int, Args, InputType, PartialType, Float } from '@nestjs/graphql';

import { GetAccountInputResolver } from '../account/account.resolver';
import { GqlAuthGuard } from '../guard/auth.guard';

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
  @Field(() => Boolean)
  sign: boolean;
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
  @Field(() => Boolean)
  sign: boolean;
  @Field(() => Int)
  type_id: number;
  @Field(() => Int, { nullable: true })
  third_id: number;
  @Field(() => Int, { nullable: true })
  category_id: number;
  @Field(() => String)
  description: string;
}

@InputType()
export class CreateOperationLinkInputResolver {
  @Field(() => Int)
  operationA_id: number;
  @Field(() => Int)
  operationB_id: number;
}

@ObjectType()
export class OperationLinkModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  operationA_id: number;
  @Field(() => Int)
  operationB_id: number;
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
export class OperationThirdsModelResolver {
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
  async operations(@Args('dto') dto: GetAccountInputResolver): Promise<OperationModelResolver[]> {
    return [];
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => OperationModelResolver
  )
  async operation(@Args('dto') dto: GetOperationInputResolver): Promise<OperationModelResolver> {
    return {
      id: 1,
      account_id: 1,
      account_id_dest: null,
      amount: 42.42,
      date: 'now',
      status_id: 1,
      sign: true,
      type_id: 1,
      third_id: 1,
      category_id: null,
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => OperationModelResolver
  )
  async createOperation(@Args('dto') dto: CreateOperationInputResolver): Promise<OperationModelResolver> {
    return {
      id: 1,
      account_id: 1,
      account_id_dest: null,
      amount: 42.42,
      date: 'now',
      status_id: 1,
      sign: true,
      type_id: 1,
      third_id: 1,
      category_id: null,
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => OperationModelResolver
  )
  async updateOperation(@Args('dto') dto: UpdateOperationInputResolver): Promise<OperationModelResolver> {
    return {
      id: 1,
      account_id: 1,
      account_id_dest: null,
      amount: 42.42,
      date: 'now',
      status_id: 1,
      sign: true,
      type_id: 1,
      third_id: 1,
      category_id: null,
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => Boolean
  )
  async deleteOperation(@Args('dto') dto: GetOperationInputResolver): Promise<boolean> {
    return true;
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationTypeModelResolver]
  )
  async operationTypes(): Promise<OperationTypeModelResolver[]> {
    return [{
      id: 1,
      label: 'operation.type-credit',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    },{
      id: 2,
      label: 'operation.type-debit',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    },{
      id: 3,
      label: 'operation.type-vire',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    }];
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationCategoryModelResolver]
  )
  async operationCategories(): Promise<OperationCategoryModelResolver[]> {
    return [{
      id: 1,
      label: 'operation.category-other',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    },{
      id: 2,
      label: 'Alimentation',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    },{
      id: 3,
      label: 'Santé',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    }];
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationStatutModelResolver]
  )
  async operationStatus(): Promise<OperationStatutModelResolver[]> {
    return [{
      id: 1,
      label: 'operation.status-follow',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    },{
      id: 2,
      label: 'operation.status-reconciled',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    }];
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationThirdsModelResolver]
  )
  async operationThirds(): Promise<OperationThirdsModelResolver[]> {
    return [{
      id: 1,
      label: 'operation.third-otherCredit',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    },{
      id: 2,
      label: 'operation.third-otherDebit',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    }];
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationLinkModelResolver]
  )
  async operationLinks(@Args('dto') dto: GetOperationInputResolver): Promise<OperationLinkModelResolver[]> {
    return [{
      id: 1,
      operationA_id: 1,
      operationB_id: 2,
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null,
    }];
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => OperationLinkModelResolver
  )
  async createOperationLink(@Args('dto') dto: CreateOperationLinkInputResolver): Promise<OperationLinkModelResolver> {
    return {
      id: 1,
      operationA_id: 1,
      operationB_id: 2,
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => Boolean
  )
  async deleteOperationLink(@Args('dto') dto: GetOperationLinkInputResolver): Promise<boolean> {
    return true;
  }
}
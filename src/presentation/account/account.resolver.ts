import { UseGuards } from '@nestjs/common';
import { Field, ObjectType, Mutation, Query, Resolver, Int, Args, InputType, PartialType } from '@nestjs/graphql';

import { GqlAuthGuard } from '../guard/auth.guard';

@ObjectType()
export class AccountModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => Int, { description: '1, regular by default' })
  type_id: number;
  @Field(() => Int, { nullable: true })
  parent_account_id: number;
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
export class GetAccountInputResolver {
  @Field(() => Int)
  account_id: number;
}

@InputType()
export class CreateAccountInputResolver {
  @Field(() => Int, { description: '1, regular by default' })
  type_id: number;
  @Field(() => Int, { nullable: true })
  parent_account_id: number;
  @Field(() => String)
  label: string;
}

@InputType()
export class UpdateAccountInputResolver extends PartialType(CreateAccountInputResolver) {
  @Field(() => Int)
  account_id: number;
}

@ObjectType()
export class AccountTypeModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  label: string;
  @Field(() => String, { nullable: true })
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

@Resolver('AccountResolver')
export class AccountResolver {
  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [AccountModelResolver]
  )
  async accounts(): Promise<AccountModelResolver[]> {
    return [];
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => AccountModelResolver
  )
  async account(@Args('dto') dto: GetAccountInputResolver): Promise<AccountModelResolver> {
    return {
      id: 1,
      type_id: 1,
      parent_account_id: null,
      label: 'test',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => AccountModelResolver
  )
  async createAccount(@Args('dto') dto: CreateAccountInputResolver): Promise<AccountModelResolver> {
    return {
      id: 1,
      type_id: 1,
      parent_account_id: null,
      label: 'test',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => AccountModelResolver
  )
  async updateAccount(@Args('dto') dto: UpdateAccountInputResolver): Promise<AccountModelResolver> {
    return {
      id: 1,
      type_id: 1,
      parent_account_id: null,
      label: 'test',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => Boolean
  )
  async deleteAccount(@Args('dto') dto: GetAccountInputResolver): Promise<boolean> {
    return true;
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [AccountTypeModelResolver]
  )
  async accountTypes(): Promise<AccountTypeModelResolver[]> {
    return [{
      id: 1,
      label: 'account.type-regular',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    },{
      id: 2,
      label: 'account.type-template',
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null
    }];
  }
}
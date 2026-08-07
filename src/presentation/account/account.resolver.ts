// src\presentation\account\account.resolver.ts
import { UseGuards } from '@nestjs/common';
import {
  Field,
  ObjectType,
  Mutation,
  Query,
  Resolver,
  Int,
  Args,
  InputType,
  Float,
} from '@nestjs/graphql';

import inversify from '@src/inversify/investify';
import {
  CurrentSession,
  makeAuthGuard,
  USER_ROLE,
  UserSession,
} from '@happykiller/sunny-apis';

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
  @Field(() => String, { nullable: true })
  description: string;
  @Field(() => Float, { nullable: true })
  balance_reconcilied: number;
  @Field(() => Float, { nullable: true })
  balance_not_reconcilied: number;
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
  @Field(() => String, { nullable: true })
  description: string;
}

@InputType()
export class UpdateAccountInputResolver {
  @Field(() => Int)
  account_id: number;
  @Field(() => Int, { nullable: true })
  type_id: number;
  @Field(() => Int, { nullable: true })
  parent_account_id: number;
  @Field(() => String, { nullable: true })
  label: string;
  @Field(() => String, { nullable: true })
  description: string;
}

@ObjectType()
export class AccountTypeModelResolver {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  label: string;
  @Field(() => String, { nullable: true })
  description: string;
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
  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [AccountModelResolver],
  )
  async accounts(
    @CurrentSession() session: UserSession,
  ): Promise<AccountModelResolver[]> {
    return inversify.getAccountsUsecase.execute({
      user_id: parseInt(session.id),
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => AccountModelResolver,
  )
  async account(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetAccountInputResolver,
  ): Promise<AccountModelResolver> {
    return inversify.getAccountUsecase.execute({
      user_id: parseInt(session.id),
      account_id: dto.account_id,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => AccountModelResolver,
  )
  async createAccount(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CreateAccountInputResolver,
  ): Promise<AccountModelResolver> {
    return inversify.createAccountUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => AccountModelResolver,
  )
  async updateAccount(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: UpdateAccountInputResolver,
  ): Promise<AccountModelResolver> {
    return inversify.updateAccountUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => Boolean,
  )
  async deleteAccount(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetAccountInputResolver,
  ): Promise<boolean> {
    return inversify.deleteAccountUsecase.execute({
      user_id: parseInt(session.id),
      account_id: dto.account_id,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [AccountTypeModelResolver],
  )
  async accountTypes(): Promise<AccountTypeModelResolver[]> {
    return inversify.getAccountTypesUsecase.execute();
  }
}

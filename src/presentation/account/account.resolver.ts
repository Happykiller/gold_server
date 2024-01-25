import { UseGuards } from '@nestjs/common';
import { Field, ObjectType, Mutation, Query, Resolver, Int, Args, InputType, PartialType } from '@nestjs/graphql';

import inversify from '@src/inversify/investify';
import { GqlAuthGuard } from '@src/presentation/guard/auth.guard';
import { UserSession } from '@src/presentation/auth/jwt.strategy';
import { CurrentSession } from '@src/presentation/guard/userSession.decorator';

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
  async accounts(@CurrentSession() session: UserSession): Promise<AccountModelResolver[]> {
    return inversify.getAccountsUsecase.execute({
      user_id: session.id
    });
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => AccountModelResolver
  )
  async account(@CurrentSession() session: UserSession, @Args('dto') dto: GetAccountInputResolver): Promise<AccountModelResolver> {
    return inversify.getAccountUsecase.execute({
      user_id: session.id,
      account_id: dto.account_id
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => AccountModelResolver
  )
  async createAccount(@CurrentSession() session: UserSession, @Args('dto') dto: CreateAccountInputResolver): Promise<AccountModelResolver> {
    return inversify.createAccountUsecase.execute({
      user_id: session.id,
      ... dto
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => AccountModelResolver
  )
  async updateAccount(@CurrentSession() session: UserSession, @Args('dto') dto: UpdateAccountInputResolver): Promise<AccountModelResolver> {
    return inversify.updateAccountUsecase.execute({
      user_id: session.id,
      ... dto
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => Boolean
  )
  async deleteAccount(@CurrentSession() session: UserSession, @Args('dto') dto: GetAccountInputResolver): Promise<boolean> {
    return inversify.deleteAccountUsecase.execute({
      user_id: session.id,
      account_id: dto.account_id
    });
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
import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Args, ResolveField, Parent } from '@nestjs/graphql';

import inversify from '@src/inversify/investify';
import { GqlAuthGuard } from '@presentation/guard/auth.guard';
import { UserSession } from '@presentation/auth/jwt.strategy';
import { CurrentSession } from '@presentation/guard/userSession.decorator';
import { AccountModelResolver } from '@presentation/account/account.resolver';
import { OperationModelResolver } from '@presentation/operation/model/operation.resolver.model';
import { GetOperationInputResolver } from '@presentation/operation/dto/get.operation.resolver.dto';
import { GetOperationsInputResolver } from '@presentation/operation/dto/getAll.operation.resolver.dto';
import { CloneOperationInputResolver } from '@presentation/operation/dto/clone.operation.resolver.dto';
import { OperationLinkModelResolver } from '@presentation/operation/model/operationLink.resolver.model';
import { OperationTypeModelResolver } from '@presentation/operation/model/operationType.resolver.model';
import { CreateOperationInputResolver } from '@presentation/operation/dto/create.operation.resolver.dto';
import { UpdateOperationInputResolver } from '@presentation/operation/dto/update.operation.resolver.dto';
import { OperationThirdModelResolver } from '@presentation/operation/model/operationThrid.resolver.model';
import { GetOperationLinkInputResolver } from '@presentation/operation/dto/get.operationLink.resolver.dto';
import { OperationStatutModelResolver } from '@presentation/operation/model/operationStatut.resolver.model';
import { OperationCategoryModelResolver } from '@presentation/operation/model/operationCategory.resolver.model';
import { CreateOperationLinkInputResolver } from '@presentation/operation/dto/create.operationLink.resolver.dto';

@Resolver((of) => OperationModelResolver)
export class OperationResolver {

  @ResolveField((of) => AccountModelResolver)
  async account(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
  ): Promise<AccountModelResolver> {
    const entity: AccountModelResolver = await inversify.getAccountUsecase.execute(
      {
        user_id: session.id,
        account_id: parent.account_id
      },
    );
    return entity;
  }

  @ResolveField((of) => AccountModelResolver, { nullable: true })
  async account_dest(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
  ): Promise<AccountModelResolver> {
    if (parent.account_id_dest !== null) {
      const entity: AccountModelResolver = await inversify.getAccountUsecase.execute(
        {
          user_id: session.id,
          account_id: parent.account_id_dest
        },
      );
      return entity;
    } else {
      return null;
    }
  }

  @ResolveField((of) => OperationStatutModelResolver)
  async status(
    @Parent() parent: OperationModelResolver
  ): Promise<OperationStatutModelResolver> {
    const statusEntities = await inversify.getOperationStatusUsecase.execute();
    return statusEntities.find(elt => parent.status_id === elt.id);
  }

  @ResolveField((of) => OperationTypeModelResolver)
  async type(
    @Parent() parent: OperationModelResolver
  ): Promise<OperationTypeModelResolver> {
    const typeEntities = await inversify.getOperationTypesUsecase.execute();
    return typeEntities.find(elt => parent.type_id === elt.id);
  }

  @ResolveField((of) => OperationThirdModelResolver)
  async third(
    @Parent() parent: OperationModelResolver
  ): Promise<OperationThirdModelResolver> {
    const thirdEntities = await inversify.getOperationThridsUsecase.execute();
    return thirdEntities.find(elt => parent.third_id === elt.id);
  }

  @ResolveField((of) => OperationCategoryModelResolver)
  async category(
    @Parent() parent: OperationModelResolver
  ): Promise<OperationCategoryModelResolver> {
    const categoryEntities = await inversify.getOperationCategoriesUsecase.execute();
    return categoryEntities.find(elt => parent.category_id === elt.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    () => [OperationModelResolver]
  )
  async operations(@CurrentSession() session: UserSession, @Args('dto') dto: GetOperationsInputResolver): Promise<OperationModelResolver[]> {
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
    return inversify.getOperationThridsUsecase.execute();
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

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    () => [OperationModelResolver]
  )
  async cloneOperations(@CurrentSession() session: UserSession, @Args('dto') dto: CloneOperationInputResolver): Promise<OperationModelResolver[]> {
    return inversify.cloneOperationsUsecase.execute({
      user_id: session.id,
      ...dto
    });
  }
}
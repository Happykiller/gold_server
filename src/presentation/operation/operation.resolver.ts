// src\presentation\operation\operation.resolver.ts
import { UseGuards } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import {
  Mutation,
  Query,
  Resolver,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { ERRORS } from '@src/common/ERROR';

import inversify from '@src/inversify/investify';
import { AccountModelResolver } from '@presentation/account/account.resolver';
import {
  CurrentSession,
  makeAuthGuard,
  USER_ROLE,
  UserSession,
} from '@happykiller/sunny-apis';
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
import { CashflowModelResolver } from '@presentation/operation/model/cashflow.resolver.model';
import { CashflowInputResolver } from '@presentation/operation/dto/cashflow.resolver.dto';

@Resolver((of) => OperationModelResolver)
export class OperationResolver {
  @ResolveField((of) => AccountModelResolver)
  async account(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
  ): Promise<AccountModelResolver> {
    const entity: AccountModelResolver =
      await inversify.getAccountUsecase.execute({
        user_id: parseInt(session.id),
        account_id: parent.account_id,
      });
    return entity;
  }

  @ResolveField((of) => AccountModelResolver, { nullable: true })
  async account_dest(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
  ): Promise<AccountModelResolver> {
    if (parent.account_id_dest !== null) {
      const entity: AccountModelResolver =
        await inversify.getAccountUsecase.execute({
          user_id: parseInt(session.id),
          account_id: parent.account_id_dest,
        });
      return entity;
    } else {
      return null;
    }
  }

  @ResolveField((of) => OperationStatutModelResolver)
  async status(
    @Parent() parent: OperationModelResolver,
  ): Promise<OperationStatutModelResolver> {
    const statusEntities = await inversify.getOperationStatusUsecase.execute();
    return statusEntities.find((elt) => parent.status_id === elt.id);
  }

  @ResolveField((of) => OperationTypeModelResolver)
  async type(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
  ): Promise<OperationTypeModelResolver> {
    const typeEntities = await inversify.getOperationTypesUsecase.execute({
      user_id: parseInt(session.id),
    });
    return typeEntities.find((elt) => parent.type_id === elt.id);
  }

  @ResolveField((of) => OperationThirdModelResolver)
  async third(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
  ): Promise<OperationThirdModelResolver> {
    const thirdEntities = await inversify.getOperationThridsUsecase.execute({
      user_id: parseInt(session.id),
    });
    return thirdEntities.find((elt) => parent.third_id === elt.id);
  }

  @ResolveField((of) => OperationCategoryModelResolver)
  async category(
    @Parent() parent: OperationModelResolver,
    @CurrentSession() session: UserSession,
  ): Promise<OperationCategoryModelResolver> {
    const categoryEntities =
      await inversify.getOperationCategoriesUsecase.execute({
        user_id: parseInt(session.id),
      });
    return categoryEntities.find((elt) => parent.category_id === elt.id);
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationModelResolver],
  )
  async operations(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetOperationsInputResolver,
  ): Promise<OperationModelResolver[]> {
    return inversify.getOperationsUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [CashflowModelResolver],
  )
  async cashflow(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CashflowInputResolver,
  ): Promise<CashflowModelResolver[]> {
    return inversify.getCashflowUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => OperationModelResolver,
  )
  async operation(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetOperationInputResolver,
  ): Promise<OperationModelResolver> {
    return inversify.getOperationUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => OperationModelResolver,
  )
  async createOperation(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CreateOperationInputResolver,
  ): Promise<OperationModelResolver> {
    return inversify.createOperationUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => OperationModelResolver,
  )
  async updateOperation(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: UpdateOperationInputResolver,
  ): Promise<OperationModelResolver> {
    try {
      return await inversify.updateOperationUsecase.execute({
        user_id: parseInt(session.id),
        ...dto,
      });
    } catch (e) {
      // Le usecase reste indépendant du framework : c'est ici, dans la couche
      // de présentation, qu'une erreur métier devient un refus GraphQL typé.
      // Sans cette traduction, le client reçoit un INTERNAL_SERVER_ERROR et ne
      // peut pas distinguer une opération inconnue d'une panne du serveur.
      if (e instanceof Error && e.message === ERRORS.OPERATION_NOT_FOUND) {
        throw new GraphQLError(ERRORS.OPERATION_NOT_FOUND, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      throw e;
    }
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => Boolean,
  )
  async deleteOperation(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetOperationInputResolver,
  ): Promise<boolean> {
    return inversify.deleteOperationUsecase.execute({
      user_id: parseInt(session.id),
      operation_id: dto.operation_id,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationTypeModelResolver],
  )
  async operationTypes(
    @CurrentSession() session: UserSession,
  ): Promise<OperationTypeModelResolver[]> {
    return inversify.getOperationTypesUsecase.execute({
      user_id: parseInt(session.id),
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationCategoryModelResolver],
  )
  async operationCategories(
    @CurrentSession() session: UserSession,
  ): Promise<OperationCategoryModelResolver[]> {
    return inversify.getOperationCategoriesUsecase.execute({
      user_id: parseInt(session.id),
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationStatutModelResolver],
  )
  async operationStatus(): Promise<OperationStatutModelResolver[]> {
    return inversify.getOperationStatusUsecase.execute();
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationThirdModelResolver],
  )
  async operationThirds(
    @CurrentSession() session: UserSession,
  ): Promise<OperationThirdModelResolver[]> {
    return inversify.getOperationThridsUsecase.execute({
      user_id: parseInt(session.id),
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    () => [OperationLinkModelResolver],
  )
  async operationLinks(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetOperationInputResolver,
  ): Promise<OperationLinkModelResolver[]> {
    return inversify.getOperationLinksUsecase.execute({
      user_id: parseInt(session.id),
      operation_id: dto.operation_id,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => OperationLinkModelResolver,
  )
  async createOperationLink(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CreateOperationLinkInputResolver,
  ): Promise<OperationLinkModelResolver> {
    return inversify.createOperationLinkUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => Boolean,
  )
  async deleteOperationLink(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetOperationLinkInputResolver,
  ): Promise<boolean> {
    return inversify.deleteOperationLinkUsecase.execute({
      user_id: parseInt(session.id),
      operation_link_id: dto.operation_link_id,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    () => [OperationModelResolver],
  )
  async cloneOperations(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CloneOperationInputResolver,
  ): Promise<OperationModelResolver[]> {
    return inversify.cloneOperationsUsecase.execute({
      user_id: parseInt(session.id),
      ...dto,
    });
  }
}

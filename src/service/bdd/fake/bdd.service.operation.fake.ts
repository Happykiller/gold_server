// src\service\bdd\fake\bdd.service.operation.fake.ts
import { OperationServiceModel } from '@service/bdd/model/operation.service.model';
import { GetOperationServiceDto } from '@service/bdd/dto/getOperation.service.dto';
import { GetOperationsServiceDto } from '@service/bdd/dto/getOperations.service.dto';
import { GetCashflowServiceDto } from '@service/bdd/dto/getCashflow.service.dto';
import { CashflowServiceModel } from '@service/bdd/model/cashflow.service.model';
import { CloneOperationsServiceDto } from '@service/bdd/dto/cloneOperations.service.dto';
import { CreateOperationServiceDto } from '@service/bdd/dto/createOperation.service.dto';
import { UpdateOperationServiceDto } from '@service/bdd/dto/updateOperation.service.dto';
import { DeleteOperationServiceDto } from '@service/bdd/dto/deleteOperation.service.dto';
import { GetOperationLinkServiceDto } from '@service/bdd/dto/getOperationLink.service.dto';
import { OperationLinkServiceModel } from '@service/bdd/model/operationLink.service.model';
import { OperationTypeServiceModel } from '@service/bdd/model/operationType.service.model';
import { OperationThridServiceModel } from '@service/bdd/model/operationThrid.service.model';
import { GetOperationLinksServiceDto } from '@service/bdd/dto/getOperationLinks.service.dto';
import { OperationStatutServiceModel } from '@service/bdd/model/operationStatut.service.model';
import { DeleteOperationLinkServiceDto } from '@service/bdd/dto/deleteOperationLink.service.dto';
import { CreateOperationLinkServiceDto } from '@service/bdd/dto/createOperationLink.service.dto';
import { CreateOperationLinksServiceDto } from '@service/bdd/dto/createOperationLinks.service.dto';
import { LinkedOperationServiceModel } from '@service/bdd/model/linkedOperation.service.model';
import {
  GetLinkedOperationsServiceDto,
  LINK_DIRECTION,
} from '@service/bdd/dto/getLinkedOperations.service.dto';
import { GetOperationThridsServiceDto } from '@service/bdd/dto/getOperationThrids.service.dto';
import { GetOperationTypesServiceDto } from '@service/bdd/dto/getOperationTypes.service.dto';
import { GetOperationCategoriesServiceDto } from '@service/bdd/dto/getOperationCategories.service.dto';
import { OperationCategoryServiceModel } from '@service/bdd/model/operationCategory.service.model';

export class BddServiceOperationFake {
  collectionOperation: OperationServiceModel[] = [
    {
      id: 1,
      account_id: 1,
      account_id_dest: null,
      amount: 42.42,
      date: 'now',
      status_id: 1,
      type_id: 1,
      third_id: 1,
      category_id: null,
      vat_rate: 20,
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null,
      linked_count: 0,
      linked_by_count: 0,
    },
  ];

  collectionOperationLink: OperationLinkServiceModel[] = [];

  // Des compteurs explicites plutôt que `collection.length++ - 1` : cette
  // expression incrémente la longueur du tableau *puis* retranche 1, ce qui
  // donne l'identifiant -1 sur une collection vide, 0 sur la suivante, et
  // laisse au passage un trou dans le tableau.
  private nextOperationId = 2;
  private nextOperationLinkId = 1;

  createOperation(
    dto: CreateOperationServiceDto,
  ): Promise<OperationServiceModel> {
    const elt: OperationServiceModel = {
      id: this.nextOperationId++,
      account_id: 1,
      account_id_dest: dto.account_id_dest,
      amount: dto.amount,
      date: dto.date,
      status_id: dto.status_id,
      type_id: dto.type_id,
      third_id: dto.third_id,
      category_id: dto.category_id,
      vat_rate: dto.vat_rate ?? 20,
      description: dto.description,
      active: true,
      creator_id: dto.user_id,
      creation_date: new Date().getTime().toString(),
      modificator_id: null,
      modification_date: null,
      // Une opération naît sans lien : ceux du virement sont posés juste après,
      // par `createOperationLinks`, depuis le usecase.
      linked_count: 0,
      linked_by_count: 0,
    };

    this.collectionOperation.push(elt);

    return Promise.resolve(elt);
  }

  getOperation(dto: GetOperationServiceDto): Promise<OperationServiceModel> {
    return Promise.resolve(
      this.collectionOperation.find((elt) => elt.id === dto.operation_id),
    );
  }

  getOperations(
    dto: GetOperationsServiceDto,
  ): Promise<OperationServiceModel[]> {
    return Promise.resolve(
      this.collectionOperation.filter((elt) => elt.id === dto.account_id),
    );
  }

  getCashflow(_dto: GetCashflowServiceDto): Promise<CashflowServiceModel[]> {
    return Promise.resolve([]);
  }

  async updateOperation(
    dto: UpdateOperationServiceDto,
  ): Promise<OperationServiceModel> {
    let elt: OperationServiceModel = await this.getOperation(dto);
    const objIndex = this.collectionOperation.findIndex(
      (obj) => obj.id == dto.operation_id,
    );

    const input = dto;
    delete input.user_id;

    elt = {
      ...elt,
      ...input,
      modificator_id: dto.user_id,
      modification_date: new Date().getTime().toString(),
    };

    this.collectionOperation[objIndex] = elt;

    return Promise.resolve(elt);
  }

  deleteOperation(dto: DeleteOperationServiceDto): Promise<boolean> {
    const elt = this.collectionOperation.find(
      (obj) => obj.id == dto.operation_id,
    );

    elt.active = false;
    elt.modificator_id = dto.user_id;
    elt.modification_date = new Date().getTime().toString();

    return Promise.resolve(true);
  }

  getOperationTypes(
    _dto: GetOperationTypesServiceDto,
  ): Promise<OperationTypeServiceModel[]> {
    return Promise.resolve([
      {
        id: 1,
        label: 'operation.type-credit',
        description: 'description',
        active: true,
        creator_id: 1,
        creation_date: 'now',
        modificator_id: null,
        modification_date: null,
      },
      {
        id: 2,
        label: 'operation.type-debit',
        description: 'description',
        active: true,
        creator_id: 1,
        creation_date: 'now',
        modificator_id: null,
        modification_date: null,
      },
      {
        id: 3,
        label: 'operation.type-vire',
        description: 'description',
        active: true,
        creator_id: 1,
        creation_date: 'now',
        modificator_id: null,
        modification_date: null,
      },
    ]);
  }

  getOperationThrids(
    _dto: GetOperationThridsServiceDto,
  ): Promise<OperationThridServiceModel[]> {
    return Promise.resolve([
      {
        id: 1,
        label: 'operation.third-otherCredit',
        description: 'description',
        active: true,
        creator_id: 1,
        creation_date: 'now',
        modificator_id: null,
        modification_date: null,
      },
      {
        id: 2,
        label: 'operation.third-otherDebit',
        description: 'description',
        active: true,
        creator_id: 1,
        creation_date: 'now',
        modificator_id: null,
        modification_date: null,
      },
    ]);
  }

  getOperationStatus(): Promise<OperationStatutServiceModel[]> {
    return Promise.resolve([
      {
        id: 1,
        label: 'operation.status-follow',
        description: 'description',
        active: true,
        creator_id: 1,
        creation_date: 'now',
        modificator_id: null,
        modification_date: null,
      },
      {
        id: 2,
        label: 'operation.status-reconciled',
        description: 'description',
        active: true,
        creator_id: 1,
        creation_date: 'now',
        modificator_id: null,
        modification_date: null,
      },
    ]);
  }

  getOperationCategories(
    _dto: GetOperationCategoriesServiceDto,
  ): Promise<OperationCategoryServiceModel[]> {
    return Promise.resolve([
      {
        id: 1,
        label: 'operation.third-otherCredit',
        description: 'description',
        active: true,
        creator_id: 1,
        creation_date: 'now',
        modificator_id: null,
        modification_date: null,
      },
      {
        id: 2,
        label: 'operation.third-otherDebit',
        description: 'description',
        active: true,
        creator_id: 1,
        creation_date: 'now',
        modificator_id: null,
        modification_date: null,
      },
    ]);
  }

  createOperationLink(
    dto: CreateOperationLinkServiceDto,
  ): Promise<OperationLinkServiceModel> {
    const elt: OperationLinkServiceModel = {
      id: this.nextOperationLinkId++,
      operation_id: dto.operation_id,
      operation_ref_id: dto.operation_ref_id,
      active: true,
      creator_id: dto.user_id,
      creation_date: new Date().getTime().toString(),
      modificator_id: null,
      modification_date: null,
    };

    this.collectionOperationLink.push(elt);

    return Promise.resolve(elt);
  }

  async createOperationLinks(
    dto: CreateOperationLinksServiceDto,
  ): Promise<OperationLinkServiceModel[]> {
    for (const ref of [...new Set(dto.operation_ref_ids)]) {
      if (ref === dto.operation_id) continue;

      // Miroir du `WHERE o.creator_id = ? AND o.active = 1` de l'adaptateur
      // SQL : une opération d'autrui ou supprimée ne produit aucun lien.
      const target = this.collectionOperation.find(
        (elt) => elt.id === ref && elt.creator_id === dto.user_id && elt.active,
      );
      if (!target) continue;

      const already = this.collectionOperationLink.some(
        (elt) =>
          elt.active &&
          elt.operation_id === dto.operation_id &&
          elt.operation_ref_id === ref,
      );
      if (already) continue;

      await this.createOperationLink({
        user_id: dto.user_id,
        operation_id: dto.operation_id,
        operation_ref_id: ref,
      });
    }

    return await this.getOperationLinks({
      operation_id: dto.operation_id,
      user_id: dto.user_id,
    });
  }

  getOperationLink(
    dto: GetOperationLinkServiceDto,
  ): Promise<OperationLinkServiceModel> {
    return Promise.resolve(
      this.collectionOperationLink.find(
        (elt) =>
          elt.id === dto.operation_link_id &&
          elt.creator_id === dto.user_id &&
          elt.active,
      ) ?? null,
    );
  }

  getOperationLinks(
    dto: GetOperationLinksServiceDto,
  ): Promise<OperationLinkServiceModel[]> {
    return Promise.resolve(
      this.collectionOperationLink.filter(
        // Était `elt.id === dto.operation_id` : le fake cherchait un lien par
        // son propre identifiant là où le SQL cherche par opération portante.
        (elt) =>
          elt.operation_id === dto.operation_id &&
          elt.creator_id === dto.user_id &&
          elt.active,
      ),
    );
  }

  getLinkedOperations(
    dto: GetLinkedOperationsServiceDto,
  ): Promise<LinkedOperationServiceModel[]> {
    const links = this.collectionOperationLink.filter(
      (elt) =>
        elt.active &&
        elt.creator_id === dto.user_id &&
        (dto.direction === LINK_DIRECTION.DOWN
          ? elt.operation_id === dto.operation_id
          : elt.operation_ref_id === dto.operation_id),
    );

    return Promise.resolve(
      links
        .map((link) => {
          const target = this.collectionOperation.find(
            (elt) =>
              elt.id ===
                (dto.direction === LINK_DIRECTION.DOWN
                  ? link.operation_ref_id
                  : link.operation_id) &&
              elt.creator_id === dto.user_id &&
              elt.active,
          );
          if (!target) return null;
          return {
            link_id: link.id,
            id: target.id,
            account_id: target.account_id,
            account_id_dest: target.account_id_dest,
            amount: target.amount,
            date: target.date,
            status_id: target.status_id,
            type_id: target.type_id,
            third_id: target.third_id,
            category_id: target.category_id,
            description: target.description,
          };
        })
        .filter((elt) => elt !== null),
    );
  }

  deleteOperationLink(dto: DeleteOperationLinkServiceDto): Promise<boolean> {
    const elt = this.collectionOperationLink.find(
      (obj) =>
        obj.id === dto.operation_link_id &&
        obj.creator_id === dto.user_id &&
        obj.active,
    );

    // Sans cette garde, un identifiant inconnu levait un TypeError là où
    // l'adaptateur SQL se contente de renvoyer false.
    if (!elt) {
      return Promise.resolve(false);
    }

    elt.active = false;
    elt.modificator_id = dto.user_id;
    elt.modification_date = new Date().getTime().toString();

    return Promise.resolve(true);
  }

  cloneOperations(
    _dto: CloneOperationsServiceDto,
  ): Promise<OperationServiceModel[]> {
    return Promise.resolve([
      {
        id: 1,
        account_id: 1,
        account_id_dest: null,
        amount: 42.42,
        date: 'now',
        status_id: 1,
        type_id: 1,
        third_id: 1,
        category_id: null,
        vat_rate: 20,
        description: 'description',
        active: true,
        creator_id: 1,
        creation_date: 'now',
        modificator_id: null,
        modification_date: null,
        linked_count: 0,
        linked_by_count: 0,
      },
    ]);
  }
}

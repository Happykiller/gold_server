// src\service\bdd\fake\bdd.service.operation.fake.ts
import { OperationServiceModel } from '@service/bdd/model/operation.service.model';
import { GetOperationServiceDto } from '@service/bdd/dto/getOperation.service.dto';
import { GetOperationsServiceDto } from '@service/bdd/dto/getOperations.service.dto';
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
import { OperationCategoryServiceModel } from '@service/bdd/model/operationCategory.service.model';

export class BddServiceOperationFake {
  collectionOperation:OperationServiceModel[] = [{
    id: 1,
    account_id: 1,
    account_id_dest: null,
    amount: 42.42,
    date: 'now',
    status_id: 1,
    type_id: 1,
    third_id: 1,
    category_id: null,
    description: 'description',
    active: true,
    creator_id: 1,
    creation_date: 'now',
    modificator_id: null,
    modification_date: null,
  }];

  collectionOperationLink:OperationLinkServiceModel[] = [];
  
  createOperation(dto: CreateOperationServiceDto): Promise<OperationServiceModel> {
    const elt:OperationServiceModel = {
      id: (this.collectionOperation.length++ - 1),
      account_id: 1,
      account_id_dest: dto.account_id_dest,
      amount: dto.amount,
      date: dto.date,
      status_id: dto.status_id,
      type_id: dto.type_id,
      third_id: dto.third_id,
      category_id: dto.category_id,
      description: dto.description,
      active: true,
      creator_id: dto.user_id,
      creation_date: (new Date()).getTime().toString(),
      modificator_id: null,
      modification_date: null
    };

    this.collectionOperation.push(elt);

    return Promise.resolve(elt);
  }

  getOperation(dto: GetOperationServiceDto): Promise<OperationServiceModel> {
    return Promise.resolve(this.collectionOperation.find(elt => elt.id === dto.operation_id));
  }

  getOperations(dto: GetOperationsServiceDto): Promise<OperationServiceModel[]> {
    return Promise.resolve(this.collectionOperation.filter(elt => elt.id === dto.account_id));
  }

  async updateOperation(dto: UpdateOperationServiceDto): Promise<OperationServiceModel> {
    let elt:OperationServiceModel = await this.getOperation(dto);
    let objIndex = this.collectionOperation.findIndex((obj => obj.id == dto.operation_id));

    const input = dto;
    delete input.user_id;

    elt = {
      ...elt,
      ...input,
      modificator_id: dto.user_id,
      modification_date: (new Date()).getTime().toString()
    }

    this.collectionOperation[objIndex] = elt;

    return Promise.resolve(elt);
  }

  deleteOperation(dto: DeleteOperationServiceDto): Promise<boolean> {
    let elt = this.collectionOperation.find((obj => obj.id == dto.operation_id));

    elt.active = false;
    elt.modificator_id = dto.user_id;
    elt.modification_date = (new Date()).getTime().toString();

    return Promise.resolve(true);
  }

  getOperationTypes(): Promise<OperationTypeServiceModel[]> {
    return Promise.resolve([{
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
    }]);
  }

  getOperationThrids(): Promise<OperationThridServiceModel[]> {
    return Promise.resolve([{
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
    }]);
  }

  getOperationStatus(): Promise<OperationStatutServiceModel[]> {
    return Promise.resolve([{
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
    }]);
  }

  getOperationCategories(): Promise<OperationCategoryServiceModel[]> {
    return Promise.resolve([{
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
    }]);
  }

  createOperationLink(dto: CreateOperationLinkServiceDto): Promise<OperationLinkServiceModel> {
    const elt:OperationLinkServiceModel = {
      id: (this.collectionOperationLink.length++ - 1),
      operation_id: dto.operation_id,
      operation_ref_id: dto.operation_ref_id,
      active: true,
      creator_id: dto.user_id,
      creation_date: (new Date()).getTime().toString(),
      modificator_id: null,
      modification_date: null
    };

    this.collectionOperationLink.push(elt);

    return Promise.resolve(elt);
  }

  getOperationLink(dto: GetOperationLinkServiceDto): Promise<OperationLinkServiceModel> {
    return Promise.resolve(this.collectionOperationLink.find(elt => elt.id === dto.operation_link_id));
  }

  getOperationLinks(dto: GetOperationLinksServiceDto): Promise<OperationLinkServiceModel[]> {
    return Promise.resolve(this.collectionOperationLink.filter(elt => elt.id === dto.operation_id));
  }

  deleteOperationLink(dto: DeleteOperationLinkServiceDto): Promise<boolean> {
    let elt = this.collectionOperationLink.find((obj => obj.id == dto.operation_link_id));

    elt.active = false;
    elt.modificator_id = dto.user_id;
    elt.modification_date = (new Date()).getTime().toString();

    return Promise.resolve(true);
  }

  cloneOperations(dto: CloneOperationsServiceDto): Promise<OperationServiceModel[]> {
    return Promise.resolve([{
      id: 1,
      account_id: 1,
      account_id_dest: null,
      amount: 42.42,
      date: 'now',
      status_id: 1,
      type_id: 1,
      third_id: 1,
      category_id: null,
      description: 'description',
      active: true,
      creator_id: 1,
      creation_date: 'now',
      modificator_id: null,
      modification_date: null,
    }]);
  }
}
import { BddService } from '@service/bdd/bdd.service';
import PasskeyDbModel from '@service/bdd/model/passkey.db.model';
import { passkeyRopo } from '@service/bdd/fake/mock/passkey.ropo';
import { GetPasskeyDbDto } from '@service/bdd/dto/get.passkey.db.dto';
import CreatePasskeyDbDto from '@service/bdd/dto/create.passkey.db.dto';
import { DeletePasskeyDbDto } from '@service/bdd/dto/delete.passkey.db.dto';
import { GetPasskeyByUserIdDbDto } from '@service/bdd/dto/getByUserId.passkey.db.dto';

export class BddServicePasskeyFake
  implements
    Pick<BddService, 'createPasskey' | 'getPasskeyByUserId' | 'getPasskey'>
{
  passkeyCollection: PasskeyDbModel[];

  getPasskeyCollection(): PasskeyDbModel[] {
    if (!this.passkeyCollection) {
      this.passkeyCollection = [passkeyRopo];
    }
    return this.passkeyCollection;
  }

  createPasskey(dto: CreatePasskeyDbDto): Promise<PasskeyDbModel> {
    const entity: PasskeyDbModel = {
      id: this.passkeyCollection.length.toString(),
      ...dto,
      active: true,
    };
    this.getPasskeyCollection().push(entity);
    return Promise.resolve(JSON.parse(JSON.stringify(entity)));
  }

  getPasskeyByUserId(dto: GetPasskeyByUserIdDbDto): Promise<PasskeyDbModel[]> {
    const entities = this.getPasskeyCollection().filter(
      (elt) => elt.active && elt.user_id === dto.user_id,
    );
    return Promise.resolve(JSON.parse(JSON.stringify(entities)));
  }

  getPasskey(dto: GetPasskeyDbDto): Promise<PasskeyDbModel> {
    const entity = this.getPasskeyCollection().find((elt) => {
      if (!elt.active) return false;
      else if (dto.passkey_id) {
        return elt.id === dto.passkey_id;
      } else if (dto.credential_id) {
        return elt.registration.credential.id === dto.credential_id;
      }
    });

    if (entity) {
      return Promise.resolve(JSON.parse(JSON.stringify(entity)));
    } else {
      return null;
    }
  }

  deletePasskey(dto: DeletePasskeyDbDto): Promise<boolean> {
    const entity = this.getPasskeyCollection().find(
      (elt) => elt.id === dto.passkey_id && elt.active,
    );

    entity.active = false;

    return Promise.resolve(true);
  }
}

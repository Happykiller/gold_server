// src\service\bdd\fake\bdd.service.fake.ts
import { BddServiceAccountFake } from '@service/bdd/fake/bdd.service.account.fake';
import { BddServiceOperationFake } from '@service/bdd/fake/bdd.service.operation.fake';
import { applyMixins, BddServicePasskeyFake, BddServiceTestFake, BddServiceUserFake } from '@happykiller/sunny-apis';

class BddServiceFake {}

applyMixins(BddServiceFake, [
  // Sunny
  BddServiceTestFake,
  BddServiceUserFake,
  BddServicePasskeyFake,
  // Project
  BddServiceAccountFake,
  BddServiceOperationFake
]);

export { BddServiceFake };
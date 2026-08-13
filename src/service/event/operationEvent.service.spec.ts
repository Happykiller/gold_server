// src\service\event\operationEvent.service.spec.ts
import {
  OperationEventService,
  OperationsChangedPayload,
} from '@service/event/operationEvent.service';

/**
 * Le seul cloisonnement du produit est l'identifiant d'utilisateur (loi 1).
 * Ici il tient au **sujet** sur lequel on publie : ces tests vérifient qu'un
 * abonné ne peut rien recevoir d'un autre utilisateur, quoi qu'il arrive.
 *
 * Éprouvé par mutation : remplacer le sujet par une constante fait échouer le
 * second cas.
 */
describe('OperationEventService', () => {
  const payload = (
    kind: OperationsChangedPayload['kind'],
  ): OperationsChangedPayload => ({
    kind,
    account_ids: [12],
    operation_ids: [345],
    origin: null,
  });

  it('remet à son abonné ce qui est publié pour lui', async () => {
    const service = new OperationEventService();
    const iterator = service.subscribe(1);

    const received = iterator.next();
    service.publish(1, payload('created'));

    const { value } = await received;
    expect(value).toEqual({ operationsChanged: payload('created') });
  });

  it('ne remet rien de ce qui est publié pour un autre utilisateur', async () => {
    const service = new OperationEventService();
    const iterator = service.subscribe(1);

    const received = iterator.next();
    service.publish(2, payload('created'));
    // Le seul événement que l'abonné doit voir est le sien : si le sujet ne
    // cloisonnait pas, c'est celui de l'utilisateur 2 qui arriverait ici.
    service.publish(1, payload('deleted'));

    const { value } = await received;
    expect(value).toEqual({ operationsChanged: payload('deleted') });
  });

  it('sert plusieurs abonnés du même utilisateur', async () => {
    const service = new OperationEventService();
    const premier = service.subscribe(1);
    const second = service.subscribe(1);

    const attentes = Promise.all([premier.next(), second.next()]);
    service.publish(1, payload('updated'));

    const [a, b] = await attentes;
    expect(a.value).toEqual({ operationsChanged: payload('updated') });
    expect(b.value).toEqual({ operationsChanged: payload('updated') });
  });
});
